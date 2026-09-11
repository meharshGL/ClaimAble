from agents.state import ClaimState
from langchain_core.messages import AIMessage

def document_intel_stub(state: ClaimState) -> dict:
    """Step 02 — Shivansh owns this. Stub until Phase 2."""
    print(f"  [Step 02 - DocumentIntel] stub called for {state['claim_id']}")
    return {
        "audit_log": [AIMessage(content="[Step02:DocumentIntel] stub executed")]
    }

def policy_intel_stub(state: ClaimState) -> dict:
    """Step 03 — Shivansh owns this. Stub until Phase 2."""
    print(f"  [Step 03 - PolicyIntel] stub called for {state['claim_id']}")
    return {
        "audit_log": [AIMessage(content="[Step03:PolicyIntel] stub executed")]
    }

def validation_stub(state: ClaimState) -> dict:
    """Step 04 — Aditya + Shivansh own this. Stub until Phase 2."""
    print(f"  [Step 04 - Validation] stub called for {state['claim_id']}")
    return {
        "audit_log": [AIMessage(content="[Step04:Validation] stub executed")]
    }

def claim_router_stub(state: ClaimState) -> dict:
    """Step 05 — Meharsh owns this in Phase 3."""
    print(f"  [Step 05 - ClaimRouter] stub called for {state['claim_id']}")
    return {
        "routing_decision": "investigate",   # hardcoded until Phase 3
        "confidence_score": 0.5,
        "audit_log": [AIMessage(content="[Step05:ClaimRouter] stub — defaulting to investigate")]
    }

def fraud_investigation_stub(state: ClaimState) -> dict:
    """Step 06 — Meharsh owns this in Phase 3."""
    print(f"  [Step 06 - FraudInvestigation] stub called for {state['claim_id']}")
    return {
        "fraud_signals": [],
        "fraud_risk_score": 0.0,
        "audit_log": [AIMessage(content="[Step06:FraudInvestigation] stub executed")]
    }

def action_execution_stub(state: ClaimState) -> dict:
    """Step 07 — Meharsh + Aditya own this in Phase 4."""
    print(f"  [Step 07 - ActionExecution] stub called for {state['claim_id']}")
    return {
        "actions_triggered": [],
        "audit_log": [AIMessage(content="[Step07:ActionExecution] stub executed")]
    }

def verification_audit_stub(state: ClaimState) -> dict:
    """Step 08 — Aditya owns this in Phase 4."""
    print(f"  [Step 08 - VerificationAudit] stub called for {state['claim_id']}")
    return {
        "claim_status": "pending_review",
        "audit_log": [AIMessage(content="[Step08:VerificationAudit] stub — status=pending_review")]
    }   