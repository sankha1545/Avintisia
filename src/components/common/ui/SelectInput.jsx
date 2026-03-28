import { ChevronDown } from "lucide-react";

const SelectInput = ({ value, onChange, options = [], placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm text-gray-800 transition-colors duration-150 bg-white border border-gray-200 rounded-md outline-none appearance-none cursor-pointer pr-9 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    >
      {/* Placeholder */}
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {/* SAFE MAP */}
      {options.length > 0 ? (
        options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))
      ) : (
        <option disabled>No options</option>
      )}
    </select>

    <span className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
      <ChevronDown size={16} />
    </span>
  </div>
);

export default SelectInput;