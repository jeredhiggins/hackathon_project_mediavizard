import React from 'react';

interface WizardIconProps {
  className?: string;
}

export const WizardIcon: React.FC<WizardIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
      >
        {/* MASSIVE HIGH-QUALITY LOGO - FILLS ENTIRE CONTAINER */}
        <defs>
          <linearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="brimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#d1d5db" />
          </radialGradient>
        </defs>
        
        {/* MASSIVE Hat brim - fills width */}
        <ellipse 
          cx="70" 
          cy="100" 
          rx="60" 
          ry="15" 
          fill="url(#brimGradient)"
          stroke="#1f2937"
          strokeWidth="2"
        />
        
        {/* MASSIVE Hat cone - much taller */}
        <path 
          d="M 10 100 L 70 5 L 130 100 Z" 
          fill="url(#hatGradient)"
          stroke="#1f2937"
          strokeWidth="2"
        />
        
        {/* MASSIVE Hat band */}
        <rect 
          x="10" 
          y="90" 
          width="120" 
          height="18" 
          fill="#6b7280"
          rx="4"
          stroke="#374151"
          strokeWidth="1.5"
        />
        
        {/* LARGE Hat buckle */}
        <rect 
          x="62" 
          y="93" 
          width="16" 
          height="12" 
          fill="#fbbf24"
          rx="2"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        
        {/* MASSIVE PRIVACY EYE SYMBOL - DOMINATES THE HAT */}
        <g transform="translate(70, 60)">
          {/* HUGE Eye background circle */}
          <circle 
            cx="0" 
            cy="0" 
            r="28" 
            fill="rgba(255, 255, 255, 0.95)"
            stroke="#d1d5db"
            strokeWidth="3"
          />
          
          {/* MASSIVE Eye outline */}
          <ellipse 
            cx="0" 
            cy="0" 
            rx="24" 
            ry="16" 
            fill="none"
            stroke="#374151"
            strokeWidth="4"
          />
          
          {/* LARGE Eye iris */}
          <circle 
            cx="0" 
            cy="0" 
            r="12" 
            fill="url(#eyeGradient)"
            stroke="#6b7280"
            strokeWidth="2"
          />
          
          {/* PROMINENT Inner pupil */}
          <circle 
            cx="0" 
            cy="0" 
            r="6" 
            fill="#374151"
          />
          
          {/* MASSIVE Privacy slash - VERY THICK AND PROMINENT */}
          <line 
            x1="-22" 
            y1="-12" 
            x2="22" 
            y2="12" 
            stroke="#dc2626"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* BRIGHT White highlight slash */}
          <line 
            x1="-22" 
            y1="-12" 
            x2="22" 
            y2="12" 
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
        
        {/* LARGE Enhanced magic sparkles */}
        <g fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
          <circle cx="20" cy="20" r="3.5" />
          <circle cx="120" cy="15" r="3" />
          <circle cx="125" cy="50" r="3.5" />
          <circle cx="15" cy="70" r="3" />
          <circle cx="25" cy="115" r="2.5" />
          <circle cx="115" cy="115" r="2.5" />
        </g>
        
        {/* LARGE Enhanced sparkle crosses */}
        <g stroke="#fbbf24" strokeWidth="3" strokeLinecap="round">
          <line x1="30" y1="15" x2="30" y2="25" />
          <line x1="25" y1="20" x2="35" y2="20" />
          
          <line x1="110" y1="30" x2="110" y2="40" />
          <line x1="105" y1="35" x2="115" y2="35" />
          
          <line x1="20" y1="85" x2="20" y2="95" />
          <line x1="15" y1="90" x2="25" y2="90" />
        </g>
        
        {/* LARGE Additional magical elements */}
        <g fill="#a855f7" opacity="0.8">
          <circle cx="45" cy="30" r="2" />
          <circle cx="95" cy="25" r="2" />
          <circle cx="100" cy="80" r="2" />
        </g>
        
        {/* LARGE Hat tip star */}
        <g transform="translate(70, 10)" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
          <path d="M 0,-6 L 2,0 L 6,0 L 3,3 L 4,8 L 0,5 L -4,8 L -3,3 L -6,0 L -2,0 Z" />
        </g>
      </svg>
    </div>
  );
};