import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Plus, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/browse', label: 'Browse' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (to) => location.pathname.startsWith(to.split('?')[0]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-primary brutal-border border-t-0 border-l-0 border-r-0 border-b-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group flex-shrink-0 mr-8">
              <img src="/assets/logo-brutal.png" alt="FINDY" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 flex-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={() =>
                    `px-5 py-2 font-bold font-display text-[15px] uppercase tracking-wide transition-all ${
                      isActive(link.to)
                        ? 'bg-charcoal text-primary brutal-border border-charcoal hover:bg-black'
                        : 'text-charcoal border-2 border-transparent hover:border-black'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right Panel */}
            <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
              {user && (
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white brutal-border brutal-shadow hover:translate-y-[2px] hover:translate-x-[2px] transition-transform active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                  >
                    <div className="w-6 h-6 rounded-none bg-charcoal text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold font-sans text-charcoal">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 text-charcoal transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                  </button>
                  
                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white brutal-border brutal-shadow-lg z-50 py-1 origin-top-right animate-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b-2 border-black mb-1 bg-neutral">
                        <p className="text-sm font-bold text-charcoal truncate">{user.name}</p>
                        <p className="text-xs text-charcoal/70 truncate">{user.email}</p>
                      </div>
                      <Link to="/browse" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-charcoal hover:bg-primary transition-colors border-b-2 border-transparent hover:border-black">
                         <User className="w-4 h-4" strokeWidth={2.5}/> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-t-2 border-transparent hover:border-red-600 text-left"
                      >
                         <LogOut className="w-4 h-4" strokeWidth={2.5}/> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to="/create?type=Lost"
                  className="brutal-btn bg-white text-charcoal py-2 px-4 hover:bg-charcoal hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> REPORT ALL
                </Link>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-charcoal brutal-border bg-white p-2 shadow-[2px_2px_0_0_#000]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <Menu className="w-6 h-6" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-[320px] bg-neutral brutal-border brutal-shadow-xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b-2 border-black bg-primary">
          <span className="text-2xl font-display font-black tracking-tight text-charcoal">FINDY</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-charcoal brutal-border p-1.5 bg-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
        
        {user && (
           <div className="p-5 border-b-2 border-black bg-white">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-charcoal text-white flex items-center justify-center font-display font-black text-xl brutal-border shadow-[2px_2px_0_0_#000]">
                 {user.name.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-base font-bold text-charcoal truncate">{user.name}</p>
                 <p className="text-sm font-semibold text-charcoal/60 truncate">{user.email}</p>
               </div>
             </div>
           </div>
        )}

        <nav className="p-5 space-y-3" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-5 py-3 font-display font-bold text-lg uppercase transition-all brutal-border ${
                isActive(link.to)
                  ? 'bg-charcoal text-primary shadow-[2px_2px_0_0_#000]'
                  : 'bg-white text-charcoal hover:bg-primary shadow-[2px_2px_0_0_#000]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 mt-6 pb-2 space-y-4">
            <Link
              to="/create"
              className="brutal-btn-primary w-full shadow-[4px_4px_0_0_#000]"
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
              REPORT ITEM
            </Link>
            
            {user && (
              <button 
                onClick={handleLogout}
                className="brutal-btn w-full bg-white hover:bg-red-50 text-red-600 shadow-[4px_4px_0_0_#000]"
              >
                SIGN OUT
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
