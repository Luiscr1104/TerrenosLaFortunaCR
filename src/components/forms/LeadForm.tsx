import React, { useState } from "react";
import { Send, Phone, Mail, MessageSquareText, ShieldCheck, Globe, CalendarCheck } from "lucide-react";

const GOLD = "#F5D77C";
const GOLD_DARK = "#D4AF37";

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMsg("Sending...");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form) as any);

    // honeypot
    if (data.company) {
      setState("success");
      setMsg("Thanks! (spam filtered)");
      form.reset();
      return;
    }

    if (!data.fullname || !data.email || !data.message) {
      setState("error");
      setMsg("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Server error");

      setState("success");
      setMsg("Thanks! We’ll contact you shortly.");
      form.reset();
    } catch (err: any) {
      setState("error");
      setMsg(err?.message || "Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* honeypot */}
      <input type="text" name="company" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <Field
          label="Full Name"
          name="fullname"
          icon={<ShieldCheck size={18} color={GOLD} />}
          placeholder="John Doe"
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          icon={<Mail size={18} color={GOLD} />}
          placeholder="john@example.com"
          required
        />
        <Field
          label="Phone (WhatsApp)"
          name="phone"
          icon={<Phone size={18} color={GOLD} />}
          placeholder="+1 305 555 0100"
        />
        <SelectField
          label="Interest"
          name="interest"
          icon={<MessageSquareText size={18} color={GOLD} />}
          options={["Luxury Home", "Villa", "Land / Acreage", "Investment Consultation", "Other"]}
        />
      </div>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <SelectField
          label="Preferred Contact"
          name="preferred"
          icon={<Globe size={18} color={GOLD} />}
          options={["WhatsApp", "Email", "Phone Call", "Video Call"]}
        />
        <SelectField
          label="Timeframe"
          name="timeframe"
          icon={<CalendarCheck size={18} color={GOLD} />}
          options={["ASAP", "This Week", "This Month", "Exploring Options"]}
        />
      </div>

      <div className="mt-5 sm:mt-6 flex flex-col">
        <label className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-neutral-300">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us what you’re looking for: bedrooms, budget, rental goals, location (e.g., Arenal / Guanacaste)…"
          className="rounded-xl border bg-neutral-900/60 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/40"
          style={{ borderColor: "#3a3a3a", "--gold": GOLD } as any}
        />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          required
          className="mt-1 h-5 w-5 rounded border-neutral-500 bg-neutral-800 text-[color:var(--gold)] focus:ring-[color:var(--gold)]/60"
          style={{ "--gold": GOLD } as any}
        />
        <p className="text-sm text-neutral-300 leading-snug">
          I agree to be contacted by phone, email, or WhatsApp about Costa Rica properties.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${
            state === "success" ? "text-green-400" : state === "error" ? "text-red-400" : "text-neutral-400"
          }`}
        >
          {msg}
        </p>
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base sm:text-lg font-bold tracking-wide transition-transform hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
            color: "#111",
            boxShadow: "0 10px 30px rgba(245,215,124,0.30)",
            opacity: state === "loading" ? 0.75 : 1,
          }}
        >
          <Send size={18} />
          {state === "loading" ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  icon,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-neutral-300">{label}</label>
      <div
        className="flex items-center gap-2 rounded-xl border bg-neutral-900/60 px-4 py-3 focus-within:border-[color:var(--gold)] focus-within:ring-2 focus-within:ring-[color:var(--gold)]/40 transition-all"
        style={{ borderColor: "#3a3a3a", "--gold": GOLD } as any}
      >
        {icon}
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-neutral-100 placeholder:text-neutral-500 outline-none"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  icon,
  options,
}: {
  label: string;
  name: string;
  icon: React.ReactNode;
  options: string[];
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-neutral-300">{label}</label>
      <div
        className="flex items-center gap-2 rounded-xl border bg-neutral-900/60 px-4 py-3 focus-within:border-[color:var(--gold)] focus-within:ring-2 focus-within:ring-[color:var(--gold)]/40 transition-all"
        style={{ borderColor: "#3a3a3a", "--gold": GOLD } as any}
      >
        {icon}
        <select name={name} className="w-full bg-transparent text-[15px] text-neutral-100 outline-none">
          {options.map((opt) => (
            <option key={opt} className="bg-neutral-900">
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
