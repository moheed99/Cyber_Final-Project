import React, { useState, useEffect } from 'react';
import { Activity, Server, Users, StopCircle, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogEntry, ToolType } from '../types';

interface StressTesterProps {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const StressTester: React.FC<StressTesterProps> = ({ addLog }) => {
  const [isActive, setIsActive] = useState(false);
  const [clients, setClients] = useState(200);
  const [data, setData] = useState<{time: string, latency: number, requests: number}[]>([]);
  const [stats, setStats] = useState({ sent: 0, failed: 0 });

  useEffect(() => {
    let interval: any;
    if (isActive) {
        addLog({ tool: ToolType.STRESS_TESTER, type: 'WARNING', message: `Starting load test with ${clients} simulated clients` });
        
        interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            
            // Simulate server degradation under load
            const baseLatency = 20;
            const loadFactor = clients / 50; 
            const jitter = Math.random() * 50;
            const latency = baseLatency + (Math.pow(loadFactor, 1.5)) + jitter;
            
            // Requests per second
            const rps = clients * (Math.random() * 0.5 + 0.5);

            setData(prev => {
                const newData = [...prev, { time: timeStr, latency: Math.floor(latency), requests: Math.floor(rps) }];
                if (newData.length > 20) newData.shift();
                return newData;
            });

            setStats(prev => ({
                sent: prev.sent + Math.floor(rps),
                failed: prev.failed + (latency > 500 ? Math.floor(rps * 0.1) : 0)
            }));

        }, 1000);
    } else {
        if (data.length > 0) {
            addLog({ tool: ToolType.STRESS_TESTER, type: 'INFO', message: `Load test stopped. Total reqs: ${stats.sent}` });
        }
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, clients]);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-lg">
                    <Activity className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Load / DoS Simulation</h2>
                    <p className="text-slate-400 text-sm">Stress test API endpoints.</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                 <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Simulated Clients</label>
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-400" />
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="50"
                            value={clients}
                            onChange={(e) => setClients(parseInt(e.target.value))}
                            className="w-32 accent-blue-500"
                            disabled={isActive}
                        />
                        <span className="font-mono text-white w-12">{clients}</span>
                    </div>
                 </div>

                 <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/20'}`}
                 >
                     {isActive ? <><StopCircle className="w-5 h-5"/> Stop</> : <><Play className="w-5 h-5"/> Ignite</>}
                 </button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs uppercase">Total Requests</div>
                <div className="text-2xl font-mono text-blue-400">{stats.sent.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs uppercase">Dropped / Failed</div>
                <div className="text-2xl font-mono text-red-400">{stats.failed.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs uppercase">Avg Latency</div>
                <div className="text-2xl font-mono text-yellow-400">{data.length > 0 ? data[data.length-1].latency : 0} ms</div>
            </div>
        </div>

        {/* Chart */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 min-h-[300px]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                <Server className="w-4 h-4" /> Live Response Metrics
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} 
                        itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="latency" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLatency)" name="Latency (ms)" />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReqs)" name="Requests/s" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default StressTester;