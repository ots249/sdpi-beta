import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-5 py-10 animate-[fadeIn_0.5s]">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[var(--shadow)]">
        <h1 className="text-[var(--primary)] text-3xl font-bold mb-8 flex items-center gap-3 border-b-2 border-gray-100 pb-4">
          <i className="fas fa-shield-alt"></i> Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">1. Information Collection</h2>
            <p>DPI Student Portal (Unofficial) provides access to student records. We do not store any personal information searched by users on our servers. All searches are processed in real-time. For statistical purposes, we may track the total number of searches performed on the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">2. Use of Information</h2>
            <p>The information displayed on this portal is intended for academic and informational use only. The data is retrieved from official records of Dhaka Polytechnic Institute and common technical education databases.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect the platform. However, as this is a public search portal, users should be aware that the information displayed is already public record within the educational system.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">4. Third-Party Links</h2>
            <p>Our portal may contain links to official government or educational websites (like BTEB or Dhaka Polytechnic official site). We are not responsible for the privacy practices or content of these external sites.</p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-gray-800 mb-4">5. Disclaimer</h2>
             <p>This is an <strong>unofficial</strong> service. While we strive for accuracy, we cannot guarantee that all records are 100% error-free. Users are encouraged to verify important information with the institute's official administration.</p>
          </section>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm italic">Last Updated: October 2025</p>
            <Link to="/" className="btn-primary">
              <i className="fas fa-home"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
