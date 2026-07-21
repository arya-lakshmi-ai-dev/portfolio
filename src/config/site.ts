/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for the whole portfolio.
 *  Edit THIS file to update text, links, projects, skills, etc.
 *  Editing it updates the page AND the AI assistant together.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type NavItem = { label: string; href: string };

export type SocialLink = {
  label: string;
  href: string;
  /** lucide-react icon name, resolved in the component layer */
  icon: "github" | "linkedin" | "medium" | "mail";
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** Shows a small "Live" / "Case study" pill on the card. */
  badge?: string;
  featured?: boolean;
};

export type SkillGroup = { category: string; items: string[] };

export type ExperienceRole = {
  title: string;
  period: string;
  summary?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location?: string;
  points: string[];
  stack?: string[];
  /** When set, this entry is one company with multiple nested roles. */
  roles?: ExperienceRole[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  detail: string;
  period: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
};

export type FAQItem = { q: string; a: string };

export const site = {
  /* ── Identity ─────────────────────────────────────────────────────────── */
  name: "Arya Lakshmi M",
  shortName: "Arya",
  role: "AI Engineer & Full-Stack Developer",
  location: "India",
  email: "aryalakshmi.dev@gmail.com",

  /* Used for <title>, meta tags, OG. */
  url: "https://www.aryalakshmi.me",
  description:
    "AI Engineer & Full-Stack Developer building end-to-end GenAI systems — LLM pipelines, agent workflows, and RAG-based knowledge systems.",

  /* ── Hero ─────────────────────────────────────────────────────────────── */
  hero: {
    // Short kicker shown above the name.
    kicker: "Hi, I'm",
    // The one-liner under the name/title.
    tagline:
      "I build end-to-end GenAI systems — LLM pipelines, agent workflows, and RAG-based knowledge products — and ship them as scalable, production-ready full-stack apps.",
    // Small status pill in the hero. Set to null to hide.
    availability: "Open to AI Engineering roles",
    // Path to your résumé PDF (place it in /public). Set to null to hide the button.
    resumeUrl: "/resume.pdf",
  },

  /* ── About ────────────────────────────────────────────────────────────── */
  about: {
    // A few short paragraphs. Keep them tight.
    paragraphs: [
      "I'm an AI Engineer building end-to-end Generative AI systems — LLM pipelines, multi-agent workflows, and RAG — with a full-stack background across FastAPI and React.",
      "Currently an AI Engineer Intern at Just Move In, working on LLM-powered agents and RAG for a production AI assistant.",
    ],
    // Quick stats strip. Edit or trim freely.
    stats: [
      { value: "3+", label: "AI projects shipped" },
      { value: "4", label: "Certifications" },
      { value: "2026", label: "B.Tech (CSBS)" },
    ],
  },

  /* ── Skills (grouped) ─────────────────────────────────────────────────── */
  skills: [
    {
      category: "Generative AI & LLMs",
      items: ["LLMs", "Transformers", "Prompt Engineering", "OpenAI API", "Open-Source LLMs"],
    },
    {
      category: "Retrieval & Knowledge Systems",
      items: ["RAG", "Embeddings", "Vector DBs (FAISS)", "Semantic Search", "Reranking"],
    },
    {
      category: "Agentic AI Systems",
      items: ["LangChain", "LangGraph", "Tool Calling", "Multi-Agent (CrewAI)", "Agent Memory"],
    },
    {
      category: "Backend & Full-Stack",
      items: ["Python", "FastAPI", "REST APIs", "React.js", "JavaScript", "Node.js"],
    },
    {
      category: "Data & Storage",
      items: ["Vector Stores", "MongoDB", "MySQL", "PostgreSQL", "Metadata Indexing"],
    },
    {
      category: "Deployment & MLOps",
      items: ["Docker", "Git & GitHub", "Vercel", "Render", "Model Evaluation"],
    },
  ] satisfies SkillGroup[],

  /* ── Projects ─────────────────────────────────────────────────────────── */
  projects: [
    {
      title: "Quick AI",
      tagline: "AI content generation platform",
      description:
        "An AI-powered creative assistant built on the PERN stack, integrated with OpenAI and ClipDrop APIs for generating articles, titles, and images. Features dynamic content generation, image editing, and subscription-based access.",
      tech: ["React.js", "Node.js", "Express.js", "PostgreSQL (Neon)", "OpenAI API", "ClipDrop", "Vercel"],
      liveUrl: "https://quick-ai-sigma-six.vercel.app",
      badge: "Live",
      featured: true,
    },
    {
      title: "AI Knowledge Copilot",
      tagline: "Intelligent RAG system",
      description:
        "A production-grade knowledge assistant that lets users query PDFs, documents, and web content via advanced Retrieval-Augmented Generation. Implements semantic search, reranking, citation-based answers, and hallucination control for accurate responses.",
      tech: ["FastAPI", "LangChain", "FAISS", "Sentence Transformers", "Llama / OpenAI"],
      repoUrl: "https://github.com/arya-lakshmi-ai-dev/AI-Knowledge-Copilot",
      badge: "RAG",
      featured: true,
    },
    {
      title: "Multi-Agent Startup Simulator",
      tagline: "Collaborative agent system",
      description:
        "A multi-agent AI system that simulates a startup team — coordinating Product, Engineering, and Market Research agents to analyze ideas and produce structured business outputs. Enables parallel task execution, role-based reasoning, and agent collaboration.",
      tech: ["Python", "CrewAI", "LangChain", "FastAPI", "OpenAI"],
      // repoUrl / liveUrl: add when the repo or demo is public.
      badge: "Agents",
      featured: true,
    },
  ] satisfies Project[],

  /* ── Experience ───────────────────────────────────────────────────────── */
  experience: [
    {
      role: "AI Engineer Intern",
      company: "Just Move In",
      period: "Apr 2026 — Present",
      location: "Bournemouth, England, UK · Remote",
      points: [
        "Ship production features for Jay, JMI's AI moving assistant — a Pydantic AI multi-agent system (FastAPI, Redis, Supabase/pgvector RAG) serving real customers over web chat and WhatsApp.",
        "Built safety and trust systems around the agent: AI scope guardrails across every channel prompt, and GDPR breach alerting with a 4-hour SLA.",
        "Automated Voice-of-Customer reporting — weekly digests with CSAT scoring and failure analysis generated from real conversation transcripts.",
        "Own quality end-to-end: LLM-judge evaluation suites, Logfire observability dashboards for latency and answer quality, and fully-mocked TDD test suites.",
      ],
      stack: ["Pydantic AI", "Python", "FastAPI", "RAG", "MCP", "Redis", "Logfire"],
    },
    {
      role: "Software Engineer Intern",
      company: "Adya AI",
      period: "Jun 2025 — Mar 2026",
      points: [
        "Built LLM-powered GTM and Marketing agent workflows for content generation and campaign insights.",
        "Worked on prompt engineering, tool/function calling, RAG, and output validation.",
      ],
      stack: ["MCP", "RAG", "Python", "FastAPI", "Azure OpenAI", "LLMs"],
    },
    {
      role: "Developer Intern",
      company: "unoiatech",
      period: "Jan — Jun 2025",
      points: [],
      stack: ["TypeScript", "Next.js", "React", "Node.js", "WordPress", "SEO"],
      roles: [
        {
          title: "Full-Stack Developer Intern",
          period: "May — Jun 2025",
          summary:
            "Built full-stack web apps across frontend and backend — interactive UIs, REST APIs, databases, and deployment.",
        },
        {
          title: "WordPress Developer Intern",
          period: "Jan — Apr 2025",
          summary:
            "Built and customized WordPress sites — theme editing, plugins, responsiveness, performance, and SEO.",
        },
      ],
    },
  ] satisfies ExperienceItem[],

  /* ── Education ────────────────────────────────────────────────────────── */
  education: [
    {
      institution: "Sri Eshwar College of Engineering",
      degree: "B.Tech — Computer Science & Business Systems (CSBS)",
      detail: "CGPA: 8.02 (up to 6th semester)",
      period: "2022 — 2026",
    },
  ] satisfies EducationItem[],

  /* ── Certifications ───────────────────────────────────────────────────── */
  certifications: [
    { name: "Certified System Administrator", issuer: "ServiceNow", year: "2024" },
    { name: "Full Stack Web Development", issuer: "Infosys Springboard", year: "2024" },
    { name: "Joy of Computing using Python", issuer: "NPTEL", year: "2024" },
    { name: "Networking Basics", issuer: "Cisco Networking Academy", year: "2024" },
  ] satisfies Certification[],

  /* ── Recruiter FAQ ────────────────────────────────────────────────────────
     The AI answers from these too. Drafted where possible; anything marked
     TODO only YOU can confirm — edit the answer and remove the TODO. */
  faq: [
    {
      q: "What roles is Arya looking for / open to?",
      a: "She's primarily looking for AI / GenAI Engineer roles — building LLM, agent, and RAG systems end to end. With her full-stack background (FastAPI + React) she's also comfortable in broader software-engineering roles.",
    },
    {
      q: "Is Arya available? When can she start / what's her notice period?",
      a: "Yes — she's available for full-time roles and can start immediately (short notice).",
    },
    {
      q: "Does she work remotely? Is she open to relocation?",
      a: "She's open to any work mode — remote, hybrid, or onsite — and is open to relocation globally, including internationally.",
    },
    {
      q: "What are Arya's key strengths?",
      a: "Building production GenAI end to end — LLM pipelines, multi-agent workflows (CrewAI, LangGraph, MCP), and RAG with reranking and citations — plus the full-stack skills to ship and deploy what she builds. Fast, ship-first learner with high ownership.",
    },
    {
      q: "Why should we hire Arya?",
      a: "She already ships production AI features at Just Move In while still an undergraduate — taking GenAI ideas from prompt to deployed product (LLM pipelines, agents, RAG) with the full-stack skills to ship them, a ship-first mindset, and high ownership across guardrails, evaluations, and observability.",
    },
    {
      q: "What are her career goals / what does she want to build?",
      a: "To work at the intersection of applied AI research and engineering — turning cutting-edge models into reliable, real-world products.",
    },
    {
      q: "What kind of team or company is she looking for?",
      a: "She's most excited by AI-first product teams — where GenAI is core to the product, not a bolt-on.",
    },
    {
      q: "What is she currently working on?",
      a: "As an AI Engineer Intern at Just Move In, she builds features for Jay, a production AI moving assistant — a Pydantic AI multi-agent system with FastAPI, Redis, and Supabase/pgvector RAG.",
    },
    {
      q: "What's her strongest technical area?",
      a: "Applied Generative AI: RAG systems (semantic search, reranking, citation-based answers) and agentic workflows, backed by Python/FastAPI and a solid full-stack foundation.",
    },
    {
      q: "What is she currently learning / improving?",
      a: "She's going deeper on model fine-tuning and evaluation — beyond prompt-engineering and RAG approaches.",
    },
    {
      q: "Does she have professional / production experience?",
      a: "Yes — production AI work at Just Move In, LLM agent workflows at Adya AI, and full-stack + WordPress development at unoiatech. See the Experience section for details.",
    },
    {
      q: "What are her interests outside of core work?",
      a: "She's active in hackathons, contributes to and builds open-source projects, and writes technical blogs on Medium.",
    },
    {
      q: "What languages does she speak?",
      a: "English (professional working proficiency) and Tamil (native).",
    },
    {
      q: "What are her salary expectations?",
      a: "Arya is happy to discuss compensation directly — please reach out by email.",
    },
    {
      q: "How can I contact Arya?",
      a: "The best way is email (aryalakshmi.dev@gmail.com) or LinkedIn. You can also use the contact form on this page.",
    },
  ] satisfies FAQItem[],

  /* ── Social / contact links ───────────────────────────────────────────── */
  socials: [
    { label: "GitHub", href: "https://github.com/22CB006", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aryalakshmi/", icon: "linkedin" },
    { label: "Medium", href: "https://medium.com/@aryalakshmisece", icon: "medium" },
    { label: "Email", href: "mailto:aryalakshmi.dev@gmail.com", icon: "mail" },
  ] satisfies SocialLink[],
};

/* Navigation is derived here so the header + footer stay in sync. */
export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export type Site = typeof site;
