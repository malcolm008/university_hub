import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ProofSubmissionPage = ({ setCurrentPage }) => {
  const { submitProof, showToast, registrations } = useApp();
  const [email, setEmail] = useState('');
  const [reg, setReg] = useState(null);
  const [proofData, setProofData] = useState({
    referenceNumber: '',
    notes: '',
    file: null,
    fileName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [found, setFound] = useState(false);

  const handleLookup = () => {
    if (!email) {
      showToast('Please enter your email.', 'error');
      return;
    }
    const foundReg = registrations.find(r => r.email.toLowerCase() === email.toLowerCase());
    if (foundReg) {
      setReg(foundReg);
      setFound(true);
      if (foundReg.proofStatus === 'submitted') {
        showToast('You have already submitted proof for this application.', 'info');
      }
    } else {
      showToast('No registration found with that email.', 'error');
      setReg(null);
      setFound(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProofData(prev => ({
          ...prev,
          file: ev.target.result,
          fileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reg) return;
    if (!proofData.referenceNumber && !proofData.file) {
      showToast('Please provide either a reference number or upload a screenshot.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      submitProof(reg.id, {
        referenceNumber: proofData.referenceNumber,
        notes: proofData.notes,
        file: proofData.file || '',
        fileName: proofData.fileName || '',
      });
      setProofData({ referenceNumber: '', notes: '', file: null, fileName: '' });
      setFound(false);
      setReg(null);
      setEmail('');
      setCurrentPage('ambassador');
    } catch (err) {
      showToast('Error submitting proof.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fas fa-upload"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Submit Application Proof</h2>
          <p className="text-gray-500 text-sm mt-1">Provide evidence of your application to help us credit your referrer.</p>
        </div>

        {!found ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                placeholder="Enter the email you registered with" 
              />
            </div>
            <button 
              onClick={handleLookup} 
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <i className="fas fa-search mr-2"></i> Find My Registration
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Don't have an account? <button onClick={() => setCurrentPage('register')} className="text-indigo-600 hover:underline">Register here</button>
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 mb-6">
              <i className="fas fa-check-circle mr-2"></i>
              Found registration for <strong>{reg.fullName}</strong> ({reg.programme})
              {reg.proofStatus === 'submitted' && (
                <span className="block mt-1 text-amber-600">
                  <i className="fas fa-info-circle mr-1"></i> Proof already submitted.
                </span>
              )}
            </div>

            {reg.proofStatus !== 'submitted' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Reference Number</label>
                  <input 
                    type="text" 
                    value={proofData.referenceNumber} 
                    onChange={(e) => setProofData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="e.g. APP-2024-1234" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot of Application Confirmation</label>
                  <div className="file-upload-area rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-all">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="proofFile" 
                    />
                    <label htmlFor="proofFile" className="cursor-pointer block">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
                      <p className="text-sm text-gray-500">
                        {proofData.fileName ? proofData.fileName : 'Click or drag to upload (PNG/JPG, max 5MB)'}
                      </p>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
                  <textarea 
                    value={proofData.notes} 
                    onChange={(e) => setProofData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="Any additional information..." 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Proof</>}
                </button>
              </form>
            )}

            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => { setFound(false); setReg(null); }} 
                className="flex-1 py-2 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                <i className="fas fa-arrow-left mr-1"></i> Look Up Another
              </button>
              <button 
                onClick={() => setCurrentPage('ambassador')} 
                className="flex-1 py-2 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                <i className="fas fa-chart-simple mr-1"></i> Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ MAKE SURE THIS LINE EXISTS AT THE END OF THE FILE
export default ProofSubmissionPage;