// FormField.jsx
// Layout wrapper: renders a label row above any input child.
//
// Props:
//   label    {string}  – visible label text
//   required {boolean} – shows a red asterisk (*) after the label
//   hint     {string}  – optional muted note shown inline with the label
//                        e.g. "Cannot be edited later"
//   children           – the input element rendered below the label

const FormField = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">

    {/* Label row */}
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 select-none">
      {label}

      {/* Red asterisk — only for required fields */}
      {required && (
        <span className="text-red-500 text-sm leading-none">*</span>
      )}

      {/* Muted hint text in parentheses beside the label */}
      {hint && (
        <span className="ml-0.5 text-xs font-normal text-gray-400">
          ({hint})
        </span>
      )}
    </label>

    {/* Input slot */}
    {children}
  </div>
);

export default FormField;