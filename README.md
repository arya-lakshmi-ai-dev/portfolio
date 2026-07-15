# aryalakshmi.me

Personal portfolio of **Arya Lakshmi M — AI Engineer & Full-Stack Developer**.

**Live:** https://www.aryalakshmi.me

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion**, in a
warm editorial style (porcelain + deep plum, Fraunces display serif) — with an AI
assistant woven through the whole site.

## ✨ What makes it different

- **Hero terminal** — a live `arya@portfolio — ai` shell that auto-plays a typed Q&A
  demo, then answers *your* question for real when you type at the prompt.
- **"Ask my AI" chatbot** — a floating assistant grounded in the same profile content
  that renders the page, so it never drifts out of sync. Powered by Google Gemini
  (free tier) behind a provider-agnostic streaming layer.
- **Editorial motion** — scroll-progress bar, word-by-word headline reveals, stacking
  project cards, a self-drawing experience timeline, magnetic buttons, and a custom
  robot cursor.

## 🚀 Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The site works without any API key — the AI simply shows a setup note. To enable real
answers: copy `.env.example` to `.env.local`, add a free `GEMINI_API_KEY` from
https://aistudio.google.com/apikey, and restart.

## ✏️ Editing content

Everything lives in **[`src/config/site.ts`](src/config/site.ts)** — identity, about,
skills, projects, experience, socials. The AI assistant's knowledge is built from the
same file (`src/lib/ai/persona.ts`), so editing it updates both the page and the bot.

Drop your résumé at `public/resume.pdf` (the hero button links to it).

## 📁 Structure

```
src/
├── app/
│   ├── api/chat/route.ts        # Streaming chat endpoint (Gemini, SSE→text)
│   ├── icon.svg                 # Robot favicon
│   ├── opengraph-image.tsx      # Social-preview card (next/og)
│   ├── layout.tsx · page.tsx · globals.css
├── components/
│   ├── sections/                # hero (terminal), about, skills, projects, experience, contact, marquee-strip
│   ├── chat/ask-ai.tsx          # Floating chatbot widget
│   ├── effects/                 # marquee, magnetic, scroll-progress, text-reveal
│   ├── layout/                  # header (pill nav), footer
│   └── ui/                      # button, badge, card primitives
├── config/site.ts               # ← ALL content
└── lib/ai/                      # persona (system prompt) + provider (Gemini streaming)
```

## ☁️ Deploy

Deployed on **Vercel** — every push to `main` auto-deploys. Set `GEMINI_API_KEY` in
Project → Settings → Environment Variables. Model/vendor can be swapped in one place:
`src/lib/ai/provider.ts` (or via the `GEMINI_MODEL` env var).
