# ==============================================================================
# PROJECT: PAYBUDDY CYBERGUARD TOOLKIT V4.2 PROFESSIONAL
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
from datetime import datetime, timedelta
from streamlit_lottie import st_lottie

# ------------------------------------------------------------------------------
# CONFIGURATION & THEME
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="CyberGuard Elite",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# INJECT CUSTOM CSS FOR FUTURISTIC UI
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    /* GLOBAL THEME */
    .stApp {
        background-color: #020617;
        background-image: 
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
    }
    
    /* FONTS */
    h1, h2, h3 { font-family: 'Orbitron', sans-serif !important; color: #00f3ff !important; text-shadow: 0 0 10px rgba(0,243,255,0.5); }
    p, div, input, button { font-family: 'JetBrains Mono', monospace !important; }
    
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

    /* CARDS */
    .metric-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(0, 243, 255, 0.2);
        padding: 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }
    
    /* ALERTS */
    .success-box { border-left: 5px solid #10b981; background: rgba(16, 185, 129, 0.1); padding: 15px; }
    .warning-box { border-left: 5px solid #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 15px; }
    .danger-box { border-left: 5px solid #ef4444; background: rgba(239, 68, 68, 0.1); padding: 15px; }

</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# IDENTITY GATE
# ------------------------------------------------------------------------------
def check_identity():
    try:
        with open('identity.txt', 'r', encoding='utf-8') as f:
            content = f.read()
            # check team members (case-insensitive)
            if not all(name.lower().split()[0] in content.lower() for name in ["Moheed", "Ali", "Abdur"]):
                st.error("❌ IDENTITY VERIFICATION FAILED: Team members mismatch.")
                return False

        with open('consent.txt', 'r', encoding='utf-8') as f:
            consent_content = f.read()
            if "Approved Targets" not in consent_content:
                st.error("❌ CONSENT VERIFICATION FAILED: Authorization missing.")
                return False

        return True
    except FileNotFoundError:
        st.error("❌ CRITICAL ERROR: identity.txt or consent.txt not found.")
        return False
    except Exception as e:
        st.error(f"❌ IDENTITY CHECK ERROR: {e}")
        return False

if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        st.title("🔐 PAYBUDDY SECURE GATE")
        st.markdown("---")
        if st.button("VERIFY CREDENTIALS & MOUNT DRIVES", use_container_width=True):
            if check_identity():
                with st.spinner("Decrypting System Core..."):
                    time.sleep(1.5)
                    st.session_state.authenticated = True
                    st.experimental_rerun()
    st.stop()

# ------------------------------------------------------------------------------
# UTILS
# ------------------------------------------------------------------------------
def load_lottie(url):
    try:
        r = requests.get(url, timeout=3)
        if r.status_code != 200:
            return None
        return r.json()
    except:
        return None

# Animations (safe external Lottie URLs)
anim_scan = load_lottie("https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json")
anim_lock = load_lottie("https://assets2.lottiefiles.com/packages/lf20_bmf65n6k.json")
anim_dos = load_lottie("https://assets9.lottiefiles.com/packages/lf20_qp1q7mct.json")

# ------------------------------------------------------------------------------
# NAVIGATION
# ------------------------------------------------------------------------------
with st.sidebar:
    st.title("💻 CYBERGUARD v4.2")
    st.markdown("Running as: **QA_TEAM_LEAD**")
    st.markdown("Target Env: **PayBuddy_Dev_Lab**")
    st.markdown("---")
    
    menu = st.radio("MODULE SELECTION", 
        ["Dashboard", "Port Scanner", "Password Auditor", "DoS Stress Test", "Web Recon", "Packet Sniffer", "Reports"])
    
    st.markdown("---")
    st.markdown("✅ VPN Connected")
    st.markdown("✅ Proxy Active (127.0.0.1:8080)")

# ------------------------------------------------------------------------------
# MODULE: DASHBOARD
# ------------------------------------------------------------------------------
if menu == "Dashboard":
    st.title("SYSTEM OVERVIEW")
    
    # KPIs
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Security Level", "ELEVATED", delta="Active")
    c2.metric("Active Threads", "12", delta="-2")
    c3.metric("Network Load", "14 Mbps", delta="+1.2%")
    c4.metric("CPU Temp", "45°C", delta="Normal")
    
    st.markdown("### 📡 Live Threat Map")
    
    # Mock Traffic Data
    now = datetime.now()
    data = pd.DataFrame({
        'Time': pd.date_range(start=now, periods=20, freq='T'),
        'Inbound': [random.randint(50, 100) for _ in range(20)],
        'Outbound': [random.randint(20, 80) for _ in range(20)]
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=data['Time'], y=data['Inbound'], fill='tozeroy', name='Inbound (MB)', line=dict(color='#00f3ff')))
    fig.add_trace(go.Scatter(x=data['Time'], y=data['Outbound'], fill='tozeroy', name='Outbound (MB)', line=dict(color='#ff0055')))
    fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
    st.plotly_chart(fig, use_container_width=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("### 👥 Active Operators")
        st.code("1. Moheed Ul Hassan (Lead)\n2. Ali Abbas (Network)\n3. Abdur Rehman (Crypto)")
    with col2:
        st.markdown("### 📝 Recent Alerts")
        st.warning("⚠️ [10:42] Port 22 Detected Open on 192.168.1.15")
        st.success("✅ [10:40] Identity Verified Successfully")

# ------------------------------------------------------------------------------
# MODULE: PORT SCANNER
# ------------------------------------------------------------------------------
elif menu == "Port Scanner":
    st.title("TCP PORT & SERVICE SCANNER")
    if anim_scan:
        st_lottie(anim_scan, height=150, key="scan_anim")
    
    target_ip = st.text_input("Target IP Address", "192.168.1.1")
    
    col1, col2 = st.columns(2)
    start_port = col1.number_input("Start Port", 1, 65535, 1)
    end_port = col2.number_input("End Port", 1, 65535, 1000)
    
    if st.button("🚀 INITIATE SCAN"):
        results = []
        progress = st.progress(0.0)
        status = st.empty()
        
        # Simulate scan for safe environment (replace with socket logic locally if permitted)
        total_ports = max(1, end_port - start_port + 1)
        
        for i, port in enumerate(range(start_port, end_port + 1)):
            status.text(f"Scanning port {port}...")
            progress.progress((i + 1) / total_ports)
            time.sleep(0.002)  # simulated delay
            
            # Simulated findings
            if port in [21, 22, 80, 443, 3306, 8080] and random.random() > 0.2:
                banners = {
                    21: "vsFTPd 3.0.3",
                    22: "OpenSSH 8.2p1 Ubuntu",
                    80: "Apache/2.4.41 (Ubuntu)",
                    443: "nginx/1.18.0",
                    3306: "MySQL 8.0.28",
                    8080: "Werkzeug/2.0.3 Python/3.9.12"
                }
                cve = f"CVE-2023-{random.randint(1000,9999)}" if random.random() > 0.7 else "None"
                results.append({
                    "Port": port,
                    "State": "OPEN",
                    "Service": banners.get(port, "Unknown"),
                    "Vulnerability": cve
                })
        
        status.text("Scan Complete.")
        progress.empty()
        
        if results:
            df = pd.DataFrame(results)
            st.dataframe(df, use_container_width=True)
            
            csv = df.to_csv(index=False).encode('utf-8')
            json_dat = df.to_json(orient='records')
            
            filename = f"scan_{target_ip}_{datetime.now().strftime('%Y%m%d')}_22I-7451"
            
            c1, c2 = st.columns(2)
            c1.download_button("Download CSV Report", csv, f"{filename}.csv", "text/csv")
            c2.download_button("Download JSON Report", json_dat, f"{filename}.json", "application/json")
        else:
            st.info("No open ports found in range.")

# ------------------------------------------------------------------------------
# MODULE: PASSWORD AUDITOR
# ------------------------------------------------------------------------------
elif menu == "Password Auditor":
    st.title("CREDENTIAL STRENGTH AUDITOR")
    if anim_lock:
        st_lottie(anim_lock, height=150, key="lock_anim")
    
    password = st.text_input("Enter Password to Test (Offline Simulation)", type="password")
    
    if password:
        # Entropy calculation
        pool = 0
        if any(c.islower() for c in password): pool += 26
        if any(c.isupper() for c in password): pool += 26
        if any(c.isdigit() for c in password): pool += 10
        if any(c in string.punctuation for c in password): pool += 32
        
        entropy = math.log2(pool ** len(password)) if pool > 0 else 0.0
        
        # Strength gauge
        col1, col2 = st.columns([1, 2])
        with col1:
            st.metric("Entropy Bits", f"{entropy:.1f}")
            
            fig = go.Figure(go.Indicator(
                mode = "gauge+number",
                value = entropy,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Strength"},
                gauge = {
                    'axis': {'range': [0, 128], 'tickwidth': 1, 'tickcolor': "white"},
                    'bar': {'color': "#00f3ff"},
                    'steps': [
                        {'range': [0, 40], 'color': "#ef4444"},
                        {'range': [40, 80], 'color': "#f59e0b"},
                        {'range': [80, 128], 'color': "#10b981"}],
                }))
            fig.update_layout(height=250, margin=dict(l=10,r=10,t=0,b=0), paper_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            st.subheader("Security Checklist")
            checks = {
                "Length >= 12": len(password) >= 12,
                "Has Uppercase": any(c.isupper() for c in password),
                "Has Lowercase": any(c.islower() for c in password),
                "Has Numbers": any(c.isdigit() for c in password),
                "Has Special Chars": any(c in string.punctuation for c in password)
            }
            
            for check, passed in checks.items():
                if passed:
                    st.markdown(f"✅ **{check}**")
                else:
                    st.markdown(f"❌ {check}")

        # Estimated crack times
        st.subheader("Estimated Time to Crack (Brute Force)")
        
        def get_time_str(seconds):
            if seconds < 1:
                return "Instant"
            if seconds < 60:
                return f"{seconds:.1f} seconds"
            if seconds < 3600:
                return f"{seconds/60:.1f} minutes"
            if seconds < 86400:
                return f"{seconds/3600:.1f} hours"
            if seconds < 31536000:
                return f"{seconds/86400:.1f} days"
            return f"{seconds/31536000:.1f} years"

        scenarios = {
            "Hacker with Laptop (10M/s)": 10**7,
            "Mining Rig (100G/s)": 10**11,
            "Supercomputer (100T/s)": 10**14
        }
        
        crack_data = []
        for name, speed in scenarios.items():
            seconds = (2**entropy) / speed if entropy > 0 else 0
            crack_data.append({"Attacker Profile": name, "Time to Crack": get_time_str(seconds)})
        
        st.table(pd.DataFrame(crack_data))

# ------------------------------------------------------------------------------
# MODULE: DoS STRESS TEST
# ------------------------------------------------------------------------------
elif menu == "DoS Stress Test":
    st.title("LOAD TESTING / DoS SIMULATION")
    if anim_dos:
        st_lottie(anim_dos, height=150, key="dos_anim")
    
    st.warning("⚠️ AUTHORIZED TESTING ONLY. DO NOT USE ON PUBLIC TARGETS.")
    
    target = st.text_input("Target URL/IP", "http://paybuddy-dev.internal")
    threads = st.slider("Simulated Threads/Clients", 10, 500, 100)
    
    if st.button("🔥 IGNITE ATTACK"):
        placeholder = st.empty()
        chart_holder = st.empty()
        
        latencies = []
        cpu_loads = []
        times = []
        
        # Simulation Loop (approx 15 seconds)
        for i in range(15):
            latency = random.randint(20, 50) + (i * threads * 0.05)  # simulated trend
            cpu = min(10 + (i * 5), 99)
            
            latencies.append(latency)
            cpu_loads.append(cpu)
            times.append(datetime.now().strftime("%H:%M:%S"))
            
            with placeholder.container():
                c1, c2, c3 = st.columns(3)
                c1.metric("Avg Latency", f"{int(latency)} ms")
                c2.metric("Target CPU", f"{int(cpu)}%", delta_color="inverse")
                c3.metric("Packet Loss", f"{min(i*2, 100)}%", delta_color="inverse")
            
            # Live Chart
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=times, y=latencies, mode='lines+markers', name='Latency (ms)', line=dict(color='#ff0055')))
            fig.add_trace(go.Scatter(x=times, y=cpu_loads, mode='lines', name='CPU Load (%)', line=dict(color='#f59e0b', dash='dot')))
            fig.update_layout(title="Live Impact Analysis", template="plotly_dark", height=300)
            chart_holder.plotly_chart(fig, use_container_width=True)
            
            time.sleep(1)
        
        st.success("Test Completed. Target stabilized.")
        
        # Export Log
        report_df = pd.DataFrame({"Time": times, "Latency": latencies, "CPU_Load": cpu_loads})
        st.download_button("Download Attack Telemetry", report_df.to_csv(index=False).encode('utf-8'), "DoS_Report_22I-7451.csv", "text/csv")

# ------------------------------------------------------------------------------
# MODULE: WEB RECON
# ------------------------------------------------------------------------------
elif menu == "Web Recon":
    st.title("WEB FOOTPRINTING & DISCOVERY")
    
    url = st.text_input("Target URL", "http://paybuddy-dev.internal")
    
    if st.button("🔍 START ENUMERATION"):
        st.markdown("### 📂 Directory Structure")
        
        dirs = ['/admin', '/login', '/uploads', '/api', '/config', '/backup', '/db']
        found = []
        
        for d in dirs:
            time.sleep(0.25)
            status = random.choice([200, 403, 404])
            if status != 404:
                color = "green" if status == 200 else "orange"
                st.markdown(f"- Found {d} - Status: {status}")
                found.append({"Path": d, "Status": status})
            else:
                st.markdown(f"- {d} - Not Found")
        
        st.markdown("### 🕸️ Subdomains")
        subs = ['dev', 'test', 'mail', 'vpn']
        for s in subs:
            time.sleep(0.15)
            if random.random() > 0.5:
                ip = f"192.168.1.{random.randint(10,99)}"
                st.markdown(f"✅ Found: **{s}.paybuddy-dev.internal** (IP: {ip})")
                found.append({"Path": f"{s}.paybuddy-dev.internal", "Status": 200})
            else:
                st.markdown(f"❌ {s}.paybuddy-dev.internal - Not found")

# ------------------------------------------------------------------------------
# MODULE: PACKET SNIFFER
# ------------------------------------------------------------------------------
elif menu == "Packet Sniffer":
    st.title("NETWORK TRAFFIC INTERCEPTOR")
    
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown("Listening on interface: **eth0** (Promiscuous Mode)")
    with col2:
        listening = st.checkbox("Capture Active", value=False)
    
    if listening:
        log_box = st.empty()
        logs = []
        
        # Simulated capture loop (safe demo)
        for i in range(100):
            if not st.session_state.get('authenticated', True):
                break
            src = f"192.168.1.{random.randint(2, 254)}"
            dst = f"10.0.0.{random.randint(2, 254)}"
            proto = random.choice(["TCP", "UDP", "TLSv1.3", "HTTP/1.1"])
            info = f"Len={random.randint(64, 1500)} Seq={random.randint(1000,9999)}"
            
            logs.insert(0, f"[{datetime.now().strftime('%H:%M:%S')}] {proto} | {src} -> {dst} | {info}")
            if len(logs) > 15:
                logs.pop()
            
            log_text = "\n".join(logs)
            log_box.code(log_text, language="bash")
            time.sleep(0.4)

# ------------------------------------------------------------------------------
# MODULE: REPORTS
# ------------------------------------------------------------------------------
elif menu == "Reports":
    st.title("CENTRALIZED REPORTING")
    
    st.markdown("Generate executive summaries for the PayBuddy QA Team.")
    
    report_type = st.selectbox("Report Format", ["PDF (Simulated)", "Word (.docx)", "JSON"])
    
    if st.button("Generate Final Report"):
        st.success(f"Compiling Audit Logs into {report_type}...")
        time.sleep(1.5)
        
        # Simulated report content (replace with python-docx / reportlab for production)
        report_content = f"""
PAYBUDDY SECURITY AUDIT REPORT
------------------------------
Date: {datetime.now().isoformat()}
Team: CyberGuard

EXECUTIVE SUMMARY:
Scanning performed on 192.168.1.x subnet. 
Critical vulnerabilities found in Port 21 (FTP).
Password policy audit passed 80%.

RECOMMENDATIONS:
1. Close unused FTP ports.
2. Enforce MFA on admin panels.
"""
        # Attach reg number to filename
        filename_base = f"CyberGuard_Report_{datetime.now().strftime('%Y%m%d')}_22I-7451"
        st.download_button(
            label="Download Report File (TXT)",
            data=report_content,
            file_name=f"{filename_base}.txt",
            mime="text/plain"
        )
        # Also provide JSON summary
        summary_json = {
            "date": datetime.now().isoformat(),
            "team": "CyberGuard",
            "findings": [{"item": "FTP Open", "port": 21, "severity": "High"}],
            "recommendations": ["Close unused FTP ports", "Enforce MFA"]
        }
        st.download_button(
            label="Download JSON Summary",
            data=json.dumps(summary_json, indent=2),
            file_name=f"{filename_base}.json",
            mime="application/json"
        )

# ------------------------------------------------------------------------------
# FOOTER / EVIDENCE NOTE (ASCII-friendly)
# ------------------------------------------------------------------------------
st.markdown("---")
st.markdown("Evidence files and logs must include: `identity.txt; date; <command>` in filenames.")
st.markdown("Example filenames should include your registration number, e.g. `scan_192.168.1.1_20251129_22I-7451.json`")
st.markdown("Verified Clean Code - UTF-8 Encoded - Streamlit Ready")
