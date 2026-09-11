// These mirror agents/state.py::ClaimState on the backend. Keep field names
// identical — the backend serializes the graph's final `result` dict
// straight into this shape.

export type ClaimStatus = "approved" | "rejected" | "pending_review";
export type RoutingDecision = "auto_approve" | "investigate" | "escalate";

export interface AuditEntry {
  content: string;
  actor: "system" | "adjudicator";
  at: string; // ISO timestamp
}

export interface ClaimSummary {
  claim_id: string;
  claim_status: ClaimStatus | null;
  routing_decision: RoutingDecision | null;
  fraud_risk_score: number | null;
  confidence_score: number | null;
  doc_count: number;
}

export interface ClaimDetail {
  claim_id: string;
  raw_documents: string[];
  extracted_facts: Record<string, unknown> | null;
  doc_anomalies: string[] | null;
  policy_clauses: string[] | null;
  coverage_status: string | null;
  validation_result: Record<string, unknown> | null;
  confidence_score: number | null;
  routing_decision: RoutingDecision | null;
  fraud_signals: string[];
  fraud_risk_score: number | null;
  actions_triggered: string[];
  settlement_amount: number | null;
  claim_status: ClaimStatus | null;
  rejection_reason: string | null;
  audit_log: AuditEntry[];
}
