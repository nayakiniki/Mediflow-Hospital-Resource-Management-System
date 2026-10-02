import React from 'react';
import { MediFlowView } from '../types';

interface MediFlowHeroProps {
  onNavigate: (view: MediFlowView) => void;
  onExploreDashboard: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  user?: {
    displayName?: string | null;
    email?: string | null;
    role?: string;
    department?: string;
  } | null;
  onSignOut?: () => void;
}

export const MediFlowHero: React.FC<MediFlowHeroProps> = ({
  onNavigate,
  onExploreDashboard,
  onOpenAuth,
  user,
  onSignOut
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-mediflow-helps');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-900 select-none flex flex-col justify-between">
      {/* 
        ========================================================================
        EXACT METALLIC SAGE DIAGONAL FOLDS BACKGROUND
        Reproduces the exact satin/metallic cylindrical folds in image.png:
        - Top-left dark charcoal into sharp silver specular fold ridge
        - Dark shadow valley crease
        - Broad bright silvery-white specular beam cutting behind MEDIFLOW
        - Dark diagonal shadow trough beneath the buttons
        - Lower-right sage green zone with distressed chalk/salt fleck grunge
        ========================================================================
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(132deg,
              #1B241E 0%,
              #232F27 7%,
              #3E4E42 12%,
              #8FA395 17%,
              #D6E4DB 21.5%,
              #EFF6F1 24%,
              #A5B9AD 27%,
              #344238 32%,
              #19221C 38%,
              #222D25 44%,
              #4C5E51 49%,
              #9AB0A2 54%,
              #DCE8DF 59%,
              #F2F7F4 63.5%,
              #CAD8CE 68%,
              #4E6053 74%,
              #1E2721 80%,
              #151C17 85%,
              #2F3C33 91%,
              #435247 100%
            )
          `
        }}
      />

      {/* Layer 2: Metallic Cylindrical Specular Sheen Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-80"
        style={{
          background: `
            linear-gradient(132deg,
              rgba(0, 0, 0, 0.5) 0%,
              rgba(255, 255, 255, 0.42) 23.5%,
              rgba(0, 0, 0, 0.65) 35%,
              rgba(255, 255, 255, 0.55) 63%,
              rgba(0, 0, 0, 0.7) 81%,
              rgba(255, 255, 255, 0.15) 100%
            )
          `
        }}
      />

      {/* Layer 3: Central Radial Specular Glow Behind MEDIFLOW */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 95% 75% at 65% 40%, rgba(246, 252, 248, 0.45) 0%, rgba(200, 218, 206, 0.22) 38%, transparent 72%)
          `
        }}
      />

      {/* Layer 4: Distressed Chalk / Salt Dust Grunge Texture in Lower-Right Quadrant */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 88% 85%, rgba(255, 255, 255, 0.12) 0%, transparent 60%),
            radial-gradient(1.2px 1.2px at 82% 76%, rgba(255, 255, 255, 0.45) 1px, transparent 0),
            radial-gradient(1.5px 1.5px at 89% 82%, rgba(255, 255, 255, 0.5) 1px, transparent 0),
            radial-gradient(1.8px 1.8px at 94% 78%, rgba(255, 255, 255, 0.4) 1px, transparent 0),
            radial-gradient(1.4px 1.4px at 78% 88%, rgba(255, 255, 255, 0.35) 1px, transparent 0),
            radial-gradient(2px 2px at 85% 92%, rgba(255, 255, 255, 0.55) 1px, transparent 0),
            radial-gradient(1.6px 1.6px at 91% 90%, rgba(255, 255, 255, 0.45) 1px, transparent 0),
            radial-gradient(1.2px 1.2px at 75% 82%, rgba(255, 255, 255, 0.3) 1px, transparent 0),
            radial-gradient(1.5px 1.5px at 96% 88%, rgba(255, 255, 255, 0.4) 1px, transparent 0),
            radial-gradient(1.4px 1.4px at 88% 70%, rgba(255, 255, 255, 0.35) 1px, transparent 0),
            radial-gradient(2.2px 2.2px at 80% 95%, rgba(255, 255, 255, 0.5) 1px, transparent 0),
            radial-gradient(1.3px 1.3px at 70% 89%, rgba(255, 255, 255, 0.3) 1px, transparent 0),
            radial-gradient(1.7px 1.7px at 93% 96%, rgba(255, 255, 255, 0.4) 1px, transparent 0)
          `,
          backgroundSize: '100% 100%, 140px 140px, 120px 120px, 160px 160px, 130px 130px, 110px 110px, 150px 150px, 170px 170px, 135px 135px, 145px 145px, 125px 125px, 155px 155px, 165px 165px'
        }}
      />

      {/* Layer 5: Fine Organic Paper Stipple Grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '2.5px 2.5px'
        }}
      />

      {/* 
        ========================================================================
        TOP FLOATING BRAND & AUTH BAR
        ========================================================================
      */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={onExploreDashboard}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#7D0C0C]/10 border border-[#7D0C0C]/30 flex items-center justify-center text-[#7D0C0C] group-hover:scale-105 transition-transform shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7D0C0C] animate-pulse" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wide text-[#7D0C0C] block leading-none">
              MEDIFLOW
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-700">
              Operations Center
            </span>
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-xs text-xs font-semibold text-slate-800">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="px-3 py-1 rounded-full hover:bg-white/50 hover:text-[#7D0C0C] transition-colors cursor-pointer"
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('beds')} 
            className="px-3 py-1 rounded-full hover:bg-white/50 hover:text-[#7D0C0C] transition-colors cursor-pointer"
          >
            3D Bed Spatial
          </button>
          <button 
            onClick={() => onNavigate('patients')} 
            className="px-3 py-1 rounded-full hover:bg-white/50 hover:text-[#7D0C0C] transition-colors cursor-pointer"
          >
            Critical Queue
          </button>
          <button 
            onClick={() => onNavigate('staff')} 
            className="px-3 py-1 rounded-full hover:bg-white/50 hover:text-[#7D0C0C] transition-colors cursor-pointer"
          >
            Staff on Duty
          </button>
          <button 
            onClick={() => onNavigate('insights')} 
            className="px-3 py-1 rounded-full hover:bg-white/50 hover:text-[#7D0C0C] transition-colors cursor-pointer"
          >
            Surge Scenarios
          </button>
        </nav>

        {/* Right Auth Portal Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2 bg-white/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[130px]">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-emerald-800 font-mono block">
                  {user.role ? String(user.role).replace('_', ' ') : 'Clinician'}
                </span>
              </div>
              <button
                onClick={onExploreDashboard}
                className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#7D0C0C] hover:bg-[#921414] transition-all shadow-xs cursor-pointer"
              >
                Command Center →
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#550E0E] bg-white/50 hover:bg-white/80 border border-white/60 transition-all shadow-xs cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#550E0E] transition-all transform hover:scale-102 cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, #EAA6A0 0%, #E3958F 48%, #D4847E 100%)',
                  boxShadow: '0 2px 8px rgba(70, 15, 15, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Register Clinician
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 
        ========================================================================
        EXACT 3D WIREFRAME RIBBON WAVES WITH 180° HAIRPIN FOLDS
        Matches exact curves and fold geometry from image.png:
        1. Top-Right 3D Mesh Ribbon:
           Sweeps left from upper right, pinches into a tight 180° hairpin twist/fold
           right above the "W" in MEDIFLOW, then loops back out to the top right.
        2. Bottom-Left 3D Mesh Ribbon:
           Arches up from bottom-left corner, makes an elegant 180° hairpin fold
           at the crest, and swoops out with secondary flared loop.
        3. Bottom-Right Distressed Chalk Texture:
           High-frequency chalk dust and speckle grain overlay.
        ========================================================================
      */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle glow for ribbon edges */}
          <filter id="ribbon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Chalk dust mask fading toward center */}
          <radialGradient id="chalk-mask-grad" cx="88%" cy="85%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <mask id="chalk-mask">
            <rect x="0" y="0" width="1440" height="1024" fill="url(#chalk-mask-grad)" />
          </mask>
        </defs>

        {/* ====================================================================
            RIBBON 1: TOP-RIGHT 3D WIREFRAME RIBBON WITH EXACT 180° HAIRPIN FOLD
            ==================================================================== */}
        <g stroke="rgba(255, 255, 255, 0.72)" filter="url(#ribbon-glow)">
          {Array.from({ length: 44 }).map((_, i) => {
            const u = (i - 21.5) / 21.5; // normalized offset across ribbon width [-1, 1]
            // Section A: enters from top-right edge (x ~ 1450, y ~ 190)
            const xStart = 1450 + u * 35;
            const yStart = 190 + u * 45;
            const cp1x = 1270 + u * 40;
            const cp1y = 240 + u * 40;
            const cp2x = 1150 + u * 25;
            const cp2y = 235 + u * 22;

            // Hairpin fold waist right above the "W": lines converge and invert orientation (-u)
            const xFold = 1045 - u * 18;
            const yFold = 210 - u * 28;

            // Section B: curls upward and loops back to top right
            const cp3x = 1120 - u * 32;
            const cp3y = 135 - u * 36;
            const cp4x = 1250 - u * 45;
            const cp4y = 80 - u * 42;
            const xEnd = 1440 - u * 55;
            const yEnd = 15 - u * 45;

            const isAccent = i % 5 === 0;
            const isCrease = Math.abs(u) < 0.25;

            return (
              <path
                key={`tr-fold-${i}`}
                d={`M ${xStart} ${yStart} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xFold} ${yFold} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${xEnd} ${yEnd}`}
                stroke={isCrease ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.65)"}
                strokeWidth={isAccent ? "1.1" : "0.75"}
                strokeOpacity={0.4 + (1 - Math.abs(u) * 0.4) * 0.55}
              />
            );
          })}
        </g>

        {/* Secondary fine highlight strands along the fold ridge */}
        <g stroke="rgba(255, 255, 255, 0.85)" strokeWidth="0.6">
          {Array.from({ length: 8 }).map((_, k) => {
            const u = (k - 3.5) / 3.5 * 0.35;
            return (
              <path
                key={`tr-ridge-${k}`}
                d={`M ${1340 + u * 20} ${230 + u * 25} C ${1180 + u * 18} ${240 + u * 18}, ${1110 - u * 12} ${185 - u * 20}, ${1200 - u * 25} ${110 - u * 25}`}
                strokeOpacity={0.7}
              />
            );
          })}
        </g>

        {/* ====================================================================
            RIBBON 2: BOTTOM-LEFT 3D WIREFRAME RIBBON WITH EXACT HAIRPIN FOLD
            ==================================================================== */}
        <g stroke="rgba(255, 255, 255, 0.72)" filter="url(#ribbon-glow)">
          {Array.from({ length: 40 }).map((_, j) => {
            const v = (j - 19.5) / 19.5; // normalized offset across ribbon width [-1, 1]
            // Rises from bottom left corner
            const xStart = 40 + v * 55;
            const yStart = 1040 + v * 30;
            const cp1x = 115 + v * 50;
            const cp1y = 870 + v * 35;
            const cp2x = 165 + v * 38;
            const cp2y = 740 + v * 24;

            // Hairpin fold crest: lines invert orientation (-v)
            const xFold = 142 - v * 20;
            const yFold = 615 - v * 28;

            // Loops out down-left
            const cp3x = 95 - v * 40;
            const cp3y = 560 - v * 36;
            const cp4x = 15 - v * 55;
            const cp4y = 540 - v * 42;
            const xEnd = -65 - v * 62;
            const yEnd = 555 - v * 42;

            const isAccent = j % 5 === 0;

            return (
              <path
                key={`bl-fold-${j}`}
                d={`M ${xStart} ${yStart} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xFold} ${yFold} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${xEnd} ${yEnd}`}
                stroke="rgba(255, 255, 255, 0.68)"
                strokeWidth={isAccent ? "1.1" : "0.75"}
                strokeOpacity={0.42 + (1 - Math.abs(v) * 0.35) * 0.52}
              />
            );
          })}
        </g>

        {/* Secondary lower flared fan wave in bottom-left */}
        <g stroke="rgba(255, 255, 255, 0.48)" strokeWidth="0.7">
          {Array.from({ length: 24 }).map((_, k) => {
            const w = (k - 11.5) / 11.5;
            const xStart = -40 + w * 25;
            const yStart = 710 + w * 35;
            const cp1x = 75 + w * 35;
            const cp1y = 780 + w * 25;
            const cp2x = 115 + w * 45;
            const cp2y = 905 + w * 22;
            const xEnd = 30 + w * 50;
            const yEnd = 1025 + w * 18;

            return (
              <path
                key={`bl-fan-${k}`}
                d={`M ${xStart} ${yStart} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xEnd} ${yEnd}`}
                strokeOpacity={0.32 + (1 - Math.abs(w)) * 0.38}
              />
            );
          })}
        </g>

        {/* ====================================================================
            BOTTOM-RIGHT DISTRESSED CHALK FLECK & DUST STIPPLES
            Matches the chalk/salt speckles in image.png lower-right quadrant
            ==================================================================== */}
        <g mask="url(#chalk-mask)">
          {/* Subtle distressed scratch streaks */}
          <path d="M 880 720 L 910 705 M 950 740 L 980 732 M 1040 680 L 1075 668 M 1120 720 L 1155 710 M 1210 685 L 1245 675" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
          <path d="M 820 830 L 860 818 M 890 860 L 935 848 M 980 820 L 1025 808 M 1060 880 L 1110 865 M 1160 840 L 1215 825" stroke="#FFFFFF" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />
          <path d="M 850 910 L 895 898 M 940 940 L 990 926 M 1020 905 L 1070 892 M 1110 960 L 1165 944 M 1220 915 L 1270 900" stroke="#FFFFFF" strokeWidth="1.3" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M 1280 780 L 1320 768 M 1330 840 L 1375 825 M 1270 870 L 1320 855 M 1340 920 L 1390 905 M 1380 760 L 1420 748" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />

          {/* Clusters of speckled chalk dust flecks */}
          {[
            [830, 760, 1.6], [870, 710, 2.2], [910, 780, 1.8], [960, 730, 2.4], [1010, 690, 1.5],
            [880, 840, 2.5], [920, 880, 2.0], [970, 830, 2.8], [1020, 870, 1.9], [1070, 820, 2.6],
            [1120, 860, 2.1], [1160, 810, 2.7], [1210, 850, 1.8], [1260, 800, 2.3], [1310, 840, 2.0],
            [890, 930, 2.2], [940, 960, 1.7], [990, 920, 2.6], [1040, 950, 2.3], [1090, 910, 2.9],
            [1140, 940, 2.1], [1190, 900, 2.5], [1240, 930, 1.8], [1290, 890, 2.4], [1340, 920, 2.2],
            [1380, 870, 1.9], [1410, 910, 2.3], [1360, 970, 2.6], [1420, 960, 2.0], [1060, 760, 2.2],
            [1150, 740, 1.9], [1230, 720, 2.5], [1280, 750, 2.1], [1340, 710, 2.3], [1390, 730, 1.8]
          ].map(([cx, cy, r], idx) => (
            <circle key={`dust-${idx}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" fillOpacity={0.45 + (idx % 3) * 0.15} />
          ))}
        </g>
      </svg>

      {/* 
        ========================================================================
        HERO SECTION (Top Half)
        Matches exact red serif MEDIFLOW, subtitle & salmon pill buttons from image.png
        ========================================================================
      */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-16 sm:pt-24 lg:pt-32 text-center flex flex-col items-center">
        {/* Main Title: MEDIFLOW in Red Classical Serif matching image.png */}
        <h1 
          className="text-6xl sm:text-8xl lg:text-[118px] leading-none tracking-normal font-normal select-none"
          style={{ 
            fontFamily: "'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif",
            color: '#7D0A0A',
            letterSpacing: '0.025em',
            textShadow: '0 4px 10px rgba(0, 0, 0, 0.38), 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        >
          MEDIFLOW
        </h1>

        {/* Subtitle: Hospital command center matching image.png */}
        <p 
          className="mt-4 sm:mt-5 text-lg sm:text-2xl font-semibold tracking-normal"
          style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#7D0A0A',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.22)'
          }}
        >
          Hospital command center
        </p>

        {/* CTA Buttons: Pill shape in soft coral/salmon gradient matching image.png */}
        <div className="mt-8 sm:mt-10 flex flex-row items-center justify-center gap-5 sm:gap-7 flex-wrap">
          {/* Button 1: Explore Dashboard → */}
          <button
            onClick={onExploreDashboard}
            className="px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-103 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(180deg, #E69D97 0%, #E08E88 45%, #CB7973 100%)',
              color: '#520C0C',
              boxShadow: '0 12px 28px -4px rgba(45, 12, 12, 0.45), 0 4px 10px rgba(0, 0, 0, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.45)'
            }}
          >
            <span>Explore Dashboard</span>
            <span className="text-base leading-none font-bold">→</span>
          </button>

          {/* Button 2: See How It Works */}
          <button
            onClick={scrollToHowItWorks}
            className="px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-103 active:scale-98 flex items-center justify-center cursor-pointer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(180deg, #E69D97 0%, #E08E88 45%, #CB7973 100%)',
              color: '#520C0C',
              boxShadow: '0 12px 28px -4px rgba(45, 12, 12, 0.45), 0 4px 10px rgba(0, 0, 0, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.45)'
            }}
          >
            <span>See How It Works</span>
          </button>
        </div>

        {/* Clinician & Staff Access Bar */}
        <div className="mt-8 flex items-center justify-center gap-3.5 bg-white/35 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/45 text-xs text-slate-800 shadow-xs flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#7D0C0C] font-bold">
            Hospital Staff Portal:
          </span>
          <button 
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="font-semibold underline decoration-[#7D0C0C]/50 hover:text-[#7D0C0C] cursor-pointer"
          >
            Clinician Sign In
          </button>
          <span className="text-slate-400">·</span>
          <button 
            onClick={() => onOpenAuth && onOpenAuth('register')}
            className="font-semibold underline decoration-[#7D0C0C]/50 hover:text-[#7D0C0C] cursor-pointer"
          >
            Register Clinician Account
          </button>
          <span className="text-slate-400">·</span>
          <button 
            onClick={() => onNavigate('beds')}
            className="text-[11px] font-mono text-[#7D0C0C] font-semibold hover:underline"
          >
            3D Bed Spatial Map →
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        "HOW MEDIFLOW HELPS" SECTION (Bottom Half)
        Matches exact red serif header, 4 line icons & dark pewter pill buttons
        ========================================================================
      */}
      <div 
        id="how-mediflow-helps"
        className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center flex flex-col items-center"
      >
        {/* Section Heading: How MediFlow Helps */}
        <h2 
          className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight font-normal select-none"
          style={{ 
            color: '#7D0C0C',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          How MediFlow Helps
        </h2>

        {/* 4 Feature Items in a horizontal row */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 lg:gap-10 items-end justify-center">
          
          {/* ===================================================================
              Item 1: ECG Bedside Monitor Icon + View Monitoring →
              =================================================================== */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('dashboard')}>
            {/* Monitor Line Icon matching screenshot */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20"
                viewBox="0 0 72 72" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Monitor Screen Frame */}
                <rect 
                  x="8" 
                  y="10" 
                  width="56" 
                  height="38" 
                  rx="6" 
                  stroke="#16241C" 
                  strokeWidth="3.2" 
                />
                {/* Stand Neck */}
                <rect 
                  x="33" 
                  y="48" 
                  width="6" 
                  height="10" 
                  fill="#16241C" 
                />
                {/* Stand Base */}
                <rect 
                  x="20" 
                  y="58" 
                  width="32" 
                  height="3.6" 
                  rx="1.8" 
                  fill="#16241C" 
                />
                {/* ECG Heartbeat Line */}
                <path 
                  d="M 12 29 L 24 29 L 28 18 L 34 40 L 40 21 L 44 32 L 48 29 L 60 29" 
                  stroke="#16241C" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>

            {/* Dark Pewter Pill Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('dashboard');
              }}
              className="mt-4 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-medium text-white transition-all transform group-hover:scale-103 active:scale-98 shadow-md"
              style={{
                background: 'linear-gradient(180deg, #536259 0%, #3B4640 100%)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <span>View Monitoring →</span>
            </button>
          </div>

          {/* ===================================================================
              Item 2: Medical Clipboard with 3 Checkmarks + View Patient Queue →
              =================================================================== */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('patients')}>
            {/* Clipboard Line Icon matching screenshot */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20"
                viewBox="0 0 72 72" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Clipboard Body */}
                <rect 
                  x="14" 
                  y="12" 
                  width="44" 
                  height="52" 
                  rx="6" 
                  stroke="#16241C" 
                  strokeWidth="3.2" 
                />
                {/* Top Clip */}
                <path 
                  d="M 27 12 V 8 C 27 6.5 28.5 5 30 5 H 42 C 43.5 5 45 6.5 45 8 V 12 Z" 
                  fill="#16241C" 
                />
                <circle cx="36" cy="9" r="1.8" fill="#B2C2B6" />

                {/* Checklist Item 1 */}
                <path 
                  d="M 20 25 L 24 29 L 30 22" 
                  stroke="#16241C" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <line x1="34" y1="26" x2="50" y2="26" stroke="#16241C" strokeWidth="2.6" strokeLinecap="round" />

                {/* Checklist Item 2 */}
                <path 
                  d="M 20 37 L 24 41 L 30 34" 
                  stroke="#16241C" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <line x1="34" y1="38" x2="50" y2="38" stroke="#16241C" strokeWidth="2.6" strokeLinecap="round" />

                {/* Checklist Item 3 */}
                <path 
                  d="M 20 49 L 24 53 L 30 46" 
                  stroke="#16241C" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <line x1="34" y1="50" x2="50" y2="50" stroke="#16241C" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Dark Pewter Pill Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('patients');
              }}
              className="mt-4 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-medium text-white transition-all transform group-hover:scale-103 active:scale-98 shadow-md"
              style={{
                background: 'linear-gradient(180deg, #536259 0%, #3B4640 100%)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <span>View Patient Queue →</span>
            </button>
          </div>

          {/* ===================================================================
              Item 3: Ascending Bar Chart with Trend Arrow + Explore Forecasts →
              =================================================================== */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('insights')}>
            {/* Bar Chart Line Icon matching screenshot */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20" 
                viewBox="0 0 72 72" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal Baseline */}
                <line x1="10" y1="62" x2="62" y2="62" stroke="#16241C" strokeWidth="2.8" strokeLinecap="round" />

                {/* Bar 1 (Shortest) */}
                <rect x="18" y="44" width="9" height="18" stroke="#16241C" strokeWidth="2.4" />

                {/* Bar 2 (Medium) */}
                <rect x="31" y="32" width="9" height="30" stroke="#16241C" strokeWidth="2.4" />

                {/* Bar 3 (Tallest) */}
                <rect x="44" y="18" width="9" height="44" stroke="#16241C" strokeWidth="2.4" />

                {/* Ascending Trend Line with Arrow ↗ */}
                <path 
                  d="M 16 48 L 32 30 L 46 22 L 58 10" 
                  stroke="#16241C" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                />
                {/* Arrow Head */}
                <path 
                  d="M 48 10 H 58 V 20" 
                  stroke="#16241C" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>

            {/* Dark Pewter Pill Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('insights');
              }}
              className="mt-4 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-medium text-white transition-all transform group-hover:scale-103 active:scale-98 shadow-md"
              style={{
                background: 'linear-gradient(180deg, #536259 0%, #3B4640 100%)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <span>Explore Forecasts →</span>
            </button>
          </div>

          {/* ===================================================================
              Item 4: Operations Screen with Gear & Nodes + View Recommendations →
              =================================================================== */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('dashboard')}>
            {/* Screen with Gear & Flow Nodes matching screenshot */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <svg 
                className="w-16 h-16 sm:w-20 sm:h-20" 
                viewBox="0 0 72 72" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Top Hanging Rod/Plate */}
                <rect x="8" y="10" width="56" height="5" rx="2" stroke="#16241C" strokeWidth="3" fill="#16241C" />
                
                {/* Hanging Board / Screen */}
                <rect x="12" y="15" width="48" height="42" rx="3" stroke="#16241C" strokeWidth="3" />

                {/* Central Gear ⚙ */}
                <circle cx="36" cy="31" r="5" stroke="#16241C" strokeWidth="2.8" />
                {/* Gear Cogs */}
                <line x1="36" y1="23" x2="36" y2="26" stroke="#16241C" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="36" y1="36" x2="36" y2="39" stroke="#16241C" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="28" y1="31" x2="31" y2="31" stroke="#16241C" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="41" y1="31" x2="44" y2="31" stroke="#16241C" strokeWidth="2.8" strokeLinecap="round" />

                {/* Branched Connection Lines */}
                <path d="M 36 39 V 47" stroke="#16241C" strokeWidth="2.2" />
                <path d="M 24 47 H 48" stroke="#16241C" strokeWidth="2.2" />
                <path d="M 24 47 V 51" stroke="#16241C" strokeWidth="2.2" />
                <path d="M 48 47 V 51" stroke="#16241C" strokeWidth="2.2" />
                <path d="M 36 47 V 51" stroke="#16241C" strokeWidth="2.2" />

                {/* 3 Node Indicators: square / circle / diamond */}
                <rect x="22" y="50" width="4" height="4" fill="#16241C" />
                <circle cx="36" cy="52" r="2.2" fill="#16241C" />
                <rect x="46" y="50" width="4" height="4" transform="rotate(45 48 52)" fill="#16241C" />
              </svg>
            </div>

            {/* Dark Pewter Pill Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('dashboard');
              }}
              className="mt-4 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-medium text-white transition-all transform group-hover:scale-103 active:scale-98 shadow-md"
              style={{
                background: 'linear-gradient(180deg, #536259 0%, #3B4640 100%)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <span>View Recommendations →</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
