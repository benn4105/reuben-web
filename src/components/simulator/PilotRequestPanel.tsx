"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { submitPilotRequest, type PilotRequestPayload } from "@/lib/simulation/api-client";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "buildreuben.dev@gmail.com";

interface PilotRequestPanelProps {
  sourceRunId?: string;
  simulationName?: string;
  className?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function PilotRequestPanel({
  sourceRunId,
  simulationName,
  className,
}: PilotRequestPanelProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PilotRequestPayload, string>>>({});
  const [decision, setDecision] = useState(
    simulationName
      ? `I want to explore a founder pilot based on "${simulationName}".`
      : "I want to model one real business decision with baseline assumptions and scenarios.",
  );

  const heading = sourceRunId ? "Turn this result into a founder pilot" : "Request a founder pilot";
  const subcopy = sourceRunId
    ? "Send this result with one real spreadsheet decision, and we will shape it into a focused Reux-backed pilot."
    : "Bring one spreadsheet decision. We will model the assumptions, compare scenarios, and return a focused decision workflow.";

  const formId = useMemo(
    () => `pilot-${sourceRunId ?? "dashboard"}`,
    [sourceRunId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload: PilotRequestPayload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      decision: decision.trim(),
      sourceRunId,
      pageUrl: window.location.href,
    };

    const errors = validatePayload(payload);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("idle");
      setFeedback("Fix the highlighted fields and try again.");
      return;
    }

    try {
      const response = await submitPilotRequest(payload);

      if (response.delivery.mailto && response.delivery.status !== "sent") {
        window.location.href = response.delivery.mailto;
        setFeedback("Your email app should open with a prepared pilot request. Send it to complete the handoff.");
      } else {
        setFeedback(`Pilot request received${response.request?.id ? ` (${response.request.id})` : ""}.`);
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      window.location.href = buildMailto(payload);
      setStatus("success");
      setFeedback(
        error instanceof Error
          ? "We opened your email app with a prepared pilot request. Send it to complete the handoff."
          : "Your email app should open with a prepared pilot request. Send it to complete the handoff.",
      );
    }
  }

  return (
    <section className={cn("rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 sm:p-6", className)}>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
            <Mail className="h-3.5 w-3.5" />
            Founder Pilot
          </div>
          <h2 className="text-xl font-bold text-white">{heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{subcopy}</p>
          <div className="mt-4 grid gap-2 text-xs text-gray-500">
            <span>1. Send the decision you want modeled.</span>
            <span>2. We convert it into Reux assumptions and scenarios.</span>
            <span>3. You review a pilot simulator before any larger build.</span>
          </div>
        </div>

        {status === "success" ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <p className="text-sm font-semibold text-white">Pilot request ready</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-100/80">{feedback}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 border-white/[0.12] text-white hover:bg-white/[0.06]"
                  onClick={() => {
                    setStatus("idle");
                    setFeedback("");
                  }}
                >
                  Send another
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form id={formId} onSubmit={handleSubmit} className="grid gap-4">
            {feedback && (
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  Object.keys(fieldErrors).length > 0
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                    : "border-rose-500/20 bg-rose-500/10 text-rose-200",
                )}
              >
                {feedback}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" error={fieldErrors.name}>
                <Input
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass(fieldErrors.name)}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
              </Field>
              <Field label="Email" error={fieldErrors.email}>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={inputClass(fieldErrors.email)}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </Field>
            </div>

            <Field label="Decision to model" error={fieldErrors.decision}>
              <textarea
                value={decision}
                onChange={(event) => setDecision(event.target.value)}
                rows={4}
                className={cn(
                  "w-full resize-none rounded-md border bg-black/40 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20",
                  fieldErrors.decision ? "border-amber-500/50" : "border-white/10",
                )}
                aria-invalid={Boolean(fieldErrors.decision)}
              />
            </Field>

            <Button
              type="submit"
              disabled={status === "submitting"}
              className="w-full gap-2 bg-white text-black hover:bg-gray-200 sm:w-fit"
            >
              <Send className="h-4 w-4" />
              {status === "submitting" ? "Sending..." : "Request Founder Pilot"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      {children}
      {error && <span className="text-xs text-amber-300">{error}</span>}
    </label>
  );
}

function validatePayload(payload: PilotRequestPayload) {
  const errors: Partial<Record<keyof PilotRequestPayload, string>> = {};
  if (payload.name.length < 2) errors.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = "Enter a valid email.";
  if (payload.decision.length < 10) errors.decision = "Describe the decision you want modeled.";
  return errors;
}

function inputClass(error?: string) {
  return cn(
    "bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-cyan-500/20",
    error && "border-amber-500/50",
  );
}

function buildMailto(payload: PilotRequestPayload) {
  const subject = encodeURIComponent("Business Simulator Pilot Request");
  const body = encodeURIComponent(
    [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.sourceRunId ? `Source run: ${payload.sourceRunId}` : null,
      payload.pageUrl ? `Page URL: ${payload.pageUrl}` : null,
      "",
      "Decision to model:",
      payload.decision,
    ].filter((line): line is string => line !== null).join("\n"),
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
