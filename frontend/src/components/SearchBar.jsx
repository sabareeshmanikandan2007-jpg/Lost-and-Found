import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search items, locations, categories...' }) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" strokeWidth={2} />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-base pl-11 pr-10 h-12 text-[15px]"
      aria-label="Search posts"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
        aria-label="Clear search"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SearchBar;
