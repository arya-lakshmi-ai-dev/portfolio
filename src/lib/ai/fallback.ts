import { site } from "@/config/site";

/**
 * Offline answer engine — used when the LLM is unavailable (no API key, free
 * tier exhausted, provider outage). Keyword buckets with synonyms so related
 * phrasings match, not just exact questions. Answers are composed from the
 * same `site.ts` content that powers the page, so they stay in sync.
 */

const jmi = site.experience[0];

type Rule = { keywords: string[]; answer: () => string };

const RULES: Rule[] = [
  {
    // Personal / private details Arya doesn't publish — decline gracefully.
    // Listed FIRST so "phone"/"address" never fall through to the generic intro.
    keywords: [
      "address", "phone", "whatsapp", "mobile number", "phone number",
      "contact number", "personal number", "where does she live",
      "where she lives", "home town", "hometown", "date of birth", "age",
    ],
    answer: () =>
      `For privacy, I don't share Arya's personal details like her address or phone number. The best way to reach her is email (${site.email}) or the contact form on this page.`,
  },
  {
    keywords: ["rag", "retrieval", "vector", "embedding", "semantic search", "rerank", "knowledge base"],
    answer: () =>
      `Arya has solid production RAG experience. She built the AI Knowledge Copilot — a RAG system with semantic search, reranking, and citation-based answers over PDFs and web content (FastAPI, LangChain, FAISS). At Just Move In she works on RAG features for Jay, a production AI assistant using Supabase/pgvector.`,
  },
  {
    keywords: ["agent", "crewai", "langgraph", "multi-agent", "mcp", "tool calling", "workflow"],
    answer: () =>
      `Agentic AI is Arya's core strength. She built a Multi-Agent Startup Simulator (CrewAI — Product, Engineering & Market Research agents collaborating), works with LangChain/LangGraph, MCP, and tool calling, and ships multi-agent workflows in production at Just Move In using Pydantic AI.`,
  },
  {
    keywords: ["current role", "current job", "just move in", "jmi", "working now", "work now", "where does she work", "intern"],
    answer: () =>
      `Arya is currently an ${jmi.role} at ${jmi.company} (${jmi.period}). She ships production features for Jay, JMI's AI moving assistant — a Pydantic AI multi-agent system with FastAPI, Redis and Supabase/pgvector RAG — including guardrails, GDPR alerting, Voice-of-Customer reporting, and LLM evaluation suites.`,
  },
  {
    keywords: ["quick ai", "content generation", "pern"],
    answer: () =>
      `Quick AI is Arya's AI content-generation platform: a PERN-stack app integrated with OpenAI and ClipDrop APIs for generating articles, titles and images, with image editing and subscription-based access. Deployed on Vercel.`,
  },
  {
    keywords: ["copilot", "knowledge"],
    answer: () =>
      `The AI Knowledge Copilot is Arya's production-grade RAG assistant — query PDFs, documents and web content with semantic search, reranking, citation-based answers and hallucination control. Stack: FastAPI, LangChain, FAISS, Sentence Transformers, Llama/OpenAI.`,
  },
  {
    keywords: ["project", "built", "build", "portfolio", "showcase", "work"],
    answer: () =>
      `Arya's featured projects:\n• Quick AI — an AI content-generation platform (PERN + OpenAI + ClipDrop)\n• AI Knowledge Copilot — a production RAG system with citations (FastAPI, LangChain, FAISS)\n• Multi-Agent Startup Simulator — collaborative CrewAI agents producing structured business output\nPlus Jay, the production AI assistant she works on at Just Move In.`,
  },
  {
    keywords: ["skill", "stack", "tech", "tool", "language", "framework", "python", "fastapi", "react"],
    answer: () =>
      `Arya's toolkit spans:\n• GenAI & LLMs — prompt engineering, OpenAI API, open-source LLMs\n• Retrieval — RAG, embeddings, FAISS, semantic search, reranking\n• Agents — LangChain, LangGraph, CrewAI, MCP, tool calling\n• Full-stack — Python, FastAPI, React, Node.js, TypeScript\n• Data — PostgreSQL, MongoDB, MySQL, vector stores\n• Deployment — Docker, Vercel, Render, model evaluation.`,
  },
  {
    keywords: ["experience", "background", "career", "history", "adya", "unoiatech", "previous"],
    answer: () =>
      `Arya's path so far: currently AI Engineer Intern at Just Move In (Apr 2026–present) building a production AI assistant; before that, Software Engineer Intern at Adya AI (Jun 2025–Mar 2026) building LLM-powered GTM and marketing agent workflows; and earlier, full-stack and WordPress internships at unoiatech (2025).`,
  },
  {
    keywords: ["education", "college", "degree", "study", "cgpa", "university", "b.tech", "btech"],
    answer: () =>
      `Arya is completing a B.Tech in Computer Science & Business Systems (CSBS) at Sri Eshwar College of Engineering, class of 2026, with a CGPA of 8.02. Certifications include ServiceNow CSA, Infosys Full Stack Web Development, NPTEL Python, and Cisco Networking Basics.`,
  },
  {
    keywords: ["contact", "email", "reach", "connect", "linkedin", "github", "medium", "talk"],
    answer: () =>
      `The fastest way to reach Arya is email: ${site.email}. She's also on LinkedIn (linkedin.com/in/aryalakshmi), GitHub (github.com/22CB006) and Medium (@aryalakshmisece) — or use the contact form at the bottom of this page.`,
  },
  {
    keywords: ["resume", "cv", "résumé"],
    answer: () =>
      `You can download Arya's résumé using the Résumé button in the hero section at the top of this page.`,
  },
  {
    keywords: ["available", "availability", "open to", "looking for", "notice period", "start", "join", "relocat", "remote", "hire", "why should", "strength", "role", "opportunit"],
    answer: () =>
      `Arya is open to AI Engineer / GenAI / SDE roles building LLM, agent, and RAG systems. She's completing her B.Tech (CSBS, 2026) and currently interning as an AI Engineer at Just Move In. For availability, start dates, or relocation specifics, please email ${site.email}.`,
  },
  {
    keywords: ["who", "about", "arya", "yourself", "introduce", "intro", "tell me about"],
    answer: () =>
      `Arya Lakshmi M is an AI Engineer & Full-Stack Developer who builds end-to-end GenAI systems — LLM pipelines, multi-agent workflows and RAG products. She's currently an AI Engineer Intern at Just Move In, shipping features for a production AI assistant. Ask me about her projects, skills, or experience!`,
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "good morning", "good evening"],
    answer: () =>
      `Hi! I'm ${site.shortName}'s assistant. Ask me about her skills, projects, current role, or how to get in touch.`,
  },
];

// Off-topic / non-professional requests → firm, formal redirect.
const OFF_TOPIC = [
  "joke", "funny", "laugh", "riddle", "poem", "story", "song", "sing",
  "weather", "recipe", "cook", "game", "play", "movie", "sport", "news",
  "translate", "code for", "write code", "debug", "solve", "math", "calculate",
  "capital of", "who is the president", "opinion", "do you think", "roleplay",
  "pretend", "act as", "ignore previous", "system prompt",
];

const REDIRECT = `I'm ${site.shortName}'s assistant — I can only answer questions about her work, skills, and experience. What would you like to know?`;

export function fallbackAnswer(question: string): string {
  const q = question.toLowerCase();

  // On-topic answers take priority (so "code" in "what code has she written"
  // still matches skills/projects before the off-topic guard).
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.answer();
  }

  // Clearly off-topic → formal refusal.
  if (OFF_TOPIC.some((k) => q.includes(k))) return REDIRECT;

  // Anything else unrecognised → stay in scope, don't guess.
  return REDIRECT;
}
