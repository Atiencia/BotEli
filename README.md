# 🤖 Eli Bot - AI Customer Service SaaS

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://botfrontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Meta API](https://img.shields.io/badge/Meta_Graph_API-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://developers.facebook.com/)

**Eli Bot** is a production-ready, AI-powered Customer Service SaaS designed to automate Instagram and Messenger interactions. It leverages state-of-the-art LLMs (Llama 3.1) and Semantic Search (RAG) to provide autonomous, accurate responses while seamlessly blending with a real-time human handoff interface.

🌐 **[Try the Interactive Live Demo!](https://botfrontend.vercel.app/)**

---

## ✨ Key Features

- 🧠 **Autonomous Auto-Learning:** The true magic of Eli Bot. When a human agent intervenes to answer a complex question, the AI evaluates the response. If it contains valuable new business logic, the bot automatically extracts, embeds, and saves it to its vector database to use in future conversations.
- 🎙️ **Voice Note Transcription:** Automatically downloads and transcribes audio messages sent by customers on Instagram, allowing the AI to process and answer voice notes as if they were text.
- 🤝 **Silent Human Handoff:** Automatically detects when human intervention is needed (e.g., when a user sends a photo or asks an unknown question) and pauses the bot silently, without disrupting the customer's experience.
- 🔍 **Semantic Search (RAG):** Uses **Supabase `pgvector`** to store and query the knowledge base, ensuring the AI only answers using company-approved information and never hallucinates policies or prices.
- 📊 **Real-Time Dashboard:** A responsive, multi-tenant React dashboard featuring live chat metrics (Recharts), global state caching (Context API), and real-time WebSocket updates powered by Supabase Realtime.
- 📱 **Hyper-Realistic Simulator:** The landing page features a virtual iPhone mock-up that interacts directly with the backend, allowing users to experience the bot exactly as it works on Instagram Direct.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Custom Sky-Blue Glassmorphism UI)
- **State Management:** React Context API + Custom Hooks
- **Data Visualization:** Recharts
- **Icons & UI:** Lucide React, React Hot Toast

### Backend (Serverless)
- **Runtime:** Node.js + Express (Deployed on Vercel Serverless Functions)
- **AI Inference:** Groq SDK (`openai/gpt-oss-20b`) for ultra-low latency generation.
- **Integrations:** Meta Graph API (Webhooks, Messaging, Media downloading)
- **Reliability:** Automated Vercel Cron Jobs to prevent database pausing.

### Database & Security
- **Database:** Supabase (PostgreSQL)
- **Vector DB:** `pgvector` for local embedding matching (RAG).
- **Security:** Row Level Security (RLS) for secure multi-tenant isolation.
- **Storage:** Supabase Storage for chat image attachments.

---

## 🏗️ How It Works (The Pipeline)

1. **Meta Webhook:** A customer sends a message or voice note on Instagram. The Node.js server receives the event.
2. **Media Processing:** If it's audio, it's transcribed using Groq's Whisper implementation. If it's an image, a silent handoff is triggered.
3. **Context Retrieval:** The server converts the text into vector embeddings and queries `pgvector` to find relevant business knowledge.
4. **LLM Generation:** The Groq API generates a contextual response based on the system prompt, chat history, and the retrieved vector knowledge.
5. **Delivery & Sync:** The server sends the response back to Instagram via the Graph API and saves the interaction to Supabase, which instantly updates the React dashboard via WebSockets.

---

## ⚙️ Environment Setup

To run this project locally, you will need the following environment variables:

**Backend (`backend/.env`)**
```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
GROQ_API_KEY=your_groq_api_key
META_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

**Frontend (`frontend/.env`)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

---

## 🧪 Testing
The backend business logic (Webhook processing, Meta API integration, and RAG pipelines) is fully covered by unit tests using **Vitest**. Mocks are heavily utilized to isolate database transactions and external API calls.

```bash
cd backend
npm run test
```

---
*Designed and engineered as a robust, production-ready MVP for modern Customer Support.*
