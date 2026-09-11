import { ClaimDetail, ClaimStatus, ClaimSummary } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export function listClaims(): Promise<ClaimSummary[]> {
  return request<ClaimSummary[]>("/api/claims", { cache: "no-store" });
}

export function getClaim(claimId: string): Promise<ClaimDetail> {
  return request<ClaimDetail>(`/api/claims/${claimId}`, { cache: "no-store" });
}

export function uploadClaim(files: File[]): Promise<ClaimDetail> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return request<ClaimDetail>("/api/claims", { method: "POST", body: form });
}

export function adjudicateClaim(
  claimId: string,
  decision: ClaimStatus,
  reason?: string,
  adjudicator?: string
): Promise<ClaimDetail> {
  return request<ClaimDetail>(`/api/claims/${claimId}/adjudicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision, reason, adjudicator: adjudicator ?? "adjudicator" }),
  });
}
