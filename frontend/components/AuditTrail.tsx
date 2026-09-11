import { AuditEntry } from "@/lib/types";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) {
    return <p className="text-sm text-ink-soft">No audit entries yet.</p>;
  }
  return (
    <ol className="relative border-l border-paper-line pl-5 space-y-5">
      {entries.map((entry, i) => (
        <li key={i} className="relative">
          <span
            className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-paper ${
              entry.actor === "adjudicator" ? "bg-stamp-investigate" : "bg-ink-soft"
            }`}
          />
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs uppercase tracking-wide text-ink-soft">
              {entry.actor === "adjudicator" ? "Adjudicator" : "System"}
            </span>
            <span className="text-xs text-ink-soft font-mono">{formatTime(entry.at)}</span>
          </div>
          <p className="text-sm text-ink mt-0.5">{entry.content}</p>
        </li>
      ))}
    </ol>
  );
}
