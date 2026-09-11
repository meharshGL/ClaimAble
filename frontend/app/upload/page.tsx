import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display italic text-3xl text-ink">New claim intake</h1>
        <p className="text-sm text-ink-soft mt-1">
          Upload the supporting documents for a claim. Submitting runs the
          document intel, policy intel, validation, routing, and fraud
          pipeline end to end.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
