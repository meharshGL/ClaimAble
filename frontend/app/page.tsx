import Link from "next/link";
import { listClaims } from "@/lib/api";
import ClaimRow from "@/components/ClaimRow";
import { ClaimSummary } from "@/lib/types";

export default async function QueuePage() {
  let claims: ClaimSummary[];
  let loadError: string | null = null;
  try {
    claims = await listClaims();
  } catch (e) {
    claims = [];
    loadError = e instanceof Error ? e.message : "Could not reach the ClaimAble API.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display italic text-3xl text-ink">Claims queue</h1>
          <p className="text-sm text-ink-soft mt-1">
            Every claim the pipeline has processed, newest first.
          </p>
        </div>
        <Link
          href="/upload"
          className="rounded-sm bg-ink text-paper px-4 py-2 text-sm hover:bg-ink-soft transition-colors"
        >
          Upload a claim
        </Link>
      </div>

      {loadError && (
        <div className="border border-stamp-rejected/40 bg-stamp-rejected-bg rounded-sm px-4 py-3 text-sm text-stamp-rejected">
          Couldn&apos;t load the queue — {loadError}. Is the API running at{" "}
          <code className="font-mono">NEXT_PUBLIC_API_BASE</code>?
        </div>
      )}

      {!loadError && claims.length === 0 && (
        <div className="border border-dashed border-paper-line rounded-sm px-6 py-14 text-center">
          <p className="font-display italic text-lg text-ink">No claims yet</p>
          <p className="text-sm text-ink-soft mt-1">
            Upload documents to start the intake pipeline.
          </p>
        </div>
      )}

      {claims.length > 0 && (
        <div className="border border-paper-line rounded-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 text-xs uppercase tracking-wide text-ink-soft border-b border-paper-line bg-white/30">
            <span>Claim ID</span>
            <span>Documents</span>
            <span>Status</span>
            <span>Routing</span>
            <span>Confidence</span>
            <span>Fraud risk</span>
          </div>
          {claims.map((c) => (
            <ClaimRow key={c.claim_id} claim={c} />
          ))}
        </div>
      )}
    </div>
  );
}
