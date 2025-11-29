import React, { useState, useEffect, useRef } from 'react';
import { Play, StopCircle, Terminal, Wifi } from 'lucide-react';
import { ScanResult, LogEntry, ToolType } from '../types';

interface PortScannerProps {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'TELNET' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MYSQL' },
  { port: 8080, service: 'HTTP-PROXY' },
];

const PortScanner: React.FC<PortScannerProps> = ({ addLog }) => {
  const [target, setTarget] = useState('192.168.1.105');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [currentPort, setCurrentPort] = useState(0);

  const startScan = () => {
    if (!target) return;
    setIsScanning(true);
    setResults([]);
    setProgress(0);
    addLog({ tool: ToolType.PORT_SCANNER, type: 'INFO', message: `Starting TCP scan on ${target}` });
  };

  useEffect(() => {
    if (!isScanning) return;

    let scanIdx = 0;
    const totalPorts = 1000; // Simulated range
    const interval = setInterval(() => {
      scanIdx += 5; // Jump 5 ports per tick
      setCurrentPort(scanIdx);
      setProgress(Math.min((scanIdx / totalPorts) * 100, 100));

      // Simulate finding a port
      const foundPort = COMMON_PORTS.find(p => p.port === scanIdx);
      if (foundPort) {
        // Randomize open/closed for simulation effect
        if (Math.random() > 0.3) {
            const result: ScanResult = {
                port: foundPort.port,
                service: foundPort.service,
                state: 'OPEN',
                banner: `Simulated banner for ${foundPort.service} v${(Math.random() * 5).toFixed(1)}`
            };
            setResults(prev => [...prev, result]);
            addLog({ tool: ToolType.PORT_SCANNER, type: 'SUCCESS', message: `Found OPEN port: ${foundPort.port}/${foundPort.service}` });
        }
      }

      if (scanIdx >= totalPorts) {
        setIsScanning(false);
        clearInterval(interval);
        addLog({ tool: ToolType.PORT_SCANNER, type: 'INFO', message: `Scan completed for ${target}` });
      }
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning, target]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Wifi className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="font-bold text-white">Target Configuration</h2>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white font-mono focus:border-blue-500 outline-none w-48"
                placeholder="IP Address"
                disabled={isScanning}
              />
            </div>
          </div>
        </div>
        <button
          onClick={isScanning ? () => setIsScanning(false) : startScan}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
            isScanning
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
          }`}
        >
          {isScanning ? <><StopCircle className="w-5 h-5" /> Abort</> : <><Play className="w-5 h-5" /> Start Scan</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Results List */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-hidden flex flex-col">
          <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider">Discovered Services</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {results.map((r, i) => (
              <div key={i} className="p-3 bg-slate-900/50 rounded border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-400 font-mono font-bold">{r.port}/TCP</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs rounded uppercase">{r.state}</span>
                </div>
                <div className="text-slate-300 text-sm font-semibold">{r.service}</div>
                <div className="text-slate-500 text-xs font-mono mt-1 truncate">{r.banner}</div>
              </div>
            ))}
            {results.length === 0 && !isScanning && (
              <div className="text-slate-500 text-center text-sm py-10 italic">No open ports found yet.</div>
            )}
          </div>
        </div>

        {/* Terminal/Visualizer */}
        <div className="lg:col-span-2 bg-black rounded-xl border border-slate-700 p-4 font-mono text-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div className="h-full bg-blue-500 transition-all duration-75" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 mb-2 pb-2 border-b border-slate-800">
                <Terminal className="w-4 h-4" />
                <span>Console Output</span>
                {isScanning && <span className="ml-auto text-blue-400 animate-pulse">Scanning Port {currentPort}...</span>}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-slate-300">
                {results.map((r, i) => (
                    <div key={i}>
                        <span className="text-emerald-500">[+]</span> Discovered open port {r.port}/{r.service} on {target}
                    </div>
                ))}
                {isScanning && (
                     <div className="animate-pulse text-slate-500">
                        {`>`} Probing {target}:{currentPort} [SYN]...
                     </div>
                )}
                {!isScanning && progress === 100 && (
                     <div className="text-blue-500">
                        {`>`} Scan complete. {results.length} services identified.
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PortScanner;