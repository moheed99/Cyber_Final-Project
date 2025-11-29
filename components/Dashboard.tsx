
import React from 'react';
import { TEAM_MEMBERS, TEAM_NAME, LogEntry } from '../types';
import { Activity, Shield, Wifi, Globe, Lock, Cpu, Server, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
    logs: LogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
    // Mock Data for visuals
    const trafficData = Array.from({ length: 20 }, (_, i) => ({
        time: `${i}:00`,
        inbound: Math.floor(Math.random() * 100),
        outbound: Math.floor(Math.random() * 80),
    }));

    const alertData = [
        { name: 'Port Scan', value: 35, color: '#3b82f6' },
        { name: 'Auth Fail', value: 12, color: '#f43f5e' },
        { name: 'Web Enum', value: 28, color: '#a855f7' },
        { name: 'DoS Sim', value: 15, color: '#f59e0b' },
    ];

    return (
        <div className="p-6 h-full overflow-y-auto bg-slate-950 relative">
            {/* Background Grid FX */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none z-0"></div>

            <div className="relative z-10">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-cyan-900/10">
                        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-cyan-200/50 text-xs uppercase font-bold tracking-wider">Security Status</div>
                            <div className="text-white font-bold text-lg flex items-center gap-2 font-mono">
                                SYSTEM SECURE <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-md border border-purple-500/20 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-purple-900/10">
                        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <Activity className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-purple-200/50 text-xs uppercase font-bold tracking-wider">Active Agents</div>
                            <div className="text-white font-bold text-lg font-mono">{TEAM_MEMBERS.length} OPERATORS</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-md border border-pink-500/20 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-pink-900/10">
                        <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                            <Layers className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <div className="text-pink-200/50 text-xs uppercase font-bold tracking-wider">Env Status</div>
                            <div className="text-white font-bold text-lg font-mono">LAB_CONNECTED</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-emerald-900/10">
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <Cpu className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-emerald-200/50 text-xs uppercase font-bold tracking-wider">CPU Load</div>
                            <div className="text-white font-bold text-lg font-mono">14% NOMINAL</div>
                        </div>
                    </div>
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 min-h-[300px]">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 font-mono tracking-widest">
                            <Wifi className="w-5 h-5 text-cyan-400" /> NETWORK_TRAFFIC_OP
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12, fontFamily: 'monospace'}} />
                                <YAxis stroke="#64748b" tick={{fontSize: 12, fontFamily: 'monospace'}} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{fontFamily: 'monospace'}} />
                                <Area type="monotone" dataKey="inbound" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                                <Area type="monotone" dataKey="outbound" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 font-mono tracking-widest">
                            <Lock className="w-5 h-5 text-yellow-500" /> THREAT_VECTOR_ANALYSIS
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={alertData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 12, fontFamily: 'monospace'}} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {alertData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Roster */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 font-mono tracking-widest">AUTHORIZED_PERSONNEL</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TEAM_MEMBERS.map((member, i) => (
                            <div key={i} className="group flex items-center gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all cursor-default">
                                <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold font-mono shadow-lg shadow-cyan-900/20 group-hover:shadow-cyan-500/20 transition-all">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm font-mono group-hover:text-cyan-300 transition-colors">{member.name}</div>
                                    <div className="text-slate-500 text-xs font-mono group-hover:text-slate-400">{member.reg}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
