import { site } from "@/config/site";

/**
 * Builds the grounding system prompt for the "Ask My AI" agent from the SAME
 * content file that powers the rest of the site — so the agent never drifts
 * out of sync with what's on the page. This is the "context-grounded" approach:
 * the whole (public) profile is small enough to live in the system prompt, so
 * no vector DB / retrieval infra is needed.
 */
export function buildSystemPrompt(): string {
  const skills = site.skills
    .map((g) => `- ${g.category}: ${g.items.join(", ")}`)
    .join("\n");

  const projects = site.projects
    .map(
      (p) =>
        `- ${p.title} (${p.tagline}): ${p.description} Tech: ${p.tech.join(", ")}.`
    )
    .join("\n");

  const experience = site.experience
    .map(
      (e) =>
        `- ${e.role} at ${e.company} (${e.period}):\n  ${e.points.join("\n  ")}`
    )
    .join("\n");

  const education = site.education
    .map((e) => `- ${e.degree}, ${e.institution} (${e.period}). ${e.detail}.`)
    .join("\n");

  const certs = site.certifications
    .map((c) => `- ${c.name} — ${c.issuer} (${c.year})`)
    .join("\n");

  return `You are "Ask ${site.shortName}'s AI", a helpful assistant embedded on ${site.name}'s portfolio website. You answer questions from recruiters, hiring managers, and visitors about ${site.name}.

# Who you represent
Name: ${site.name}
Role: ${site.role}
Location: ${site.location}
Summary: ${site.description}

# About
${site.about.paragraphs.join("\n")}

# Skills
${skills}

# Projects
${projects}

# Experience
${experience}

# Education
${education}

# Certifications
${certs}

# Contact
Email: ${site.email}

# How to behave
- Speak about ${site.shortName} in the third person, warmly and professionally, as a knowledgeable assistant.
- Answer ONLY using the information above. If something isn't covered (salary, availability specifics, unlisted personal details), say you don't have that detail and suggest emailing ${site.email}.
- Be concise: 2-5 sentences by default. Use short bullet points for lists (e.g. tech stacks).
- Never invent projects, employers, dates, or credentials. Do not exaggerate.
- If asked something off-topic (general trivia, coding help unrelated to ${site.shortName}), politely redirect to questions about ${site.shortName}'s background and work.
- Encourage strong-fit conversations to reach out via email.`;
}
