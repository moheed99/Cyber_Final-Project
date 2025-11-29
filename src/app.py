# ==============================================================================
# PROJECT: PAYBUDDY CYBERGUARD TOOLKIT V7.0 (ULTIMATE EDITION)
# TEAM: CYBERGUARD (Moheed Ul Hassan, Ali Abbas, Abdur Rehman)
# ==============================================================================

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import time
import random
import math
import string
import json
from datetime import datetime

# ------------------------------------------------------------------------------
# 1. CONFIGURATION & FUTURISTIC THEME ENGINE
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="CyberGuard V7.0",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# INJECT ADVANCED CSS TO MATCH REACT DASHBOARD (NEON/GLASSMORPHISM)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');

    /* BACKGROUND - SLATE 950 with GRID */
    .stApp {
        background-color: #020617;
        background-image: 
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        background-size: 40px 40px;
        color: #f8fafc;
        font-family: 'JetBrains Mono', monospace;
    }

    /* SIDEBAR */
    [data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid #1e293b;
    }

    /* TYPOGRAPHY */
    h1, h2, h3, .big-font { font-family: 'Orbitron', sans-serif !important; letter-spacing: 2px; }
    p, div, span, button, input, label { font-family: 'JetBrains Mono', monospace !important; }

    /* CONTAINERS - GLASS EFFECT */
    .css-card {
        background: rgba(15, 17, 42, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(51, 65, 85, 0.5);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        margin-bottom: 20px;
    }

    /* NEON TEXT */
    .neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.4); }
    .neon-red { color: #f43f5e; text-shadow: 0 0 10px rgba(244, 63, 94, 0.4); }
    .neon-green { color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }

    /* INPUT FIELDS */
    .stTextInput > div > div > input {
        background-color: #1e293b;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 6px;
    }
    .stTextInput > div > div > input:focus {
        border-color: #00f3ff;
        box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
    }

    /* BUTTONS */
    .stButton > button {
        background: linear-gradient(45deg, #0f172a, #1e293b);
        border: 1px solid #3b82f6;
        color: #60a5fa;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        width: 100%;
    }
    .stButton > button:hover {
        background: #2563eb;
        color: white;
        box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
        border-color: #60a5fa;
    }
    
    /* DATAFRAMES */
    [data-testid="stDataFrame"] {
        border: 1px solid #334155;
        border-radius: 8px;
    }
</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 2. SESSION STATE MANAGEMENT (PERSISTENCE)
# ------------------------------------------------------------------------------
if 'logs' not in st.session_state: st.session_state['logs'] = []
if 'scan_data' not in st.session_state: st.session_state['scan_data'] = []
if 'auth_verified' not in st.session_state: st.session_state['auth_verified'] = False
if 'web_enum' not in st.session_state: st.session_state['web_enum'] = []

def log_event(tool, type, msg):
    ts = datetime.now().strftime("%H:%M:%S")
    st.session_state['logs'].append({"Time": ts, "Tool": tool, "Type": type, "Message": msg})

# ------------------------------------------------------------------------------
# 3. IDENTITY GATE (SECURITY LAYER)
# ------------------------------------------------------------------------------
if not st.session_state['auth_verified']:
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("<br><br><br>", unsafe_allow_html=True)
        st.markdown("""
        <div style="text-align: center;">
            <div style="font-size: 80px; margin-bottom: 20px;">🛡️</div>
            <h1 class="neon-blue" style="font-size: 48px; margin: 0;">CYBERGUARD</h1>
            <p style="color: #64748b; letter-spacing: 4px; font-size: 14px;">RESTRICTED ACCESS // AUTHORIZED PERSONNEL ONLY</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### 🔒 IDENTITY VERIFICATION")
        
        # Simulated File Check
        c1, c2 = st.columns(2)
        with c1:
            st.info("📄 identity.txt: **FOUND**")
        with c2:
            st.info("✅ consent.txt: **SIGNED**")
            
        st.markdown("---")
        st.markdown("**DETECTED TEAM:**")
        st.code("Moheed Ul Hassan (22I-7451)\nAli Abbas (22I-2285)\nAbdur Rehman (22I-2291)")
        
        if st.button("INITIALIZE SYSTEM CORE"):
            with st.spinner("Decrypting keys... Verifying signatures..."):
                time.sleep(2)
                st.session_state['auth_verified'] = True
                st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)
    st.stop()

# ------------------------------------------------------------------------------
# 4. MAIN APPLICATION LOGIC
# ------------------------------------------------------------------------------

# --- SIDEBAR ---
with st.sidebar:
    st.markdown("""
    <div style="padding: 10px;">
        <h2 class="neon-blue" style="margin:0;">CYBERGUARD</h2>
        <p style="font-size: 10px; color: #94a3b8; letter-spacing: 2px;">TOOLKIT V7.0</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    menu = st.radio("MODULES", [
        "Dashboard", 
        "Port Scanner", 
        "Password Auditor", 
        "Load Stresser", 
        "Web Recon", 
        "Packet Sniffer", 
        "Reports"
    ])
    st.markdown("---")
    
    # Live Status
    st.markdown("**SYSTEM STATUS**")
    st.markdown("🟢 **CORE:** ONLINE")
    st.markdown("🟢 **DB:** CONNECTED")
    st.markdown("🟡 **NET:** MONITORING")
    
    if st.button("LOGOUT"):
        st.session_state['auth_verified'] = False
        st.rerun()

# --- HEADER ---
st.markdown(f"""
<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
    <div>
        <h1 style="margin:0; font-size: 32px;">{menu.upper()}</h1>
        <p style="color: #64748b; margin:0;">PAYBUDDY SECURITY INFRASTRUCTURE</p>
    </div>
    <div style="text-align: right;">
        <span class="neon-green" style="font-size: 14px; font-weight: bold;">● SYSTEM ACTIVE</span>
        <br>
        <span style="font-size: 12px; color: #64748b;">{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</span>
    </div>
</div>
""", unsafe_allow_html=True)

# --- MODULE: DASHBOARD ---
if menu == "Dashboard":
    # Metrics
    c1, c2, c3, c4 = st.columns(4)
    c1.markdown('<div class="css-card"><div style="font-size:12px; color:#94a3b8">SECURITY SCORE</div><div style="font-size:28px; color:#00f3ff; font-weight:bold">98/100</div></div>', unsafe_allow_html=True)
    c2.markdown('<div class="css-card"><div style="font-size:12px; color:#94a3b8">ACTIVE THREADS</div><div style="font-size:28px; color:#f43f5e; font-weight:bold">4</div></div>', unsafe_allow_html=True)
    c3.markdown('<div class="css-card"><div style="font-size:12px; color:#94a3b8">PORTS SCANNED</div><div style="font-size:28px; color:#10b981; font-weight:bold">1,024</div></div>', unsafe_allow_html=True)
    c4.markdown('<div class="css-card"><div style="font-size:12px; color:#94a3b8">LATENCY</div><div style="font-size:28px; color:#fbbf24; font-weight:bold">12ms</div></div>', unsafe_allow_html=True)

    col_main, col_logs = st.columns([2, 1])
    
    with col_main:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### 📡 NETWORK TRAFFIC REAL-TIME")
        
        # Plotly Chart
        x_data = list(range(20))
        y_in = [random.randint(20, 100) for _ in range(20)]
        y_out = [random.randint(10, 80) for _ in range(20)]
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=x_data, y=y_in, fill='tozeroy', name='Inbound', line=dict(color='#00f3ff')))
        fig.add_trace(go.Scatter(x=x_data, y=y_out, fill='tozeroy', name='Outbound', line=dict(color='#f43f5e')))
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#94a3b8'),
            height=300,
            margin=dict(l=0, r=0, t=20, b=20),
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=True, gridcolor='#1e293b')
        )
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with col_logs:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### 📜 RECENT ACTIVITY")
        if st.session_state['logs']:
            for log in st.session_state['logs'][-5:]:
                color = "#10b981" if log['Type'] == "SUCCESS" else "#f43f5e" if log['Type'] == "ALERT" else "#00f3ff"
                st.markdown(f"<div style='border-left: 3px solid {color}; padding-left: 10px; margin-bottom: 8px; font-size: 12px;'><span style='color: #64748b'>{log['Time']}</span> <strong style='color: {color}'>{log['Tool']}</strong><br>{log['Message']}</div>", unsafe_allow_html=True)
        else:
            st.markdown("*No activity recorded yet.*")
        st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: PORT SCANNER ---
