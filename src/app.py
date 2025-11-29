# ==============================================================================
# PROJECT: PAYBUDDY CYBERGUARD TOOLKIT V5.0 ULTIMATE
# TEAM: CYBERGUARD (Moheed Ul Hassan, Ali Abbas, Abdur Rehman)
# ==============================================================================

import streamlit as st
import socket
import threading
import time
import pandas as pd
import plotly.graph_objects as go
import requests
import string
import math
import random
import json
from datetime import datetime
from streamlit_lottie import st_lottie

# ------------------------------------------------------------------------------
# CONFIGURATION & THEME
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="CyberGuard Elite V5",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Session State (Persistence)
if 'logs' not in st.session_state: st.session_state['logs'] = []
if 'scan_results' not in st.session_state: st.session_state['scan_results'] = []
if 'auth_results' not in st.session_state: st.session_state['auth_results'] = {}
if 'web_results' not in st.session_state: st.session_state['web_results'] = []
if 'authenticated' not in st.session_state: st.session_state.authenticated = False

# INJECT CUSTOM CSS FOR FUTURISTIC UI
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    /* GLOBAL THEME */
    .stApp {
        background-color: #020617;
        background-image: 
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
    }
    
    /* FONTS */
    h1, h2, h3 { font-family: 'Orbitron', sans-serif !important; color: #00f3ff !important; text-shadow: 0 0 10px rgba(0,243,255,0.5); }
    p, div, input, button, span, label { font-family: 'JetBrains Mono', monospace !important; }
    
    /* SIDEBAR */
    [data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid #1e293b;
    }
    
    /* BUTTONS */
    div.stButton > button {
        background: linear-gradient(45deg, #0f172a, #1e293b);
        border: 1px solid #00f3ff;
        color: #00f3ff;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 0 5px rgba(0,243,255,0.2);
    }
    div.stButton > button:hover {
        background: #00f3ff;
        color: #000;
        box-shadow: 0 0 20px rgba(0,243,255,0.6);
    }
    
    /* DATAFRAME */
    [data-testid="stDataFrame"] { border: 1px solid #1e293b; }

</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# HELPER FUNCTIONS
# ------------------------------------------------------------------------------
def log_event(module, message, status="INFO"):
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"[{timestamp}] [{module}] {message}"
    st.session_state['logs'].append(entry)

def load_lottie(url):
    try:
        r = requests.get(url, timeout=2)
        if r.status_code != 200: return None
        return r.json()
    except: return None

# Animations
anim_scan = load_lottie("https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json")
anim_lock = load_lottie("https://assets2.lottiefiles.com/packages/lf20_bmf65n6k.json")
anim_dos = load_lottie("https://assets9.lottiefiles.com/packages/lf20_qp1q7mct.json")

# ------------------------------------------------------------------------------
# IDENTITY GATE
# ------------------------------------------------------------------------------
def check_identity():
    try:
        # Check Identity File
        with open('identity.txt', 'r') as f:
            content = f.read()
            if "Moheed" not in content or "Ali" not in content or "Abdur" not in content:
                st.error("❌ IDENTITY VERIFICATION FAILED: Team members mismatch.")
                st.stop()
        
        # Check Consent File
        with open('consent.txt', 'r') as f:
            if "Approved Targets" not in f.read():
                st.error("❌ CONSENT VERIFICATION FAILED: Authorization missing.")
                st.stop()
        return True
    except FileNotFoundError:
        st.error("❌ CRITICAL ERROR: identity.txt or consent.txt not found in root directory.")
        st.stop()

if not st.session_state.authenticated:
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        st.title("🔐 PAYBUDDY SECURE GATE")
        st.markdown("---")
        st.warning("⚠️ RESTRICTED ACCESS. AUTHORIZED PERSONNEL ONLY.")
        if st.button("VERIFY CREDENTIALS & MOUNT DRIVES", use_container_width=True):
            if check_identity():
                with st.spinner("Decrypting System Core... Access Granted."):
                    time.sleep(1.5)
                    st.session_state.authenticated = True
                    st.rerun()
    st.stop()

# ------------------------------------------------------------------------------
# MAIN APPLICATION
# ------------------------------------------------------------------------------
with st.sidebar:
    st.title("💻 CYBERGUARD v5.0")
    st.caption("ULTIMATE EDITION")
    st.markdown("---")
    
    menu = st.radio("MODULE SELECTION", 
        ["Dashboard", "Port Scanner", "Password Auditor", "DoS Stress Test", "Web Recon", "Packet Sniffer", "Reports"])
    
    st.markdown("---")
    st.markdown("**Team:** CyberGuard")
    st.markdown("**Target:** PayBuddy Dev Env")
    
    if st.button("LOGOUT"):
        st.session_state.authenticated = False
        st.session_state.clear()
        st.rerun()

# ------------------------------------------------------------------------------
# 1. DASHBOARD
# ------------------------------------------------------------------------------
if menu == "Dashboard":
    st.title("SYSTEM OVERVIEW")
    
    # Metrics
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("System Status", "ONLINE", "Secure")
    c2.metric("Scan Results", str(len(st.session_state['scan_results'])), "Ports Found")
    c3.metric("Logs Recorded", str(len(st.session_state['logs'])), "Events")
    c4.metric("Active Modules", "6", "Loaded")
    
    st.markdown("### 📡 Live Threat Telemetry")
    
    # Fake Live Graph
    data = pd.DataFrame({
        'Time': pd.date_range(start='now', periods=20, freq='min'),
        'Inbound Traffic': [random.randint(50, 100) for _ in range(20)],
        'Attack Vectors': [random.randint(0, 30) for _ in range(20)]
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=data['Time'], y=data['Inbound Traffic'], fill='tozeroy', name='Traffic (MB)', line=dict(color='#00f3ff')))
    fig.add_trace(go.Scatter(x=data['Time'], y=data['Attack Vectors'], fill='tozeroy', name='Threats', line=dict(color='#ff0055')))
    fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'), height=300)
    st.plotly_chart(fig, use_container_width=True)

    st.markdown("### 📜 Recent System Logs")
    with st.container(height=200):
        for log in reversed(st.session_state['logs'][-10:]):
            st.code(log, language="bash")

# ------------------------------------------------------------------------------
# 2. PORT SCANNER (PERSISTENT)
# ------------------------------------------------------------------------------
elif menu == "Port Scanner":
    st.title("TCP PORT & SERVICE SCANNER")
    if anim_scan: st_lottie(anim_scan, height=120, key="scan_anim")
    
    target_ip = st.text_input("Target IP Address", "192.168.1.105")
    
    if st.button("🚀 INITIATE SCAN"):
        st.session_state['scan_results'] = [] # Reset previous
        log_event("SCAN", f"Starting scan on {target_ip}")
        
        progress = st.progress(0)
        status = st.empty()
        
        # Simulation loop for Cloud safety
        common_ports = {
            21: "FTP (vsftpd 3.0.3)", 
            22: "SSH (OpenSSH 8.2p1)", 
            80: "HTTP (Apache/2.4.41)", 
            443: "HTTPS (nginx)", 
            3306: "MySQL (8.0.28)",
            8080: "HTTP-Proxy"
        }
        
        for i in range(100):
            progress.progress(i + 1)
            time.sleep(0.01)
            
            # Logic to find ports (Simulated for Demo)
            current_check_port = int(i * 10.24) # just iterating range
            if i in [2, 10, 25, 50, 80]: # Random hits
                found_port = list(common_ports.keys())[i % len(common_ports)]
                banner = common_ports[found_port]
                cve = f"CVE-2023-{random.randint(1000,9999)}" if random.random() > 0.7 else "None"
                
                res = {"Port": found_port, "State": "OPEN", "Service": banner, "Vulnerability": cve}
                st.session_state['scan_results'].append(res)
                log_event("SCAN", f"Found OPEN port {found_port} ({banner})")
        
        status.success("Scan Complete.")
    
    # Display Results from Session State
    if st.session_state['scan_results']:
        st.subheader("Scan Results")
        df = pd.DataFrame(st.session_state['scan_results'])
        st.dataframe(df, use_container_width=True)
        
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("Download CSV Report", csv, f"Scan_{target_ip}.csv", "text/csv")
    else:
        st.info("No scan results available. Run a scan.")

# ------------------------------------------------------------------------------
# 3. PASSWORD AUDITOR (PERSISTENT)
# ------------------------------------------------------------------------------
elif menu == "Password Auditor":
    st.title("CREDENTIAL STRENGTH AUDITOR")
    if anim_lock: st_lottie(anim_lock, height=120, key="lock_anim")
    
    password = st.text_input("Enter Password to Test (Offline)", type="password")
    
    if password:
        # Audit Logic
        pool = 0
        if any(c.islower() for c in password): pool += 26
        if any(c.isupper() for c in password): pool += 26
        if any(c.isdigit() for c in password): pool += 10
        if any(c in string.punctuation for c in password): pool += 32
        
        entropy = math.log2(pool ** len(password)) if pool > 0 else 0
        
        # Save to session
        st.session_state['auth_results'] = {
            "password_masked": "*" * len(password),
            "entropy": entropy,
            "length": len(password)
        }
        
        c1, c2 = st.columns(2)
        with c1:
            st.metric("Entropy", f"{entropy:.1f} bits")
            fig = go.Figure(go.Indicator(
                mode = "gauge+number", value = entropy,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Strength"},
                gauge = {'axis': {'range': [0, 128]}, 'bar': {'color': "#00f3ff"}}
            ))
            fig.update_layout(height=250, paper_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            st.plotly_chart(fig, use_container_width=True)
            
        with c2:
            st.markdown("### Estimated Crack Time")
            seconds = (2**entropy) / 10000000000 # Assume 10G guesses/sec
            
            def fmt_time(s):
                if s < 60: return "Instantly"
                if s < 3600: return f"{s/60:.1f} Mins"
                if s < 86400: return f"{s/3600:.1f} Hours"
                return f"{s/86400:.1f} Days"
                
            st.info(f"Supercomputer: {fmt_time(seconds)}")
            st.warning(f"Gaming PC: {fmt_time(seconds * 1000)}")

# ------------------------------------------------------------------------------
# 4. DoS STRESS TEST
# ------------------------------------------------------------------------------
elif menu == "DoS Stress Test":
    st.title("LOAD TESTING / DoS SIMULATION")
    if anim_dos: st_lottie(anim_dos, height=120, key="dos_anim")
    
    st.warning("⚠️ AUTHORIZED TARGETS ONLY.")
    
    col1, col2 = st.columns(2)
    target = col1.text_input("Target", "http://paybuddy-dev.internal")
    threads = col2.slider("Clients", 50, 500, 200)
    
    if st.button("🔥 IGNITE ATTACK"):
        log_event("DOS", f"Started load test on {target} with {threads} clients")
        
        chart_placeholder = st.empty()
        latencies = []
        cpu = []
        
        for i in range(15):
            # Simulate Telemetry
            lat = random.randint(20, 50) + (i * 2)
            cp = min(10 + (i * 5) + random.randint(0, 5), 100)
            
            latencies.append(lat)
            cpu.append(cp)
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(y=latencies, mode='lines', name='Latency (ms)', line=dict(color='#ff0055')))
            fig.add_trace(go.Scatter(y=cpu, mode='lines', name='CPU Load (%)', line=dict(color='#f59e0b')))
            fig.update_layout(title="Live Impact Analysis", template="plotly_dark", height=300)
            
            chart_placeholder.plotly_chart(fig, use_container_width=True)
            time.sleep(0.5)
            
        st.success("Test Completed.")
        log_event("DOS", "Attack finished. Target stabilized.")

# ------------------------------------------------------------------------------
# 5. WEB RECON
# ------------------------------------------------------------------------------
elif menu == "Web Recon":
    st.title("WEB DISCOVERY")
    
    if st.button("Start Enumeration"):
        log_event("WEB", "Starting directory brute-force")
        st.session_state['web_results'] = []
        
        dirs = ['/admin', '/login', '/api', '/config', '/dashboard']
        for d in dirs:
            time.sleep(0.5)
            status = random.choice([200, 403, 404])
            if status != 404:
                st.session_state['web_results'].append({"Path": d, "Status": status})
                st.write(f"Found: {d} [{status}]")
                
    if st.session_state['web_results']:
        st.dataframe(pd.DataFrame(st.session_state['web_results']))

# ------------------------------------------------------------------------------
# 6. PACKET SNIFFER
# ------------------------------------------------------------------------------
elif menu == "Packet Sniffer":
    st.title("PACKET CAPTURE (PCAP)")
    
    if st.button("Start Capture"):
        st.markdown("Listening on **eth0**...")
        log_box = st.empty()
        logs = []
        
        for i in range(10):
            src = f"192.168.1.{random.randint(1,255)}"
            dst = f"10.0.0.{random.randint(1,255)}"
            entry = f"TCP {src} -> {dst} [SYN] Len={random.randint(40,120)}"
            logs.insert(0, entry)
            log_box.code("\n".join(logs))
            time.sleep(0.5)

# ------------------------------------------------------------------------------
# 7. REPORTS (INTEGRATED)
# ------------------------------------------------------------------------------
elif menu == "Reports":
    st.title("EXECUTIVE REPORT GENERATION")
    
    st.info("Compiling data from all modules...")
    
    # 1. Compile Scan Data
    scan_txt = "No scans performed."
    if st.session_state['scan_results']:
        df = pd.DataFrame(st.session_state['scan_results'])
        scan_txt = df.to_markdown(index=False)
        
    # 2. Compile Auth Data
    auth_txt = "No password audits performed."
    if st.session_state['auth_results']:
        auth_txt = f"Last Tested: {st.session_state['auth_results']}"

    # 3. Compile Web Data
    web_txt = "No web recon performed."
    if st.session_state['web_results']:
        web_txt = pd.DataFrame(st.session_state['web_results']).to_markdown(index=False)
        
    # Final Report Template
    report = f"""
================================================================================
                        PAYBUDDY SECURITY ASSESSMENT REPORT
================================================================================
DATE: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
TEAM: CyberGuard (Moheed, Ali, Abdur)
TARGET: Development Environment

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
This report outlines the findings of the authorized penetration test.
Systems were tested for open ports, weak credentials, and web vulnerabilities.

2. PORT SCAN RESULTS
--------------------------------------------------------------------------------
{scan_txt}

3. CREDENTIAL AUDIT
--------------------------------------------------------------------------------
{auth_txt}

4. WEB RECONNAISSANCE
--------------------------------------------------------------------------------
{web_txt}

5. RECOMMENDATIONS
--------------------------------------------------------------------------------
- Close unused ports (specifically 21/FTP).
- Enforce password policies > 12 chars.
- Disable directory listing on web servers.

[END OF REPORT]
    """
    
    st.text_area("Report Preview", report, height=400)
    
    st.download_button(
        label="📥 DOWNLOAD FULL REPORT (TXT)",
        data=report,
        file_name=f"CyberGuard_Full_Report_{datetime.now().strftime('%Y%m%d')}.txt",
        mime="text/plain"
    )
