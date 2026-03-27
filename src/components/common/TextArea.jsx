// TextArea.jsx
// Controlled multi-line text field.
//
// Props:
//   value       {string}
//   onChange    {(val: string) => void}
//   placeholder {string}
//   rows        {number}  – visible row count (default: 4)

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors duration-150"
  />
);

export default TextArea;