import { SearchX } from 'lucide-react';

const EmptyState = ({
  title = 'No items found',
  description = 'Try adjusting your search or filters.',
  action = null,
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white brutal-border shadow-[8px_8px_0_0_rgba(183,198,194,1)]">
    <div className="w-20 h-20 bg-primary brutal-border flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#000]">
      <SearchX className="w-10 h-10 text-charcoal" strokeWidth={2.5} />
    </div>
    <h3 className="text-3xl font-display font-black uppercase text-charcoal tracking-tighter mb-2">{title}</h3>
    <p className="text-base font-bold font-sans text-charcoal/70 max-w-sm">{description}</p>
    {action && <div className="mt-8">{action}</div>}
  </div>
);

export default EmptyState;
