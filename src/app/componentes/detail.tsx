import { useState } from "react";

export default function Detail({
  value,
  title,
  open,
  rows,
  readOnly = true,
  className,
}: {
  title: string,
  value: string | null,
  open?: boolean;
  rows?: number | undefined,
  readOnly?: boolean | undefined,
  className?: string;
}) {
  return (
    <details open={open} className={className}>
      <summary className="cursor-pointer">{title}</summary>
      <div className="relative">
        <CopyButton value={value} className="absolute right-2 top-2" />
        <textarea
          readOnly={readOnly}
          value={value ?? ""}
          wrap="off"
          rows={rows}
          className="border rounded w-full p-1"
        />
      </div>
    </details>
  )
}

enum CLIPBOARD {
  COPY = '📋',
  OK_COPY = '✅'
}

function CopyButton({ value, className = "" }: { value: string | null, className?: string }) {
  const [cText, setCText] = useState(CLIPBOARD.COPY);

  return (
    <button
      type="button"
      onClick={() => {
        if (cText === CLIPBOARD.OK_COPY) return;

        navigator.clipboard.writeText(value ?? "");
        setCText(CLIPBOARD.OK_COPY);
        setTimeout(() => {
          setCText(CLIPBOARD.COPY);
        }, 1000);
      }}
      className={"border rounded px-2 py-1 cursor-pointer " + className}

    >
      {cText}
    </button>
  )
}