import Link from "next/link";
import { ClaimSummary } from "@/lib/types";
import { ClaimStatusBadge, RoutingBadge } from "./StatusBadge";

function pct(n: number | null) {
  if (n === null || n === undefined) return "—";
  return `${Math.round(n * 100)}%`;
}

export default function ClaimRow({ claim }: { claim: ClaimSummary }) {
  return (
    <Link
      href={`/claims/${claim.claim_id}`}
      className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center px-4 py-3 border-b border-paper-line hover:bg-white/40 transition-colors text-sm"
    >
      <span className="font-mono text-ink col-span-2 sm:col-span-1">{claim.claim_id}</span>
      <span className="text-ink-soft hidden sm:block">{claim.doc_count} docs</span>
      <ClaimStatusBadge status={claim.claim_status} />
      <RoutingBadge decision={claim.routing_decision} />
      <span className="text-ink-soft hidden sm:block">conf {pct(claim.confidence_score)}</span>
      <span className="text-ink-soft">fraud {pct(claim.fraud_risk_score)}</span>
    </Link>
  );
}
