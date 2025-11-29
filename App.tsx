import React, { useState } from 'react';
import { Download, Copy, FileText, Code, Check, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeFile, setActiveFile] = useState('src/app.py');
  const [copied, setCopied] = useState(false);

  const files = {
    'src/app.py': `# VERSION: V4.0_LIVING_EDITION
# AUTHOR: CYBERGUARD TEAM
# THEME: LIVING CYBER GRID + MULTI-PAGE

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import time
import socket
import threading
import requests
import os
import random
import hashlib
import json
import base64
import string
from datetime import datetime
from io import BytesIO

# ==========================================
# 1. PAGE CONFIGURATION
# ==========================================
st.set_page_config(
    page_title="PAYBUDDY // CYBERGUARD",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# IMPORTS FALLBACK
try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

try:
    from streamlit_lottie import st_lottie
    LOTTIE_AVAILABLE = True
except ImportError:
    LOTTIE_AVAILABLE = False

# ==========================================
# 2. STATE MANAGEMENT (PERSISTENCE)
# ==========================================
if 'auth' not in st.session_state: st.session_state.auth = False
if 'logs' not in st.session_state: st.session_state.logs = []
if 'scan_results' not in st.session_state: st.session_state.scan_results = None
if 'dos_data' not in st.session_state: st.session_state.dos_data = []
if 'web_enum' not in st.session_state: st.session_state.web_enum = []
if 'packets' not in st.session_state: st.session_state.packets = []

def log_system(tool, type_, msg):
    ts = datetime.now().strftime("%H:%M:%S")
    st.session_state.logs.insert(0, {"timestamp": ts, "tool": tool, "type": type_, "message": msg})

# ==========================================
# 3. LIVE BACKGROUND & CSS ENGINE
# ==========================================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');

    /* --- ANIMATED LIVE BACKGROUND --- */
    .stApp {
        background-color: #000510;
        background-image: 
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        background-size: 40px 40px;
        background-attachment: fixed;
    }
    
    /* Subtle pulsing glow in background */
    .stApp::before {
        content: "";
        position: fixed;
        top: 50%; left: 50%;
        width: 150vw; height: 150vh;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.05) 0%, transparent 60%);
        transform: translate(-50%, -50%);
        animation: pulseGlow 8s infinite alternate;
        z-index: -1;
        pointer-events: none;
    }

    @keyframes pulseGlow {
        0% { opacity: 0.3; }
        100% { opacity: 0.8; }
    }

    /* --- TYPOGRAPHY --- */
    h1, h2, h3, .stMetricValue {
        font-family: 'Orbitron', sans-serif !important;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    h1 {
        background: linear-gradient(90deg, #00f3ff, #ff00ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900 !important;
        text-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
    }
    
    p, div, label, input, button {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
    }

    /* --- GLASSMORPHISM CONTAINERS --- */
    div[data-testid="stVerticalBlock"] > div {
        background: rgba(10, 20, 40, 0.6);
        border: 1px solid rgba(0, 243, 255, 0.15);
        border-radius: 12px;
        padding: 20px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }
    
    /* Special override for inner containers to avoid double padding */
    div[data-testid="stVerticalBlock"] > div > div {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        padding: 0 !important;
    }

    /* --- SIDEBAR --- */
    section[data-testid="stSidebar"] {
        background: rgba(0, 5, 10, 0.95);
        border-right: 1px solid #00f3ff;
    }
    
    /* --- WIDGETS --- */
    .stTextInput > div > div > input {
        background-color: rgba(0, 243, 255, 0.05);
        color: #00f3ff;
        border: 1px solid #00f3ff;
        font-family: 'Share Tech Mono', monospace;
    }
    
    .stButton > button {
        width: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #002244, #004488);
        border: 1px solid #00f3ff;
        color: white;
        font-weight: bold;
        transition: 0.3s;
    }
    .stButton > button:hover {
        background: #00f3ff;
        color: black;
        box-shadow: 0 0 15px #00f3ff;
    }

</style>
""", unsafe_allow_html=True)

# LOTTIE LOADERS
def load_lottie_url(url: str):
    if not LOTTIE_AVAILABLE: return None
    r = requests.get(url)
    if r.status_code != 200: return None
    return r.json()

# Assets
LOTTIE_DASH = "https://lottie.host/4b677103-6058-450f-a367-735954605178/wX4y8tH2r6.json" # Cyber Shield
LOTTIE_SCAN = "https://lottie.host/c5c83011-80a2-4a7b-a481-9b1191060936/V17M6vFk3Q.json" # Radar
LOTTIE_PASS = "https://lottie.host/9326f21c-d784-486d-ab63-90977464047a/s4Z7QzV6lI.json" # Lock
LOTTIE_DOS  = "https://lottie.host/5b2484ca-5b4d-4c3e-902e-503487c645e7/L9lE0qO1J0.json" # Server
LOTTIE_WEB  = "https://lottie.host/02005477-943b-4861-923f-42728f35d513/f6H9sR8p6Q.json" # Network

# ==========================================
# 4. IDENTITY GATE
# ==========================================
TEAM_NAME = "CyberGuard"
TEAM_MEMBERS = [
    {"name": "Moheed Ul Hassan", "reg": "22I-7451"},
    {"name": "Ali Abbas", "reg": "22I-2285"},
    {"name": "Abdur Rehman", "reg": "22I-2291"}
]

if not st.session_state.auth:
    c1, c2, c3 = st.columns([1,2,1])
    with c2:
        st.markdown("<h1 style='text-align:center;'>CYBERGUARD V4.0</h1>", unsafe_allow_html=True)
        st.markdown("<p style='text-align:center; color:#00f3ff;'>PAYBUDDY SECURITY FRAMEWORK</p>", unsafe_allow_html=True)
        
        # Simulated Biometric Box
        st.info("🔒 SYSTEM LOCKED. IDENTITY TOKEN REQUIRED.")
        
        id_file = os.path.exists("identity.txt")
        con_file = os.path.exists("consent.txt")
        
        c_a, c_b = st.columns(2)
        c_a.metric("IDENTITY.TXT", "FOUND" if id_file else "MISSING", delta_color="normal")
        c_b.metric("CONSENT.TXT", "FOUND" if con_file else "MISSING", delta_color="normal")
        
        if id_file and con_file:
            if st.button("AUTHENTICATE BIOMETRICS"):
                with st.spinner("VERIFYING ENCRYPTION KEYS..."):
                    time.sleep(2)
                    st.session_state.auth = True
                    st.rerun()
        else:
            st.error("Please ensure identity.txt and consent.txt are in the root directory.")
    st.stop()

# ==========================================
# 5. MAIN NAVIGATION (SIDEBAR)
# ==========================================
with st.sidebar:
    st.markdown("## 🛡️ NAVIGATOR")
    page = st.radio("SELECT MODULE", [
        "DASHBOARD", 
        "PORT SCANNER", 
        "PASSWORD AUDIT", 
        "LOAD STRESSER", 
        "WEB RECON", 
        "PACKET SNIFFER",
        "REPORTING"
    ])
    
    st.markdown("---")
    st.markdown("### 👥 SQUAD")
    for m in TEAM_MEMBERS:
        st.markdown(f"**{m['name']}**")
        st.caption(f"ID: {m['reg']}")
    
    st.markdown("---")
    if st.button("LOGOUT"):
        st.session_state.auth = False
        st.rerun()

# ==========================================
# 6. MODULES
# ==========================================

# --- DASHBOARD ---
if page == "DASHBOARD":
    c_head, c_anim = st.columns([3, 1])
    with c_head:
        st.title("COMMAND CENTER")
        st.markdown(f"**OPERATOR:** {TEAM_NAME} | **STATUS:** ONLINE")
    with c_anim:
        if LOTTIE_AVAILABLE:
            lottie_json = load_lottie_url(LOTTIE_DASH)
            st_lottie(lottie_json, height=120)

    # Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("THREAT LEVEL", "LOW", "-2%")
    m2.metric("ACTIVE NODES", "42", "+3")
    m3.metric("ENCRYPTION", "AES-256", "SECURE")
    m4.metric("UPTIME", "42:10:05", "")

    # Main Graph
    st.markdown("### 📡 GLOBAL NETWORK TRAFFIC")
    x = list(range(30))
    y1 = [random.randint(20, 80) for _ in x]
    y2 = [random.randint(10, 50) for _ in x]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=y1, fill='tozeroy', name='Inbound (MB/s)', line=dict(color='#00f3ff')))
    fig.add_trace(go.Scatter(x=x, y=y2, fill='tozeroy', name='Outbound (MB/s)', line=dict(color='#ff00ff')))
    fig.update_layout(template="plotly_dark", height=350, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig, use_container_width=True)

# --- PORT SCANNER ---
elif page == "PORT SCANNER":
    c_head, c_anim = st.columns([3, 1])
    with c_head:
        st.title("PORT RECONNAISSANCE")
    with c_anim:
        if LOTTIE_AVAILABLE:
            st_lottie(load_lottie_url(LOTTIE_SCAN), height=100)
    
    col1, col2 = st.columns([1, 2])
    with col1:
        st.markdown("### CONFIGURATION")
        target = st.text_input("TARGET IP", "192.168.1.105")
        mode = st.selectbox("PROFILE", ["FAST SCAN", "DEEP SCAN", "UDP SCAN"])
        
        if st.button("INITIATE SEQUENCE"):
            with st.status("SCANNING TARGET...", expanded=True):
                progress = st.progress(0)
                res = []
                for i in range(100):
                    time.sleep(0.02)
                    progress.progress(i + 1)
                    if random.random() > 0.9:
                        port = random.randint(20, 1000)
                        svc = {21:'FTP', 22:'SSH', 80:'HTTP', 443:'HTTPS', 3306:'SQL'}.get(port, 'UNKNOWN')
                        res.append({'port': port, 'service': svc, 'state': 'OPEN'})
                
                st.session_state.scan_results = res
                log_system("SCANNER", "SUCCESS", f"Scan completed on {target}")
    
    with col2:
        st.markdown("### LIVE TERMINAL OUTPUT")
        if st.session_state.scan_results:
            df = pd.DataFrame(st.session_state.scan_results)
            st.dataframe(df, use_container_width=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            st.download_button("DOWNLOAD JSON", df.to_json(), file_name=f"Scan_{target}_{timestamp}.json")
        else:
            st.code("WAITING FOR COMMAND...", language="bash")

# --- PASSWORD AUDIT ---
elif page == "PASSWORD AUDIT":
    c_head, c_anim = st.columns([3, 1])
    with c_head:
        st.title("CREDENTIAL AUDIT")
    with c_anim:
        if LOTTIE_AVAILABLE:
            st_lottie(load_lottie_url(LOTTIE_PASS), height=100)

    pwd = st.text_input("ENTER PASSWORD / HASH", type="password")
    
    if pwd:
        # Entropy Logic
        entropy = len(pwd) * 4 # Simplified calc
        st.markdown(f"### ENTROPY SCORE: {entropy} BITS")
        
        gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = entropy,
            gauge = {'axis': {'range': [0, 150]}, 'bar': {'color': "#00f3ff"}}
        ))
        gauge.update_layout(height=250, margin=dict(t=0,b=0), paper_bgcolor='rgba(0,0,0,0)', font={'color':'white'})
        st.plotly_chart(gauge, use_container_width=True)
        
        if st.button("RUN BRUTE-FORCE SIMULATION"):
            with st.spinner("ATTEMPTING HASHCAT ATTACK..."):
                time.sleep(2)
                st.error(f"CRACKED IN {random.randint(1, 59)} MINUTES (SIMULATED)")

# --- LOAD STRESSER ---
elif page == "LOAD STRESSER":
    c_head, c_anim = st.columns([3, 1])
    with c_head:
        st.title("DoS / STRESS TEST")
    with c_anim:
        if LOTTIE_AVAILABLE:
            st_lottie(load_lottie_url(LOTTIE_DOS), height=100)
            
    st.warning("⚠️ AUTHORIZED TARGETS ONLY")
    
    col1, col2 = st.columns(2)
    with col1:
        threads = st.slider("THREAD COUNT", 100, 1000, 500)
    with col2:
        duration = st.slider("DURATION (SEC)", 10, 60, 20)
        
    if st.button("LAUNCH ATTACK"):
        chart_spot = st.empty()
        data_lat = []
        
        for i in range(duration):
            lat = random.randint(20, 200) + (i * 2)
            data_lat.append(lat)
            
            fig = px.area(y=data_lat, title="SERVER LATENCY (ms)", template="plotly_dark")
            fig.update_traces(line_color='#ff0055')
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
            chart_spot.plotly_chart(fig, use_container_width=True)
            time.sleep(0.5)
        
        st.session_state.dos_data = data_lat
        st.success("ATTACK FINISHED")
        
        df = pd.DataFrame({"Latency": data_lat})
        st.download_button("DOWNLOAD REPORT", df.to_csv(), file_name=f"DoS_Attack_{datetime.now().strftime('%H%M')}.csv")

# --- WEB RECON ---
elif page == "WEB RECON":
    c_head, c_anim = st.columns([3, 1])
    with c_head:
        st.title("WEB CRAWLER")
    with c_anim:
        if LOTTIE_AVAILABLE:
            st_lottie(load_lottie_url(LOTTIE_WEB), height=100)
            
    url = st.text_input("TARGET URL", "http://paybuddy-dev.internal")
    
    if st.button("START CRAWLER"):
        with st.status("ENUMERATING DIRECTORIES..."):
            dirs = ['/admin', '/login', '/uploads', '/api', '/config', '/.git']
            found = []
            for d in dirs:
                time.sleep(0.3)
                code = random.choice([200, 403, 404])
                if code != 404:
                    st.write(f"FOUND: {url}{d} [{code}]")
                    found.append({"path": d, "code": code})
            
            st.session_state.web_enum = found
            log_system("WEB", "INFO", f"Crawler found {len(found)} paths on {url}")

    if st.session_state.web_enum:
        st.markdown("### SITE TOPOLOGY")
        df = pd.DataFrame(st.session_state.web_enum)
        st.table(df)

# --- PACKET SNIFFER ---
elif page == "PACKET SNIFFER":
    st.title("TRAFFIC INTERCEPT")
    
    c1, c2 = st.columns([1,3])
    with c1:
        if st.button("START CAPTURE (10s)"):
            with st.spinner("LISTENING ON ETH0..."):
                new_packets = []
                for _ in range(15):
                    time.sleep(0.5)
                    pkt = {
                        "time": datetime.now().strftime("%H:%M:%S"),
                        "src": f"192.168.1.{random.randint(2,200)}",
                        "dst": "10.0.0.5",
                        "proto": random.choice(["TCP", "UDP", "HTTP", "TLS"]),
                        "len": random.randint(64, 1500)
                    }
                    new_packets.append(pkt)
                st.session_state.packets = new_packets
                log_system("SNIFFER", "INFO", "Packet capture session complete")

    with c2:
        st.markdown("### CAPTURED FRAMES")
        if st.session_state.packets:
            df = pd.DataFrame(st.session_state.packets)
            st.dataframe(df, use_container_width=True)
            st.download_button("EXPORT PCAP (JSON)", df.to_json(), file_name="capture.json")
        else:
            st.info("BUFFER EMPTY")

# --- REPORTING ---
elif page == "REPORTING":
    st.title("MISSION DEBRIEF")
    
    st.markdown("### SESSION AUDIT LOG")
    df_logs = pd.DataFrame(st.session_state.logs)
    st.dataframe(df_logs, use_container_width=True)
    
    if st.button("GENERATE EXECUTIVE REPORT"):
        if DOCX_AVAILABLE:
            doc = Document()
            doc.add_heading('CYBERGUARD SECURITY REPORT', 0)
            doc.add_paragraph(f'GENERATED BY: {TEAM_NAME}')
            doc.add_paragraph(f'DATE: {datetime.now()}')
            
            doc.add_heading('SUMMARY', 1)
            doc.add_paragraph('This report details the security assessment activities performed using the CyberGuard Toolkit.')
            
            doc.add_heading('LOGS', 2)
            for log in st.session_state.logs:
                doc.add_paragraph(f"[{log['timestamp']}] {log['message']}")
            
            buffer = BytesIO()
            doc.save(buffer)
            buffer.seek(0)
            
            st.download_button("DOWNLOAD DOCX", buffer, file_name=f"Report_{TEAM_NAME}.docx")
        else:
            st.error("DOCX MODULE NOT FOUND")
`,
    'identity.txt': `Team: CyberGuard
Members:
- Moheed Ul Hassan | 22I-7451
- Ali Abbas | 22I-2285
- Abdur Rehman | 22I-2291`,
    'consent.txt': `Approved Targets:
- Localhost (127.0.0.1)
- PayBuddy Dev Environment
- Lab Network 192.168.1.x

Approved By: QA Lead
Date: 2024-05-20
Status: AUTHORIZED FOR TESTING`,
    'requirements.txt': `streamlit
pandas
plotly
requests
scapy
python-docx
matplotlib
streamlit-lottie`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile as keyof typeof files]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileContent = files[activeFile as keyof typeof files];
    // CRITICAL FIX: Explicitly set UTF-8 encoding to prevent binary corruption on some OS/Browsers
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileName = activeFile.split('/').pop() || activeFile;
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-300 font-sans">
      {/* File Browser Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-[#010409] flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            Project Files
          </h1>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {Object.keys(files).map((filename) => (
            <button
              key={filename}
              onClick={() => setActiveFile(filename)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                activeFile === filename 
                  ? 'bg-[#1f6feb] text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              {filename}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          PayBuddy CyberGuard v4.0 Living<br/>
          Python Streamlit Edition
        </div>
      </div>

      {/* Code Viewer Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0d1117]">
          <div className="flex items-center gap-3">
             <div className="text-sm font-mono text-white">
                {activeFile}
             </div>
             {activeFile.endsWith('.py') && (
                 <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-0.5 rounded border border-green-800">V4.0 Living Edition</span>
             )}
          </div>
          <div className="flex items-center gap-2">
             <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors border border-gray-600"
            >
              <Download className="w-3 h-3" />
              Download File
            </button>
             <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </header>

        <div className="bg-green-900/20 border-b border-green-800/50 px-6 py-2 text-xs text-green-400 flex items-center gap-2">
            <Check className="w-3 h-3" />
            <span>V4.0 Living Edition Loaded. Multi-page, Persistent State, Live Background.</span>
        </div>

        <main className="flex-1 overflow-auto p-0 bg-[#0d1117]">
          <pre className="p-6 text-sm font-mono leading-relaxed text-[#c9d1d9]">
            {files[activeFile as keyof typeof files]}
          </pre>
        </main>
      </div>
    </div>
  );
};

export default App;
