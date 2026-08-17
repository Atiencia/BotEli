# Eli Bot - AI Customer Service SaaS

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://botfrontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Meta API](https://img.shields.io/badge/Meta_Graph_API-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://developers.facebook.com/)

**Eli Bot** is a production-ready, AI-powered Customer Service SaaS designed to automate Instagram and Messenger interactions. It leverages state-of-the-art LLMs (Llama 3.1) and Semantic Search (RAG) to provide autonomous, accurate responses while seamlessly blending with a real-time human handoff interface.

**[Try the Interactive Live Demo!](https://botfrontend.vercel.app/)**

---

## Key Features

- **Autonomous Auto-Learning:** The true magic of Eli Bot. When a human agent intervenes to answer a complex question, the AI evaluates the response. If it contains valuable new business logic, the bot automatically extracts, embeds, and saves it to its vector database to use in future conversations.
- **Voice Note Transcription:** Automatically downloads and transcribes audio messages sent by customers on Instagram, allowing the AI to process and answer voice notes as if they were text.
- **Silent Human Handoff:** Automatically detects when human intervention is needed (e.g., when a user sends a photo or asks an unknown question) and pauses the bot silently, without disrupting the customer's experience.
- **Semantic Search (RAG):** Uses **Supabase `pgvector`** to store and query the knowledge base, ensuring the AI only answers using company-approved information and never hallucinates policies or prices.
- **Real-Time Dashboard:** A responsive, multi-tenant React dashboard featuring live chat metrics (Recharts), global state caching (Context API), and real-time WebSocket updates powered by Supabase Realtime.
- **Hyper-Realistic Simulator:** The landing page features a virtual iPhone mock-up that interacts directly with the backend, allowing users to experience the bot exactly as it works on Instagram Direct.

---

## Tech Stack & Architecture

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

## How It Works (The Pipeline)

1. **Meta Webhook:** A customer sends a message or voice note on Instagram. The Node.js server receives the event.
2. **Media Processing:** If it's audio, it's transcribed using Groq's Whisper implementation. If it's an image, a silent handoff is triggered.
3. **Context Retrieval:** The server converts the text into vector embeddings and queries `pgvector` to find relevant business knowledge.
4. **LLM Generation:** The Groq API generates a contextual response based on the system prompt, chat history, and the retrieved vector knowledge.
5. **Delivery & Sync:** The server sends the response back to Instagram via the Graph API and saves the interaction to Supabase, which instantly updates the React dashboard via WebSockets.

---

## Environment Setup

To run this project locally, you will need the following environment variables:

**Backend (`BotBackend/.env`)**
```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
GROQ_API_KEY=your_groq_api_key
META_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

**Frontend (`BotFrontend/.env`)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

---

## Testing
The backend business logic (Webhook processing, Meta API integration, and RAG pipelines) is fully covered by unit tests using **Vitest**. Mocks are heavily utilized to isolate database transactions and external API calls.

```bash
cd BotBackend
npm run test
```

---
*Designed and engineered as a robust, production-ready MVP for modern Customer Support.*

---
---

# Eli Bot - SaaS de Servicio al Cliente con IA

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://botfrontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Meta API](https://img.shields.io/badge/Meta_Graph_API-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://developers.facebook.com/)

**Eli Bot** es un SaaS de servicio al cliente impulsado por IA, listo para producción y diseñado para automatizar interacciones en Instagram y Messenger. Utiliza LLMs de última generación y Búsqueda Semántica (RAG) para proporcionar respuestas autónomas y precisas, al mismo tiempo que se integra perfectamente con una interfaz de transferencia a humanos en tiempo real.

**[¡Prueba la Demo Interactiva en Vivo!](https://botfrontend.vercel.app/)**

---

## Características Principales

- **Auto-Aprendizaje Autónomo:** La verdadera magia de Eli Bot. Cuando un agente humano interviene para responder una pregunta compleja, la IA evalúa la respuesta. Si contiene nueva lógica de negocio valiosa, el bot la extrae automáticamente, la convierte en embeddings y la guarda en su base de datos vectorial para usarla en futuras conversaciones.
- **Transcripción de Notas de Voz:** Descarga y transcribe automáticamente los mensajes de audio enviados por los clientes en Instagram, permitiendo que la IA procese y responda notas de voz como si fueran texto.
- **Transferencia Silenciosa a Humanos (Handoff):** Detecta automáticamente cuando se necesita intervención humana (por ejemplo, cuando un usuario envía una foto o hace una pregunta desconocida) y pausa el bot silenciosamente, sin interrumpir la experiencia del cliente.
- **Búsqueda Semántica (RAG):** Utiliza **Supabase `pgvector`** para almacenar y consultar la base de conocimientos, asegurando que la IA solo responda usando información aprobada por la empresa y nunca alucine políticas o precios.
- **Panel de Control en Tiempo Real:** Un dashboard responsivo en React multi-inquilino que muestra métricas de chat en vivo (Recharts), caché de estado global (Context API) y actualizaciones en tiempo real a través de WebSockets impulsadas por Supabase Realtime.
- **Simulador Hiper-Realista:** La página de inicio cuenta con un modelo virtual de iPhone que interactúa directamente con el backend, permitiendo a los usuarios experimentar el bot exactamente como funciona en Instagram Direct.

---

## Stack Tecnológico y Arquitectura

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Estilos:** Tailwind CSS (UI personalizada Glassmorphism azul cielo)
- **Gestión de Estado:** React Context API + Custom Hooks
- **Visualización de Datos:** Recharts
- **Iconos y UI:** Lucide React, React Hot Toast

### Backend (Serverless)
- **Entorno de Ejecución:** Node.js + Express (Desplegado en Vercel Serverless Functions)
- **Inferencia de IA:** Groq SDK (`openai/gpt-oss-20b`) para generación con latencia ultra baja.
- **Integraciones:** Meta Graph API (Webhooks, Mensajería, Descarga de medios)
- **Fiabilidad:** Cron Jobs automatizados en Vercel para evitar la pausa de la base de datos.

### Base de Datos y Seguridad
- **Base de Datos:** Supabase (PostgreSQL)
- **Base de Datos Vectorial:** `pgvector` para coincidencia local de embeddings (RAG).
- **Seguridad:** Seguridad a Nivel de Fila (RLS) para aislamiento seguro multi-inquilino.
- **Almacenamiento:** Supabase Storage para los archivos adjuntos de imágenes del chat.

---

## Cómo Funciona (El Pipeline)

1. **Webhook de Meta:** Un cliente envía un mensaje o nota de voz en Instagram. El servidor Node.js recibe el evento.
2. **Procesamiento de Medios:** Si es audio, se transcribe utilizando la implementación Whisper de Groq. Si es una imagen, se activa una transferencia silenciosa a un humano.
3. **Recuperación de Contexto:** El servidor convierte el texto en embeddings vectoriales y consulta `pgvector` para encontrar conocimiento relevante del negocio.
4. **Generación LLM:** La API de Groq genera una respuesta contextual basada en el prompt del sistema, el historial de chat y el conocimiento vectorial recuperado.
5. **Entrega y Sincronización:** El servidor envía la respuesta de vuelta a Instagram a través de la Graph API y guarda la interacción en Supabase, lo que actualiza instantáneamente el dashboard de React a través de WebSockets.

---

## Configuración del Entorno

Para ejecutar este proyecto localmente, necesitarás las siguientes variables de entorno:

**Backend (`BotBackend/.env`)**
```env
PORT=3000
SUPABASE_URL=tu_url_del_proyecto_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_de_supabase
GROQ_API_KEY=tu_api_key_de_groq
META_WEBHOOK_VERIFY_TOKEN=tu_token_de_verificacion_personalizado
```

**Frontend (`BotFrontend/.env`)**
```env
VITE_SUPABASE_URL=tu_url_del_proyecto_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_API_URL=http://localhost:3000/api
```

---

## Pruebas
La lógica de negocio del backend (procesamiento de Webhooks, integración con Meta API y pipelines RAG) está completamente cubierta por pruebas unitarias usando **Vitest**. Los mocks se utilizan intensamente para aislar transacciones de bases de datos y llamadas a APIs externas.

```bash
cd BotBackend
npm run test
```

---
*Diseñado y desarrollado como un MVP robusto y listo para producción para el Servicio al Cliente moderno.*
