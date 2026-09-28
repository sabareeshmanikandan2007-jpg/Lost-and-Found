import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Splash = () => {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      navigate(isAuthenticated ? '/home' : '/login', { replace: true });
      return;
    }

    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 1800);
    const tFinal = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/login', { replace: true });
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tFinal); };
  }, [navigate, isAuthenticated]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary overflow-hidden selection:bg-charcoal selection:text-white cursor-default">
      
      {/* Brutalist Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 10px 10px, black 3px, transparent 3px)',
          backgroundSize: '40px 40px',
        }} 
      />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* LOGO */}
        <div 
          className={`transition-all duration-700 ease-out transform
            ${stage === 0 ? 'opacity-0 translate-y-8' : ''}
            ${stage === 1 ? 'opacity-100 translate-y-0' : ''}
            ${stage >= 2 ? 'scale-110' : ''}
          `}
        >
          <img src="/assets/logo-brutal.png" alt="FINDY Logo" className="w-[300px] h-auto md:w-[450px]" />
        </div>

        {/* Tagline */}
        <div 
          className={`mt-12 overflow-hidden transition-all duration-500 ease-in-out
            ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          <div className="bg-white brutal-border brutal-shadow px-6 py-4 border-black inline-block text-center mx-auto transform -rotate-2">
            <p className="text-2xl md:text-3xl font-display font-black tracking-tight text-charcoal uppercase leading-tight">
              Find what matters.<br/>
              <span className="text-white bg-charcoal px-2 leading-tight py-1 inline-block mt-1">Return what belongs.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Splash;
