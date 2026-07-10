import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const RegisterPage = ({ setCurrentPage }) => {
  const { addRegistration, ambassadors, getAmbassadorBySlug, showToast } = useApp();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    programme: '',
    referrerSlug: 'malcolm',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programmes = [
    'Computer Science', 'Business Administration', 'Engineering', 'Medicine',
    'Law', 'Arts & Design', 'Education', 'Nursing',
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      const amb = getAmbassadorBySlug(ref);
      if (amb) setForm(prev => ({ ...prev, referrerSlug: amb.slug }));
    }
  }, [getAmbassadorBySlug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.programme || !form.referrerSlug) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!form.consent) {
      showToast('Please consent to email communications.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const newReg = addRegistration({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || '',
        programme: form.programme,
        referrerSlug: form.referrerSlug,
        consent: form.consent,
      });
      sessionStorage.setItem('lastRegistration', JSON.stringify(newReg));
      setCurrentPage('confirmation');
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAmbassador = ambassadors.find(a => a.slug === form.referrerSlug);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-20 md:py-28 overflow-hidden transition-colors duration-500">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fas fa-pen-to-square"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Register Your Interest</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in your details and get ready to apply.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              type="text" 
              name="fullName" 
              value={form.fullName} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="e.g. John Doe" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="john@example.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (optional)</label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="+1 234 567 890" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Programme / Course of Interest *</label>
            <select 
              name="programme" 
              value={form.programme} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all appearance-none bg-white"
              required
            >
              <option value="">Select a programme</option>
              {programmes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Who referred you? *</label>
            <select 
              name="referrerSlug" 
              value={form.referrerSlug} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all appearance-none bg-white"
              required
            >
              {ambassadors.filter(a => a.active).map(a => (
                <option key={a.slug} value={a.slug}>{a.name}</option>
              ))}
            </select>
            {selectedAmbassador && (
              <div className="mt-1.5 text-xs text-indigo-600 flex items-center gap-1">
                <i className="fas fa-check-circle"></i>
                <span>You'll be credited to <strong>{selectedAmbassador.name}</strong></span>
              </div>
            )}
          </div>
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              name="consent" 
              checked={form.consent} 
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
              required 
            />
            <label className="text-sm text-gray-600">
              I consent to receive email communications about my application and university updates.
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-indigo-600 dark:bg-purple-700 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-lg hover:shadow-indigo-200/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-arrow-right"></i> Register & Continue</>}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          <i className="fas fa-lock mr-1"></i> Your data is secure and GDPR compliant.
        </p>
      </div>
    </div>
  );
};

// ✅ MAKE SURE THIS LINE EXISTS AT THE VERY END OF THE FILE
export default RegisterPage;