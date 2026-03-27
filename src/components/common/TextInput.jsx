// TextInput.jsx
// Controlled single-line text field.
//
// Props:
//   value       {string}
//   onChange    {(val: string) => void}
//   placeholder {string}

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors duration-150"
  />
);

export default TextInput;