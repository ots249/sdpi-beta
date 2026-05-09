import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-5 py-10 animate-[fadeIn_0.5s]">
      <div className="bg-[var(--gradient)] rounded-3xl p-12 text-center text-white mb-10 shadow-xl">
        <i className="fas fa-info-circle text-5xl mb-5"></i>
        <h1 className="text-4xl font-bold mb-4">About DPI Student Portal</h1>
        <p className="text-lg opacity-90">Your trusted source for student information at Dhaka Polytechnic Institute</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white rounded-3xl p-8 shadow-[var(--shadow)]">
          <h2 className="text-[var(--primary)] text-2xl font-bold mb-5 flex items-center gap-3 border-b-2 border-gray-100 pb-3">
            <i className="fas fa-university"></i> About Dhaka Polytechnic Institute
          </h2>
          <p className="leading-relaxed text-gray-600 mb-4">Dhaka Polytechnic Institute (DPI) is one of the largest and most prestigious technical educational institutions in Bangladesh. Established in 1955, DPI has been producing skilled engineers and technicians who contribute significantly to the nation's development.</p>
          <p className="leading-relaxed text-gray-600">The institute offers Diploma in Engineering programs across various departments including Computer Science, Electrical, Mechanical, Civil, Electronics, and more. With state-of-the-art laboratories and experienced faculty members, DPI maintains high standards of technical education.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl text-center shadow-[var(--shadow)] hover:-translate-y-1 transition-transform">
            <i className="fas fa-bullseye text-5xl text-[#17b890] mb-4"></i>
            <h3 className="text-[var(--primary)] text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To provide accurate, up-to-date student information and academic records through a user-friendly digital platform, ensuring transparency and accessibility for all students and stakeholders.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl text-center shadow-[var(--shadow)] hover:-translate-y-1 transition-transform">
            <i className="fas fa-eye text-5xl text-[#17b890] mb-4"></i>
            <h3 className="text-[var(--primary)] text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To become the premier digital hub for student information management in Bangladesh's technical education sector, empowering students with instant access to their academic data.</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-8 shadow-[var(--shadow)]">
          <h2 className="text-[var(--primary)] text-2xl font-bold mb-5 flex items-center gap-3 border-b-2 border-gray-100 pb-3">
            <i className="fas fa-globe"></i> About This Portal
          </h2>
          <p className="leading-relaxed text-gray-600 mb-4">The DPI Student Portal is a digital platform designed to help students, teachers, and parents easily find student information including board roll numbers, academic results, personal details, and other important records.</p>
          <p className="leading-relaxed text-gray-600">Built with modern web technologies (React), this portal provides a fast, secure, and user-friendly interface to search for student information by roll number or name. The data is regularly updated from official sources to ensure accuracy.</p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '1955', label: 'Established' },
            { num: '10+', label: 'Departments' },
            { num: '5000+', label: 'Students' },
            { num: '24/7', label: 'Accessible' }
          ].map((stat, i) => (
            <div key={i} className="bg-[var(--gradient)] p-5 text-center text-white rounded-2xl">
              <div className="text-2xl font-bold">{stat.num}</div>
              <div className="text-xs opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="btn-primary inline-flex">
            <i className="fas fa-home"></i> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default About;