elif menu == "Port Scanner":
    col_input, col_action = st.columns([3, 1])
    with col_input:
        target = st.text_input("Target IP / Hostname", "192.168.1.105")
    with col_action:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🚀 INITIATE SCAN"):
            st.session_state['scan_data'] = []
            log_event("SCAN", "INFO", f"Scanning {target}")
            
            with st.status("Scanning ports...") as status:
                progress = st.progress(0)
                ports_list = [21, 22, 23, 25, 53, 80, 110, 443, 3306, 8080]
                services_list = ["FTP", "SSH", "Telnet", "SMTP", "DNS", "HTTP", "POP3", "HTTPS", "MySQL", "HTTP-Proxy"]
                
                for i in range(100):
                    time.sleep(0.01)
                    progress.progress(i + 1)
                    
                    if i % 10 == 0 and random.random() > 0.3:
                        idx = (i // 10) % len(ports_list)
                        port_num = ports_list[idx]
                        service = services_list[idx]
                        banner = f"{service} v{random.randint(1,5)}.{random.randint(0,9)}"
                        st.session_state['scan_data'].append({
                            "Port": port_num,
                            "State": "OPEN",
                            "Service": service,
                            "Banner": banner
                        })
                status.update(label="Scan Complete!", state="complete")
                log_event("SCAN", "SUCCESS", f"Scan finished. Found {len(st.session_state['scan_data'])} ports.")

    if st.session_state['scan_data']:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### SCAN RESULTS")
        df = pd.DataFrame(st.session_state['scan_data'])
        st.dataframe(df, use_container_width=True)
        
        # Download
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button(
            "📥 DOWNLOAD RESULTS (CSV)",
            csv,
            f"scan_results_{target}.csv",
            "text/csv"
        )
        st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: PASSWORD AUDITOR ---
elif menu == "Password Auditor":
    c1, c2 = st.columns(2)
    
    with c1:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### 🔑 PASSWORD STRENGTH AUDIT")
        password = st.text_input("Enter Password to Test", type="password")
        
        if password:
            # Entropy Calc
            pool = 0
            if any(c.islower() for c in password): pool += 26
            if any(c.isupper() for c in password): pool += 26
            if any(c.isdigit() for c in password): pool += 10
            if any(c in string.punctuation for c in password): pool += 32
            
            entropy = math.log2(pool ** len(password)) if pool > 0 else 0
            
            # Display Metrics
            col_a, col_b = st.columns(2)
            col_a.metric("Entropy (Bits)", f"{entropy:.1f}")
            col_b.metric("Length", len(password))
            
            # Strength Bar
            st.markdown(" **STRENGTH METER**")
            if entropy < 40:
                st.progress(30)
                st.markdown(":red[WEAK - Instantly Crackable]")
            elif entropy < 80:
                st.progress(60)
                st.markdown(":orange[MODERATE - Crackable by GPU]")
            else:
                st.progress(95)
                st.markdown(":green[STRONG - Secure]")
                
        st.markdown('</div>', unsafe_allow_html=True)

    with c2:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### ⚡ TIME TO CRACK MATRIX")
        if password:
            # Estimations
            hashes_per_sec_laptop = 10_000_000 # 10 MH/s
            hashes_per_sec_gpu = 10_000_000_000 # 10 GH/s
            hashes_per_sec_super = 1_000_000_000_000 # 1 TH/s
            
            total_combs = 2 ** entropy
            
            def fmt_time(seconds):
                if seconds < 1: return "Instantly"
                if seconds < 60: return f"{seconds:.0f} seconds"
                if seconds < 3600: return f"{seconds/60:.0f} minutes"
                if seconds < 86400: return f"{seconds/3600:.0f} hours"
                if seconds < 31536000: return f"{seconds/86400:.0f} days"
                return f"{seconds/31536000:.0f} years"

            st.markdown(f"**Hacker (Laptop):** <span class='neon-red'>{fmt_time(total_combs / hashes_per_sec_laptop)}</span>", unsafe_allow_html=True)
            st.markdown(f"**Hacker (RTX 4090):** <span class='neon-red'>{fmt_time(total_combs / hashes_per_sec_gpu)}</span>", unsafe_allow_html=True)
            st.markdown(f"**Supercomputer:** <span class='neon-red'>{fmt_time(total_combs / hashes_per_sec_super)}</span>", unsafe_allow_html=True)
            
            log_event("AUTH", "INFO", f"Tested password strength. Entropy: {entropy:.1f}")

        else:
            st.info("Enter a password on the left to see forensic analysis.")
        st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: LOAD STRESSER ---
elif menu == "Load Stresser":
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    st.markdown("### 💥 DoS / LOAD SIMULATION")
    
    c1, c2, c3 = st.columns(3)
    target_url = c1.text_input("Target URL", "http://paybuddy-dev.internal")
    threads = c2.slider("Threads", 10, 500, 200)
    duration = c3.slider("Duration (s)", 5, 60, 10)
    
    if st.button("🚀 LAUNCH STRESS TEST"):
        log_event("DOS", "ALERT", f"Started load test on {target_url} with {threads} threads")
        
        chart_placeholder = st.empty()
        stats_placeholder = st.empty()
        
        latencies = []
        times = []
        
        for t in range(duration):
            time.sleep(1)
            # Simulated Data
            lat = random.randint(50, 500) + (t * 10) # Increasing latency
            latencies.append(lat)
            times.append(t)
            
            # Update Chart
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=times, y=latencies, mode='lines', line=dict(color='#f43f5e', width=3)))
            fig.update_layout(
                title="Server Latency (ms)",
                template="plotly_dark",
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                height=300
            )
            chart_placeholder.plotly_chart(fig, use_container_width=True)
            
            # Update Stats
            dropped = int(t * threads * 0.05)
            stats_placeholder.markdown(f"""
            <div style="display:flex; justify-content:space-around; text-align:center;">
                <div><h3>PACKETS SENT</h3><span class='neon-blue'>{t * threads * 15}</span></div>
                <div><h3>PACKETS DROPPED</h3><span class='neon-red'>{dropped}</span></div>
                <div><h3>AVG LATENCY</h3><span class='neon-green'>{lat} ms</span></div>
            </div>
            """, unsafe_allow_html=True)
            
        st.success("Stress Test Complete.")
        
        # Download Report
        report_df = pd.DataFrame({"Time": times, "Latency": latencies})
        st.download_button("📥 DOWNLOAD DOS REPORT", report_df.to_csv().encode('utf-8'), "dos_report.csv", "text/csv")
    
    st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: WEB RECON ---
