import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

export default function Error({
  hasError,
  message,
}: {
  hasError?: boolean,
  message?: string,
}) {
  if (hasError == undefined) return (<></>);
  if (hasError) return (<></>);
  return (
    <Callout.Root color="red">

      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>

      <Callout.Text>
        {message ?? ""}
      </Callout.Text>
    </Callout.Root>
  )
}