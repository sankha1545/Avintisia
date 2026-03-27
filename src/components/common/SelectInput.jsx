// SelectInput.jsx
// Styled native <select> with a custom ChevronDown icon.
// appearance-none removes the browser default arrow so we render our own.
//
// Props:
//   value       {string}
//   onChange    {(val: string) => void}
//   options     {Array<{value: string, label: string}>}
//   placeholder {string}  – disabled first option shown as a hint

import { ChevronDown } from 'lucide-react';

const SelectInput = ({ value, onChange, options, placeholder }) => (
  // relative → positioning context for the absolute chevron icon
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-800 outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors duration-150"
    >
      {/* Placeholder option – disabled so it cannot be re-selected */}
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {/* Render each option */}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {/* Custom chevron – pointer-events-none lets clicks reach the <select> */}
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <ChevronDown size={16} />
    </span>
  </div>
);

export default SelectInput;