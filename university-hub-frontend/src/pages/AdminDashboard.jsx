import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ReferralTable from '../components/dashboard/ReferralTable';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardContent = () => {
  const { 
    user, 
    logout, 
    registrations, 
    initializeDashboard,
    ambassadors, 
    createAmbassador,        
    updateAmbassador,        
    deleteAmbassador,      
    toggleAmbassadorStatus,          
    proofs, 
    getStatsForAmbassador, 
    validateReferral, 
    showToast,
    isLoading 
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAmbassador, setSelectedAmbassador] = useState('all');
  const [showAddAmbassador, setShowAddAmbassador] = useState(false);
  const [showEditAmbassador, setShowEditAmbassador] = useState(false);
  const [editingAmbassador, setEditingAmbassador] = useState(null);
  const [newAmbassador, setNewAmbassador] = useState({ name: '', slug: '', email: '' });

  useEffect(() => {
    // Only proceed if admin and NEVER loaded before
    if (user?.role === 'admin' ) {
      console.log('AdminDashboard: Starting initial load (ONLY ONCE)');
      initializeDashboard();
    }
  }, [user, initializeDashboard]);

  const handleLogout = () => {
    logout();
    // setCurrentPage('home'); // This should be handled by parent
  };

  // Admin content
  const allRegistrations = registrations || [];
  const filteredRegs = allRegistrations.filter(r => {
    if (selectedAmbassador !== 'all' && r.referrerSlug !== selectedAmbassador) return false;
    if (filter === 'pending') return r.proofStatus === 'pending';
    if (filter === 'submitted') return r.proofStatus === 'submitted';
    if (filter === 'validated') return r.validated === true;
    return true;
  }).filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.fullName?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
  });

  const ambassadorOptions = ambassadors.filter(a => a.active);
  const topReferrers = ambassadorOptions.map(a => ({
    ...a,
    stats: getStatsForAmbassador(a.slug),
  })).sort((a, b) => b.stats.total - a.stats.total);

  const handleAddAmbassador = async (e) => {
    e.preventDefault();
    if (!newAmbassador.name || !newAmbassador.slug || !newAmbassador.email) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (ambassadors.find(a => a.slug === newAmbassador.slug)) {
      showToast('Slug already exists.', 'error');
      return;
    }
    if (ambassadors.find(a => a.email === newAmbassador.email)) {
      showToast('Email already exists.', 'error');
      return;
    }
    const result = await createAmbassador({
      name: newAmbassador.name,
      email: newAmbassador.email,
      ambassadorSlug: newAmbassador.slug,
      password: 'ambassador123',
    });

    if (result.success) {
      setNewAmbassador({ name: '', slug: '', email: '' });
      setShowAddAmbassador(false);
    }
  };

  const handleEditAmbassador = (ambassador) => {
    setEditingAmbassador(ambassador);
    setNewAmbassador({ name: ambassador.name, slug: ambassador.slug, email: ambassador.email, });
    setShowEditAmbassador(true);
  };

  const handleUpdateAmbassador = async (e) => {
    e.preventDefault();
    if (!newAmbassador.name || !newAmbassador.slug || !newAmbassador.email) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    const slugTaken = ambassadors.find(a => a.slug === newAmbassador.slug && a.id !== editingAmbassador.id);
    if (slugTaken) {
      showToast('Slug already exists.', 'error');
      return;
    }

    const emailTaken = ambassadors.find(a => a.email === newAmbassador.email && a.id !== editingAmbassador.id);
    if (emailTaken) {
      showToast('Slug already exists.', 'error');
      return;
    }

    const result = await updateAmbassador(editingAmbassador.id, {
      name: newAmbassador.name,
      email: newAmbassador.email,
      ambassadorSlug: newAmbassador.slug,
    });

    if (result.success) {
      setNewAmbassador({ name: '', slug: '', email: '' });
      setShowEditAmbassador(false);
      setEditingAmbassador(null);
    }
  };

  const handleDeleteAmbassador = async (slug) => {
    if (window.confirm('Are you sure you want to delete this ambassador? This action can not be undone.')) {
      const ambassador = ambassadors.find(a => a.slug === slug);
      if (!ambassador) return;

      const hasReferrals = registrations.some(r => r.reffererSlug === slug);
      if (hasReferrals) {
        if (!window.confirm('This ambassador has referrals. Deleting them will remove the referral data. Continue?')) {
          return;
        }
      }
      
      const result = await deleteAmbassador(ambassador.id);
      if (result.success) {
        showToast('Ambassador deleted successfully!', 'success');
      }
    }
  };

  const toggleAmbassador = async (slug) => {
    const ambassador = ambassadors.find(a => a.slug === slug);
    if (!ambassador) {
      showToast('Ambassador not found', 'error');
      return;
    }

    const result = await toggleAmbassadorStatus(ambassador.id);
    if (result.success){
      showToast(`Ambassador ${result.isActive ? 'activated' : 'deactivated'}.`, 'info');
    }
  };

  const handleViewProof = (regId) => {
    const reg = registrations.find(r => r.id === regId);
    if (reg && reg.proofStatus === 'submitted') {
      const proof = proofs.find(p => p.registrationId === regId);
      showToast(`Reference: ${proof?.referenceNumber || 'N/A'}`, 'info');
    } else {
      showToast('No proof submitted.', 'info');
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email).then(() => showToast('Email copied!', 'success'));
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-user-shield text-indigo-500"></i>
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || 'Admin'}!
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddAmbassador(true)} className="px-4 py-2 bg-indigo-600 dark:bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-sm flex items-center gap-2">
            <i className="fas fa-user-plus"></i> Add Ambassador
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2">
            <i className="fas fa-sign-out-alt"></i> Logout
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
          {/* Top Referrers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              <i className="fas fa-trophy text-yellow-500 mr-2"></i>Top Referrers
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topReferrers.map(a => (
                <div key={a.slug} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {a.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{a.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {a.stats.total} referrals · {a.stats.submitted} submitted · {a.stats.rate}% rate
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                    {a.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
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
            <select value={selectedAmbassador} onChange={(e) => setSelectedAmbassador(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 outline-none">
              <option value="all">All Ambassadors</option>
              {ambassadorOptions.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="flex-1 min-w-[120px] px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all" />
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <ReferralTable 
              referrals={filteredRegs} 
              onViewProof={handleViewProof} 
              onValidate={validateReferral} 
              onCopyEmail={handleCopyEmail} 
            />
          </div>
        </>
      )}

      {/* Add Ambassador Modal */}
      {showAddAmbassador && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Ambassador</h3>
              <button onClick={() => setShowAddAmbassador(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddAmbassador} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input type="text" value={newAmbassador.name} onChange={(e) => setNewAmbassador(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="e.g. Jane Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (unique) *</label>
                <input type="text" value={newAmbassador.slug} onChange={(e) => setNewAmbassador(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="e.g. jane-doe" required />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Used in referral links: ?ref={newAmbassador.slug || '...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input type="email" value={newAmbassador.email} onChange={(e) => setNewAmbassador(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="jane@university.edu" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 dark:bg-purple-700 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all">
                  <i className="fas fa-plus mr-2"></i> Add
                </button>
                <button type="button" onClick={() => setShowAddAmbassador(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ambassador Modal */}
      {showEditAmbassador && editingAmbassador && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Ambassador</h3>
              <button onClick={() => {
                setShowEditAmbassador(false);
                setEditingAmbassador(null);
                setNewAmbassador({ name: '', slug: '', email: '' });
              }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateAmbassador} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input type="text" value={newAmbassador.name} onChange={(e) => setNewAmbassador(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="e.g. Jane Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (unique) *</label>
                <input type="text" value={newAmbassador.slug} onChange={(e) => setNewAmbassador(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="e.g. jane-doe" required />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Used in referral links: ?ref={newAmbassador.slug || '...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input type="email" value={newAmbassador.email} onChange={(e) => setNewAmbassador(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
                  placeholder="jane@university.edu" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 dark:bg-purple-700 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all">
                  <i className="fas fa-save mr-2"></i> Update Ambassador
                </button>
                <button type="button" onClick={() => {
                  setShowEditAmbassador(false);
                  setEditingAmbassador(null);
                  setNewAmbassador({ name: '', slug: '', email: '' });
                }} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Ambassadors */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            <i className="fas fa-users-cog text-indigo-500 mr-2"></i>Manage Ambassadors
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {ambassadors.filter(a => a.active).length} active · {ambassadors.filter(a => !a.active).length} inactive
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ambassadors.map(a => (
            <div key={a.slug} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{a.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{a.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button 
                  onClick={() => handleEditAmbassador(a)} 
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Edit Ambassador"
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteAmbassador(a.slug)} 
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Ambassador"
                >
                  Delete
                </button>
                {/* Toggle Active/Inactive Button */}
                <button 
                  onClick={() => toggleAmbassador(a.slug)} 
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    a.active 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  {a.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main AdminDashboard component
const AdminDashboard = ({ setCurrentPage }) => {
  const { logout } = useApp();

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardContent setCurrentPage={setCurrentPage} handleLogout={handleLogout} />
    </ProtectedRoute>
  );
};

export default AdminDashboard;