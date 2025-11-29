import React, { useState, useEffect } from 'react';
import { Globe, Folder, Search, Check, AlertCircle } from 'lucide-react';
import { LogEntry, ToolType } from '../types';

interface WebEnumProps {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const DIRS = ['admin', 'login', 'uploads', 'config', 'dashboard', 'api', 'backup', '.git', 'test', 'db', 'images', 'css', 'js'];
const SUBDOMAINS = ['api', 'dev', 'staging', 'mail', 'remote', 'secure', 'vpn'];

const WebEnum: React.FC<WebEnumProps> = ({ addLog }) => {
  const [url, setUrl] = useState('http://paybuddy-dev.internal');
  const [isRunning, setIsRunning] = useState(false);
  const [foundItems, setFoundItems] = useState<{type: 'DIR' | 'SUB', path: string, status: number}[]>([]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
        addLog({ tool: ToolType.WEB_DISCOVERY, type: 'INFO', message: `Starting enumeration on ${url}` });
        setFoundItems([]);
        
        let attempts = 0;
        interval = setInterval(() => {
            attempts++;
            const isDir = Math.random() > 0.4;
            const collection = isDir ? DIRS : SUBDOMAINS;
            const item = collection[Math.floor(Math.random() * collection.length)];
            
            // Randomly "find" something
            if (Math.random() > 0.6) {
                const newItem = {
                    type: isDir ? 'DIR' as const : 'SUB' as const,
                    path: isDir ? `/${item}` : `${item}.${url.replace('http://', '')}`,
                    status: Math.random() > 0.8 ? 403 : 200
                };
                
                // Avoid duplicates in visual list
                setFoundItems(prev => {
                    if (prev.find(p => p.path === newItem.path)) return prev;
                    addLog({ tool: ToolType.WEB_DISCOVERY, type: newItem.status === 200 ? 'SUCCESS' : 'WARNING', message: `Found: ${newItem.path} [${newItem.status}]` });
                    return [...prev, newItem];
                });
            }

            if (attempts > 30) {
                setIsRunning(false);
                addLog({ tool: ToolType.WEB_DISCOVERY, type: 'INFO', message: 'Enumeration complete.' });
            }
        }, 200);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, url]);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-3 mb-4">
                 <Globe className="w-6 h-6 text-purple-500" />
                 <h2 className="text-lg font-bold text-white">Web Reconnaissance</h2>
             </div>
             <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm focus:border-purple-500 outline-none"
                 />
                 <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded font-bold text-sm ${isRunning ? 'bg-slate-700 text-slate-300' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
                 >
                     {isRunning ? 'Stop' : 'Start Discovery'}
                 </button>
             </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tree View */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-hidden flex flex-col">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Site Structure
                </h3>
                <div className="flex-1 overflow-y-auto font-mono text-sm space-y-2">
                    <div className="text-slate-300 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-purple-400" /> {url}
                    </div>
                    {foundItems.map((item, idx) => (
                        <div key={idx} className={`pl-6 flex items-center gap-2 ${item.status === 200 ? 'text-emerald-400' : 'text-yellow-500'}`}>
                            <span className="text-slate-600">└──</span>
                            {item.type === 'DIR' ? <Folder className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                            {item.path}
                            <span className="text-xs px-1 rounded bg-slate-900 border border-slate-700">{item.status}</span>
                        </div>
                    ))}
                    {isRunning && <div className="pl-6 text-slate-500 animate-pulse">└── scanning...</div>}
                </div>
            </div>

            {/* HTTP Headers Preview (Static Mock) */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 font-mono text-xs text-slate-400 overflow-y-auto">
                 <div className="text-slate-500 mb-2 border-b border-slate-800 pb-2">Last Response Header</div>
                 {foundItems.length > 0 ? (
                     <div className="space-y-1">
                        <div className="text-emerald-500">HTTP/1.1 {foundItems[foundItems.length-1].status} OK</div>
                        <div>Date: {new Date().toUTCString()}</div>
                        <div>Server: Apache/2.4.41 (Ubuntu)</div>
                        <div>X-Powered-By: PHP/7.4.3</div>
                        <div className="text-red-400">Set-Cookie: PHPSESSID=d7a8s...; path=/</div>
                        <div>Content-Type: text/html; charset=UTF-8</div>
                        <div>Connection: close</div>
                     </div>
                 ) : (
                     <div className="italic text-slate-600">Waiting for data...</div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default WebEnum;