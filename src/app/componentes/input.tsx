export default function Input({
  customRef,
  onBlur,
  onFocus,
  title,
  placeholder,
  id,
  type,
  required,
}: {
  id: string,
  type: string
  title: string,
  required?: boolean;
  placeholder?: string,
  customRef: any,
  onFocus?: () => void,
  onBlur?: () => void,
}) {
  return (
    <>
      <label htmlFor="url" className="">{title}</label>
      <input
        ref={customRef}
        onFocus={onFocus}
        onBlur={onBlur}
        //
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        className="border rounded px-2 py-1 flex-1"
      >
      </input></>
  )
}