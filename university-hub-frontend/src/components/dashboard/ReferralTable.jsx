import StatusBadge from './StatusBadge';

const ReferralTable = ({ referrals, onViewProof, onValidate, onCopyEmail, showActions = true }) => {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <i className="fas fa-inbox text-2xl block mb-2"></i>
        No referrals found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Programme</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Registered</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            {showActions && <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {referrals.map(r => (
            <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
              <td className="px-4 py-3 font-medium text-gray-800">{r.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{r.email}</td>
              <td className="px-4 py-3 text-gray-600">{r.programme}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.registeredAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.proofStatus} validated={r.validated} />
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {r.proofStatus === 'submitted' && (
                      <button onClick={() => onViewProof(r.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-xs" title="View Proof">
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {r.proofStatus === 'submitted' && !r.validated && (
                      <button onClick={() => onValidate(r.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all text-xs" title="Validate">
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <button onClick={() => onCopyEmail(r.email)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all text-xs" title="Copy Email">
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralTable;