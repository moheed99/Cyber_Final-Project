
import React from 'react';
import { TEAM_MEMBERS, TEAM_NAME, LogEntry } from '../types';
import { Activity, Shield, Wifi, Globe, Lock, Cpu, Server } from 'lucide-react';
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
        <div className="p-6 h-full overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Security Status</div>
                        <div className="text-white font-bold text-lg flex items-center gap-2">
                            SECURE <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Active Sessions</div>
                        <div className="text-white font-bold text-lg">{TEAM_MEMBERS.length} Agents</div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Server className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Target Environment</div>
                        <div className="text-white font-bold text-lg">LAB_ENV_01</div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 rounded-lg">
                        <Cpu className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">System Load</div>
                        <div className="text-white font-bold text-lg">14%</div>
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 min-h-[300px]">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-blue-500" /> Network Traffic Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                            <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                            <Area type="monotone" dataKey="inbound" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIn)" />
                            <Area type="monotone" dataKey="outbound" stroke="#f43f5e" fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-yellow-500" /> Threat Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={alertData} layout="vertical">
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 12}} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Authorized Team Members (Identity Verified)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TEAM_MEMBERS.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">{member.name}</div>
                                <div className="text-slate-500 text-xs font-mono">{member.reg}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
