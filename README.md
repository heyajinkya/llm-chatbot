Unique Schools FAQ Chatbot 🤖🎓


AI-Powered FAQ Chatbot for Irish EdTech Company “Unique Schools”

Table of Contents

Project Overview

Features

Tech Stack

Installation

Environment Variables

Usage

Folder Structure

Scripts

Contribution Guidelines

License

Project Overview

Unique Schools FAQ Chatbot is a Next.js 13+ application using React, TypeScript, and Groq AI API to provide an AI-powered assistant for answering questions related to Unique Schools’ digital education solutions.

It leverages a RAG (Retrieval-Augmented Generation) approach by retrieving relevant FAQs from a preloaded knowledge base and generating AI responses in real-time.

The chatbot is tailored for Irish schools, highlighting the company’s products, services, ROI, security, GDPR compliance, and integration capabilities.

Features

🤖 AI Assistant: Answer queries about Unique Schools products and services

📚 Knowledge Base: 140+ Irish school FAQs preloaded for quick responses

⚡ Quick Questions & Categories: Popular questions & category filters for fast answers

🕒 Live Stats: Response time, satisfaction, and FAQs loaded dynamically

💳 Payment & Product Info: Detailed information on Unique Pay, Sign-In/Out, School App, and Website services

🛡️ Security & GDPR Compliance: Includes detailed FAQ answers about data security

💬 Sources Display: Shows which FAQs were used to generate each AI answer

📈 RAG Implementation: Combines FAQ retrieval with AI generation for accurate responses

✨ Responsive UI: Fully responsive and visually appealing with TailwindCSS

Tech Stack

Frontend: React 18, Next.js 13, TypeScript

Styling: TailwindCSS

AI Integration: Groq AI (Chat Completions API)

Icons: Lucide-React

RAG (Retrieval-Augmented Generation): FAQ retrieval & scoring

Deployment: Vercel / Local development

Installation
1. Clone the repository
git clone https://github.com/your-username/unique-schools-chatbot.git
cd unique-schools-chatbot

2. Install dependencies
npm install
# or
yarn install

3. Configure TypeScript & ESLint (optional to ignore errors)

In next.config.js:

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;


⚠️ Only ignore TS/ESLint errors for quick setup or prototyping. For production, fix all errors.

Environment Variables

Create a .env.local file at the root:

NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here


NEXT_PUBLIC_GROQ_API_KEY: Your Groq AI API key (required to generate AI responses)
Get it from Groq Console
 (free account available).

Usage
Run locally
npm run dev
# or
yarn dev


Open your browser at http://localhost:3000.

Features in Action

Type a question in the input field (e.g., “How does Digital Sign-In/Out work?”).

Click send or press Enter.

The bot fetches relevant FAQs and generates an AI response.

Responses display with source FAQs and response time.

Popular questions and category filters make navigation faster.

Folder Structure
unique-schools-chatbot/
├── app/
│   ├── page.tsx         # Main chatbot page
├── components/
│   ├── ChatMessage.tsx  # Individual message bubble
│   ├── QuickQuestion.tsx
│   └── FAQCard.tsx
├── public/
│   └── logo.png
├── styles/
│   └── globals.css
├── .env.local           # API keys
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

Scripts
Command	Description
npm run dev	Run development server on localhost:3000
npm run build	Build production-ready app
npm start	Run the production build
npm run lint	Check ESLint issues
npm run format	Format code using Prettier
Contribution Guidelines

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Add feature"

Push branch: git push origin feature-name

Open a Pull Request (PR)

Note: Ensure all TypeScript types and eslint rules are followed.

License

This project is licensed under the MIT License – see the LICENSE
 file for details.

Contact

Unique Schools

Email: staffsupport@uniqueschools.ie

Phone: +353 (01) 886 9458

Website: https://www.uniqueschools.ie

💡 Pro Tip: This chatbot can be extended for multiple schools, AI providers, or integrated with internal databases for larger-scale deployments.