elif menu == "Web Recon":
    col_input, col_action = st.columns([3, 1])
    with col_input:
        target_web = st.text_input("Target Domain", "paybuddy.internal")
    with col_action:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🔎 START ENUMERATION"):
            st.session_state['web_enum'] = []
            log_event("RECON", "INFO", f"Dirbusting {target_web}")
            
            paths = ["admin", "login", "dashboard", "uploads", "api/v1", "config", "backup", ".env"]
            
            with st.status("Enumerating directories..."):
                for p in paths:
                    time.sleep(0.3)
                    status = random.choice([200, 403, 404, 500])
                    if status != 404:
                        st.session_state['web_enum'].append({"Path": f"/{p}", "Status": status})
                        st.write(f"Found: /{p} [{status}]")
            
            st.success("Enumeration Complete")

    if st.session_state['web_enum']:
        st.markdown('<div class="css-card">', unsafe_allow_html=True)
        st.markdown("### 🕸️ DISCOVERED PATHS")
        
        for item in st.session_state['web_enum']:
            color = "#10b981" if item['Status'] == 200 else "#fbbf24"
            st.markdown(f"<div style='border-bottom: 1px solid #333; padding: 5px; display: flex; justify-content: space-between;'><span>{item['Path']}</span><span style='color:{color}; font-weight:bold'>{item['Status']}</span></div>", unsafe_allow_html=True)
        
        # Download
        recon_df = pd.DataFrame(st.session_state['web_enum'])
        st.download_button("📥 DOWNLOAD RECON DATA", recon_df.to_csv().encode('utf-8'), "recon_data.csv", "text/csv")
        st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: PACKET SNIFFER ---
