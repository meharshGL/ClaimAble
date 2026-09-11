"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function UploadDropzone({ files, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      onChange([...files, ...Array.from(incoming)]);
    },
    [files, onChange]
  );

  const removeAt = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`cursor-pointer rounded-sm border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragging ? "border-ink bg-white/60" : "border-paper-line bg-white/30"
        }`}
      >
        <p className="font-display italic text-lg text-ink">
          Drop claim documents here
        </p>
        <p className="text-sm text-ink-soft mt-1">
          Hospital bills, prescriptions, policy pages — PDF, JPG, or PNG. Or
          click to browse.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="divide-y divide-paper-line border border-paper-line rounded-sm bg-white/40">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="truncate text-ink">{f.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="text-ink-soft hover:text-stamp-rejected text-xs ml-3"
                aria-label={`Remove ${f.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
