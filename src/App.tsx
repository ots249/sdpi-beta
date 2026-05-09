import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import ResultDetail from './pages/ResultDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="animated-bg">
          <div className="floating-shapes">
            <div className="w-20 h-20 top-[10%] left-[10%]"></div>
            <div className="w-32 h-32 top-[60%] right-[15%]"></div>
            <div className="w-16 h-16 bottom-[20%] left-[20%]"></div>
          </div>
        </div>

        <div className="disclaimer-banner bg-amber-50 border-b border-amber-100 py-2 px-4 text-center text-[10px] md:text-xs text-amber-800 font-medium z-50">
          <i className="fas fa-info-circle mr-2"></i>
          <span>This is an <strong>unofficial</strong> service portal. Not affiliated with DPI or BTEB.</span>
        </div>

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/result" element={<ResultDetail />} />
          {/* Fallback for old .html paths */}
          <Route path="/index.html" element={<Home />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/privacy.html" element={<Privacy />} />
          <Route path="/result.html" element={<ResultDetail />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
