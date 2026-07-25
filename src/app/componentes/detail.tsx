import { Box, Button, TextArea, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

export default function Detail({
  value,
  rows,
  readOnly = true,
}: {
  value: string | null,
    rows?: number,
    readOnly?: boolean,
}) {
  return (
    <Box position="relative">
      <Box position="absolute" top="2" right="2" style={{ zIndex: 1 }}>
        <CopyButton value={value} />
      </Box>

      <TextArea
        readOnly={readOnly}
        value={value ?? ""}
        variant="surface"
        resize="vertical"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          backgroundColor: 'var(--gray-2)'
        }}
        rows={rows}
      />
    </Box>
  )
}

function CopyButton({ value }: { value: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="1"
      variant="soft"
      color={copied ? "green" : "indigo"}
      onClick={handleCopy}
      style={{ cursor: 'pointer' }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}