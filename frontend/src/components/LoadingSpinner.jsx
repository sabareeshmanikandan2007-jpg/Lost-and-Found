const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative w-11 h-11">
      <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{text}</p>
  </div>
);

export default LoadingSpinner;
