import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import SearchSection from '../components/SearchSection';
import ResultsSection from '../components/ResultsSection';
import ResultPopup from '../components/ResultPopup';
import { Student } from '../types';
import { fetchStudents, fetchBTEBResult } from '../services/studentService';

const Home: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, searchesToday: 0 });
  
  // BTEB Result State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [btebResult, setBtebResult] = useState<any>(null);
  const [btebLoading, setBtebLoading] = useState(false);
  const [btebError, setBtebError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const data = await fetchStudents();
      setStudents(data);
      setLoading(false);
      
      const localSearches = parseInt(localStorage.getItem('searchesToday') || '0');
      const lastDate = localStorage.getItem('lastSearchDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        localStorage.setItem('searchesToday', '0');
        localStorage.setItem('lastSearchDate', today);
        setStats({ totalStudents: data.length, searchesToday: 0 });
      } else {
        setStats({ totalStudents: data.length, searchesToday: localSearches });
      }
    };
    init();
  }, []);

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    const filtered = students.filter(s => 
      (s["Board Roll"]?.toString().includes(q)) ||
      (s["Name"]?.toLowerCase().includes(q)) ||
      (s["Roll"]?.toString().includes(q))
    );
    setSearchResults(filtered);
    
    // Update local stats
    const newSearches = stats.searchesToday + 1;
    localStorage.setItem('searchesToday', newSearches.toString());
    setStats(prev => ({ ...prev, searchesToday: newSearches }));
  };

  const handleViewBTEBResult = async (roll: string) => {
    setBtebLoading(true);
    setBtebError(null);
    setBtebResult(null);
    setIsPopupOpen(true);
    
    try {
      const data = await fetchBTEBResult(roll);
      setBtebResult(data);
    } catch (err: any) {
      setBtebError(err.message || "Failed to fetch result from BTEB server.");
    } finally {
      setBtebLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
      <StatsBar 
        totalStudents={stats.totalStudents} 
        searchesToday={stats.searchesToday} 
      />

      <SearchSection 
        onSearch={handleSearch} 
        students={students} 
      />

      {loading ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium tracking-wide">Loading portal data...</p>
        </div>
      ) : (
        <ResultsSection 
          results={searchResults} 
          onViewResult={handleViewBTEBResult}
        />
      )}

      <ResultPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        resultData={btebResult}
        loading={btebLoading}
        error={btebError}
      />
    </main>
  );
};

export default Home;
