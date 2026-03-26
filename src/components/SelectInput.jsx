import { ChevronDown } from 'lucide-react';

const SelectInput = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className = '',
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 px-3 pr-10 text-sm text-text-primary border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors bg-white appearance-none cursor-pointer ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
    </div>
  );
};

export default SelectInput;
