import { ClaimStatus, RoutingDecision } from "@/lib/types";

const STATUS_STYLE: Record<ClaimStatus, { bg: string; fg: string; label: string }> = {
  approved: { bg: "bg-stamp-approved-bg", fg: "text-stamp-approved", label: "Approved" },
  rejected: { bg: "bg-stamp-rejected-bg", fg: "text-stamp-rejected", label: "Rejected" },
  pending_review: { bg: "bg-stamp-pending-bg", fg: "text-stamp-pending", label: "Pending review" },
};

const ROUTING_STYLE: Record<RoutingDecision, { bg: string; fg: string; label: string }> = {
  auto_approve: { bg: "bg-stamp-approved-bg", fg: "text-stamp-approved", label: "Auto-approve" },
  investigate: { bg: "bg-stamp-investigate-bg", fg: "text-stamp-investigate", label: "Investigate" },
  escalate: { bg: "bg-stamp-pending-bg", fg: "text-stamp-pending", label: "Escalate" },
};

function Badge({ bg, fg, label }: { bg: string; fg: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-current/20 px-2 py-0.5 text-xs font-medium ${bg} ${fg}`}
    >
      {label}
    </span>
  );
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-sm border border-ink-soft/20 px-2 py-0.5 text-xs font-medium text-ink-soft">
        Processing
      </span>
    );
  }
  const s = STATUS_STYLE[status];
  return <Badge {...s} />;
}

export function RoutingBadge({ decision }: { decision: RoutingDecision | null }) {
  if (!decision) {
    return (
      <span className="inline-flex items-center rounded-sm border border-ink-soft/20 px-2 py-0.5 text-xs font-medium text-ink-soft">
        —
      </span>
    );
  }
  const s = ROUTING_STYLE[decision];
  return <Badge {...s} />;
}
