import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    if (!formData.email.endsWith('@kpriet.ac.in')) {
      return toast.error('Only @kpriet.ac.in email addresses are allowed');
    }

    setLoading(true);
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    setLoading(false);
    
    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col lg:flex-row-reverse font-sans">
      
      {/* ── LEFT PANEL (Visual/Brand) ── */}
      <div className="lg:w-1/2 bg-charcoal brutal-border border-0 border-b-2 lg:border-b-0 lg:border-l-2 flex flex-col justify-center px-10 py-16 lg:px-20 relative overflow-hidden h-[30vh] lg:h-auto min-h-[300px]">
        
        {/* Abstract shapes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />
        
        <div className="relative z-10 max-w-xl text-white">
          <Link to="/" className="inline-block mb-8">
             <img src="/assets/logo-brutal.png" alt="FINDY" className="h-16 w-auto object-contain bg-white/10 p-2 rounded-2xl" />
          </Link>
          
          <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.1] uppercase tracking-tight text-white mb-6">
            Join <br className="hidden lg:block"/>
            <span className="bg-primary text-charcoal px-2 inline-block -rotate-1 mt-2">FINDY.</span>
          </h1>
          
          <p className="text-xl font-bold max-w-md bg-white text-charcoal brutal-border inline-block px-4 py-2">
            Help campus belongings find their way home.
          </p>

          <div className="hidden lg:flex gap-4 mt-12 w-full max-w-sm">
            <div className="flex-1 bg-lost text-white brutal-border p-4 shadow-[4px_4px_0_0_#FFF] font-display font-black text-center text-xl">REPORT</div>
            <div className="flex-1 bg-white text-charcoal brutal-border p-4 shadow-[4px_4px_0_0_#FFE17C] font-display font-black text-center text-xl translate-y-4">DISCOVER</div>
            <div className="flex-1 bg-found text-black brutal-border p-4 shadow-[4px_4px_0_0_#FFF] font-display font-black text-center text-xl">RETURN</div>
          </div>
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
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-sage brutal-border" />
            
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-display font-black uppercase text-charcoal tracking-tight leading-tight mb-2">Create Your Account</h2>
              <p className="text-base font-bold text-charcoal/60">Use your KPRIET student email to join.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-text">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="brutal-input"
                />
              </div>

              <div>
                <label className="label-text">College Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@kpriet.ac.in"
                  className="brutal-input"
                />
              </div>

              <div>
                <label className="label-text">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="brutal-input font-mono tracking-widest text-lg"
                />
              </div>

              <div>
                <label className="label-text">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="brutal-input font-mono tracking-widest text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brutal-btn-primary w-full h-14 mt-6 text-lg tracking-widest"
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
              </button>
            </form>

            <div className="mt-8 border-t-2 border-black/10 pt-6">
              <p className="text-[15px] font-bold text-charcoal text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-charcoal hover:bg-sage px-2 transition-colors border-b-2 border-black ml-1 uppercase">
                  Login instead →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
