import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchBTEBResult } from '../services/studentService';

const ResultDetail: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rollFromUrl = searchParams.get('roll');
  
  const [roll, setRoll] = useState(rollFromUrl || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rollFromUrl) {
      handleCheck(rollFromUrl);
    }
  }, [rollFromUrl]);

  const handleCheck = async (rollNum: string) => {
    if (!rollNum) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchParams({ roll: rollNum });

    try {
      const res = await fetchBTEBResult(rollNum);
      if (res.success && res.data && res.data.length > 0) {
        setResult(res.data[0]);
      } else {
        setError(res.error || "No results found for this roll number.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to BTEB Server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roll.trim()) {
      handleCheck(roll.trim());
    }
  };

  const handlePrint = () => window.print();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 animate-[fadeIn_0.5s]">
      <section className="bg-white rounded-3xl p-8 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-6 text-[#4a6fa5]">
          <i className="fas fa-poll text-2xl"></i>
          <h2 className="text-xl font-bold">Check Academic Results</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input 
            type="number" 
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="Enter Board Roll (e.g. 240363)" 
            className="input-modern"
          />
          <button type="submit" className="btn-primary justify-center md:w-auto w-full" disabled={loading}>
            <i className="fas fa-search"></i> {loading ? 'Checking...' : 'Check Result'}
          </button>
        </form>
      </section>

      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Fetching result from BTEB Server...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-red-50">
           <i className="fas fa-search text-5xl text-gray-200 mb-5"></i>
           <h3 className="text-xl font-bold text-gray-800 mb-3">Result Not Found</h3>
           <p className="text-gray-500 mb-6">{error}</p>
           <a 
             href={`https://btebresultszone.com/student-results?roll=${roll}&curriculumId=diploma_in_engineering`} 
             target="_blank" 
             rel="noreferrer"
             className="btn-primary inline-flex bg-[#4a6fa5]"
           >
             Try Direct Link <i className="fas fa-external-link-alt"></i>
           </a>
        </div>
      )}

      {result && !loading && (
        <section className="bg-white rounded-3xl p-6 shadow-xl animate-[popupScale_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
           <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fas fa-poll-h text-[#4a6fa5]"></i> BTEB Result
              </h3>
           </div>

           <div className="text-center mb-8 pb-8 border-b border-gray-50">
             <h1 className="text-3xl font-bold text-[#4a6fa5]"># {result.roll}</h1>
             <div className="text-xl font-medium text-gray-700 mt-2">
                {result.studentName}
             </div>
             <div className="flex justify-center gap-4 flex-wrap text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1.5"><i className="fas fa-university"></i> {result.institute?.name}</span>
             </div>
           </div>

           <div className="space-y-4">
              {result.semesters?.map((sem: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                   <div>
                     <span className="font-bold text-gray-700 block">{sem.semesterName}</span>
                     {sem.failedSubjects && sem.failedSubjects.length > 0 && (
                        <div className="text-xs text-red-500 font-medium mt-1">
                           Failed: {sem.failedSubjects.join(', ')}
                        </div>
                     )}
                   </div>
                   {sem.gpa ? (
                     <div className="bg-white border border-green-200 text-green-700 px-4 py-1.5 rounded-full font-bold shadow-sm">
                       GPA: {sem.gpa}
                     </div>
                   ) : sem.status === "failed" ? (
                      <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-1.5 rounded-full font-bold">
                        FAIL
                      </div>
                   ) : (
                      <div className="text-gray-400 font-bold">N/A</div>
                   )}
                </div>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-4 print:hidden">
              <button onClick={handlePrint} className="btn-primary">
                <i className="fas fa-print"></i> Print
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) navigator.share({ title: 'BTEB Result', url: window.location.href });
                  else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }
                }} 
                className="btn-primary bg-white text-[#4a6fa5] border-2 border-[#4a6fa5] shadow-none"
              >
                <i className="fas fa-share-alt"></i> Share
              </button>
           </div>
        </section>
      )}
    </main>
  );
};

export default ResultDetail;
