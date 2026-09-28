import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import PostCard from '../components/PostCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { getPosts } from '../services/api';

const CATEGORIES = ['All', 'Electronics', 'Bags', 'Books', 'ID Cards', 'Wallet', 'Keys', 'Documents', 'Accessories', 'Other'];

const BrowsePosts = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    status: 'All',
    sort: 'newest',
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce Search logic
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts({
        ...filters,
        search: debouncedSearch,
        limit: 50,
      });
      setPosts(data.posts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.category, filters.type, filters.status, filters.sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="w-full flex-1 pt-8 pb-16">
      <div className="bg-charcoal text-white brutal-border p-8 mb-8 shadow-[8px_8px_0_0_rgba(255,225,124,1)] relative overflow-hidden">
         <div className="absolute -right-20 -bottom-20 text-[180px] font-display font-black text-white/5 pointer-events-none select-none">BROWSE</div>
         <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter relative z-10">
           Find what you're looking for.
         </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Sidebar Filters ── */}
        <button 
          className="lg:hidden w-full brutal-btn bg-white shadow-[4px_4px_0_0_#000]"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'CLOSE FILTERS' : 'SHOW FILTERS'} <Filter className="w-4 h-4 ml-2" />
        </button>

        <aside className={`w-full lg:w-72 shrink-0 space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000]">
            <h3 className="font-display font-black text-xl border-b-2 border-black pb-2 mb-4 uppercase">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Keywords..."
                className="brutal-input pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search className="w-5 h-5 absolute left-3 top-3.5 text-charcoal/50" />
            </div>
            {filters.search && (
              <button 
                className="text-xs font-bold font-sans text-red-600 mt-2 flex items-center hover:underline"
                onClick={() => setFilters({...filters, search: ''})}
              >
                <X className="w-3 h-3 mr-1" /> Clear search
              </button>
            )}
          </div>

          <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000]">
            <h3 className="font-display font-black text-xl border-b-2 border-black pb-2 mb-4 uppercase">Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    className="w-5 h-5 accent-charcoal border-2 border-black brutal-border"
                    checked={filters.category === cat}
                    onChange={() => setFilters({ ...filters, category: cat })}
                  />
                  <span className="font-sans font-bold text-sm text-charcoal group-hover:text-primary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000]">
            <h3 className="font-display font-black text-xl border-b-2 border-black pb-2 mb-4 uppercase">Report Type</h3>
            <select
              className="brutal-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_10px_center] bg-no-repeat cursor-pointer font-bold"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="All">All Types</option>
              <option value="Lost">Lost Items</option>
              <option value="Found">Found Items</option>
            </select>
          </div>

          <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000]">
            <h3 className="font-display font-black text-xl border-b-2 border-black pb-2 mb-4 uppercase">Sort By</h3>
            <select
              className="brutal-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_10px_center] bg-no-repeat cursor-pointer font-bold"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </aside>

        {/* ── Main Results Grid ── */}
        <div className="flex-1 w-full">
           {/* Active Filters Bar */}
           <div className="flex flex-wrap items-center gap-2 mb-6">
             <span className="font-sans font-bold text-sm uppercase text-charcoal">Active Filters:</span>
             <span className="badge font-bold !border-black">{filters.category}</span>
             <span className="badge font-bold !border-black">{filters.type}</span>
             {filters.search && <span className="badge font-bold bg-primary border-black">"{filters.search}"</span>}
           </div>

           {loading ? (
             <SkeletonGrid count={8} />
           ) : posts.length === 0 ? (
             <EmptyState 
               title="No results found" 
               description="Try adjusting your filters or search terms." 
               action={
                 <button 
                   onClick={() => setFilters({ search: '', category: 'All', type: 'All', status: 'All', sort: 'newest' })}
                   className="brutal-btn-primary"
                 >
                   RESET FILTERS
                 </button>
               }
             />
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {posts.map(post => (
                 <PostCard key={post._id} post={post} />
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default BrowsePosts;
