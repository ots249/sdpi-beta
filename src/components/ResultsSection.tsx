import React from 'react';
import { Student } from '../types';

interface ResultsSectionProps {
  results: Student[];
  onViewResult: (roll: string) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, onViewResult }) => {
  if (results.length === 0) return null;

  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
        <h2 className="text-[#4a6fa5] flex items-center gap-2.5 text-xl font-bold">
          <i className="fas fa-user-circle"></i> Student Information
        </h2>
        <div className="bg-[#f0f9ff] text-[#0369a1] px-3 py-1 rounded-full text-sm font-medium">
          <i className="fas fa-users mr-1.5"></i> {results.length} student{results.length > 1 ? 's' : ''} found
        </div>
      </div>

      <div className="space-y-6">
        {results.map((student, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(student).map(([key, value]) => {
                if (!value) return null;
                
                const isRoll = key === "Board Roll" || key === "Roll";
                
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-xl border-l-4 border-[var(--accent)]">
                    <span className="text-xs font-bold text-[#4a6fa5] uppercase tracking-wider flex items-center gap-2">
                       {key}
                    </span>
                    <div className="text-lg font-medium text-[#343a40] mt-1">
                      {isRoll ? (
                        <button 
                          onClick={() => onViewResult(value)}
                          className="bg-[#f1f5f9] border border-[#e2e8f0] px-4 py-2 rounded-xl text-[#4a6fa5] font-bold flex items-center gap-2 transition-all hover:bg-[var(--gradient)] hover:text-white hover:border-transparent"
                        >
                          <i className="fas fa-poll-h"></i> {value} <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase ml-1">View Result</span>
                        </button>
                      ) : value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
