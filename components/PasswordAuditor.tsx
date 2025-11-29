import React, { useState } from 'react';
import { Lock, ShieldAlert, Zap, RefreshCw } from 'lucide-react';
import { LogEntry, ToolType } from '../types';

interface PasswordAuditorProps {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const PasswordAuditor: React.FC<PasswordAuditorProps> = ({ addLog }) => {
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [crackTime, setCrackTime] = useState<string | null>(null);

  const calculateEntropy = (pwd: string) => {
    const charsetSize = 
      (pwd.match(/[a-z]/) ? 26 : 0) +
      (pwd.match(/[A-Z]/) ? 26 : 0) +
      (pwd.match(/[0-9]/) ? 10 : 0) +
      (pwd.match(/[^a-zA-Z0-9]/) ? 32 : 0);
    
    if (charsetSize === 0) return 0;
    return Math.log2(Math.pow(charsetSize, pwd.length));
  };

  const getStrengthLabel = (entropy: number) => {
    if (entropy < 28) return { label: 'Very Weak', color: 'text-red-500', bar: 'bg-red-500', w: '20%' };
    if (entropy < 36) return { label: 'Weak', color: 'text-orange-500', bar: 'bg-orange-500', w: '40%' };
    if (entropy < 60) return { label: 'Moderate', color: 'text-yellow-500', bar: 'bg-yellow-500', w: '60%' };
    if (entropy < 128) return { label: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500', w: '80%' };
    return { label: 'Very Strong', color: 'text-blue-500', bar: 'bg-blue-500', w: '100%' };
  };

  const entropy = calculateEntropy(password);
  const strength = getStrengthLabel(entropy);

  const runOfflineAttackSim = () => {
    if (!password) return;
    setIsSimulating(true);
    addLog({ tool: ToolType.PASSWORD_AUDITOR, type: 'INFO', message: 'Starting offline hash crack simulation (SHA-256)' });
    
    setTimeout(() => {
        // Simple heuristic for simulation
        let time = "Instantly";
        if (entropy > 50) time = "2 hours";
        if (entropy > 70) time = "4 weeks";
        if (entropy > 90) time = "300 years";
        if (entropy > 120) time = "Trillions of years";
        
        setCrackTime(time);
        setIsSimulating(false);
        addLog({ tool: ToolType.PASSWORD_AUDITOR, type: 'WARNING', message: `Simulation Complete. Est crack time: ${time}` });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full p-4">
      {/* Policy Checker */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col gap-6">
        <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-emerald-500" />
                Password Policy Audit
            </h2>
            <p className="text-slate-400 text-sm mt-1">Check credentials against NIST guidelines & entropy rules.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Password</label>
                <input 
                    type="text" // Visible for demo purposes as per prompt "Offline testing"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setCrackTime(null);
                    }}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono mt-2 focus:border-blue-500 outline-none"
                    placeholder="Enter password to test..."
                />
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-400 text-sm">Estimated Entropy</span>
                    <span className="text-2xl font-bold text-white">{entropy.toFixed(1)} <span className="text-sm font-normal text-slate-500">bits</span></span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${strength.bar}`} style={{ width: strength.w }}></div>
                </div>
                <div className={`mt-2 text-right font-bold text-sm ${strength.color}`}>
                    {strength.label}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`px-3 py-2 rounded border ${password.length >= 12 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    Length {'>'} 12
                </div>
                <div className={`px-3 py-2 rounded border ${/[0-9]/.test(password) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    Numbers
                </div>
                <div className={`px-3 py-2 rounded border ${/[!@#$%^&*]/.test(password) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    Special Chars
                </div>
                <div className={`px-3 py-2 rounded border ${/[A-Z]/.test(password) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    Uppercase
                </div>
            </div>
        </div>
      </div>

      {/* Attack Simulator */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full"></div>
          
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 relative z-10">
              <Zap className="w-6 h-6 text-yellow-500" />
              Offline Hash Simulation
          </h2>

          <div className="text-slate-400 text-sm mb-6 relative z-10">
              Simulates a brute-force attack on a local high-performance GPU cluster (RTX 4090 Array).
          </div>

          {!crackTime && !isSimulating && (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/30">
                  <button 
                    onClick={runOfflineAttackSim}
                    disabled={!password}
                    className="flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                      <RefreshCw className="w-8 h-8" />
                      <span>Run Simulation</span>
                  </button>
              </div>
          )}

          {isSimulating && (
               <div className="h-48 flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-700 relative z-10">
                   <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"></div>
                   <div className="font-mono text-yellow-500 animate-pulse">Running Hashcat (SHA-256)...</div>
                   <div className="text-xs text-slate-500 mt-2">12,500 MH/s</div>
               </div>
          )}

          {crackTime && (
              <div className="h-48 flex flex-col items-center justify-center rounded-lg bg-red-500/10 border border-red-500/50 relative z-10">
                  <div className="text-slate-300 text-sm uppercase tracking-wider mb-2">Estimated Time to Crack</div>
                  <div className="text-3xl font-bold text-red-500">{crackTime}</div>
                  <button onClick={() => setCrackTime(null)} className="mt-4 text-xs text-slate-400 underline hover:text-white">Reset</button>
              </div>
          )}
      </div>
    </div>
  );
};

export default PasswordAuditor;