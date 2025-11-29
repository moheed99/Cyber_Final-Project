import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Lock, 
  Zap, 
  Globe, 
  Radio, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Menu,
  Download,
  Code
} from 'lucide-react';
import IdentityGate from './components/IdentityGate';
import Dashboard from './components/Dashboard';
import PortScanner from './components/PortScanner';
import PasswordAuditor from './components/PasswordAuditor';
import StressTester from './components/StressTester';
import WebEnum from './components/WebEnum';
import PacketSniffer from './components/PacketSniffer';
import CodeViewer from './components/CodeViewer';
import { LogEntry, ToolType, TEAM_MEMBERS, TEAM_NAME } from './types';
import { generateSecurityReport } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.SOURCE_CODE); // Default to Code Viewer for user convenience
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [report, setReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      ...entry
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLogs([]);
    setActiveTool(ToolType.DASHBOARD);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    addLog({ tool: ToolType.REPORTING, type: 'INFO', message: 'Requesting AI analysis from Gemini...' });
    
    const result = await generateSecurityReport(logs);
    
    setReport(result);
    setIsGeneratingReport(false);
    addLog({ tool: ToolType.REPORTING, type: 'SUCCESS', message: 'Security report generated.' });
  };

  if (!isAuthenticated) {
    return <IdentityGate onVerified={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <Dashboard logs={logs} />;
      case ToolType.PORT_SCANNER:
        return <PortScanner addLog={addLog} />;
      case ToolType.PASSWORD_AUDITOR:
        return <PasswordAuditor addLog={addLog} />;
      case ToolType.STRESS_TESTER:
        return <StressTester addLog={addLog} />;
      case ToolType.WEB_DISCOVERY:
        return <WebEnum addLog={addLog} />;
      case ToolType.PACKET_SNIFFER:
        return <PacketSniffer addLog={addLog} />;
      case ToolType.SOURCE_CODE:
        return <CodeViewer />;
      case ToolType.REPORTING:
        return (
          <div className="h-full flex flex-col gap-4 p-4">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="w-6 h-6 text-blue-500" />
                      Executive Security Report
                   </h2>
                   <div className="flex items-center gap-3">
                     {report && (
                        <button 
                          onClick={() => {
                            const blob = new Blob([report], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Security_Report_${new Date().toISOString().slice(0,10)}.md`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold text-white transition-colors"
                        >
                          <Download className="w-4 h-4" /> Save
                        </button>
                     )}
                     <button 
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                        className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${isGeneratingReport ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
                     >
                        {isGeneratingReport ? 'Analyzing Logs...' : 'Generate AI Report'}
                     </button>
                   </div>
                </div>
                <div className="text-slate-400 text-sm">
                   Uses Google Gemini to analyze session logs and generate a professional security assessment.
                </div>
             </div>
             
             <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-6 overflow-y-auto font-mono text-sm text-slate-300">
                {report ? (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">{report}</pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600 italic">
                    No report generated yet. Perform some scans and click Generate.
                  </div>
                )}
             </div>
          </div>
        );
      default:
        return <Dashboard logs={logs} />;
    }
  };

  const navItem = (tool: ToolType, label: string, icon: React.ReactNode, special = false) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTool === tool
          ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500'
          : special 
            ? 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 mt-6 border-t border-slate-800' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-3 text-white font-bold text-lg tracking-wider">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              {TEAM_NAME}
           </div>
           <div className="text-xs text-slate-500 mt-1 uppercase">Toolkit v5.0</div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
           {navItem(ToolType.DASHBOARD, 'Dashboard', <LayoutDashboard className="w-5 h-5" />)}
           <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase mt-4 mb-2">Modules</div>
           {navItem(ToolType.PORT_SCANNER, 'Port Scanner', <Network className="w-5 h-5" />)}
           {navItem(ToolType.PASSWORD_AUDITOR, 'Pass Auditor', <Lock className="w-5 h-5" />)}
           {navItem(ToolType.STRESS_TESTER, 'Load Stresser', <Zap className="w-5 h-5" />)}
           {navItem(ToolType.WEB_DISCOVERY, 'Web Recon', <Globe className="w-5 h-5" />)}
           {navItem(ToolType.PACKET_SNIFFER, 'Packet Sniffer', <Radio className="w-5 h-5" />)}
           <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase mt-4 mb-2">Analysis</div>
           {navItem(ToolType.REPORTING, 'Reporting', <FileText className="w-5 h-5" />)}
           
           {/* DOWNLOAD CODE BUTTON */}
           {navItem(ToolType.SOURCE_CODE, 'Download Code', <Code className="w-5 h-5" />, true)}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-950 rounded p-3 mb-3">
              <div className="text-xs text-slate-500 font-bold mb-2">OPERATOR</div>
              {TEAM_MEMBERS.map((m, i) => (
                 <div key={i} className="text-xs text-slate-400 truncate">{m.name}</div>
              ))}
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors text-sm font-bold"
           >
             <LogOut className="w-4 h-4" /> Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-20">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
           </button>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-xs font-bold uppercase">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 System Online
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-hidden relative">
           {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
