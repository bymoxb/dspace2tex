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
    <p className="text-red-600">
      {/* <pre>{JSON.stringify({ hasError, message })}</pre> */}
      <span className="font-bold">Error:</span> <span>{message ?? ""}</span>
    </p>
  )
}