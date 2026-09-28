import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Books', 'ID Cards', 'Wallet', 'Keys', 'Bags', 'Documents', 'Clothing', 'Accessories', 'Other'];
const TYPES = ['All', 'Lost', 'Found'];
const STATUSES = ['All', 'Active', 'Resolved'];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const SelectFilter = ({ id, label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-base h-10 text-sm cursor-pointer pr-8"
      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', appearance: 'none' }}
    >
      {options.map((opt) => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterBar = ({ filters, onFilterChange }) => {
  const hasActive =
    filters.category !== 'All' || filters.type !== 'All' ||
    filters.status !== 'All' || filters.sort !== 'newest';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-slate-800">Filters</span>
        {hasActive && (
          <button
            type="button"
            onClick={() => onFilterChange({ category: 'All', type: 'All', status: 'All', sort: 'newest' })}
            className="ml-auto flex items-center gap-1 text-[12px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SelectFilter id="f-cat"    label="Category" value={filters.category || 'All'} onChange={(v) => onFilterChange({ category: v })} options={CATEGORIES} />
        <SelectFilter id="f-type"   label="Type"     value={filters.type || 'All'}     onChange={(v) => onFilterChange({ type: v })}     options={TYPES} />
        <SelectFilter id="f-status" label="Status"   value={filters.status || 'All'}   onChange={(v) => onFilterChange({ status: v })}   options={STATUSES} />
        <SelectFilter id="f-sort"   label="Sort By"  value={filters.sort || 'newest'}  onChange={(v) => onFilterChange({ sort: v })}     options={SORTS} />
      </div>
    </div>
  );
};

export default FilterBar;
