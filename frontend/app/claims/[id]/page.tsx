import Link from "next/link";
import { getClaim } from "@/lib/api";
import { ClaimStatusBadge, RoutingBadge } from "@/components/StatusBadge";
import AuditTrail from "@/components/AuditTrail";
import AdjudicationPanel from "@/components/AdjudicationPanel";

function pct(n: number | null) {
  if (n === null || n === undefined) return "—";
  return `${Math.round(n * 100)}%`;
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-paper-line last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink text-right">{value}</span>
    </div>
  );
}

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  let claim;
  try {
    claim = await getClaim(params.id);
  } catch {
    return (
      <div className="max-w-lg">
        <p className="font-display italic text-xl text-ink">Claim not found</p>
        <p className="text-sm text-ink-soft mt-1">
          <span className="font-mono">{params.id}</span> doesn&apos;t exist, or the
          API hasn&apos;t started yet.
        </p>
        <Link href="/" className="text-sm text-stamp-investigate mt-4 inline-block">
          Back to queue
        </Link>
      </div>
    );
  }

  const fileNames = claim.raw_documents.map((p) => p.split("/").pop());

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link href="/" className="text-xs text-ink-soft hover:text-ink">
            ← Queue
          </Link>
          <h1 className="font-mono text-2xl text-ink mt-1">{claim.claim_id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ClaimStatusBadge status={claim.claim_status} />
          <RoutingBadge decision={claim.routing_decision} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: claim facts */}
        <div className="lg:col-span-2 space-y-6">
          <section className="border border-paper-line rounded-sm bg-white/40 p-5">
            <h2 className="font-display italic text-lg text-ink mb-2">Documents</h2>
            <ul className="text-sm text-ink space-y-1">
              {fileNames.map((name, i) => (
                <li key={i} className="font-mono text-ink-soft">
                  {name}
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-paper-line rounded-sm bg-white/40 p-5">
            <h2 className="font-display italic text-lg text-ink mb-2">
              Extracted facts
            </h2>
            {claim.extracted_facts ? (
              <pre className="text-xs bg-paper/60 rounded-sm p-3 overflow-x-auto">
                {JSON.stringify(claim.extracted_facts, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-ink-soft">Not yet extracted.</p>
            )}
          </section>

          <section className="border border-paper-line rounded-sm bg-white/40 p-5">
            <h2 className="font-display italic text-lg text-ink mb-3">
              Coverage &amp; validation
            </h2>
            <KeyValue label="Coverage status" value={claim.coverage_status ?? "—"} />
            <KeyValue
              label="Confidence score"
              value={pct(claim.confidence_score)}
            />
            <KeyValue
              label="Doc anomalies"
              value={claim.doc_anomalies?.length ? claim.doc_anomalies.join(", ") : "None"}
            />
            <KeyValue
              label="Fraud risk"
              value={pct(claim.fraud_risk_score)}
            />
            <KeyValue
              label="Fraud signals"
              value={claim.fraud_signals.length ? claim.fraud_signals.join(", ") : "None"}
            />
            <KeyValue
              label="Settlement amount"
              value={claim.settlement_amount != null ? `₹${claim.settlement_amount}` : "—"}
            />
            {claim.rejection_reason && (
              <KeyValue label="Rejection reason" value={claim.rejection_reason} />
            )}
          </section>

          <AdjudicationPanel claimId={claim.claim_id} />
        </div>

        {/* Right: audit trail */}
        <div className="lg:col-span-1">
          <section className="border border-paper-line rounded-sm bg-white/40 p-5 lg:sticky lg:top-24">
            <h2 className="font-display italic text-lg text-ink mb-4">Audit trail</h2>
            <AuditTrail entries={claim.audit_log} />
          </section>
        </div>
      </div>
    </div>
  );
}
