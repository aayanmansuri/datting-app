# 💖 DilSe - North India Modern Dating Web Application

> A full-stack, secure, containerized real-time dating platform tailored for modern connections, featuring AI-assisted vibe matching, real-time chat, and robust DevOps deployment pipelines.

---

## 🌐 Live Application
* **Production URL:** [https://matchbox-app.duckdns.org](https://matchbox-app.duckdns.org)[cite: 5]
* **Hosting Environment:** AWS EC2 (Ubuntu)[cite: 1]
* **Security:** Secured via Let's Encrypt SSL/TLS & Automated Nginx Reverse Proxy[cite: 1]

---

## 🏗️ Architecture & Tech Stack

### 1. Frontend
* **Framework / UI:** HTML5, CSS3, Modern JavaScript, Responsive Dashboards (`Discover Vibe`, `Chats & AI`, `Profile`)[cite: 5].
* **Web Server:** Nginx (Alpine-based container image) serving static assets and handling client-side routing.

### 2. Backend & Real-Time Engine
* **Runtime / Framework:** Node.js, Express.js.
* **Real-Time Communication:** Socket.IO for instant messaging and live chat synchronization.
* **Process Management:** PM2 / Docker Container orchestration.

### 3. DevOps & Infrastructure Pipeline
* **Containerization:** Docker & Docker Compose multi-tier architecture (`frontend` & `backend` services isolated via dedicated bridge networks).
* **Cloud Infrastructure:** AWS EC2 instance configured with custom Security Groups (Ports `80`, `443`, `5000`)[cite: 1].
* **Domain & DNS:** DuckDNS dynamic DNS mapping (`matchbox-app.duckdns.org` -> AWS Public IP `16.170.241.131`)[cite: 1].
* **SSL / TLS Automation:** Certbot standalone authentication with automatic HTTP to HTTPS redirection[cite: 1].
* **Version Control:** Git & GitHub (`https://github.com/aayanmansuri/datting-app.git`)[cite: 1].

---

## 🚀 Quick Local Setup & Deployment

If you want to run or deploy this application locally or on a fresh cloud server:

1. **Clone the repository:**
