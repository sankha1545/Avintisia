import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-white w-52">
      <Search size={16} className="text-text-muted mr-2 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full"
      />
    </div>
  );
};

export default SearchInput;
