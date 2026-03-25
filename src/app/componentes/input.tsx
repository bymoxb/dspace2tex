import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Kbd, TextField } from "@radix-ui/themes";
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
  onFocus?: () => void,
  onBlur?: () => void,
    autoFocus?: boolean;
}) {
  const [ref] = useBackSlash();

  return (
    <>
      <TextField.Root ref={ref} type={type as any} style={{ width: "100%" }} {...props}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Slot>
          <Kbd>/</Kbd>
        </TextField.Slot>
      </TextField.Root>
    </>
  )
}