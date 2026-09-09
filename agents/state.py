from typing import TypedDict, Annotated, Optional, List
from langgraph.graph.message import add_messages

class ClaimState(TypedDict):

    # ── Populated by Aditya (Step 01 - Ingestion) ──────────────────
    claim_id: str
    raw_documents: List[str]          # file paths handed in from his endpoints

    # ── Populated by Shivansh (Step 02 - Document Intel) ───────────
    extracted_facts: Optional[dict]   # patient name, diagnosis, dates, amounts
    doc_anomalies: Optional[List[str]]

    # ── Populated by Shivansh (Step 03 - Policy Intel) ─────────────
    policy_clauses: Optional[List[str]]
    coverage_status: Optional[str]    # "covered" | "excluded" | "partial"

    # ── Populated by Aditya + Shivansh (Step 04 - Validation) ──────
    validation_result: Optional[dict] # covered items, violations, ineligible expenses

    # ── Populated by Meharsh Phase 3 (Step 05 - Claim Router) ──────
    confidence_score: Optional[float]
    routing_decision: Optional[str]   # "auto_approve" | "investigate" | "escalate"

    # ── Populated by Meharsh Phase 3 (Step 06 - Fraud) ─────────────
    fraud_signals: Optional[List[str]]
    fraud_risk_score: Optional[float]

    # ── Populated by Meharsh + Aditya Phase 4 (Step 07 - Action) ───
    actions_triggered: Optional[List[str]]
    settlement_amount: Optional[float]

    # ── Populated by Aditya Phase 4 (Step 08 - Audit) ───────────────
    claim_status: Optional[str]       # "approved" | "rejected" | "pending_review"
    rejection_reason: Optional[str]

    # ── Immutable audit trail — append-only, never overwrite ────────
    audit_log: Annotated[List[str], add_messages]
    messages:  Annotated[List,      add_messages]