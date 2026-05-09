import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header text-center py-5 relative overflow-hidden">
      <style>{`
        .header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gradient);
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          z-index: -1;
        }
      `}</style>
      <Link to="/" className="logo flex items-center justify-center gap-4 mb-2.5 hover:opacity-90 transition-opacity">
        <i className="fas fa-graduation-cap text-4xl text-white animate-[pulse_2s_infinite]"></i>
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-md">DPI Student Portal</h1>
          <p className="text-white/90 text-lg">Student Information Search - 2025</p>
        </div>
      </Link>
    </header>
  );
};

export default Header;
