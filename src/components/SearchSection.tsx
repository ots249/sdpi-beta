import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  students: Student[];
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, students }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = students.filter(s => {
      const q = val.toLowerCase();
      return (
        (s["Board Roll"]?.toString().includes(q)) ||
        (s["Name"]?.toLowerCase().includes(q)) ||
        (s["Roll"]?.toString().includes(q))
      );
    }).slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSuggestionClick = (s: Student) => {
    const roll = s["Board Roll"] || s["Roll"];
    setQuery(roll);
    setShowSuggestions(false);
    onSearch(roll);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-lg mb-8 transform transition hover:-translate-y-1">
      <div className="flex items-center gap-2.5 mb-6 text-[#4a6fa5]">
        <i className="fas fa-search text-2xl text-[#17b890]"></i>
        <h2 className="text-2xl font-semibold">Find Student Information</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10" ref={containerRef}>
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={query}
              onChange={handleInputChange}
              className="input-modern"
              placeholder="Enter Board Roll or Student Name..."
              onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            />
            <i className="fas fa-user-graduate absolute left-5 top-1/2 -translate-y-1/2 text-[var(--primary)]"></i>
          </div>
          <button type="submit" className="btn-primary justify-center md:w-auto w-full">
            <i className="fas fa-search"></i> Find Student
          </button>
        </div>

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl mt-2 overflow-hidden animate-slide-down max-h-[300px] overflow-y-auto">
            {suggestions.map((s, i) => (
              <div 
                key={i} 
                className="p-4 border-b border-gray-50 flex items-center gap-4 cursor-pointer hover:bg-gray-50 hover:pl-6 transition-all"
                onClick={() => handleSuggestionClick(s)}
              >
                <i className="fas fa-user-graduate text-[#4a6fa5] text-lg"></i>
                <div>
                  <div className="font-semibold text-[#343a40]">{s["Name"]}</div>
                  <div className="text-sm text-gray-500">Roll: {s["Board Roll"] || s["Roll"]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </section>
  );
};

export default SearchSection;
