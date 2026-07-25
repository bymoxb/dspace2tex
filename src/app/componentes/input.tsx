import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Kbd, TextField } from "@radix-ui/themes";
import { useBackSlash } from "../hooks/use-shortcuts";

export default function Input({
  type,
  ...props
}: {
  id: string,
    type: string,
    name: string,
  required?: boolean;
    placeholder?: string,
    autoFocus?: boolean;
}) {
  const [ref] = useBackSlash();

  return (
    <TextField.Root
      ref={ref}
      size="3"
      type={type as any}
      {...props}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="18" width="18" />
      </TextField.Slot>
      <TextField.Slot pr="3">
        <Box display={{ initial: 'none', sm: 'block' }}>
          <Kbd size="2">/</Kbd>
        </Box>
      </TextField.Slot>
    </TextField.Root>
  )
}