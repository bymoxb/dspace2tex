import { Box, Button, IconButton, TextArea } from "@radix-ui/themes";
import { useState } from "react";

export default function Detail({
  value,
  open,
  rows,
  readOnly = true,
  className,
}: {
    // title: string,
  value: string | null,
  open?: boolean;
  rows?: number | undefined,
  readOnly?: boolean | undefined,
  className?: string;
}) {
  return (
    <Box className="box">
      <CopyButton value={value} className="copy-button" />
      <TextArea
        readOnly={readOnly}
        value={value ?? ""}
        wrap="off"
        rows={rows}
        className="border rounded w-full p-1"
      />
    </Box>
  )
}

enum CLIPBOARD {
  COPY = '📋 Copy',
  OK_COPY = '✅ Copied'
}

function CopyButton({ value, className = "" }: { value: string | null, className?: string }) {
  const [cText, setCText] = useState(CLIPBOARD.COPY);

  return (
    <Button
      color="indigo"
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
    </Button>
  )
}