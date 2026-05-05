// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Configuration ─────────────────────────────────────────────────────────────
const RECIPIENT_EMAIL = "martin.stefanov@itrb.org";
const SENDER_DOMAIN = "itrb.org";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms
const CAPTCHA_TTL_MS = 600_000;

// ── In-memory rate limit store ────────────────────────────────────────────────
const rateLimitStore = new Map<string, number[]>();

// ── Nodemailer transporter ────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log(process.env.SMTP_HOST);

export async function POST(req: NextRequest) {
  // 1. Parse form data
  const formData = await req.formData();
  const get = (key: string) => (formData.get(key) as string | null) ?? "";

  // 2. Honeypot
  if (get("website")) {
    return fail(400, "Spam detected.");
  }

  // 3. Detect IP
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  // 4. Rate limiting
  const now = Date.now();
  const history = (rateLimitStore.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );

  if (history.length >= RATE_LIMIT_MAX) {
    return fail(429, "Too many requests. Please try again later.");
  }

  // 5. Captcha validation
  const rawToken = get("captcha_token");
  const userAnswer = parseInt(get("captcha_answer"), 10);

  let decoded: string;
  try {
    decoded = atob(rawToken);
  } catch {
    return fail(400, "Invalid captcha token.");
  }

  const parts = decoded.split(":");
  if (parts.length !== 3) return fail(400, "Invalid captcha token format.");

  const [a, b, expiresMs] = parts;

  if (Number(expiresMs) < now) {
    return fail(400, "Captcha expired. Please refresh and try again.");
  }

  const na = parseInt(a, 10);
  const nb = parseInt(b, 10);

  if (na < 2 || na > 9 || nb < 1 || nb > 9) {
    return fail(400, "Invalid captcha values.");
  }

  if (userAnswer !== na + nb) {
    return fail(400, "Incorrect captcha answer. Please try again.");
  }

  // 6. Sanitize & validate inputs
  const name = get("name")
    .trim()
    .replace(/<[^>]*>/g, "");
  const email = get("email").trim();
  const subject = get("subject")
    .trim()
    .replace(/<[^>]*>/g, "");
  const message = get("message")
    .trim()
    .replace(/<[^>]*>/g, "");

  if (!name || !email || !subject || !message) {
    return fail(400, "All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || /[\r\n]/.test(email)) {
    return fail(400, "Invalid email address.");
  }

  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    return fail(400, "Input exceeds maximum allowed length.");
  }

  // 7. Save rate limit record
  history.push(now);
  rateLimitStore.set(ip, history);

  // 8. Send email
  try {
    await transporter.sendMail({
      from: `"ITRB Contact" <noreply@${SENDER_DOMAIN}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `[ITRB Contact] ${subject}`,
      text: [
        "You have received a new message from the ITRB website contact form.",
        "",
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Subject: ${subject}`,
        "─".repeat(60),
        message,
        "─".repeat(60),
        `Sent from: ${SENDER_DOMAIN}`,
        `IP: ${ip}`,
      ].join("\n"),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your message has been sent. We will get back to you shortly.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[contact] mail error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send the message. Please try again or email us directly at ${RECIPIENT_EMAIL}.`,
      },
      { status: 500 }
    );
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────
function fail(status: number, message: string) {
  return NextResponse.json({ success: false, message }, { status });
}
