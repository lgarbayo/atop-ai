# 🚀 AtopAI: Your Extended Intelligence

**AtopAI** is an advanced document retrieval and analysis system engineered specifically for **students and professionals**. It facilitates rapid information extraction from academic notes, research papers, and professional documentation, eliminating the inefficiencies of manual searching.

## 🎓 The Vision Behind AtopAI
In contemporary academic and professional environments, information is often fragmented across numerous PDFs, slides, and personal notes. Retrieving specific insights from these disparate sources is frequently more time-consuming than the study or analysis itself.

**AtopAI** aims to streamline this process through:
- **Direct Inquiry:** Instead of traditional keyword-based searches, users can query their documentation using natural language: *"Summarize the professor's notes on multi-variable calculus."*
- **Enhanced Productivity:** Significantly reduces the time allocated to information retrieval.
- **Privacy & Security:** Documents are processed securely using local models or controlled API integrations, ensuring your intellectual assets remain organized and accessible.

## ✨ Key Features
- **Semantic Vector Search:** Understands the conceptual intent behind queries rather than relying on exact word matching.
- **AI-Powered Synthesis:** Leverages Large Language Models (LLMs) to summarize and explain the content of your specific files.
- **Optimized Interface:** A streamlined, intuitive user experience designed for immediate deployment.
- **Multi-Format Compatibility:** Seamlessly process PDFs, text files, and other standard formats.

## 🌐 Live Access
You can access the live application at: **[https://atopai.cloud](https://atopai.cloud)**

## 🛠️ Local Setup & Deployment
If you wish to deploy your own instance, AtopAI is containerized using Docker for simplified consistency across environments.

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/lgarbayo/document-search.git atopai
   cd atopai
   ```

2. **Configuration:**
   Configure your environment variables by creating a `.env` file in the root directory (refer to `.env.example` if available) and include your respective API keys.

3. **Deploy with Docker Compose:**
   ```bash
   docker compose up -d
   ```

4. **Access the Application:**
   Navigate to `http://localhost:8000` (or your designated port) to begin indexing and querying your knowledge base.

---
*This project is built upon the foundation of the repository developed for **HackUDC 2026**, evolving into a comprehensive tool dedicated to enhancing academic and professional productivity.* 🚀
