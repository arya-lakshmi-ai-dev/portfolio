import { Marquee } from "@/components/effects/marquee";

const ITEMS = [
  "Generative AI",
  "LLMs",
  "RAG",
  "Agentic AI",
  "FastAPI",
  "LangChain",
  "CrewAI",
  "React",
  "Python",
  "System Design",
];

/** Editorial keyword marquee that separates the hero from the content. */
export function MarqueeStrip() {
  return (
    <div className="border-y border-border py-6">
      <Marquee pauseOnHover className="[--duration:36s]">
        {ITEMS.map((item) => (
          <span key={item} className="mx-6 flex items-center gap-6">
            <span className="font-display text-2xl font-light tracking-tight text-foreground/80 sm:text-3xl">
              {item}
            </span>
            <span className="text-primary">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
