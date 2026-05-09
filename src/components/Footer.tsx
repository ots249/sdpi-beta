import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-20 py-8 bg-[var(--gradient)] text-white text-center">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <Link to="/about" className="flex items-center gap-2 text-white/90 hover:text-white transition-all hover:-translate-y-0.5">
            <i className="fas fa-info-circle"></i> About
          </Link>
          <Link to="/privacy" className="flex items-center gap-2 text-white/90 hover:text-white transition-all hover:-translate-y-0.5">
            <i className="fas fa-shield-alt"></i> Privacy
          </Link>
        </div>
        <div className="text-sm text-white/70">
          <p>DPI Student Portal (Unofficial) &copy; {new Date().getFullYear()}</p>
          <p className="mt-1 font-semibold">Developed with <i className="fas fa-heart text-red-400"></i> by Oahid Towsif Shamol</p>
          <p className="text-[10px] mt-2 bg-black/10 inline-block px-2 py-1 rounded">Last Information Updated: 25/09/2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
