import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ConfirmationPage = ({ setCurrentPage }) => {
  const { getRegistrationById } = useApp();
  
  // Initialize state directly from sessionStorage
  const [reg] = useState(() => {
    try {
      const stored = sessionStorage.getItem('lastRegistration');
      if (stored) {
        const data = JSON.parse(stored);
        const fresh = getRegistrationById(data.id);
        return fresh || data;
      }
    } catch (e) {
      console.error('Error loading registration:', e);
    }
    return null;
  });

  const handleApply = () => {
    window.open('https://university.edu/apply', '_blank');
    if (reg) {
      const updated = { ...reg, applyClicked: true, applyClickedAt: new Date().toISOString() };
      sessionStorage.setItem('lastRegistration', JSON.stringify(updated));
      // We don't need to update state here since we're leaving the page anyway
    }
  };

  if (!reg) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-400"></i>
          <p className="mt-4 text-gray-500">Loading your registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">You're Registered!</h2>
          <p className="text-gray-500 mt-2">
            Thank you, <strong>{reg.fullName}</strong>! Your interest has been recorded.
          </p>
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 text-left space-y-1">
            <div><span className="font-medium">Programme:</span> {reg.programme}</div>
            <div><span className="font-medium">Referred by:</span> {reg.referrerSlug === 'malcolm' ? 'Malcolm Mwakitwange' : reg.referrerSlug}</div>
            <div><span className="font-medium">Registration ID:</span> <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">{reg.id}</code></div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Next Steps</h3>
          <p className="text-sm text-gray-500 text-center mt-1">Complete your application on the official university portal.</p>
          <div className="mt-4 space-y-3">
            <button 
              onClick={handleApply} 
              className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-external-link-alt"></i> Apply Now on University Website
            </button>
            <button 
              onClick={() => setCurrentPage('home')} 
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-home"></i> Return to Home
            </button>
          </div>
          <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-700 flex items-start gap-3">
            <i className="fas fa-info-circle mt-0.5"></i>
            <div>
              <strong>Keep this in mind:</strong> You'll receive an email reminder in 48 hours to submit
              proof of your application (e.g., application reference number or screenshot).
              <br />
              <span className="text-xs text-blue-600 mt-1 block">If you have questions, contact Malcolm at malcolm@university.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;