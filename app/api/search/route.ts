import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type DocChunk = {
  id: string;
  text: string;
  fileName: string;
  embedding: number[];
};

type SessionStore = Map<string, DocChunk[]>;

const globalAny = global as unknown as { __DOC_VECTOR_STORE__?: SessionStore };
const store: SessionStore = (globalAny.__DOC_VECTOR_STORE__ ||= new Map());

function getGroqApiKey(): string {
  return process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function localEmbed(text: string, dim = 384): number[] {
  const v = new Array(dim).fill(0);
  const norm = text.toLowerCase();
  for (let i = 0; i < norm.length; i++) {
    const code = norm.charCodeAt(i);
    v[code % dim] += 1;
  }
  let s = 0;
  for (let i = 0; i < dim; i++) s += v[i] * v[i];
  const mag = Math.sqrt(s) || 1;
  return v.map((x) => x / mag);
}

async function embedQuery(text: string): Promise<number[]> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return localEmbed(text);
  }

  const res = await fetch("https://api.groq.com/openai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-large",
      input: [text],
    }),
  });

  if (!res.ok) {
    // Fallback to local embedding if remote returns 404/4xx/5xx
    return localEmbed(text);
  }

  const data = await res.json();
  return data.data?.[0]?.embedding || localEmbed(text);
}

export const POST = async (req: NextRequest) => {
  try {
    const { query, topK = 5 } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("doc_session_id")?.value;
    const allChunks = (sessionId && store.get(sessionId)) || [];

    if (!allChunks.length) {
      return NextResponse.json({ chunks: [], total: 0 });
    }

    const K = Math.min(Math.max(topK, 1), 10);
    const qEmb = await embedQuery(query);

    const results = allChunks
      .map(c => ({
        ...c,
        score: cosineSimilarity(qEmb, c.embedding),
      }))
      .filter(r => r.score > 0.2) // 🔑 threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, K);

    return NextResponse.json({
      chunks: results.map(r => ({
        id: r.id,
        text: r.text,
        fileName: r.fileName,
        score: r.score,
      })),
      total: allChunks.length,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Search failed" },
      { status: 500 }
    );
  }
};
