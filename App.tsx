import React, { useState } from 'react';
import { Download, Copy, FileText, Code, Check, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeFile, setActiveFile] = useState('src/app.py');
  const [copied, setCopied] = useState(false);

  const files = {
    'src/app.py': `import streamlit as st
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
from datetime import datetime
from io import BytesIO

# Try to import scapy, fallback if not available (common in some cloud envs)
try:
    from scapy.all import sniff, IP, TCP, UDP
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False

# Try to import docx
try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

# Try to import lottie
try:
    from streamlit_lottie import st_lottie
    LOTTIE_AVAILABLE = True
except ImportError:
    LOTTIE_AVAILABLE = False

# ==========================================
# CONFIGURATION & THEME
# ==========================================
st.set_page_config(
    page_title="PayBuddy CyberGuard Toolkit",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for "Extraordinary" Cyberpunk Look
st.markdown("""
<style>
    /* Global Theme */
    .stApp {
        background-color: #0e1117;
        color: #e0e0e0;
    }
    
    /* Headers */
    h1, h2, h3 {
        color: #00ffcc !important;
        font-family: 'Courier New', Courier, monospace;
    }
    
    /* Metrics */
    div[data-testid="stMetricValue"] {
        font-size: 24px;
        color: #00ffcc;
    }
    
    /* Sidebar */
    section[data-testid="stSidebar"] {
        background-color: #161b22;
        border-right: 1px solid #30363d;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #238636;
        color: white;
        border-radius: 8px;
        border: none;
        padding: 10px 20px;
        font-weight: bold;
        transition: all 0.3s;
    }
    .stButton>button:hover {
        background-color: #2ea043;
        box-shadow: 0 0 10px #2ea043;
    }
    
    /* Status Messages */
    .success-box {
        padding: 10px;
        background-color: rgba(46, 160, 67, 0.2);
        border: 1px solid #2ea043;
        border-radius: 5px;
        color: #7ee787;
    }
    .warning-box {
        padding: 10px;
        background-color: rgba(210, 153, 34, 0.2);
        border: 1px solid #d29922;
        border-radius: 5px;
        color: #e3b341;
    }
    .error-box {
        padding: 10px;
        background-color: rgba(248, 81, 73, 0.2);
        border: 1px solid #f85149;
        border-radius: 5px;
        color: #ff7b72;
    }

    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: #21262d;
        border-radius: 4px;
        color: #8b949e;
    }
    .stTabs [aria-selected="true"] {
        background-color: #1f6feb;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# ==========================================
# CONSTANTS & SETUP
# ==========================================
TEAM_NAME = "CyberGuard"
TEAM_MEMBERS = [
    {"name": "Moheed Ul Hassan", "reg": "22I-7451"},
    {"name": "Ali Abbas", "reg": "22I-2285"},
    {"name": "Abdur Rehman", "reg": "22I-2291"}
]

if 'logs' not in st.session_state:
    st.session_state.logs = []
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'scan_results' not in st.session_state:
    st.session_state.scan_results = []

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def log_event(tool, event_type, message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {
        "timestamp": timestamp,
        "tool": tool,
        "type": event_type,
        "message": message
    }
    st.session_state.logs.append(entry)

def verify_identity():
    """Reads identity.txt and consent.txt to verify authorization."""
    try:
        # Check Identity
        if not os.path.exists("identity.txt"):
            return False, "Missing identity.txt"
        
        with open("identity.txt", "r", encoding='utf-8') as f:
            identity_content = f.read()
            if TEAM_NAME not in identity_content:
                return False, "Invalid Team Name in identity.txt"
        
        # Check Consent
        if not os.path.exists("consent.txt"):
            return False, "Missing consent.txt"
        
        return True, "Verified"
    except Exception as e:
        return False, str(e)

def load_lottie_url(url: str):
    if not LOTTIE_AVAILABLE:
        return None
    try:
        r = requests.get(url)
        if r.status_code != 200:
            return None
        return r.json()
    except:
        return None

# Load Animation
lottie_cyber = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json")

# ==========================================
# SIDEBAR & AUTHENTICATION
# ==========================================
with st.sidebar:
    st.title("🛡️ CyberGuard Toolkit")
    if lottie_cyber and LOTTIE_AVAILABLE:
        st_lottie(lottie_cyber, height=150, key="sidebar_anim")
    
    st.markdown("---")
    
    st.subheader("Team Identity")
    if os.path.exists("identity.txt"):
        with open("identity.txt", "r", encoding='utf-8') as f:
            st.code(f.read(), language="yaml")
    else:
        st.error("❌ identity.txt NOT FOUND")

    st.markdown("---")
    st.subheader("Authorization")
    
    if not st.session_state.authenticated:
        auth_status, auth_msg = verify_identity()
        if auth_status:
            if st.button("🔐 Authenticate & Load Toolkit"):
                st.session_state.authenticated = True
                log_event("SYSTEM", "INFO", "User authenticated successfully via identity.txt")
                st.rerun()
        else:
            st.error(f"Authentication Failed: {auth_msg}")
            st.warning("Ensure identity.txt and consent.txt are present.")
    else:
        st.success(f"✅ Authenticated as {TEAM_NAME}")
        if st.button("🔓 Lock Session"):
            st.session_state.authenticated = False
            st.rerun()

# ==========================================
# MAIN APP LOGIC
# ==========================================

if not st.session_state.authenticated:
    # LANDING PAGE (LOCKED)
    st.markdown("""
    <div style="text-align: center; padding: 50px;">
        <h1 style="font-size: 3em;">🔒 PAYBUDDY CYBERGUARD</h1>
        <p style="font-size: 1.2em; color: #8b949e;">Authorized Personnel Only. Please verify identity in the sidebar.</p>
        <br>
        <div style="background: #161b22; padding: 20px; border-radius: 10px; display: inline-block; text-align: left;">
            <p><strong>System Status:</strong> <span style="color: orange;">LOCKED</span></p>
            <p><strong>Environment:</strong> PROD_QA_01</p>
            <p><strong>Modules Loaded:</strong> 6/6</p>
        </div>
    </div>
    """, unsafe_allow_html=True)
else:
    # DASHBOARD TABS
    tab_dash, tab_scan, tab_auth, tab_dos, tab_recon, tab_pcap, tab_report = st.tabs([
        "📊 Dashboard", 
        "🔍 Port Scanner", 
        "🔐 Auth Audit", 
        "⚡ DoS Stress", 
        "🌐 Web Recon", 
        "📡 Packet Sniffer", 
        "📑 Reporting"
    ])

    # --------------------------------------------------------------------------------
    # 1. DASHBOARD
    # --------------------------------------------------------------------------------
    with tab_dash:
        st.header(f"Welcome, {TEAM_NAME} Commander")
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric(label="System Status", value="ONLINE", delta="Secure")
        with col2:
            st.metric(label="Tools Active", value="5 Modules")
        with col3:
            st.metric(label="Logs Generated", value=len(st.session_state.logs))
        with col4:
            st.metric(label="Target Env", value="Localhost / Lab")

        st.markdown("### 📈 Live Security Metrics")
        
        # Mock Data for Visuals (Simulated Activity)
        chart_col1, chart_col2 = st.columns(2)
        
        with chart_col1:
            st.subheader("Network Traffic (Simulated)")
            mock_data = pd.DataFrame({
                'Time': pd.date_range(start='now', periods=20, freq='min'),
                'Inbound (MB)': [random.randint(10, 100) for _ in range(20)],
                'Outbound (MB)': [random.randint(5, 50) for _ in range(20)]
            })
            fig = px.area(mock_data, x='Time', y=['Inbound (MB)', 'Outbound (MB)'], 
                          color_discrete_sequence=['#00ffcc', '#ff0066'])
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font_color='white')
            st.plotly_chart(fig, use_container_width=True)

        with chart_col2:
            st.subheader("Vulnerability Distribution")
            vuln_data = pd.DataFrame({
                'Severity': ['Critical', 'High', 'Medium', 'Low', 'Info'],
                'Count': [2, 5, 12, 8, 24]
            })
            fig2 = px.bar(vuln_data, x='Severity', y='Count', color='Severity',
                          color_discrete_map={'Critical':'red', 'High':'orange', 'Medium':'yellow', 'Low':'blue', 'Info':'green'})
            fig2.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font_color='white')
            st.plotly_chart(fig2, use_container_width=True)

    # --------------------------------------------------------------------------------
    # 2. PORT SCANNER
    # --------------------------------------------------------------------------------
    with tab_scan:
        st.header("🔍 Advanced Port Scanner")
        
        col_input, col_action = st.columns([3, 1])
        with col_input:
            target_ip = st.text_input("Target IP Address", value="127.0.0.1")
        with col_action:
            st.write("") # Spacer
            st.write("") # Spacer
            start_scan = st.button("🚀 Start TCP Scan")

        if start_scan:
            st.session_state.scan_results = []
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            common_ports = {
                21: 'FTP', 22: 'SSH', 23: 'TELNET', 25: 'SMTP', 53: 'DNS',
                80: 'HTTP', 443: 'HTTPS', 3306: 'MySQL', 8080: 'HTTP-Proxy'
            }
            ports_to_scan = list(common_ports.keys()) + [random.randint(1000, 5000) for _ in range(5)]
            
            log_event("PORT_SCAN", "INFO", f"Started scan on {target_ip}")
            
            for i, port in enumerate(ports_to_scan):
                status_text.text(f"Scanning port {port}...")
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(0.5)
                    result = s.connect_ex((target_ip, port))
                    if result == 0:
                        service = common_ports.get(port, "Unknown")
                        try:
                            banner = s.recv(1024).decode().strip()
                        except:
                            banner = "No Banner"
                        
                        st.session_state.scan_results.append({
                            "Port": port,
                            "State": "OPEN",
                            "Service": service,
                            "Banner": banner
                        })
                        log_event("PORT_SCAN", "SUCCESS", f"Open Port: {port} ({service})")
                    s.close()
                except:
                    pass
                progress_bar.progress((i + 1) / len(ports_to_scan))
            
            status_text.text("Scan Complete!")
        
        if st.session_state.scan_results:
            st.success(f"Scan Finished. Found {len(st.session_state.scan_results)} open ports.")
            st.table(pd.DataFrame(st.session_state.scan_results))
            
            # Export
            json_res = json.dumps(st.session_state.scan_results, indent=2)
            st.download_button("Download JSON Report", json_res, file_name=f"scan_{target_ip}.json")

    # --------------------------------------------------------------------------------
    # 3. PASSWORD AUDIT
    # --------------------------------------------------------------------------------
    with tab_auth:
        st.header("🔐 Password Policy & Offline Audit")
        
        pwd_input = st.text_input("Enter Password to Test (Offline Simulation)", type="password")
        
        if pwd_input:
            # 1. Entropy Calculation
            charset_size = 0
            if any(c.islower() for c in pwd_input): charset_size += 26
            if any(c.isupper() for c in pwd_input): charset_size += 26
            if any(c.isdigit() for c in pwd_input): charset_size += 10
            if any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?" for c in pwd_input): charset_size += 32
            
            entropy = len(pwd_input) * (0 if charset_size == 0 else (1 if charset_size == 1 else  (len(bin(charset_size)) - 2))) # Approximate bits
            
            st.subheader("1. Policy Check")
            col_pol1, col_pol2 = st.columns(2)
            
            with col_pol1:
                st.write(f"**Length:** {len(pwd_input)} chars " + ("✅" if len(pwd_input) >= 12 else "❌ (Rec: >12)"))
                st.write(f"**Numbers:** " + ("✅" if any(c.isdigit() for c in pwd_input) else "❌"))
                st.write(f"**Special Chars:** " + ("✅" if any(not c.isalnum() for c in pwd_input) else "❌"))
            
            with col_pol2:
                st.metric("Entropy (bits)", f"{entropy:.1f}")
                strength = "Weak"
                if entropy > 60: strength = "Moderate" 
                if entropy > 80: strength = "Strong"
                if entropy > 100: strength = "Very Strong"
                
                color = "red"
                if strength == "Moderate": color = "orange"
                if strength == "Strong": color = "green"
                
                st.markdown(f"**Strength:** <span style='color:{color}; font-size:1.2em'>{strength}</span>", unsafe_allow_html=True)

            st.markdown("---")
            st.subheader("2. Offline Hash Simulation")
            
            if st.button("Run Hash Simulation"):
                hashed = hashlib.sha256(pwd_input.encode()).hexdigest()
                st.code(f"SHA-256: {hashed}")
                
                with st.spinner("Simulating Offline Brute Force Attack..."):
                    time.sleep(2) # Simulate processing
                    
                    # Simulation Logic
                    if entropy < 40:
                        crack_time = "Instant"
                    elif entropy < 60:
                        crack_time = "Few Minutes"
                    elif entropy < 80:
                        crack_time = "Days"
                    else:
                        crack_time = "Centuries"
                
                st.error(f"Estimated Time to Crack (RTX 4090 Cluster): {crack_time}")
                log_event("AUTH_AUDIT", "WARNING", f"Tested password strength. Entropy: {entropy:.1f}, Result: {strength}")

    # --------------------------------------------------------------------------------
    # 4. DoS STRESS TEST
    # --------------------------------------------------------------------------------
    with tab_dos:
        st.header("⚡ Service Stress Testing (DoS Simulation)")
        st.warning("⚠️ AUTHORIZED USE ONLY. Ensure consent.txt allows stress testing on target.")
        
        col_dos1, col_dos2 = st.columns(2)
        with col_dos1:
            dos_target = st.text_input("Target URL", "http://localhost:8501")
        with col_dos2:
            client_count = st.slider("Simulated Clients", min_value=50, max_value=500, value=200)

        if st.button("🔥 Ignite Load Test"):
            log_event("DOS_STRESS", "WARNING", f"Started load test on {dos_target} with {client_count} clients")
            
            placeholder = st.empty()
            latencies = []
            
            # Simulation of load testing
            for i in range(10):
                # Simulate varying latency based on load
                base_latency = 50 # ms
                added_latency = (client_count * 0.5) * (1 + (i * 0.1)) # Increasing load effect
                current_latency = base_latency + added_latency + random.randint(-20, 20)
                
                latencies.append(current_latency)
                
                # Visual Update
                with placeholder.container():
                    st.write(f"Batch {i+1}/10 - Sending requests...")
                    
                    chart_data = pd.DataFrame({
                        'Batch': list(range(len(latencies))),
                        'Latency (ms)': latencies
                    })
                    st.area_chart(chart_data.set_index('Batch'))
                
                time.sleep(0.5)
            
            st.success("Load Test Complete. Check Logs for details.")
            log_event("DOS_STRESS", "INFO", f"Load test finished. Avg Latency: {sum(latencies)/len(latencies):.1f}ms")

    # --------------------------------------------------------------------------------
    # 5. WEB RECON
    # --------------------------------------------------------------------------------
    with tab_recon:
        st.header("🌐 Web Reconnaissance")
        
        recon_url = st.text_input("Target URL for Recon", "http://paybuddy-dev.internal")
        
        if st.button("🔎 Start Directory Discovery"):
            st.write("Running directory busting...")
            log_event("WEB_RECON", "INFO", f"Started enumeration on {recon_url}")
            
            common_dirs = ['admin', 'login', 'dashboard', 'api', 'uploads', 'config', 'backup', '.git', 'db']
            found = []
            
            my_bar = st.progress(0)
            
            col_res1, col_res2 = st.columns(2)
            
            for i, d in enumerate(common_dirs):
                # Simulation of 404 vs 200
                # In real life: resp = requests.get(f"{recon_url}/{d}")
                time.sleep(0.2)
                
                status = 404
                if random.random() > 0.6: # Simulate finding some
                    status = 200
                elif random.random() > 0.8:
                    status = 403
                
                if status != 404:
                    found.append({'Path': f"/{d}", 'Status': status})
                    log_event("WEB_RECON", "SUCCESS", f"Found path: /{d} [{status}]")
                
                my_bar.progress((i + 1) / len(common_dirs))
            
            with col_res1:
                st.subheader("Discovered Paths")
                if found:
                    st.dataframe(found)
                else:
                    st.info("No common directories found.")

            with col_res2:
                st.subheader("Header Analysis (Mock)")
                st.code("""
HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: PHP/7.4.3
Set-Cookie: PHPSESSID=d7a8s...; path=/
Content-Type: text/html; charset=UTF-8
                """, language="http")

    # --------------------------------------------------------------------------------
    # 6. PACKET SNIFFER
    # --------------------------------------------------------------------------------
    with tab_pcap:
        st.header("📡 Network Packet Analysis")
        
        mode = st.radio("Capture Mode", ["Simulation (Cloud Safe)", "Live Interface (Root Req)"])
        
        if st.button("▶️ Start Capture"):
            if mode == "Simulation (Cloud Safe)":
                log_event("PCAP", "INFO", "Started Packet Capture (Simulation Mode)")
                st.info("Capturing simulated traffic for PayBuddy environment...")
                
                packets = []
                protos = ['TCP', 'UDP', 'HTTP', 'TLSv1.2', 'ARP']
                
                for i in range(15):
                    pkt = {
                        "Time": datetime.now().strftime("%H:%M:%S.%f")[:-3],
                        "Source": f"192.168.1.{random.randint(2, 254)}",
                        "Destination": f"10.0.0.{random.randint(2, 254)}",
                        "Protocol": random.choice(protos),
                        "Length": random.randint(64, 1500),
                        "Info": "Application Data / PayBuddy Transact"
                    }
                    packets.append(pkt)
                    time.sleep(0.1)
                
                df_pcap = pd.DataFrame(packets)
                st.dataframe(df_pcap, use_container_width=True)
                
                csv = df_pcap.to_csv(index=False)
                st.download_button("Download PCAP Summary (CSV)", csv, "capture.csv", "text/csv")
                
            else:
                if SCAPY_AVAILABLE:
                    st.warning("Listening on default interface... (This requires root/admin)")
                    try:
                        # Simple sniffer (blocking for demo duration)
                        capture = sniff(count=10)
                        st.success(f"Captured {len(capture)} packets")
                        st.write(capture.summary())
                    except Exception as e:
                        st.error(f"Capture failed: {e}. Try running as Administrator/Root or use Simulation Mode.")
                else:
                    st.error("Scapy not installed or not available in this environment.")

    # --------------------------------------------------------------------------------
    # 7. REPORTING
    # --------------------------------------------------------------------------------
    with tab_report:
        st.header("📑 Automated Report Generation")
        
        st.write("Generate a professional audit report based on the session logs.")
        
        if st.button("Generate Report (DOCX + JSON)"):
            # 1. JSON Report
            report_data = {
                "Project": "PayBuddy CyberGuard",
                "Team": TEAM_NAME,
                "Date": str(datetime.now()),
                "Logs": st.session_state.logs
            }
            json_report = json.dumps(report_data, indent=4)
            st.download_button("Download JSON Logs", json_report, "cyberguard_report.json", "application/json")
            
            # 2. DOCX Report
            if DOCX_AVAILABLE:
                doc = Document()
                doc.add_heading('PayBuddy Security Assessment Report', 0)
                
                doc.add_paragraph(f"Generated by: {TEAM_NAME}")
                doc.add_paragraph(f"Date: {datetime.now()}")
                
                doc.add_heading('Executive Summary', level=1)
                doc.add_paragraph("This report details the security assessment findings for the PayBuddy QA environment. The assessment was conducted using the CyberGuard Python Toolkit.")
                
                doc.add_heading('Session Logs', level=1)
                for log in st.session_state.logs:
                    p = doc.add_paragraph()
                    run = p.add_run(f"[{log['timestamp']}] [{log['type']}] {log['message']}")
                    if log['type'] == 'CRITICAL':
                        run.font.color.rgb = 0xFF0000 # Red for critical
                
                # Save to buffer
                buffer = BytesIO()
                doc.save(buffer)
                buffer.seek(0)
                
                st.download_button(
                    label="Download Professional Report (DOCX)",
                    data=buffer,
                    file_name=f"Report_{TEAM_NAME}.docx",
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
            else:
                st.warning("python-docx library not found. Install it to generate Word reports.")
        
        st.subheader("Session Log View")
        st.dataframe(pd.DataFrame(st.session_state.logs))
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
          PayBuddy CyberGuard v1.1<br/>
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
                 <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Python Source</span>
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

        <div className="bg-yellow-900/20 border-b border-yellow-800/50 px-6 py-2 text-xs text-yellow-500 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            <span>Ensure you download/copy this code exactly. If you see "SyntaxError: invalid character" in your logs, your local file was saved as binary. Use Copy Code to fix.</span>
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
