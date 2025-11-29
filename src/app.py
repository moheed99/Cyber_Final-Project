import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import time
import random
import string
from datetime import datetime

# ==============================================================================
# CONFIGURATION & THEME
# ==============================================================================
st.set_page_config(
    page_title="PayBuddy CyberGuard V7.0",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CUSTOM CSS FOR NEON/DARK THEME (MATCHING REACT PREVIEW)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700&display=swap');
    
    /* Main Background */
    .stApp {
        background-color: #020617;
        background-image: linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        color: #f8fafc;
    }
    
    /* Fonts */
    h1, h2, h3 { font-family: 'Orbitron', sans-serif !important; letter-spacing: 1px; }
    p, div, button, input, span, label { font-family: 'JetBrains Mono', monospace !important; }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid #1e293b;
    }
    
    /* Cards */
    .metric-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(51, 65, 85, 0.5);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #1e293b;
        color: #00f3ff;
        border: 1px solid #00f3ff;
        font-weight: bold;
        transition: all 0.3s;
        border-radius: 5px;
    }
    .stButton>button:hover {
        background-color: #00f3ff;
        color: #000;
        box-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
    }
    
    /* Inputs */
    .stTextInput>div>div>input {
        background-color: #1e293b;
        color: white;
        border: 1px solid #334155;
    }
    
    /* Success/Error text */
    .success-text { color: #10b981; }
    .danger-text { color: #f43f5e; }
    .neon-text { color: #00f3ff; text-shadow: 0 0 5px rgba(0, 243, 255, 0.5); }
    
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# STATE MANAGEMENT
# ==============================================================================
if 'logs' not in st.session_state: st.session_state.logs = []
if 'scan_results' not in st.session_state: st.session_state.scan_results = []
if 'web_recon' not in st.session_state: st.session_state.web_recon = []
if 'dos_stats' not in st.session_state: st.session_state.dos_stats = []

def add_log(tool, type, message):
    ts = datetime.now().strftime("%H:%M:%S")
    st.session_state.logs.append({"Time": ts, "Tool": tool, "Type": type, "Message": message})

# ==============================================================================
# SIDEBAR
# ==============================================================================
with st.sidebar:
    st.markdown("<h2 class='neon-text'>🛡️ CYBERGUARD</h2>", unsafe_allow_html=True)
    st.markdown("<div style='font-size: 10px; color: #64748b; margin-bottom: 20px;'>PAYBUDDY SECURITY TOOLKIT V7.0</div>", unsafe_allow_html=True)
    
    menu = st.radio("NAVIGATION", [
        "Dashboard",
        "Port Scanner",
        "Password Auditor",
        "Load Stresser",
        "Web Recon",
        "Packet Sniffer",
        "Reports"
    ])
    
    st.markdown("---")
    st.markdown("**OPERATORS**")
    st.code("Moheed Ul Hassan\nAli Abbas\nAbdur Rehman")
    
    if st.button("LOGOUT"):
        st.stop()

# ==============================================================================
# MAIN DASHBOARD
# ==============================================================================
if menu == "Dashboard":
    st.markdown(f"<h1>DASHBOARD <span style='font-size:14px; color:#10b981'>● SYSTEM ONLINE</span></h1>", unsafe_allow_html=True)
    
    # Metrics
    c1, c2, c3, c4 = st.columns(4)
    c1.markdown("""<div class="metric-card"><h4>SECURITY LEVEL</h4><h2 style="color:#10b981">HIGH</h2></div>""", unsafe_allow_html=True)
    c2.markdown("""<div class="metric-card"><h4>ACTIVE THREADS</h4><h2 style="color:#00f3ff">4</h2></div>""", unsafe_allow_html=True)
    c3.markdown("""<div class="metric-card"><h4>NETWORK LOAD</h4><h2 style="color:#f59e0b">14%</h2></div>""", unsafe_allow_html=True)
    c4.markdown(f"""<div class="metric-card"><h4>LOGS GENERATED</h4><h2 style="color:#f43f5e">{len(st.session_state.logs)}</h2></div>""", unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_chart, col_feed = st.columns([2, 1])
    
    with col_chart:
        st.markdown("### 📡 LIVE TRAFFIC ANALYSIS")
        # Plotly Chart
        x = list(range(20))
        y = [random.randint(10, 80) for _ in range(20)]
        fig = go.Figure(data=go.Scatter(x=x, y=y, fill='tozeroy', line=dict(color='#00f3ff')))
        fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='#94a3b8'), height=300)
        st.plotly_chart(fig, use_container_width=True)
        
    with col_feed:
        st.markdown("### 📜 EVENT LOG")
        if st.session_state.logs:
            for log in st.session_state.logs[-6:]:
                color = "#10b981" if log['Type'] == "SUCCESS" else "#f43f5e" if log['Type'] == "ALERT" else "#00f3ff"
                st.markdown(f"<div style='border-left: 2px solid {color}; padding-left: 10px; font-size: 12px; margin-bottom: 5px;'><b style='color:{color}'>{log['Tool']}</b>: {log['Message']}</div>", unsafe_allow_html=True)
        else:
            st.info("System initializing...")

# ==============================================================================
# PORT SCANNER
# ==============================================================================
elif menu == "Port Scanner":
    st.markdown("<h1>NETWORK PORT SCANNER</h1>", unsafe_allow_html=True)
    
    c1, c2 = st.columns([3, 1])
    target = c1.text_input("Target IP", "192.168.1.105")
    
    if c2.button("🚀 RUN SCAN"):
        st.session_state.scan_results = []
        add_log("SCAN", "INFO", f"Started TCP Scan on {target}")
        
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        common_ports = {21: 'FTP', 22: 'SSH', 80: 'HTTP', 443: 'HTTPS', 3306: 'MySQL'}
        
        for i in range(100):
            time.sleep(0.02)
            progress_bar.progress(i + 1)
            
            # Simulate Finding Ports
            if i in [10, 25, 50, 80]:
                port = random.choice(list(common_ports.keys()))
                service = common_ports[port]
                banner = f"{service} v{random.randint(1,9)}.{random.randint(0,9)}"
                st.session_state.scan_results.append({
                    "Port": port, "State": "OPEN", "Service": service, "Banner": banner
                })
                
        status_text.success("Scan Complete.")
        add_log("SCAN", "SUCCESS", f"Found {len(st.session_state.scan_results)} open ports.")
        
    if st.session_state.scan_results:
        df = pd.DataFrame(st.session_state.scan_results)
        st.table(df)
        
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("📥 DOWNLOAD RESULTS (CSV)", csv, "scan_results.csv", "text/csv")

# ==============================================================================
# PASSWORD AUDITOR
# ==============================================================================
elif menu == "Password Auditor":
    st.markdown("<h1>PASSWORD FORENSICS</h1>", unsafe_allow_html=True)
    
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("### 🔑 ENTER CREDENTIALS")
        password = st.text_input("Test Password", type="password")
        
        if password:
            entropy = len(password) * 4  # Simplified entropy logic
            st.metric("Entropy Bits", f"{entropy}")
            
            st.markdown("### ANALYSIS")
            if len(password) < 8:
                st.error("❌ Too Short (< 8 chars)")
            else:
                st.success("✅ Length OK")
                
            if any(char.isdigit() for char in password):
                st.success("✅ Contains Numbers")
            else:
                st.warning("⚠️ Missing Numbers")
                
    with c2:
        st.markdown("### ⚡ TIME TO CRACK")
        if password:
            st.markdown(f"""
            <div class="metric-card">
                <p>Hacker (Laptop): <b class="danger-text">Instant</b></p>
                <p>Hacker (GPU Cluster): <b class="danger-text">Instant</b></p>
                <p>Supercomputer: <b class="danger-text">Instant</b></p>
            </div>
            """, unsafe_allow_html=True)
            if entropy > 60:
                st.success("Password is moderately secure.")
            else:
                st.error("Password is WEAK.")

# ==============================================================================
# LOAD STRESSER
# ==============================================================================
elif menu == "Load Stresser":
    st.markdown("<h1>DoS / LOAD SIMULATION</h1>", unsafe_allow_html=True)
    
    if st.button("🔥 LAUNCH ATTACK"):
        add_log("DOS", "ALERT", "Starting Load Stress Test...")
        
        chart_placeholder = st.empty()
        data = []
        
        for i in range(20):
            time.sleep(0.5)
            latency = random.randint(50, 500) + (i * 10)
            data.append(latency)
            
            fig = go.Figure(data=go.Scatter(y=data, mode='lines', line=dict(color='#f43f5e')))
            fig.update_layout(title="Server Latency (ms)", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='#94a3b8'), height=300)
            chart_placeholder.plotly_chart(fig, use_container_width=True)
            
        st.success("Stress Test Complete.")
        
        # Download
        df_dos = pd.DataFrame({"Seconds": range(20), "Latency": data})
        st.download_button("📥 DOWNLOAD DOS LOGS", df_dos.to_csv().encode('utf-8'), "dos_logs.csv", "text/csv")

# ==============================================================================
# WEB RECON
# ==============================================================================
elif menu == "Web Recon":
    st.markdown("<h1>WEB RECONNAISSANCE</h1>", unsafe_allow_html=True)
    
    if st.button("🔎 START ENUMERATION"):
        st.session_state.web_recon = []
        paths = ["/admin", "/login", "/dashboard", "/config", "/uploads", "/.env"]
        
        for p in paths:
            time.sleep(0.5)
            status = random.choice([200, 403, 404])
            st.write(f"Probing {p} ... Status: {status}")
            if status != 404:
                st.session_state.web_recon.append({"Path": p, "Status": status})
                
    if st.session_state.web_recon:
        df = pd.DataFrame(st.session_state.web_recon)
        st.download_button("📥 DOWNLOAD DISCOVERY DATA", df.to_csv().encode('utf-8'), "web_recon.csv", "text/csv")

# ==============================================================================
# PACKET SNIFFER
# ==============================================================================
elif menu == "Packet Sniffer":
    st.markdown("<h1>TRAFFIC INTERCEPTION</h1>", unsafe_allow_html=True)
    st.info("Simulation Mode Active (Root privileges not detected)")
    
    if st.button("START CAPTURE"):
        st.code("Capturing packets on interface eth0...")
        for i in range(5):
            time.sleep(1)
            src = f"192.168.1.{random.randint(1,255)}"
            dst = "10.0.0.5"
            st.text(f"[{datetime.now().strftime('%H:%M:%S')}] TCP {src} -> {dst} [SYN] Len=64")

# ==============================================================================
# REPORTS
# ==============================================================================
elif menu == "Reports":
    st.markdown("<h1>SECURITY REPORT GENERATION</h1>", unsafe_allow_html=True)
    
    report_content = f"""
    PAYBUDDY CYBERGUARD SECURITY REPORT
    Date: {datetime.now().strftime('%Y-%m-%d')}
    ===================================
    
    [1] SYSTEM LOGS
    {pd.DataFrame(st.session_state.logs).to_string(index=False) if st.session_state.logs else "No logs."}
    
    [2] OPEN PORTS
    {pd.DataFrame(st.session_state.scan_results).to_string(index=False) if st.session_state.scan_results else "No scan data."}
    
    [3] WEB VULNERABILITIES
    {pd.DataFrame(st.session_state.web_recon).to_string(index=False) if st.session_state.web_recon else "No web data."}
    """
    
    st.text_area("Report Preview", report_content, height=300)
    st.download_button("📥 DOWNLOAD FULL REPORT (.TXT)", report_content, "Full_Security_Report.txt")
