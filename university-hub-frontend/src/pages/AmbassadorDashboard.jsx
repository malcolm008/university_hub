import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import ReferralTable from '../components/dashboard/ReferralTable';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardContent = ({ setCurrentPage }) => {
  const { 
    user, 
    registrations, 
    initializeAmbassadorDashboard,
    initializeDashboard,
    getStatsForAmbassador, 
    getReferralsByAmbassador, 
    getProofByRegistrationId, 
    validateReferral, 
    showToast,
    isLoading 
  } = useApp();
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedReg, setSelectedReg] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  const ambassadorSlug = user?.ambassadorSlug || 'malcolm';

  // Load registrations only once
  useEffect(() => {
    if (user?.role === 'ambassador' || user?.role === 'admin') {
      console.log('AmbassadorDashboard: Starting initial load');
      initializeDashboard();
    }
  }, [user, ambassadorSlug, initializeAmbassadorDashboard]);

  // Memoize stats and referrals
  const stats = useMemo(() => getStatsForAmbassador(ambassadorSlug), [getStatsForAmbassador, ambassadorSlug, registrations]);
  const referrals = useMemo(() => getReferralsByAmbassador(ambassadorSlug), [getReferralsByAmbassador, ambassadorSlug, registrations]);

  // Memoize filtered results
  const filtered = useMemo(() => {
    return referrals.filter(r => {
      if (filter === 'pending') return r.proofStatus === 'pending';
      if (filter === 'submitted') return r.proofStatus === 'submitted';
      if (filter === 'validated') return r.validated === true;
      return true;
    }).filter(r => {
      if (!search) return true;
      const q = search.toLowerCase();
      return r.fullName?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
    }).filter(r => {
      if (dateRange.from) {
        const d = new Date(r.registeredAt);
        if (d < new Date(dateRange.from)) return false;
      }
      if (dateRange.to) {
        const d = new Date(r.registeredAt);
        if (d > new Date(dateRange.to)) return false;
      }
      return true;
    });
  }, [referrals, filter, search, dateRange]);

  const handleExport = () => {
    const data = filtered.map(r => ({
      Name: r.fullName,
      Email: r.email,
      Programme: r.programme,
      'Registered At': new Date(r.registeredAt).toLocaleString(),
      'Proof Status': r.proofStatus,
      Validated: r.validated ? 'Yes' : 'No',
      'Reference #': getProofByRegistrationId(r.id)?.referenceNumber || '',
    }));
    const headers = Object.keys(data[0] || {});
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?ref=${ambassadorSlug}`;
    navigator.clipboard?.writeText(link).then(() => showToast('Referral link copied!', 'success'))
      .catch(() => {
        const input = document.createElement('input');
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Referral link copied!', 'success');
      });
  };

  const handleViewProof = (regId) => {
    const reg = registrations.find(r => r.id === regId);
    if (reg && reg.proofStatus === 'submitted') {
      const proof = getProofByRegistrationId(regId);
      setSelectedReg({ ...reg, proof });
      setShowProofModal(true);
    } else {
      showToast('No proof submitted yet.', 'info');
    }
  };

  const handleValidate = (regId) => {
    validateReferral(regId);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email).then(() => showToast('Email copied!', 'success'));
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-chart-simple text-indigo-500"></i>
            Ambassador Dashboard — {user?.name || 'Ambassador'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your referrals and their application progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCopyLink} className="px-4 py-2 bg-indigo-600 dark:bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-sm flex items-center gap-2">
            <i className="fas fa-link"></i> Copy Referral Link
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2">
            <i className="fas fa-file-csv"></i> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatsCard icon="fas fa-users" label="Total Referrals" value={stats.total} bgColor="bg-indigo-50 dark:bg-indigo-900/20" textColor="text-indigo-600 dark:text-indigo-400" />
            <StatsCard icon="fas fa-clock" label="Pending Proof" value={stats.pending} bgColor="bg-yellow-50 dark:bg-yellow-900/20" textColor="text-yellow-600 dark:text-yellow-400" />
            <StatsCard icon="fas fa-check-circle" label="Proof Submitted" value={stats.submitted} bgColor="bg-green-50 dark:bg-green-900/20" textColor="text-green-600 dark:text-green-400" />
            <StatsCard icon="fas fa-badge-check" label="Validated" value={stats.validated} bgColor="bg-purple-50 dark:bg-purple-900/20" textColor="text-purple-600 dark:text-purple-400" />
            <StatsCard icon="fas fa-percent" label="Conversion Rate" value={`${stats.rate}%`} bgColor="bg-blue-50 dark:bg-blue-900/20" textColor="text-blue-600 dark:text-blue-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex gap-1">
              {['all','pending','submitted','validated'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${filter === f ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {f}
                </button>
              ))}
            </div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="flex-1 min-w-[120px] px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all" />
            <div className="flex gap-2">
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 outline-none" />
              <span className="text-gray-400 dark:text-gray-500 text-sm self-center">to</span>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 outline-none" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <ReferralTable 
              referrals={filtered} 
              onViewProof={handleViewProof} 
              onValidate={handleValidate} 
              onCopyEmail={handleCopyEmail} 
            />
          </div>
        </>
      )}

      {/* Proof Modal */}
      {showProofModal && selectedReg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proof of Application</h3>
              <button onClick={() => setShowProofModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> <span className="text-gray-900 dark:text-white">{selectedReg.fullName}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Email:</span> <span className="text-gray-900 dark:text-white">{selectedReg.email}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Programme:</span> <span className="text-gray-900 dark:text-white">{selectedReg.programme}</span></div>
              {selectedReg.proof && (
                <>
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">Reference #:</span> <span className="text-gray-900 dark:text-white">{selectedReg.proof.referenceNumber || 'N/A'}</span></div>
                  {selectedReg.proof.file && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Screenshot:</span>
                      <div className="mt-2 border dark:border-gray-700 rounded-xl overflow-hidden">
                        <img src={selectedReg.proof.file} alt="Proof" className="max-h-64 w-auto mx-auto" />
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selectedReg.proof.fileName || 'screenshot.png'}</div>
                    </div>
                  )}
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span> <span className="text-gray-900 dark:text-white">{selectedReg.proof.notes || '—'}</span></div>
                  <div><span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span> <span className="text-gray-900 dark:text-white">{new Date(selectedReg.proof.submittedAt).toLocaleString()}</span></div>
                </>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { if (!selectedReg.validated) { validateReferral(selectedReg.id); setShowProofModal(false); } }}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${selectedReg.validated ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                disabled={selectedReg.validated}>
                {selectedReg.validated ? 'Already Validated' : <><i className="fas fa-check mr-1"></i> Validate Referral</>}
              </button>
              <button onClick={() => setShowProofModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AmbassadorDashboard = ({ setCurrentPage }) => {
  return (
    <ProtectedRoute allowedRoles={['ambassador', 'admin']}>
      <DashboardContent setCurrentPage={setCurrentPage} />
    </ProtectedRoute>
  );
};

export default AmbassadorDashboard;