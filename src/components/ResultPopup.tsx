import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: any;
  loading: boolean;
  error: string | null;
}

const ResultPopup: React.FC<ResultPopupProps> = ({ isOpen, onClose, resultData, loading, error }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end md:items-center z-[10000] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-gray-100 z-10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fas fa-poll text-[#4a6fa5]"></i> BTEB Result
              </h3>
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Fetching result from BTEB Server...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                  <p className="font-semibold">{error}</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-gray-100 rounded-full font-medium"
                  >
                    Close
                  </button>
                </div>
              ) : resultData ? (
                <div className="animate-[fadeIn_0.5s]">
                  <div className="text-center mb-6 pb-6 border-b border-gray-50">
                    <h1 className="text-2xl font-bold text-[#4a6fa5]"># {resultData.roll}</h1>
                    <div className="text-lg font-medium text-gray-700 mt-2">
                      <i className="far fa-user mr-2"></i> {resultData.studentName}
                    </div>
                    <div className="flex justify-center gap-3 flex-wrap text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1.5"><i className="fas fa-book-open"></i> {resultData.curriculum}</span>
                      <span className="flex items-center gap-1.5"><i className="far fa-calendar-check"></i> Reg {resultData.regulation}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-3 flex items-center justify-center gap-2">
                      <i className="fas fa-university"></i> {resultData.institute?.name}
                    </div>
                    {resultData.summary && resultData.summary.failedSubjectsCount > 0 && (
                      <div className="mt-4 bg-red-50 text-red-600 px-5 py-2.5 rounded-full inline-block font-semibold text-sm border border-red-100 shadow-sm">
                        Subjects yet to pass: {resultData.summary.failedSubjectsCount}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {resultData.semesters?.map((sem: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                           <span className="font-bold text-gray-700">{sem.semesterName}</span>
                           {sem.gpa ? (
                             <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">GPA: {sem.gpa}</span>
                           ) : sem.status === "failed" ? (
                             <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-100">FAIL</span>
                           ) : (
                             <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">N/A</span>
                           )}
                        </div>
                        {sem.failedSubjects && sem.failedSubjects.length > 0 && (
                          <div className="text-xs text-red-500 font-medium">
                             Failed: {sem.failedSubjects.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResultPopup;
