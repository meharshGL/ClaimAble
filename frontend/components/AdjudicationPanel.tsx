"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adjudicateClaim } from "@/lib/api";
import { ClaimStatus } from "@/lib/types";

const OPTIONS: { value: ClaimStatus; label: string; tone: string }[] = [
  { value: "approved", label: "Approve", tone: "hover:border-stamp-approved hover:text-stamp-approved" },
  { value: "rejected", label: "Reject", tone: "hover:border-stamp-rejected hover:text-stamp-rejected" },
  { value: "pending_review", label: "Keep in review", tone: "hover:border-stamp-pending hover:text-stamp-pending" },
];

export default function AdjudicationPanel({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ClaimStatus | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresReason = selected === "rejected";

  async function submit() {
    if (!selected) return;
    if (requiresReason && !reason.trim()) {
      setError("A reason is required to reject a claim.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await adjudicateClaim(claimId, selected, reason.trim() || undefined);
      setSelected(null);
      setReason("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit decision.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-paper-line rounded-sm bg-white/40 p-5 space-y-4">
      <div>
        <h2 className="font-display italic text-lg text-ink">Manual adjudication</h2>
        <p className="text-sm text-ink-soft mt-0.5">
          Override or confirm the routed decision. This is recorded in the audit trail.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`rounded-sm border px-3 py-2 text-sm text-left transition-colors ${opt.tone} ${
              selected === opt.value
                ? "border-ink text-ink bg-paper"
                : "border-paper-line text-ink-soft"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm text-ink-soft">
            Reason {requiresReason ? "(required)" : "(optional)"}
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Note what drove this decision, for the audit trail."
            className="w-full rounded-sm border border-paper-line bg-white/70 px-3 py-2 text-sm text-ink focus:border-ink outline-none"
          />
        </div>
      )}

      {error && <p className="text-sm text-stamp-rejected">{error}</p>}

      <button
        type="button"
        disabled={!selected || submitting}
        onClick={submit}
        className="rounded-sm bg-ink text-paper px-4 py-2 text-sm disabled:opacity-40 hover:bg-ink-soft transition-colors"
      >
        {submitting ? "Submitting…" : "Record decision"}
      </button>
    </div>
  );
}
