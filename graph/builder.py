from langgraph.graph import StateGraph, END
from agents.state import ClaimState
from agents.stubs import (
    document_intel_stub,
    policy_intel_stub,
    validation_stub,
    claim_router_stub,
    fraud_investigation_stub,
    action_execution_stub,
    verification_audit_stub,
)

def build_graph():
    g = StateGraph(ClaimState)

    # Register nodes — names match the step they represent
    g.add_node("step02_document_intel",      document_intel_stub)
    g.add_node("step03_policy_intel",        policy_intel_stub)
    g.add_node("step04_validation",          validation_stub)
    g.add_node("step05_claim_router",        claim_router_stub)
    g.add_node("step06_fraud_investigation", fraud_investigation_stub)
    g.add_node("step07_action_execution",    action_execution_stub)
    g.add_node("step08_verification_audit",  verification_audit_stub)

    # Linear flow for now — Phase 3 adds conditional branching at step05
    g.set_entry_point("step02_document_intel")
    g.add_edge("step02_document_intel",      "step03_policy_intel")
    g.add_edge("step03_policy_intel",        "step04_validation")
    g.add_edge("step04_validation",          "step05_claim_router")
    g.add_edge("step05_claim_router",        "step06_fraud_investigation")
    g.add_edge("step06_fraud_investigation", "step07_action_execution")
    g.add_edge("step07_action_execution",    "step08_verification_audit")
    g.add_edge("step08_verification_audit",  END)

    return g.compile()

# Singleton — import this everywhere
claim_graph = build_graph()