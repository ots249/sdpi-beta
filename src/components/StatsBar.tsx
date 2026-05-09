import React from 'react';

interface StatsBarProps {
  totalStudents: number;
  searchesToday: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ totalStudents, searchesToday }) => {
  return (
    <div className="bg-white rounded-2xl p-2.5 flex justify-center gap-8 shadow-lg mb-8 transition-all hover:scale-[1.01]">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#4a6fa5]">{totalStudents.toLocaleString()}</div>
        <div className="text-[#666] text-xs">Total Students</div>
      </div>
      <div className="text-center border-l border-gray-100 pl-8">
        <div className="text-2xl font-bold text-[#4a6fa5]">{searchesToday.toLocaleString()}</div>
        <div className="text-[#666] text-xs">Searches Today</div>
      </div>
    </div>
  );
};

export default StatsBar;
