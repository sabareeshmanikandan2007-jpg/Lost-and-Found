import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package2, AlertCircle, Search, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import PostCard from '../components/PostCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { getPosts, getStats } from '../services/api';

/* ── Hero Browser Mockup Component ─────────────────────── */
const HeroBrowserMockup = () => {
  const mockups = [
    { cat: '📱', title: 'iPhone 13', type: 'Lost' },
    { cat: '🎒', title: 'Blue Backpack', type: 'Lost' },
    { cat: '📦', title: 'Water Bottle', type: 'Found' },
    { cat: '📱', title: 'AirPods Pro', type: 'Found' },
  ];
  return (
  <div className="bg-white brutal-border shadow-[12px_12px_0_0_#000] w-full max-w-[600px] overflow-hidden relative rotate-1 hover:rotate-0 transition-transform duration-500 origin-bottom-right">
    {/* Browser Top Bar */}
    <div className="bg-charcoal border-b-2 border-black flex items-center px-4 py-3 gap-2">
      <div className="w-3 h-3 rounded-full bg-lost brutal-border"></div>
      <div className="w-3 h-3 rounded-full bg-primary brutal-border"></div>
      <div className="w-3 h-3 rounded-full bg-found brutal-border"></div>
      <div className="flex-1 text-center font-display font-bold text-white text-xs uppercase tracking-widest pl-4 opacity-80">
        Latest Campus Finds
      </div>
    </div>
    
    {/* Browser Content */}
    <div className="p-6 bg-neutral grid grid-cols-2 gap-4 h-[300px] overflow-hidden relative">
       {mockups.map((item, i) => (
         <div key={i} className="bg-white brutal-border shadow-[4px_4px_0_0_#000] p-3 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">{item.cat}</span>
            <span className="font-display font-bold text-sm text-charcoal truncate w-full">{item.title}</span>
            <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 border-2 border-black ${item.type === 'Lost' ? 'bg-lost text-white' : 'bg-found text-black'}`}>{item.type.toUpperCase()}</span>
         </div>
       ))}
    </div>
  </div>
);
};

/* ── Stat Card Component ────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="bg-white brutal-border brutal-shadow p-6 flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all">
    <div className={`w-14 h-14 shrink-0 flex items-center justify-center brutal-border ${accent} shadow-[4px_4px_0_0_#000]`}>
      <Icon className="w-6 h-6" strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-4xl font-display font-black text-charcoal tabular-nums leading-none mb-1">{value.toLocaleString()}</p>
      <p className="text-sm font-bold font-sans text-charcoal/70 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

/* ── Home Page ──────────────────────────────────────────── */
const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sData, pData] = await Promise.all([
        getStats(),
        getPosts({ limit: 8, sort: 'newest' }),
      ]);
      setStats(sData.stats || { total: 0, lost: 0, found: 0, resolved: 0 });
      setRecentPosts(pData.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const displayPosts = recentPosts;

  return (
    <div className="flex flex-col">
      {/* ────── HERO (Neo-Brutalist Layout) ────── */}
      <section className="bg-primary w-full brutal-border border-l-0 border-r-0 border-t-0 mb-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          
          {/* Subtle Grid pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, black 3px, transparent 3px)', backgroundSize: '40px 40px' }} />

          <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
            {/* Left Column (Text) */}
            <div className="flex-1 w-full lg:pr-10">
               <div className="inline-flex items-center font-display font-black text-sm uppercase tracking-widest bg-white brutal-border px-4 py-2 shadow-[4px_4px_0_0_#000] mb-8">
                 FINDY • CAMPUS LOST & FOUND
               </div>
               
               <h1 className="text-6xl sm:text-7xl lg:text-[90px] font-display font-black leading-[0.9] text-charcoal uppercase tracking-tighter mb-8">
                 LOST SOMETHING?<br/>
                 WE'LL HELP YOU<br/>
                 <span className="text-white bg-charcoal inline-block px-4 py-1 -rotate-1 mt-2 shadow-[8px_8px_0_0_rgba(255,255,255,1)] border-2 border-white">FIND IT.</span>
               </h1>

               <p className="text-xl font-bold font-sans text-charcoal max-w-lg mb-10 bg-white inline-block p-4 brutal-border shadow-[4px_4px_0_0_#000]">
                 The premium student marketplace to report lost items and reunite discovered belongings instantly.
               </p>

               <div className="flex flex-wrap gap-4">
                 <Link to="/create?type=Lost" className="brutal-btn bg-lost text-white hover:bg-red-600 text-lg py-4">
                   🔴 REPORT LOST ITEM
                 </Link>
                 <Link to="/create?type=Found" className="brutal-btn bg-found text-black hover:bg-green-500 text-lg py-4">
                   🟢 I FOUND SOMETHING
                 </Link>
               </div>
            </div>

            {/* Right Column (Visual) */}
            <div className="flex-1 w-full relative hidden md:flex items-center justify-center min-h-[500px]">
               <HeroBrowserMockup />
               
               {/* Floating Badges */}
               <div className="absolute top-10 -left-10 bg-white brutal-border shadow-[4px_4px_0_0_#000] px-4 py-2 font-display font-black text-sm -rotate-6 z-20 flex flex-col float">
                 <span className="text-found underline">✓ RETURNED</span>
                 <span>Student ID Card</span>
               </div>

               <div className="absolute bottom-20 -right-5 bg-charcoal text-white brutal-border border-white shadow-[4px_4px_0_0_#FFF] px-4 py-2 font-display font-black text-sm rotate-3 z-20 flex flex-col float-delayed">
                 <span className="text-lost underline">! LOST</span>
                 <span>iPhone 13 - Main Block</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-24 pb-20">
        
        {/* ────── STATS (Campus Activity) ────── */}
        <section className="bg-charcoal text-white brutal-border p-8 lg:p-12 shadow-[8px_8px_0_0_rgba(183,198,194,1)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sage text-charcoal brutal-border px-6 py-2 font-display font-black text-xl shadow-[4px_4px_0_0_#000] rotate-2">
            CAMPUS ACTIVITY
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatCard icon={Package2} value={stats.total} label="Total Items" accent="bg-primary text-black" />
            <StatCard icon={AlertCircle} value={stats.lost} label="Lost" accent="bg-lost text-white" />
            <StatCard icon={Search} value={stats.found} label="Found" accent="bg-found text-black" />
            <StatCard icon={CheckCircle2} value={stats.resolved} label="Resolved" accent="bg-sage text-charcoal" />
          </div>
        </section>

        {/* ────── RECENT POSTS ────── */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4 border-b-4 border-black pb-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-display font-black text-charcoal uppercase tracking-tighter">Recently Reported</h2>
              <p className="text-charcoal/70 font-bold font-sans mt-2">See what students are currently looking for on campus.</p>
            </div>
            <Link to="/browse" className="brutal-btn bg-white hover:bg-primary shadow-[4px_4px_0_0_#000] shrink-0">
              BROWSE ALL <ArrowUpRight className="w-5 h-5 ml-1" strokeWidth={3} />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : error ? (
            <div className="bg-red-50 brutal-border p-10 text-center shadow-[4px_4px_0_0_#000]">
              <p className="text-lost font-black font-display text-2xl mb-2">Couldn't load posts</p>
              <p className="text-charcoal font-bold font-sans mb-6">{error}</p>
              <button onClick={fetchData} className="brutal-btn-primary">TRY AGAIN</button>
            </div>
          ) : displayPosts.length === 0 ? (
            <EmptyState
              title="No posts yet"
              description="Be the first to report a lost or found item on campus!"
              action={<Link to="/create" className="brutal-btn-primary">REPORT AN ITEM</Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayPosts.slice(0, 8).map((post, idx) => (
                <PostCard key={post._id || idx} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* ────── HOW FINDY WORKS ────── */}
        <section className="bg-neutral brutal-border border-4 border-charcoal p-8 lg:p-16 shadow-[12px_12px_0_0_#000] overflow-hidden relative">
          <div className="absolute -top-10 -right-10 text-[200px] font-display font-black text-charcoal opacity-[0.03] select-none pointer-events-none">FINDY</div>
          
          <h2 className="text-4xl sm:text-5xl font-display font-black text-charcoal uppercase tracking-tighter mb-12 border-b-2 border-black inline-block pb-2">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000] rotate-1">
              <span className="text-6xl font-display font-black text-primary stroke-charcoal stroke-2 tracking-tighter mb-4 block [text-shadow:2px_2px_0_#000]">01</span>
              <h3 className="text-2xl font-display font-black uppercase mb-2">Report</h3>
              <p className="font-bold font-sans text-charcoal/80">Submit details about the item you lost or found with our quick form.</p>
            </div>
            
            <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000] -rotate-1 translate-y-4">
              <span className="text-6xl font-display font-black text-sage tracking-tighter mb-4 block [text-shadow:2px_2px_0_#000]">02</span>
              <h3 className="text-2xl font-display font-black uppercase mb-2">Discover</h3>
              <p className="font-bold font-sans text-charcoal/80">Browse the live campus database and connect via student contact info.</p>
            </div>
            
            <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000] rotate-2 translate-y-8">
              <span className="text-6xl font-display font-black text-found tracking-tighter mb-4 block [text-shadow:2px_2px_0_#000]">03</span>
              <h3 className="text-2xl font-display font-black uppercase mb-2">Return</h3>
              <p className="font-bold font-sans text-charcoal/80">Meet on campus, return the item, and mark the post as resolved!</p>
            </div>
          </div>
        </section>

        {/* ────── FINAL CTA ────── */}
        <section className="bg-primary brutal-border p-10 lg:p-20 text-center shadow-[8px_8px_0_0_#000] relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-7xl font-display font-black text-charcoal uppercase tracking-tighter mb-4">
              Lost Something?
            </h2>
            <h3 className="text-4xl lg:text-5xl font-display font-black text-white bg-charcoal inline-block px-4 py-2 brutal-border mb-10 shadow-[6px_6px_0_0_rgba(255,255,255,1)] rotate-1">
              LET'S FIND IT.
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/browse" className="brutal-btn bg-white hover:bg-neutral text-xl shadow-[4px_4px_0_0_#000]">
                BROWSE ITEMS
              </Link>
              <Link to="/create?type=Lost" className="brutal-btn bg-charcoal text-white hover:bg-black text-xl shadow-[4px_4px_0_0_#FFF] hover:shadow-[2px_2px_0_0_#FFF]">
                REPORT AN ITEM
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
