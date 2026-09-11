from graph.builder import claim_graph

# This initial state simulates what Aditya's Step 01 endpoint will produce
initial_state = {
    "claim_id": "CLM-2026-001",
    "raw_documents": [
        "uploads/hospital_bill.pdf",
        "uploads/prescription.pdf",
        "uploads/policy.pdf",
    ],
    # Everything else starts as None — agents fill these in
    "extracted_facts": None,
    "doc_anomalies": None,
    "policy_clauses": None,
    "coverage_status": None,
    "validation_result": None,
    "confidence_score": None,
    "routing_decision": None,
    "fraud_signals": None,
    "fraud_risk_score": None,
    "actions_triggered": None,
    "settlement_amount": None,
    "claim_status": None,
    "rejection_reason": None,
    "audit_log": [],
    "messages": [],
}

print(f"Running graph for claim: {initial_state['claim_id']}\n")
result = claim_graph.invoke(initial_state)

print("\n── Final State ──────────────────────────")
print(f"Claim status    : {result['claim_status']}")
print(f"Routing decision: {result['routing_decision']}")
print(f"Fraud risk score: {result['fraud_risk_score']}")
print(f"\nAudit trail ({len(result['audit_log'])} entries):")
for entry in result['audit_log']:
    print(f"  {entry.content}")