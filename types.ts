
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  PORT_SCANNER = 'PORT_SCANNER',
  PASSWORD_AUDITOR = 'PASSWORD_AUDITOR',
  STRESS_TESTER = 'STRESS_TESTER',
  WEB_DISCOVERY = 'WEB_DISCOVERY',
  PACKET_SNIFFER = 'PACKET_SNIFFER',
  REPORTING = 'REPORTING',
  SOURCE_CODE = 'SOURCE_CODE'
}

export interface TeamMember {
  name: string;
  reg: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tool: ToolType;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
}

export interface ScanResult {
  port: number;
  service: string;
  state: 'OPEN' | 'CLOSED' | 'FILTERED';
  banner?: string;
}

export interface Packet {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Moheed Ul Hassan', reg: '22I-7451' },
  { name: 'Ali Abbas', reg: '22I-2285' },
  { name: 'Abdur Rehman', reg: '22I-2291' }
];

export const TEAM_NAME = "CyberGuard";
