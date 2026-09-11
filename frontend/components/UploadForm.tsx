"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadDropzone from "./UploadDropzone";
import { uploadClaim } from "@/lib/api";

export default function UploadForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (files.length === 0) {
      setError("Add at least one document before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const claim = await uploadClaim(files);
      router.push(`/claims/${claim.claim_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <UploadDropzone files={files} onChange={setFiles} />

      {error && <p className="text-sm text-stamp-rejected">{error}</p>}

      <button
        type="button"
        disabled={submitting}
        onClick={submit}
        className="rounded-sm bg-ink text-paper px-4 py-2 text-sm disabled:opacity-40 hover:bg-ink-soft transition-colors"
      >
        {submitting ? "Running intake pipeline…" : "Submit claim"}
      </button>
      {submitting && (
        <p className="text-xs text-ink-soft">
          Documents are being parsed and routed — this runs the full graph
          before the claim appears.
        </p>
      )}
    </div>
  );
}
