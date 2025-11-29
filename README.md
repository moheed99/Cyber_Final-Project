# 🛡️ PayBuddy CyberGuard Toolkit

> **A Comprehensive Hybrid Hacking & QA Security Suite for FinTech Environments**

![Version](https://img.shields.io/badge/Version-8.3_Final-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=flat-square)
![Streamlit](https://img.shields.io/badge/Framework-Streamlit-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-Authorized_Testing_Only-green?style=flat-square)

## 📌 Project Overview

**CyberGuard** is a specialized, Python-based security toolkit developed for the **PayBuddy FinTech QA Team**. It is designed to perform authorized, offline security assessments on internal APIs and simulated wallet services.

The toolkit provides a modular, all-in-one dashboard to test security layers without relying on external Kali Linux tools, ensuring a lightweight and compliant testing environment.

---

## 🚀 Key Features

### 1. 🌐 Network Reconnaissance
- **Advanced Port Scanner:** Multi-threaded TCP connect scanning with service banner grabbing.
- **Service Detection:** Identifies running services (FTP, SSH, HTTP, SQL) and potential vulnerabilities.
- **Exportable Reports:** Generates CSV/JSON reports for audit trails.

### 2. 🔐 Password Forensics & Auditing
- **NIST Compliance Check:** Validates credentials against modern security standards.
- **Entropy Calculation:** Uses Shannon Entropy algorithms to determine true password strength (bits).
- **Crack Time Estimation:** Simulates brute-force timelines against GPU clusters and Supercomputers.

### 3. ⚡ API Stress Testing (DoS Simulation)
- **Load Generation:** Simulates botnet traffic (up to 10,000 virtual clients).
- **Live Telemetry:** Real-time visualization of server latency and request drops.
- **Resilience Testing:** Tests API response under high-stress conditions.

### 4. 🌍 Web Discovery
- **Directory Enumeration:** Probes for hidden admin panels, config files, and backup directories.
- **Subdomain Discovery:** Identifies potential attack surfaces within the internal network.
- **Site Mapping:** Visualizes the directory structure of the target.

### 5. 📡 Traffic Analysis (Packet Sniffer)
- **Live Capture:** Intercepts TCP, UDP, and HTTP traffic on local interfaces.
- **Scapy Integration:** Analyzes packet headers, payloads, and protocol distribution.
- **PCAP Logging:** Saves captured traffic logs for forensic analysis.

### 6. 📄 Automated Reporting
- **Executive Summaries:** Auto-generates detailed security reports combining data from all modules.
- **Audit Logs:** Maintains an append-only session log for accountability.

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Pip package manager

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/PayBuddy-CyberGuard.git
cd PayBuddy-CyberGuard
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Identity Verification Setup
This toolkit requires authorization files to run. Ensure the following files exist in the root directory:

*   `identity.txt` (Team Credentials)
*   `consent.txt` (Authorization Signature)

### 4. Run the Toolkit
```bash
streamlit run app.py
```

---

## 👥 Project Team

**Developed by:**

| Name | Registration ID | Role |
| :--- | :--- | :--- |
| **Moheed Ul Hassan** | 22I-7451 | Lead Developer / Security Architect |
| **Ali Abbas** | 22I-2285 | Network Specialist / Python Dev |
| **Abdur Rehman** | 22I-2291 | UI/UX Designer / QA Analyst |

<br>

## 🎓 Supervision

**Project Supervisor:**
### **Dr. Usama Arshad**

---

## 📂 Project Structure

```text
PayBuddy-CyberGuard/
├── app.py                 # Main Application Engine (Streamlit)
├── requirements.txt       # Python Dependencies
├── identity.txt           # Team Identity Verification
├── consent.txt            # Authorized Target Scope
├── README.md              # Documentation
└── reports/               # Generated Audit Reports (Auto-created)
```

---

## ⚠️ Legal Disclaimer

**FOR EDUCATIONAL AND INTERNAL QA USE ONLY.**

This software is developed strictly for **PayBuddy Internal Security Testing**. Usage of this toolkit against targets without prior mutual consent is illegal. The developers assume no liability and are not responsible for any misuse or damage caused by this program.

*   **Authorized Targets Only:** 127.0.0.1, 192.168.1.x, PayBuddy Dev Env.
*   **Compliance:** Follows ethical hacking guidelines.

---

&copy; 2024 PayBuddy Security Team. All Rights Reserved.
