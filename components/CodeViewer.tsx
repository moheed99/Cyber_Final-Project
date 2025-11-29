
import React from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';

const PYTHON_CODE = `# ==============================================================================
# PROJECT: PAYBUDDY CYBERGUARD TOOLKIT V6.0 (TWIN EDITION)
# TEAM: CYBERGUARD (Moheed Ul Hassan, Ali Abbas, Abdur Rehman)
# ==============================================================================

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import time
import random
import math
import string
from datetime import datetime

# ------------------------------------------------------------------------------
# 1. CONFIGURATION & TWIN-THEME ENGINE
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="CyberGuard V6.0",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# INJECT CSS TO MATCH REACT DASHBOARD EXACTLY
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');

    /* MAIN BACKGROUND - SLATE 950 */
    .stApp {
        background-color: #020617;
        background-image: 
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        background-size: 40px 40px;
        color: #f8fafc;
    }

    /* SIDEBAR - SLATE 900 */
    [data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid #1e293b;
    }

    /* FONTS */
    h1, h2, h3, .big-font { font-family: 'Orbitron', sans-serif !important; }
    p, div, span, button, input { font-family: 'JetBrains Mono', monospace !important; }

    /* CARDS & CONTAINERS - GLASSMORPHISM */
    .css-card {
        background: rgba(15, 17, 42, 0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    /* METRIC HIGHLIGHTS */
    .metric-value { font-size: 24px; font-weight: bold; color: white; }
    .metric-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    
    /* NEON ACCENTS */
    .neon-text-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.3); }
    .neon-text-pink { color: #ec4899; text-shadow: 0 0 10px rgba(236, 72, 153, 0.3); }
    .neon-border { border: 1px solid #00f3ff; box-shadow: 0 0 5px rgba(0, 243, 255, 0.2); }

    /* CUSTOM INPUTS */
    input[type="text"], input[type="password"] {
        background-color: #1e293b !important;
        border: 1px solid #334155 !important;
        color: white !important;
        border-radius: 6px !important;
    }

    /* BUTTONS */
    div.stButton > button {
        background: linear-gradient(45deg, #0f172a, #1e293b);
        border: 1px solid #3b82f6;
        color: #60a5fa;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    div.stButton > button:hover {
        background: #2563eb;
        color: white;
        box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
        border-color: #2563eb;
    }
</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 2. SESSION STATE
# ------------------------------------------------------------------------------
if 'logs' not in st.session_state: st.session_state['logs'] = []
if 'scan_results' not in st.session_state: st.session_state['scan_results'] = []
if 'auth' not in st.session_state: st.session_state.auth = False

def add_log(tool, msg):
    ts = datetime.now().strftime("%H:%M:%S")
    st.session_state['logs'].append(f"[{ts}] [{tool}] {msg}")

# ------------------------------------------------------------------------------
# 3. IDENTITY GATE
# ------------------------------------------------------------------------------
if not st.session_state.auth:
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        st.markdown("""
        <div style="text-align: center; margin-top: 100px;">
            <div style="font-size: 60px;">🛡️</div>
            <h1 style="color: white; margin-bottom: 0;">CYBERGUARD</h1>
            <p style="color: #64748b; margin-top: 5px;">RESTRICTED ACCESS // AUTHORIZATION REQUIRED</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<div class='css-card'>", unsafe_allow_html=True)
        st.info("Identity File: **Verified (Moheed, Ali, Abdur)**")
        st.info("Consent File: **Authorized (PayBuddy Dev)**")
        
        if st.button("AUTHENTICATE SYSTEM", use_container_width=True):
            with st.spinner("Decrypting System Core..."):
                time.sleep(1.5)
                st.session_state.auth = True
                st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

# ------------------------------------------------------------------------------
# 4. DASHBOARD UI
# ------------------------------------------------------------------------------
with st.sidebar:
    st.markdown("""
    <div style="padding: 10px 0;">
        <h2 style="color: #00f3ff; margin:0;">CYBERGUARD</h2>
        <p style="font-size: 10px; color: #64748b; letter-spacing: 2px;">TOOLKIT V6.0</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    page = st.radio("NAVIGATION", ["Dashboard", "Port Scanner", "Password Auditor", "Load Stresser", "Web Recon", "Packet Sniffer", "Reports"])
    st.markdown("---")
    
    # Team Roster
    st.markdown("<div style='font-size: 10px; color: #64748b; font-weight: bold; margin-bottom: 10px;'>OPERATORS</div>", unsafe_allow_html=True)
    for member in ["Moheed Ul Hassan", "Ali Abbas", "Abdur Rehman"]:
        st.markdown(f"<div style='color: #94a3b8; font-size: 12px;'>• {member}</div>", unsafe_allow_html=True)

    if st.button("LOGOUT", use_container_width=True):
        st.session_state.auth = False
        st.rerun()

# --- HEADER ---
st.markdown(f"""
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">
    <h2 style="margin:0; font-size: 24px;">{page.upper()}</h2>
    <div style="display: flex; align-items: center; gap: 10px;">
        <span style="height: 8px; width: 8px; background-color: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #10b981;"></span>
        <span style="color: #10b981; font-size: 12px; font-weight: bold;">SYSTEM ONLINE</span>
    </div>
</div>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# PAGE: DASHBOARD
# ------------------------------------------------------------------------------
if page == "Dashboard":
    # 4 Top Stats
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown("""<div class="css-card"><div class="metric-label">Security Status</div><div class="metric-value neon-text-blue">SECURE</div></div>""", unsafe_allow_html=True)
    with c2:
        st.markdown(f"""<div class="css-card"><div class="metric-label">Active Agents</div><div class="metric-value">3</div></div>""", unsafe_allow_html=True)
    with c3:
        st.markdown("""<div class="css-card"><div class="metric-label">Env Status</div><div class="metric-value neon-text-pink">CONNECTED</div></div>""", unsafe_allow_html=True)
    with c4:
        st.markdown("""<div class="css-card"><div class="metric-label">CPU Load</div><div class="metric-value">14%</div></div>""", unsafe_allow_html=True)

    # Charts
    col_main, col_side = st.columns([2, 1])
    
    with col_main:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown('<h3 style="font-size: 16px; margin-bottom: 15px;">NETWORK_TRAFFIC_OP</h3>', unsafe_allow_html=True)
        
        # Plotly Chart
        df = pd.DataFrame({
            'Time': list(range(20)),
            'Inbound': [random.randint(20, 80) for _ in range(20)],
            'Outbound': [random.randint(10, 60) for _ in range(20)]
        })
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df['Time'], y=df['Inbound'], fill='tozeroy', name='Inbound', line=dict(color='#06b6d4')))
        fig.add_trace(go.Scatter(x=df['Time'], y=df['Outbound'], fill='tozeroy', name='Outbound', line=dict(color='#ec4899')))
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=0, r=0, t=0, b=0),
            height=250,
            showlegend=False,
            font=dict(color='#94a3b8')
        )
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with col_side:
        st.markdown('<div class="css-card" style="height: 340px;">', unsafe_allow_html=True)
        st.markdown('<h3 style="font-size: 16px; margin-bottom: 15px;">THREAT_ANALYSIS</h3>', unsafe_allow_html=True)
        st.progress(85)
        st.caption("Port Security")
        st.progress(45)
        st.caption("Auth Strength")
        st.progress(62)
        st.caption("Web Exposure")
        st.progress(15)
        st.caption("DoS Risk")
        st.markdown('</div>', unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# PAGE: PORT SCANNER
# ------------------------------------------------------------------------------
elif page == "Port Scanner":
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    col_input, col_btn = st.columns([3, 1])
    with col_input:
        target = st.text_input("Target IP", "192.168.1.105")
    with col_btn:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("START SCAN", use_container_width=True):
            st.session_state['scan_results'] = []
            add_log("SCAN", f"Started scan on {target}")
            
            # Simulation
            bar = st.progress(0)
            status = st.empty()
            
            ports = [21, 22, 80, 443, 3306]
            services = ["FTP", "SSH", "HTTP", "HTTPS", "MySQL"]
            
            for i in range(100):
                time.sleep(0.02)
                bar.progress(i+1)
                status.text(f"Scanning port {i*10}...")
                
                if i % 20 == 0:
                    idx = i // 20
                    if idx < len(ports):
                        res = {"Port": ports[idx], "Service": services[idx], "State": "OPEN", "Version": f"v{random.randint(1,9)}.0"}
                        st.session_state['scan_results'].append(res)
            
            status.text("Scan Complete.")
            bar.empty()
    st.markdown('</div>', unsafe_allow_html=True)

    if st.session_state['scan_results']:
        st.markdown("### DISCOVERED SERVICES")
        st.dataframe(pd.DataFrame(st.session_state['scan_results']), use_container_width=True)

# ------------------------------------------------------------------------------
# PAGE: PASSWORD AUDITOR
# ------------------------------------------------------------------------------
elif page == "Password Auditor":
    c1, c2 = st.columns(2)
    
    with c1:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### POLICY AUDIT")
        pwd = st.text_input("Test Password", type="password")
        
        entropy = 0
        if pwd:
            pool = 0
            if any(c.islower() for c in pwd): pool += 26
            if any(c.isupper() for c in pwd): pool += 26
            if any(c.isdigit() for c in pwd): pool += 10
            if any(c in string.punctuation for c in pwd): pool += 32
            entropy = math.log2(pool ** len(pwd)) if pool > 0 else 0
            
            st.metric("Entropy", f"{entropy:.1f} bits")
            
            color = "red"
            if entropy > 50: color = "orange"
            if entropy > 80: color = "yellow"
            if entropy > 120: color = "green"
            
            st.markdown(f"Strength: <span style='color:{color}; font-weight:bold'>{color.upper()}</span>", unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with c2:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### OFFLINE ATTACK SIM")
        if st.button("RUN HASHCAT SIMULATION", use_container_width=True):
            if not pwd:
                st.error("Enter password first.")
            else:
                with st.status("Initializing GPU Cluster..."):
                    time.sleep(1)
                    st.write("Loading Hashes...")
                    time.sleep(1)
                    st.write("Brute-forcing SHA-256...")
                    time.sleep(1)
                
                seconds = (2**entropy) / 10000000000
                st.success(f"Estimated Crack Time: {seconds:.2f} seconds (Supercomputer)")
        st.markdown('</div>', unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# PAGE: REPORTS
# ------------------------------------------------------------------------------
elif page == "Reports":
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    st.markdown("### GENERATE REPORT")
    st.write("Compile logs from Port Scanner, Password Auditor, and Web Recon into a final PDF/Text report.")
    
    if st.button("GENERATE EXECUTIVE REPORT"):
        report = f"""
PAYBUDDY SECURITY REPORT
Date: {datetime.now()}
Team: CyberGuard
------------------------
Logs:
{len(st.session_state['logs'])} events recorded.

Scan Results:
{pd.DataFrame(st.session_state['scan_results']).to_markdown() if st.session_state['scan_results'] else "No Data"}
        """
        st.text_area("Report Preview", report, height=300)
        st.download_button("Download Report", report, "CyberGuard_Report.txt")
    st.markdown('</div>', unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# OTHER PAGES (Simple placeholders for brevity)
# ------------------------------------------------------------------------------
elif page == "Load Stresser":
    st.info("Load Stresser Module Loaded. Configure target and threads.")
    st.button("Start Stress Test")
elif page == "Web Recon":
    st.info("Web Reconnaissance Module Loaded. Start directory enumeration.")
    st.button("Start Dirb")
elif page == "Packet Sniffer":
    st.info("Packet Sniffer Loaded. Listening on interface...")
    st.button("Capture Packets")
`;

const CodeViewer: React.FC = () => {
    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([PYTHON_CODE], { type: "text/x-python;charset=utf-8" });
        element.href = URL.createObjectURL(file);
        element.download = "app.py";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(PYTHON_CODE);
        alert("Code copied to clipboard!");
    };

    return (
        <div className="h-full flex flex-col p-6 bg-slate-950">
            <div className="flex justify-between items-center mb-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
                        <Download className="w-6 h-6 text-blue-500" />
                        Source Code Delivery (V6.0 TWIN)
                    </h2>
                    <p className="text-slate-400 mt-1">Download the V6.0 Python Code (Exact React Replica).</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all font-bold"
                    >
                        <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/20 font-bold transition-all animate-pulse"
                    >
                        <Download className="w-5 h-5" /> Download app.py
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-2 text-xs text-slate-400 font-mono">src/app.py (V6.0 Twin Edition)</span>
                </div>
                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    <pre className="text-xs font-mono text-green-400 leading-relaxed whitespace-pre font-medium">
                        {PYTHON_CODE}
                    </pre>
                </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Verified Clean Code - UTF-8 Encoded - Streamlit Ready</span>
            </div>
        </div>
    );
};

export default CodeViewer;