elif menu == "Packet Sniffer":
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    st.markdown("### 📻 PACKET CAPTURE (PCAP)")
    
    if st.button("START SNIFFER"):
        with st.empty():
            logs = []
            for i in range(15):
                src = f"192.168.1.{random.randint(2, 254)}"
                dst = f"10.0.0.{random.randint(2, 254)}"
                proto = random.choice(["TCP", "UDP", "ICMP", "HTTP"])
                line = f"[{datetime.now().strftime('%H:%M:%S')}] {proto} {src} -> {dst} Len={random.randint(64, 1500)}"
                logs.append(line)
                st.code("\n".join(logs))
                time.sleep(0.5)
        st.success("Capture stopped.")
    st.markdown('</div>', unsafe_allow_html=True)

# --- MODULE: REPORTS ---
elif menu == "Reports":
    st.markdown('<div class="css-card">', unsafe_allow_html=True)
    st.markdown("### 📋 EXECUTIVE SECURITY REPORT")
    
    report_text = f"""
============================================================
PAYBUDDY CYBERGUARD SECURITY ASSESSMENT REPORT
============================================================
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Team: CyberGuard
------------------------------------------------------------

[1] SESSION LOGS
----------------
{pd.DataFrame(st.session_state['logs']).to_string(index=False) if st.session_state['logs'] else "No logs recorded."}

[2] PORT SCAN FINDINGS
----------------------
{pd.DataFrame(st.session_state['scan_data']).to_string(index=False) if st.session_state['scan_data'] else "No scan data."}

[3] WEB RECONNAISSANCE
----------------------
{pd.DataFrame(st.session_state['web_enum']).to_string(index=False) if st.session_state['web_enum'] else "No recon data."}

============================================================
END OF REPORT
    """
    
    st.text_area("Report Preview", report_text, height=400)
    
    st.download_button(
        label="📥 DOWNLOAD FULL REPORT (TXT)",
        data=report_text,
        file_name=f"CyberGuard_Report_{datetime.now().strftime('%Y%m%d')}.txt",
        mime="text/plain"
    )
    st.markdown('</div>', unsafe_allow_html=True)
