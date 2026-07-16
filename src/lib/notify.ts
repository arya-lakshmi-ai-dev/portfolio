/**
 * Post a message to Slack via an Incoming Webhook. Shared by the chat and
 * contact-form routes. No-ops when SLACK_WEBHOOK_URL is unset, and never throws
 * (failures are logged, not propagated) so notifications can't break a request.
 */
export async function postToSlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("[slack] notify failed:", err);
  }
}

/** Rough device + browser from a User-Agent string (best-effort, no library). */
export function deviceInfo(ua: string | null): { device: string; browser: string } {
  if (!ua) return { device: "unknown device", browser: "unknown browser" };
  const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? "Mobile" : "Desktop";
  let browser = "browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";
  return { device, browser };
}

/** "linkedin.com" / "google.com" — or "direct / unknown" if there's no referrer. */
export function referrerLabel(referrer?: string | null): string {
  if (!referrer) return "direct / unknown";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}
