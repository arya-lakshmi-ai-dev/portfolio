# Arya Lakshmi M — Portfolio

A minimal, professional portfolio for **Arya Lakshmi M — AI Engineer & Full-Stack Developer**, featuring a unique **"Ask My AI"** assistant grounded in the real profile.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion**.

## ✨ Highlights

- **Light / Dark** theme (system-aware) with a modern cyan-azure accent.
- **"Ask My AI"** — a streaming chat agent that answers questions about Arya, grounded in her profile (RAG-style context grounding). Provider-abstracted; runs on the **free Google Gemini tier**.
- **Single source of truth for content:** edit [`src/config/site.ts`](src/config/site.ts) — every section, link, project and the AI agent's knowledge update from that one file.
- Accessible, responsive, SEO/OpenGraph tags, reduced-motion aware.

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The site runs fully **without** an API key — the chat widget shows a friendly setup message until you connect one.

### Enable the AI assistant (optional, free)

1. Get a free key at https://aistudio.google.com/apikey (no credit card).
2. `cp .env.example .env.local` and paste your key into `GEMINI_API_KEY`.
3. Restart `npm run dev`.

## ✏️ Editing your content

Everything lives in **[`src/config/site.ts`](src/config/site.ts)** — name, role, tagline, about, skills,
projects, experience, education, certifications, and social links. Look for `TODO:` markers:

- Replace social URLs (GitHub, LinkedIn, Medium).
- Add project live/repo links.
- Drop your photo at `public/avatar.jpg` and point `hero.avatar` to it.
- Drop your résumé at `public/resume.pdf`.
- Replace the placeholder project images in `public/projects/`.

The **AI agent auto-syncs** with this file — no separate knowledge base to maintain.

## 📁 Project structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Streaming endpoint for the AI agent
│   ├── layout.tsx             # Fonts, theme provider, metadata
│   ├── page.tsx               # Section composition
│   └── globals.css            # Theme tokens (accent lives here)
├── components/
│   ├── ui/                    # shadcn/ui primitives (button, badge, card)
│   ├── layout/                # site-header, site-footer
│   ├── sections/              # hero, about, skills, projects, …
│   ├── chat/ask-ai.tsx        # "Ask My AI" floating widget
│   ├── motion/reveal.tsx      # Scroll-reveal animation helper
│   └── …                      # section-heading, social-links, theme-toggle, icons
├── config/site.ts             # ← ALL content
└── lib/
    ├── utils.ts               # cn() helper
    └── ai/                    # persona (system prompt) + provider (Gemini)
```

## ☁️ Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the `GEMINI_API_KEY` environment variable in the project settings.
4. Deploy. Update `site.url` in `src/config/site.ts` to your final domain.

## 🔁 Swapping the AI provider

Specific model IDs get deprecated over time, so the LLM call is isolated in
[`src/lib/ai/provider.ts`](src/lib/ai/provider.ts). To change model, set `GEMINI_MODEL`
in your env. To change vendor entirely (OpenAI, Groq, Anthropic…), reimplement the
single `streamChat()` function — nothing else in the app touches the model.
