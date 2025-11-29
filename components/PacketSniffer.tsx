import React, { useState, useEffect } from 'react';
import { Network, Pause, Play, Download } from 'lucide-react';
import { Packet, LogEntry, ToolType } from '../types';

interface PacketSnifferProps {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const PacketSniffer: React.FC<PacketSnifferProps> = ({ addLog }) => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isCapturing) {
        addLog({ tool: ToolType.PACKET_SNIFFER, type: 'INFO', message: 'Started packet capture (pcap)' });
        
        interval = setInterval(() => {
            const id = Date.now();
            const protos = ['TCP', 'UDP', 'HTTP', 'TLSv1.3', 'ARP'];
            const proto = protos[Math.floor(Math.random() * protos.length)];
            const src = `192.168.1.${Math.floor(Math.random() * 255)}`;
            const dst = `10.0.0.${Math.floor(Math.random() * 255)}`;
            
            const newPacket: Packet = {
                id: Math.floor(Math.random() * 10000),
                time: new Date().toISOString().split('T')[1].slice(0, -1),
                source: src,
                destination: dst,
                protocol: proto,
                length: Math.floor(Math.random() * 1500),
                info: proto === 'HTTP' ? 'GET /api/v1/user HTTP/1.1' : `Len=${Math.floor(Math.random() * 100)} Seq=${Math.floor(Math.random()*1000)}`
            };

            setPackets(prev => {
                const list = [newPacket, ...prev];
                if (list.length > 50) list.pop();
                return list;
            });
        }, 800);
    } else {
        if (packets.length > 0) addLog({ tool: ToolType.PACKET_SNIFFER, type: 'INFO', message: `Capture stopped. Saved ${packets.length} packets.` });
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapturing]);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-cyan-500" />
                <h2 className="text-lg font-bold text-white">Traffic Analysis (Scapy/PyShark)</h2>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={() => setIsCapturing(!isCapturing)}
                    className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${isCapturing ? 'bg-red-500/20 text-red-500' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
                 >
                     {isCapturing ? <><Pause className="w-4 h-4"/> Pause</> : <><Play className="w-4 h-4"/> Capture</>}
                 </button>
                 <button className="px-3 py-2 rounded bg-slate-700 text-slate-300 hover:text-white">
                     <Download className="w-4 h-4" />
                 </button>
            </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col font-mono text-xs">
            <div className="grid grid-cols-12 bg-slate-800 text-slate-400 font-bold p-2 border-b border-slate-700">
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-2">Destination</div>
                <div className="col-span-1">Proto</div>
                <div className="col-span-1">Len</div>
                <div className="col-span-4">Info</div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {packets.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 p-2 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors text-slate-300">
                        <div className="col-span-2">{p.time}</div>
                        <div className="col-span-2">{p.source}</div>
                        <div className="col-span-2">{p.destination}</div>
                        <div className="col-span-1 text-cyan-400">{p.protocol}</div>
                        <div className="col-span-1">{p.length}</div>
                        <div className="col-span-4 text-slate-500 truncate">{p.info}</div>
                    </div>
                ))}
                {packets.length === 0 && (
                    <div className="p-8 text-center text-slate-600 italic">No packets captured. Start the sniffer.</div>
                )}
            </div>
        </div>
    </div>
  );
};

export default PacketSniffer;