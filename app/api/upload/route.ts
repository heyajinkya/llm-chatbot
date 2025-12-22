import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const runtime = "nodejs";

/* =========================
   Types & In-Memory Store
========================= */

type DocChunk = {
  id: string;
  text: string;
  fileName: string;
  embedding: number[];
};

type SessionStore = Map<string, DocChunk[]>;

const globalAny = global as unknown as { __DOC_VECTOR_STORE__?: SessionStore };
const store: SessionStore = (globalAny.__DOC_VECTOR_STORE__ ||= new Map());

/* =========================
   Helpers
========================= */

function getGroqApiKey(): string {
  return process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
}

// Approx token-based chunking (~4 chars/token)
function chunkText(
  text: string,
  chunkTokens = 500,
  overlapTokens = 100
): string[] {
  const approxCharsPerToken = 4;
  const chunkSize = chunkTokens * approxCharsPerToken;
  const overlapSize = overlapTokens * approxCharsPerToken;

  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    let chunk = cleaned.slice(start, end);

    if (end < cleaned.length) {
      const lastPeriod = chunk.lastIndexOf(". ");
      if (lastPeriod > 200) {
        chunk = chunk.slice(0, lastPeriod + 1);
      }
    }

    if (chunk.trim()) chunks.push(chunk.trim());
    if (end === cleaned.length) break;

    start = start + chunk.length - Math.min(overlapSize, chunk.length);
  }

  return chunks;
}

function localEmbed(text: string, dim = 384): number[] {
  // Simple hashing-based embedding fallback (deterministic). Not semantic, but enables cosine search.
  const v = new Array(dim).fill(0);
  const normText = text.toLowerCase();
  for (let i = 0; i < normText.length; i++) {
    const code = normText.charCodeAt(i);
    const idx = code % dim;
    v[idx] += 1;
  }
  // L2 normalize
  let sum = 0;
  for (let i = 0; i < dim; i++) sum += v[i] * v[i];
  const mag = Math.sqrt(sum) || 1;
  return v.map((x) => x / mag);
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error("Missing GROQ API key");

  const models = [
    process.env.GROQ_EMBEDDING_MODEL || process.env.NEXT_PUBLIC_GROQ_EMBEDDING_MODEL || "text-embedding-3-small",
    "text-embedding-3-large",
    "nomic-embed-text",
  ];

  let lastErr: any = null;
  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, input: texts }),
      });
      if (!res.ok) {
        const errText = await res.text();
        lastErr = new Error(`Groq embeddings error (${model}): ${res.status} ${errText}`);
        continue;
      }
      const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
      return data.data.map((d) => d.embedding);
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  // Fallback to local embedding if remote embeddings fail (e.g., 404 or unsupported)
  return texts.map((t) => localEmbed(t));
}

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    const result = await pdfParse(buffer);
    return result.text || "";
  }

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buffer.toString("utf8");
  }

  throw new Error(`Unsupported file type: ${file.name}`);
}

/* =========================
   POST: Upload & Embed
========================= */

export const POST = async (req: NextRequest) => {
  try {
    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("doc_session_id")?.value;
    let shouldSetCookie = false;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      shouldSetCookie = true;
    }

    // Validate file sizes up-front to return 400 instead of partial 500s
    const MAX_MB = 15;
    const oversize = files.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (oversize.length) {
      return NextResponse.json({ error: `Some files exceed ${MAX_MB}MB`, files: oversize.map(f => f.name) }, { status: 400 });
    }

    const results: { fileName: string; chunksAdded: number }[] = [];

    for (const file of files) {
      // File already size-validated above

      const text = await extractTextFromFile(file);
      if (!text.trim()) continue;

      const chunks = chunkText(text);

      // Chunk limit protection
      if (chunks.length > 200) {
        throw new Error(`${file.name} is too large to process`);
      }

      const embeddings = await embedTexts(chunks);

      if (embeddings.length !== chunks.length) {
        throw new Error("Embedding count mismatch");
      }

      const existing = store.get(sessionId) || [];
      const newChunks: DocChunk[] = chunks.map((chunk, i) => ({
        id: `${sessionId}::${file.name}::${i}`,
        text: chunk,
        fileName: file.name,
        embedding: embeddings[i],
      }));

      store.set(sessionId, existing.concat(newChunks));
      results.push({ fileName: file.name, chunksAdded: newChunks.length });
    }

    const response = NextResponse.json({
      ok: true,
      sessionId,
      results,
    });

    if (shouldSetCookie) {
      response.cookies.set("doc_session_id", sessionId, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Upload failed" },
      { status: 500 }
    );
  }
};
