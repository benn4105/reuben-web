import { NextRequest, NextResponse } from "next/server";

const TOPICS = new Set([
  "business-simulator",
  "reux",
  "enterprise",
  "plos",
  "other",
]);

interface ContactPayload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  source?: string;
  simulation?: string;
  companyWebsite?: string;
}

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  source?: string;
  simulation?: string;
  userAgent?: string;
  referer?: string;
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (payload.companyWebsite) {
    return NextResponse.json({ ok: true, delivered: false, spamFiltered: true });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json(
      { ok: false, error: validationError },
      { status: 400 }
    );
  }

  const lead: Lead = {
    id: `lead_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    name: payload.name!.trim(),
    email: payload.email!.trim(),
    topic: payload.topic!.trim(),
    message: payload.message!.trim(),
    source: payload.source?.trim() || undefined,
    simulation: payload.simulation?.trim() || undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    referer: request.headers.get("referer") ?? undefined,
  };

  const deliveries = await Promise.allSettled([
    deliverToWebhook(lead),
    deliverToResend(lead),
  ]);

  for (const result of deliveries) {
    if (result.status === "rejected") {
      console.error("Contact intake delivery failed", result.reason);
    }
  }

  const delivered = deliveries.some(
    (result) => result.status === "fulfilled" && result.value === true
  );
  const configured = isWebhookConfigured() || isResendConfigured();

  if (!delivered && configured) {
    return NextResponse.json(
      {
        ok: false,
        error: "Lead intake is configured, but delivery failed.",
        leadId: lead.id,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    delivered,
    configured,
    leadId: lead.id,
  });
}

function validatePayload(payload: ContactPayload): string | null {
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const topic = payload.topic?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (name.length < 2 || name.length > 120) {
    return "Name must be between 2 and 120 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return "Enter a valid email address.";
  }

  if (!TOPICS.has(topic)) {
    return "Choose a valid topic.";
  }

  if (message.length < 10 || message.length > 2000) {
    return "Message must be between 10 and 2000 characters.";
  }

  return null;
}

function isWebhookConfigured() {
  return Boolean(process.env.CONTACT_WEBHOOK_URL);
}

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

async function deliverToWebhook(lead: Lead) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `New Reuben lead: ${lead.name} <${lead.email}> (${lead.topic})`,
      lead,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed with ${response.status}`);
  }

  return true;
}

async function deliverToResend(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  const from = process.env.CONTACT_FROM_EMAIL ?? "Reuben <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email,
      subject: `Reuben contact: ${formatTopic(lead.topic)} from ${lead.name}`,
      text: formatLeadText(lead),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend delivery failed with ${response.status}: ${detail}`);
  }

  return true;
}

function formatTopic(topic: string) {
  return topic
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatLeadText(lead: Lead) {
  return [
    `Lead ID: ${lead.id}`,
    `Created: ${lead.createdAt}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Topic: ${formatTopic(lead.topic)}`,
    lead.source ? `Source: ${lead.source}` : null,
    lead.simulation ? `Simulation: ${lead.simulation}` : null,
    lead.referer ? `Referer: ${lead.referer}` : null,
    "",
    lead.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
