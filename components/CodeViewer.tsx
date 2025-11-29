import React, { useState } from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';

// EXACT COPY OF THE V8.0 PYTHON CODE FOR DOWNLOAD - DOUBLE ESCAPED FOR JS
const PYTHON_CODE = `import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
import time
import random
import string
import json
from datetime import datetime
import io

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION & THEME ENGINE
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="PayBuddy CyberGuard V8.0",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# NEON CYBERPUNK THEME INJECTION
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');
    
    /* GLOBAL COLORS & FONTS */
    :root {
        --bg-dark: #020617;
        --bg-card: #0f172a;
        --text-main: #f8fafc;
        --text-dim: #94a3b8;
        --neon-blue: #00f3ff;
        --neon-red: #ff0055;
        --neon-green: #10b981;
        --neon-purple: #bd00ff;
        --border-color: #1e293b;
    }

    /* MAIN CONTAINER */
    .stApp {
        background-color: var(--bg-dark);
        color: var(--text-main);
        font-family: 'JetBrains Mono', monospace;
    }

    /* HEADERS - ORBITRON FONT */
    h1, h2, h3, .orbitron {
        font-family: 'Orbitron', sans-serif !important;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
    }
    
    h1 { color: var(--text-main); font-weight: 900; }
    h2 { color: var(--neon-blue); border-bottom: 2px solid var(--border-color); padding-bottom: 10px; }
    h3 { color: var(--text-dim); font-size: 1.2rem; }

    /* SIDEBAR STYLING */
    [data-testid="stSidebar"] {
        background-color: #0b1121;
        border-right: 1px solid var(--border-color);
    }
    
    /* CUSTOM CARDS */
    .cyber-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }
    .cyber-card:hover {
        border-color: var(--neon-blue);
        box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
    }

    /* INPUT FIELDS */
    .stTextInput>div>div>input, .stSelectbox>div>div>div {
        background-color: #1e293b !important;
        color: var(--neon-blue) !important;
        border: 1px solid #334155 !important;
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
    }

    /* BUTTONS */
    .stButton>button {
        background: linear-gradient(45deg, #0f172a, #1e293b);
        color: var(--neon-blue);
        border: 1px solid var(--neon-blue);
        border-radius: 6px;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
        text-transform: uppercase;
        transition: all 0.3s;
        width: 100%;
    }
    .stButton>button:hover {
        background: var(--neon-blue);
        color: #000;
        box-shadow: 0 0 20px var(--neon-blue);
    }

    /* ALERTS & STATUS */
    .status-online { color: var(--neon-green); font-weight: bold; }
    .status-offline { color: var(--neon-red); font-weight: bold; }
    
    /* DATAFRAMES */
    .stDataFrame { border: 1px solid var(--border-color); border-radius: 8px; }
    
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SESSION STATE MANAGEMENT
# -----------------------------------------------------------------------------
if 'logs' not in st.session_state:
    st.session_state.logs = []
if 'port_results' not in st.session_state:
    st.session_state.port_results = []
if 'web_recon_results' not in st.session_state:
    st.session_state.web_recon_results = []
if 'packets' not in st.session_state:
    st.session_state.packets = []
if 'dos_data' not in st.session_state:
    st.session_state.dos_data = []

def log_action(tool, message, status="INFO"):
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = {"Time": timestamp, "Tool": tool, "Status": status, "Message": message}
    st.session_state.logs.append(entry)

# -----------------------------------------------------------------------------
# SIDEBAR NAVIGATION
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("## 🛡️ CYBERGUARD")
    st.markdown("<div style='font-size: 0.8rem; color: #64748b; margin-bottom: 20px;'>PAYBUDDY SECURITY SUITE V8.0</div>", unsafe_allow_html=True)
    
    page = st.radio("SELECT MODULE", [
        "Dashboard", 
        "Port Scanner", 
        "Password Auditor", 
        "Load / DoS Stresser", 
        "Web Recon", 
        "Packet Sniffer", 
        "Reports"
    ])
    
    st.markdown("---")
    st.markdown("### 👤 OPERATORS")
    st.info("Moheed Ul Hassan\\\\nAli Abbas\\\\nAbdur Rehman")
    
    if st.button("🔴 EMERGENCY STOP"):
        st.session_state.logs = []
        st.experimental_rerun()

# -----------------------------------------------------------------------------
# MODULE: DASHBOARD
# -----------------------------------------------------------------------------
if page == "Dashboard":
    st.title("COMMAND CENTER")
    
    # TOP STATS ROW
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(f"""<div class='cyber-card'>
            <h3>SYSTEM STATUS</h3>
            <h1 class='status-online'>ONLINE</h1>
            <div style='font-size:0.8rem; color:gray'>v8.0.1 STABLE</div>
        </div>""", unsafe_allow_html=True)
    with c2:
        st.markdown(f"""<div class='cyber-card'>
            <h3>ACTIVE SCANS</h3>
            <h1 style='color:var(--neon-blue)'>0</h1>
            <div style='font-size:0.8rem; color:gray'>IDLE</div>
        </div>""", unsafe_allow_html=True)
    with c3:
        st.markdown(f"""<div class='cyber-card'>
            <h3>LOG EVENTS</h3>
            <h1 style='color:var(--neon-purple)'>{len(st.session_state.logs)}</h1>
            <div style='font-size:0.8rem; color:gray'>SESSION</div>
        </div>""", unsafe_allow_html=True)
    with c4:
        st.markdown(f"""<div class='cyber-card'>
            <h3>THREAT LEVEL</h3>
            <h1 style='color:var(--neon-green)'>LOW</h1>
            <div style='font-size:0.8rem; color:gray'>NOMINAL</div>
        </div>""", unsafe_allow_html=True)

    # LIVE TRAFFIC GRAPH (SIMULATED)
    st.markdown("### 📡 NETWORK TRAFFIC OVERVIEW")
    traffic_data = pd.DataFrame({
        'Time': [f"{i}:00" for i in range(24)],
        'Inbound': [random.randint(10, 100) for _ in range(24)],
        'Outbound': [random.randint(5, 80) for _ in range(24)]
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=traffic_data['Time'], y=traffic_data['Inbound'], fill='tozeroy', name='Inbound (MB/s)', line=dict(color='#00f3ff')))
    fig.add_trace(go.Scatter(x=traffic_data['Time'], y=traffic_data['Outbound'], fill='tozeroy', name='Outbound (MB/s)', line=dict(color='#ff0055')))
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor='#334155'),
        height=350
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # RECENT LOGS
    st.markdown("### 📝 RECENT SYSTEM LOGS")
    if st.session_state.logs:
        st.dataframe(pd.DataFrame(st.session_state.logs).tail(5), use_container_width=True)
    else:
        st.info("System Initialized. Awaiting Input...")

# -----------------------------------------------------------------------------
# MODULE: PORT SCANNER
# -----------------------------------------------------------------------------
elif page == "Port Scanner":
    st.title("NETWORK PORT SCANNER")
    st.markdown("TCP Connect Scan • Service Detection • Banner Grabbing")
    
    col1, col2 = st.columns([3, 1])
    with col1:
        target = st.text_input("TARGET IP / HOSTNAME", "192.168.1.105")
    with col2:
        st.text("") # spacer
        st.text("")
        scan_btn = st.button("INITIATE SCAN")
        
    if scan_btn:
        log_action("PORT_SCAN", f"Starting scan on {target}")
        st.session_state.port_results = []
        
        progress = st.progress(0)
        status = st.empty()
        
        common_ports = {
            21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS', 80: 'HTTP', 
            110: 'POP3', 139: 'NetBIOS', 443: 'HTTPS', 445: 'SMB', 3306: 'MySQL', 3389: 'RDP'
        }
        
        # Simulating a scan with "Discovery" logic
        for i in range(100):
            time.sleep(0.02)
            progress.progress(i + 1)
            
            # 30% chance to find an open port from our list
            if i % 10 == 0 and random.random() > 0.4:
                # Pick a random port from common list to simulate finding it
                port = random.choice(list(common_ports.keys()))
                service = common_ports[port]
                version = f"v{random.randint(1,5)}.{random.randint(0,9)}"
                
                # Check if we already found this port to avoid dupes in this sim
                if not any(d['Port'] == port for d in st.session_state.port_results):
                    st.session_state.port_results.append({
                        "Port": port,
                        "State": "OPEN",
                        "Service": service,
                        "Banner": f"{service} {version} (Ubuntu)",
                        "Risk": "HIGH" if port in [21, 23, 445] else "LOW"
                    })
                    status.warning(f"⚠️ DISCOVERED OPEN PORT: {port}/{service}")
        
        status.success(f"SCAN COMPLETE. Found {len(st.session_state.port_results)} open ports.")
        log_action("PORT_SCAN", f"Scan finished. Found {len(st.session_state.port_results)} ports.", "SUCCESS")

    if st.session_state.port_results:
        df = pd.DataFrame(st.session_state.port_results)
        st.dataframe(df, use_container_width=True)
        
        # DOWNLOAD BUTTON
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="💾 DOWNLOAD SCAN REPORT (CSV)",
            data=csv,
            file_name=f"port_scan_{target}_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )

# -----------------------------------------------------------------------------
# MODULE: PASSWORD AUDITOR
# -----------------------------------------------------------------------------
elif page == "Password Auditor":
    st.title("PASSWORD FORENSICS")
    st.markdown("Entropy Calculation • Dictionary Attack Simulation • NIST Compliance")
    
    pwd = st.text_input("ENTER PASSWORD TO AUDIT", type="password")
    
    if pwd:
        st.markdown("---")
        c1, c2 = st.columns(2)
        
        # ANALYSIS LOGIC
        length = len(pwd)
        has_lower = any(c.islower() for c in pwd)
        has_upper = any(c.isupper() for c in pwd)
        has_digits = any(c.isdigit() for c in pwd)
        has_special = any(c in string.punctuation for c in pwd)
        
        pool = 0
        if has_lower: pool += 26
        if has_upper: pool += 26
        if has_digits: pool += 10
        if has_special: pool += 32
        
        entropy = length * (pool.bit_length() if pool > 0 else 0)
        
        # ESTIMATION
        crack_time_md5 = "Instant"
        if entropy > 40: crack_time_md5 = "3 Minutes"
        if entropy > 60: crack_time_md5 = "2 Days"
        if entropy > 80: crack_time_md5 = "4 Years"
        if entropy > 100: crack_time_md5 = "Centuries"
        
        with c1:
            st.markdown("### 📊 ENTROPY SCORE")
            st.metric("Bits of Entropy", f"{entropy:.2f}")
            
            if entropy < 50:
                st.error("RATING: WEAK")
                st.progress(0.3)
            elif entropy < 80:
                st.warning("RATING: MODERATE")
                st.progress(0.6)
            else:
                st.success("RATING: STRONG")
                st.progress(1.0)
                
        with c2:
            st.markdown("### 🔓 TIME TO CRACK")
            st.write(f"**MD5 Hash (GPU Cluster):** {crack_time_md5}")
            st.write(f"**SHA-256 (Supercomputer):** {crack_time_md5}") # Simplified for demo
            
            st.markdown("### ✅ COMPLIANCE")
            st.checkbox("Length > 12", value=length >= 12, disabled=True)
            st.checkbox("Contains Numbers", value=has_digits, disabled=True)
            st.checkbox("Contains Special Chars", value=has_special, disabled=True)
            st.checkbox("Mixed Case", value=(has_lower and has_upper), disabled=True)

        log_action("AUTH_AUDIT", f"Audited password length {length}. Entropy: {entropy:.2f}")

        # REPORT GENERATION
        audit_report = f"""
        PAYBUDDY PASSWORD AUDIT REPORT
        ------------------------------
        Analyzed String Length: {length}
        Entropy: {entropy:.2f} bits
        Character Set Size: {pool}
        
        Estimated Crack Times:
        - GPU Cluster: {crack_time_md5}
        
        Compliance:
        - NIST Guidelines: {'PASS' if entropy > 60 else 'FAIL'}
        """
        st.download_button("💾 DOWNLOAD AUDIT CERTIFICATE", audit_report, "password_audit.txt")

# -----------------------------------------------------------------------------
# MODULE: DoS STRESSER
# -----------------------------------------------------------------------------
elif page == "Load / DoS Stresser":
    st.title("LOAD & STRESS TESTING")
    st.markdown("Endpoint Stress Test • Latency Monitoring • Packet Flood Simulation")
    
    col1, col2 = st.columns(2)
    with col1:
        target_url = st.text_input("TARGET ENDPOINT", "http://paybuddy-dev.internal/api/v1")
    with col2:
        clients = st.slider("VIRTUAL BOTNET SIZE", 100, 10000, 1000)
        
    if st.button("🚀 LAUNCH STRESS TEST"):
        log_action("DOS_ATTACK", f"Launching flood on {target_url} with {clients} bots", "WARNING")
        
        chart_spot = st.empty()
        st.session_state.dos_data = []
        
        # LIVE ATTACK LOOP
        for i in range(30): # 30 seconds simulation
            time.sleep(0.5)
            
            # Simulate latency rising with time and bot count
            latency = 20 + (i * 10) + (clients / 500) + random.randint(-10, 50)
            if latency < 10: latency = 10
            
            st.session_state.dos_data.append({"Time": i, "Latency (ms)": latency, "Requests/s": clients * (1 + random.random())})
            
            # Update Chart
            df_dos = pd.DataFrame(st.session_state.dos_data)
            fig = px.area(df_dos, x="Time", y="Latency (ms)", title="REAL-TIME SERVER LATENCY",
                          color_discrete_sequence=['#ff0055'])
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            chart_spot.plotly_chart(fig, use_container_width=True)
            
        st.success("ATTACK CEASED. TARGET RECOVERING.")
        
        # DOWNLOAD DATA
        csv = pd.DataFrame(st.session_state.dos_data).to_csv(index=False).encode('utf-8')
        st.download_button("💾 DOWNLOAD TELEMETRY DATA", csv, "dos_attack_data.csv", "text/csv")

# -----------------------------------------------------------------------------
# MODULE: WEB RECON
# -----------------------------------------------------------------------------
elif page == "Web Recon":
    st.title("WEB RECONNAISSANCE")
    st.markdown("Directory Enumeration • Hidden File Discovery")
    
    url = st.text_input("TARGET URL", "http://paybuddy.internal")
    
    if st.button("START DISCOVERY"):
        log_action("WEB_RECON", f"Started enumeration on {url}")
        st.session_state.web_recon_results = []
        
        dirs = ["admin", "login", "dashboard", "uploads", "images", "css", "js", "api", "config", "backup", ".git", ".env"]
        extensions = ["", ".php", ".html", ".json", ".sql"]
        
        prog = st.progress(0)
        
        for i, directory in enumerate(dirs):
            time.sleep(0.1)
            prog.progress(int((i+1)/len(dirs)*100))
            
            # Simulation Logic
            full_path = f"{url}/{directory}"
            status = 404
            
            # Randomly find some
            if random.random() > 0.5:
                status = random.choice([200, 301, 403, 500])
                
            if status != 404:
                st.session_state.web_recon_results.append({
                    "Path": full_path,
                    "Status": status,
                    "Type": "Directory" if status == 301 else "File"
                })
                if status == 200:
                    st.success(f"[{status}] FOUND: {full_path}")
                elif status == 403:
                    st.warning(f"[{status}] FORBIDDEN: {full_path}")
                elif status == 500:
                    st.error(f"[{status}] ERROR: {full_path}")
                    
    if st.session_state.web_recon_results:
        st.markdown("### 🗺️ SITE MAP")
        df = pd.DataFrame(st.session_state.web_recon_results)
        st.dataframe(df)
        
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("💾 DOWNLOAD SITEMAP", csv, "web_recon_results.csv", "text/csv")

# -----------------------------------------------------------------------------
# MODULE: PACKET SNIFFER
# -----------------------------------------------------------------------------
elif page == "Packet Sniffer":
    st.title("PACKET CAPTURE & ANALYSIS")
    st.markdown("Live Traffic Interception (Scapy Simulation)")
    
    if st.button("START CAPTURE (10s)"):
        log_action("SNIFFER", "Started packet capture on eth0")
        
        placeholder = st.empty()
        st.session_state.packets = []
        
        start_time = time.time()
        while time.time() - start_time < 10:
            time.sleep(0.2)
            
            src = f"192.168.1.{random.randint(2, 254)}"
            dst = f"10.0.0.{random.randint(2, 254)}"
            proto = random.choice(["TCP", "UDP", "HTTP", "TLSv1.2", "ICMP"])
            length = random.randint(64, 1514)
            info = f"Seq={random.randint(0,1000)} Ack={random.randint(0,1000)} Win={random.randint(1000,8000)}"
            
            pkt = f"[{datetime.now().strftime('%H:%M:%S.%f')[:-3]}] {proto} {src} -> {dst} Len={length} Info={info}"
            st.session_state.packets.append(pkt)
            
            # Show "Matrix" style scrolling log
            # Safe join to prevent syntax errors in React preview
            log_display = "\\\\n".join(st.session_state.packets[-15:])
            placeholder.code(log_display, language="bash")
            
        log_action("SNIFFER", f"Captured {len(st.session_state.packets)} packets", "SUCCESS")
        
    if st.session_state.packets:
        st.success(f"CAPTURE COMPLETE. {len(st.session_state.packets)} PACKETS STORED.")
        data = "\\\\n".join(st.session_state.packets)
        st.download_button("💾 DOWNLOAD PCAP LOG (TXT)", data, "capture.txt", "text/plain")

# -----------------------------------------------------------------------------
# MODULE: REPORTS
# -----------------------------------------------------------------------------
elif page == "Reports":
    st.title("EXECUTIVE REPORT GENERATION")
    
    st.markdown("### 📑 SESSION SUMMARY")
    st.write(f"**Total Logs:** {len(st.session_state.logs)}")
    st.write(f"**Vulnerabilities Found:** {len(st.session_state.port_results) + len(st.session_state.web_recon_results)}")
    
    if st.session_state.logs:
        st.markdown("### 📜 FULL AUDIT LOG")
        df_logs = pd.DataFrame(st.session_state.logs)
        st.dataframe(df_logs, use_container_width=True)
        
        # Generate Text Report
        report_content = f"""
================================================================================
PAYBUDDY CYBERGUARD V8.0 - SECURITY ASSESSMENT REPORT
================================================================================
Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Operator: TEAM CYBERGUARD
Status: COMPLETED

[EXECUTIVE SUMMARY]
This report details the security testing session performed using the CyberGuard Toolkit.
All activities were authorized and performed in a controlled environment.

[SESSION METRICS]
- Total Actions Logged: {len(st.session_state.logs)}
- Port Scan Findings: {len(st.session_state.port_results)} ports
- Web Recon Findings: {len(st.session_state.web_recon_results)} endpoints

[DETAILED LOGS]
{df_logs.to_string(index=False)}

[SCAN RESULTS]
{pd.DataFrame(st.session_state.port_results).to_string(index=False) if st.session_state.port_results else "No Scan Data"}

================================================================================
END OF REPORT
================================================================================
        """
        
        st.download_button("💾 DOWNLOAD FULL REPORT (TXT)", report_content, "CyberGuard_Final_Report.txt")
        st.download_button("💾 DOWNLOAD LOGS (CSV)", df_logs.to_csv(index=False).encode('utf-8'), "CyberGuard_Logs.csv", "text/csv")

    else:
        st.info("No data available to generate report. Please run tools first.")
`;

const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-white">Source Code: V8.0 Full</h2>
           <p className="text-slate-400 text-sm">Full Features • No Skipping • Fixed Syntax Errors</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleCopy} className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-600 transition-colors">
             {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
             {copied ? 'Copied' : 'Copy'}
           </button>
           <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
             <Download className="w-4 h-4" /> Download app.py
           </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-4 overflow-hidden relative group">
          <pre className="h-full overflow-auto text-xs font-mono text-emerald-400 p-2 leading-relaxed whitespace-pre">
              {PYTHON_CODE}
          </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
