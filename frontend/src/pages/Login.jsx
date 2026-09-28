import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col lg:flex-row font-sans">
      
      {/* ── LEFT PANEL (Visual/Brand) ── */}
      <div className="lg:w-1/2 bg-primary brutal-border border-0 border-b-2 lg:border-b-0 lg:border-r-2 flex flex-col justify-center px-10 py-16 lg:px-20 relative overflow-hidden h-[40vh] lg:h-auto min-h-[400px]">
        
        {/* Background Dots */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, black 2px, transparent 2px)', backgroundSize: '30px 30px' }} 
        />
        
        <div className="relative z-10 max-w-xl">
          <Link to="/" className="inline-block mb-10">
             <img src="/assets/logo-brutal.png" alt="FINDY" className="h-16 w-auto object-contain" />
          </Link>
          
          <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.1] uppercase tracking-tight text-charcoal mb-6">
            Find <br className="hidden lg:block"/>
            <span className="bg-white px-2 inline-block -rotate-1 mt-2">what matters.</span>
            <br/>
            <span className="text-white bg-charcoal px-2 inline-block rotate-1 mt-3">Return what belongs.</span>
          </h1>
          
          <p className="text-xl font-bold text-charcoal/80 max-w-md bg-white border-2 border-black inline-block px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
            The exclusive Lost & Found network built for KPRIET students.
          </p>
        </div>

        {/* Floating Brutalist Demo Cards (CSS animated slightly if desired, or static) */}
        <div className="hidden lg:block absolute top-[15%] right-10 bg-white brutal-border shadow-[6px_6px_0_0_#000] p-4 rotate-3 z-10 select-none hover:rotate-6 hover:shadow-[8px_8px_0_0_#000] transition-all cursor-default">
           <span className="badge badge-found mb-2 !border-2 !border-black">FOUND</span>
           <p className="font-display font-black text-lg">Apple AirPods</p>
           <p className="text-sm font-bold text-charcoal/60">Library 2nd Floor</p>
        </div>
        
        <div className="hidden lg:block absolute bottom-[20%] right-20 bg-charcoal text-white brutal-border shadow-[6px_6px_0_0_#000] p-4 -rotate-6 z-10 select-none hover:-rotate-3 hover:shadow-[8px_8px_0_0_#000] transition-all cursor-default">
           <span className="badge badge-lost mb-2 !border-2 !border-black max-w-fit">LOST</span>
           <p className="font-display font-black text-lg">Student ID Card</p>
           <p className="text-sm font-medium text-white/70">Main Ground</p>
        </div>
      </div>

      {/* ── RIGHT PANEL (Auth Form) ── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative flex-1">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="brutal-btn bg-white py-2 px-3 text-sm !shadow-[3px_3px_0_0_#000]" aria-label="Go home">
            <ArrowLeft className="w-5 h-5 mr-1" strokeWidth={3} /> BACK
          </Link>
        </div>
        
        <div className="w-full max-w-[480px]">
          
          <div className="bg-white brutal-border brutal-shadow-xl p-8 lg:p-12 relative">
            {/* Decoration */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary brutal-border" />
            
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-display font-black uppercase text-charcoal tracking-tight mb-2">Student Login</h2>
              <p className="text-base font-bold text-charcoal/60">Access your campus network securely.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">College Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@kpriet.ac.in"
                  className="brutal-input"
                />
              </div>

              <div>
                <label className="label-text">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="brutal-input font-mono tracking-widest text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brutal-btn-charcoal w-full h-14 mt-4 text-lg tracking-widest"
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN TO FINDY →'}
              </button>
            </form>

            <div className="mt-8 border-t-2 border-black/10 pt-6">
              <div className="bg-primary/20 border-l-4 border-primary p-3 mb-6">
                <p className="text-[13px] font-bold text-charcoal">
                  🔒 Only <span className="bg-primary px-1">@kpriet.ac.in</span> student emails are allowed.
                </p>
              </div>
              <p className="text-[15px] font-bold text-charcoal text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-charcoal hover:bg-primary px-2 transition-colors border-b-2 border-black ml-1 uppercase">
                  Create Account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
