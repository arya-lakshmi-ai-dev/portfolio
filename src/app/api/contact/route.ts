import { NextRequest, NextResponse } from "next/server";

import { postToSlack, referrerLabel } from "@/lib/notify";

export const runtime = "nodejs";

const MAX = { name: 100, email: 200, message: 3000 };

/**
 * Contact form handler. Forwards submissions to Web3Forms (free) which emails
 * Arya. If WEB3FORMS_ACCESS_KEY isn't configured, responds with
 * `{ ok: false, reason: "unconfigured" }` so the UI can offer a mailto fallback.
 */
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    company?: string; // honeypot — real users never fill this
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  // Honeypot tripped → pretend success, drop silently.
  if (body.company) return NextResponse.json({ ok: true });

  const name = body.name?.trim().slice(0, MAX.name);
  const email = body.email?.trim().slice(0, MAX.email);
  const message = body.message?.trim().slice(0, MAX.message);

  if (!name || !email || !message || !email.includes("@")) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Capture the lead in Slack (awaited so we know it landed). This is the
  // guaranteed inbox — if it succeeds, the submission is NOT lost.
  const referrer = req.headers.get("x-visitor-referrer");
  const slackOk = await postToSlack(
    `📬 *New contact form submission*  ·  🔗 from ${referrerLabel(referrer)}\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Message:* ${message.slice(0, 1500)}`
  );

  // Also email it via Web3Forms (bonus channel). Failure here is fine as long
  // as Slack captured the lead.
  let emailOk = false;
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (accessKey) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio contact from ${name}`,
          from_name: "aryalakshmi.me",
          name,
          email,
          message,
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      emailOk = data.success === true;
    } catch (err) {
      console.error("[api/contact] web3forms failed:", err);
    }
  }

  // Success as long as the lead reached Arya through at least one channel.
  if (slackOk || emailOk) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false, reason: "send_failed" }, { status: 502 });
}
