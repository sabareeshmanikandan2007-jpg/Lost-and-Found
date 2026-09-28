import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white border-t-2 border-black py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Brand Col */}
          <div className="md:col-span-5 lg:col-span-6">
            <Link to="/home" className="inline-block mb-6 bg-white p-2 border-2 border-primary rounded shadow-[4px_4px_0_0_#FFE17C]">
              <img src="/assets/logo-brutal.png" alt="FINDY" className="h-12 w-auto object-contain" />
            </Link>
            <h4 className="text-2xl font-display font-bold leading-tight max-w-sm mb-4">
              Find what matters.<br/> Return what belongs.
            </h4>
            <p className="text-base font-sans font-medium text-sage/80 max-w-sm">
              The premium Neo-Brutalist Lost & Found platform exclusively for the KPRIET college community.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-3 lg:col-span-2 space-y-6">
            <h5 className="font-display font-black text-lg text-primary uppercase tracking-wider mb-2">Platform</h5>
            <ul className="space-y-4">
              <li><Link to="/home" className="text-white hover:text-primary font-bold transition-colors inline-block hover:translate-x-1">Home</Link></li>
              <li><Link to="/browse" className="text-white hover:text-primary font-bold transition-colors inline-block hover:translate-x-1">Browse All</Link></li>
              <li><Link to="/create?type=Lost" className="text-white hover:text-primary font-bold transition-colors inline-block hover:translate-x-1">Report Lost</Link></li>
              <li><Link to="/create?type=Found" className="text-white hover:text-primary font-bold transition-colors inline-block hover:translate-x-1">Report Found</Link></li>
            </ul>
          </div>
          
          {/* Links Col 2 */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
             <div className="bg-primary brutal-border p-6 shadow-[6px_6px_0_0_#FFF] hover:shadow-[4px_4px_0_0_#FFF] transition-shadow text-charcoal">
               <h5 className="font-display font-black text-xl mb-2 leading-tight uppercase relative">
                 Join the movement
               </h5>
               <p className="text-sm font-bold mb-4 font-sans leading-relaxed">
                 Every item reported found is one student's sigh of relief. Keep KPRIET honest and connected.
               </p>
               <Link to="/create" className="inline-flex items-center font-bold text-sm bg-charcoal text-white px-4 py-2 brutal-border">
                 Take Action <ArrowUpRight className="ml-1 w-4 h-4" strokeWidth={3}/>
               </Link>
             </div>
          </div>
        </div>

        <div className="border-t-2 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 py-6 mt-16 text-sans text-sm font-bold text-sage">
          <p>© {new Date().getFullYear()} FINDY KPRIET. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
