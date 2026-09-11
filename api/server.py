"""
FastAPI layer over the LangGraph claim pipeline.

Why this file exists:
    The Next.js frontend cannot import a Python LangGraph object directly.
    This server is the bridge — it runs `claim_graph.invoke(...)`, converts
    the resulting ClaimState dict into plain JSON, and exposes it over HTTP
    so the portal UI can upload documents, poll claim status, and submit
    manual adjudication decisions.

Contract with the frontend (do not break these field names — the UI reads
them directly):
    claim_status      -> "approved" | "rejected" | "pending_review"
    routing_decision  -> "auto_approve" | "investigate" | "escalate"
    audit_log         -> list of {content, actor, at} in chronological order

Run with:
    uvicorn api.server:app --reload --port 8000
"""
import os
import shutil
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from graph.builder import claim_graph

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="ClaimAble API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory claim store ───────────────────────────────────────────────
# Swap this for a real DB (Postgres/Mongo) when persistence matters beyond
# a single server process. Keyed by claim_id -> last known ClaimState dict.
CLAIMS: Dict[str, Dict[str, Any]] = {}


def serialize_audit_log(audit_log: List[Any]) -> List[Dict[str, str]]:
    """Turn LangChain message objects into plain JSON the UI can render."""
    out = []
    for entry in audit_log or []:
        content = getattr(entry, "content", str(entry))
        actor = "system"
        if isinstance(entry, HumanMessage):
            actor = "adjudicator"
        elif isinstance(entry, AIMessage):
            actor = "system"
        out.append({
            "content": content,
            "actor": actor,
            "at": getattr(entry, "additional_kwargs", {}).get("at")
                  or datetime.now(timezone.utc).isoformat(),
        })
    return out


def serialize_state(state: Dict[str, Any]) -> Dict[str, Any]:
    """The graph's final `result` dict, made JSON-safe for the frontend."""
    return {
        "claim_id": state.get("claim_id"),
        "raw_documents": state.get("raw_documents") or [],
        "extracted_facts": state.get("extracted_facts"),
        "doc_anomalies": state.get("doc_anomalies"),
        "policy_clauses": state.get("policy_clauses"),
        "coverage_status": state.get("coverage_status"),
        "validation_result": state.get("validation_result"),
        "confidence_score": state.get("confidence_score"),
        "routing_decision": state.get("routing_decision"),
        "fraud_signals": state.get("fraud_signals") or [],
        "fraud_risk_score": state.get("fraud_risk_score"),
        "actions_triggered": state.get("actions_triggered") or [],
        "settlement_amount": state.get("settlement_amount"),
        "claim_status": state.get("claim_status"),
        "rejection_reason": state.get("rejection_reason"),
        "audit_log": serialize_audit_log(state.get("audit_log")),
    }


def build_initial_state(claim_id: str, raw_documents: List[str]) -> Dict[str, Any]:
    return {
        "claim_id": claim_id,
        "raw_documents": raw_documents,
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


# ── Routes ───────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/claims")
async def create_claim(files: List[UploadFile] = File(...)):
    """Upload documents for a new claim and run the LangGraph pipeline."""
    if not files:
        raise HTTPException(400, "At least one document is required.")

    claim_id = f"CLM-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    claim_dir = os.path.join(UPLOAD_DIR, claim_id)
    os.makedirs(claim_dir, exist_ok=True)

    saved_paths = []
    for f in files:
        dest = os.path.join(claim_dir, f.filename)
        with open(dest, "wb") as out:
            shutil.copyfileobj(f.file, out)
        saved_paths.append(dest)

    initial_state = build_initial_state(claim_id, saved_paths)

    try:
        # This is the graph's final `result` dict — the single source of
        # truth for everything the tracking UI displays.
        result = claim_graph.invoke(initial_state)
    except Exception as exc:
        raise HTTPException(500, f"Graph execution failed: {exc}")

    serialized = serialize_state(result)
    CLAIMS[claim_id] = serialized
    return serialized


@app.get("/api/claims")
def list_claims():
    """Queue view: newest first, lightweight fields only."""
    items = [
        {
            "claim_id": c["claim_id"],
            "claim_status": c["claim_status"],
            "routing_decision": c["routing_decision"],
            "fraud_risk_score": c["fraud_risk_score"],
            "confidence_score": c["confidence_score"],
            "doc_count": len(c["raw_documents"]),
        }
        for c in CLAIMS.values()
    ]
    return list(reversed(items))


@app.get("/api/claims/{claim_id}")
def get_claim(claim_id: str):
    claim = CLAIMS.get(claim_id)
    if not claim:
        raise HTTPException(404, f"No claim found with id {claim_id}")
    return claim


class AdjudicationRequest(BaseModel):
    decision: str  # "approved" | "rejected" | "pending_review"
    reason: Optional[str] = None
    adjudicator: str = "adjudicator"


ALLOWED_DECISIONS = {"approved", "rejected", "pending_review"}


@app.post("/api/claims/{claim_id}/adjudicate")
def adjudicate_claim(claim_id: str, body: AdjudicationRequest):
    """Manual adjudication — a human overrides/confirms the routed decision.

    This never re-runs the graph; it appends a human-authored entry to the
    same audit trail the graph writes to, so the trail stays one continuous,
    append-only record regardless of who (or what) made the call.
    """
    claim = CLAIMS.get(claim_id)
    if not claim:
        raise HTTPException(404, f"No claim found with id {claim_id}")
    if body.decision not in ALLOWED_DECISIONS:
        raise HTTPException(400, f"decision must be one of {sorted(ALLOWED_DECISIONS)}")

    claim["claim_status"] = body.decision
    claim["rejection_reason"] = body.reason if body.decision == "rejected" else None

    note = f"[ManualAdjudication] {body.adjudicator} set claim_status={body.decision}"
    if body.reason:
        note += f" — reason: {body.reason}"

    claim["audit_log"].append({
        "content": note,
        "actor": "adjudicator",
        "at": datetime.now(timezone.utc).isoformat(),
    })

    CLAIMS[claim_id] = claim
    return claim