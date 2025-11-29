import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { TEAM_MEMBERS, TEAM_NAME } from '../types';

interface IdentityGateProps {
  onVerified: () => void;
}

const IdentityGate: React.FC<IdentityGateProps> = ({ onVerified }) => {
  const [identityStatus, setIdentityStatus] = useState<'PENDING' | 'VERIFIED'>('PENDING');
  const [consentStatus, setConsentStatus] = useState<'PENDING' | 'VERIFIED'>('PENDING');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate file reading delay
    setTimeout(() => {
      setIdentityStatus('VERIFIED');
      setConsentStatus('VERIFIED');
      setTimeout(() => {
        onVerified();
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-center border-b border-slate-700">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">PayBuddy CyberGuard</h1>
          <p className="text-slate-400 text-sm">Restricted Access // Authorization Required</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            
            {/* Identity Check */}
            <div className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${identityStatus === 'VERIFIED' ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-950 border-slate-700'}`}>
              {identityStatus === 'VERIFIED' ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /> : <FileText className="w-5 h-5 text-slate-400 mt-0.5" />}
              <div>
                <h3 className={`font-semibold text-sm ${identityStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-slate-200'}`}>identity.txt</h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Team: {TEAM_NAME}<br/>
                  Members: {TEAM_MEMBERS.length}
                </div>
              </div>
            </div>

            {/* Consent Check */}
            <div className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${consentStatus === 'VERIFIED' ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-950 border-slate-700'}`}>
              {consentStatus === 'VERIFIED' ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /> : <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5" />}
              <div>
                <h3 className={`font-semibold text-sm ${consentStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-slate-200'}`}>consent.txt</h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Approved Targets: LAB_ENV<br/>
                  Status: SIGNED
                </div>
              </div>
            </div>

          </div>

          <div className="text-xs text-center text-slate-500 flex items-center justify-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            <span>Unauthorized access is prohibited.</span>
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || (identityStatus === 'VERIFIED' && consentStatus === 'VERIFIED')}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Verifying Credentials...
              </>
            ) : (
              'Load Identity & Authenticate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityGate;