
<div align="center">

# ONAI — AI Vision Assistant

### See. Understand. Remember.

An AI-powered multimodal assistant that combines computer vision, conversational AI, memory retrieval, and voice interaction to help users understand the world around them.

<p>
  <img src="https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge" alt="Project Status" />
  <img src="https://img.shields.io/badge/React-TypeScript-3178C6?style=for-the-badge&logo=react" alt="React and TypeScript" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=googlegemini" alt="Google Gemini" />
</p>

</div>

---

## 📌 Overview

**ONAI** is a personal AI vision assistant designed to bridge the gap between artificial intelligence and the physical world.

Instead of treating every image as an isolated request, ONAI explores how an AI assistant can combine live visual input, natural conversation, and relevant memories to provide more context-aware responses.

Traditional image analysis:

```text
Image → AI → Response
```

The ONAI approach:

```text
Camera Input
     ↓
Current Visual Context
     ↓
Conversation History
     ↓
Relevant Memory Retrieval
     ↓
Adaptive Prompt Construction
     ↓
Multimodal AI
     ↓
Context-Aware Response
     ↓
Memory for Future Interactions
```

Imagine pointing your camera at a phone and asking what it is. You then move the camera toward a book and ask another question. ONAI is designed to prioritize the new visual input while retaining relevant information from the previous conversation.

**The goal is to build an assistant that can see, understand, remember, and interact naturally with its environment.**

## ✨ Core Features

### 📷 Camera-Based Vision

- Capture visual information through the device camera.
- Analyze objects, scenes, and documents.
- Ask questions about what is currently visible.
- Use updated visual input during continued interactions.

### 🤖 Multimodal AI

Powered by Google's Gemini models, ONAI combines visual information with natural-language prompts to generate contextual responses.

Example questions:

- "What am I looking at?"
- "What's written on this page?"
- "What is this object used for?"
- "Can you explain what I'm seeing?"
- "What is different between these two objects?"

### 💬 Conversational Interaction

ONAI is designed to support follow-up questions instead of requiring a new, isolated image-analysis request every time.

```text
User: What is this?

ONAI: That appears to be a mechanical keyboard.

User: How does it work?

ONAI: It uses individual switches beneath the keys.

User: Would it be useful for programming?

ONAI: Yes, many people prefer mechanical keyboards
      for their tactile feedback and typing experience.
```

### 🧠 Vision Memory

ONAI includes a memory system intended to preserve useful information from previous interactions.

A simplified memory entry may contain:

```text
{
    prompt,
    frame,
    response,
    timestamp
}
```

The memory pipeline:

```text
Current Interaction
        ↓
Generate Response
        ↓
Create Memory
        ↓
Store Interaction
        ↓
Future User Request
        ↓
Search Previous Memories
        ↓
Retrieve Relevant Context
        ↓
Generate Context-Aware Response
```

### 🔎 Memory Search and Retrieval

Storing previous interactions is only part of the challenge. ONAI also aims to identify which memories are relevant to the user's current request.

The memory system separates:

- **Memory storage** — preserving information from previous interactions.
- **Memory retrieval** — searching for useful historical context.
- **Context injection** — including relevant memories when constructing an AI request.

### 🎯 Adaptive Prompt Builder

Rather than relying on one static prompt, ONAI can construct prompts using available context, including:

- The current user question.
- The current camera frame.
- Previous conversation messages.
- Relevant retrieved memories.
- Previous visual context.
- The current interaction state.

This helps provide the AI model with information relevant to the current interaction.

### 👁️ Context Awareness

One important challenge for vision assistants is stale visual context.

Consider this scenario:

1. The camera sees a phone.
2. ONAI identifies the phone.
3. The user moves the camera.
4. The camera now sees a book.
5. The user asks a question about the book.

ONAI is designed to distinguish between:

- **Current visual context:** what the latest camera input shows.
- **Historical context:** what appeared during previous interactions.

The intention is to use memory to improve continuity without allowing an old image to override the current view.

### 🎙️ Voice and Hands-Free Interaction

ONAI explores voice interaction as a more natural alternative to constantly typing questions.

```text
User Speaks
     ↓
Voice Input
     ↓
Text or Command
     ↓
Vision + Memory
     ↓
AI Response
     ↓
Text-to-Speech
     ↓
User Hears Response
```

The long-term goal is to make interaction feel closer to a natural conversation:

**Look → Ask → Understand → Respond → Continue**

### 📱 Mobile Application

ONAI is also being developed toward a cross-platform experience using React Native and Expo.

Planned mobile work includes camera integration, voice interaction, and improved synchronization between platforms.

---

## 🏗️ System Architecture

ONAI is organized around a frontend, a backend API, a multimodal AI service, and a memory system.

```text
                   ┌──────────────────────┐
                   │         USER         │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │       FRONTEND       │
                   │                      │
                   │ React + TypeScript   │
                   │ Camera Interface     │
                   │ Chat Interface       │
                   │ Voice Interface      │
                   └──────────┬───────────┘
                              │ HTTP
                              ▼
                   ┌──────────────────────┐
                   │     FASTAPI API      │
                   │                      │
                   │ Request Handling     │
                   │ AI Integration       │
                   │ Context Preparation  │
                   └──────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
       ┌──────────────────┐     ┌──────────────────┐
       │    GEMINI AI     │     │  MEMORY SYSTEM   │
       │                  │     │                  │
       │ Vision           │     │ Storage          │
       │ Reasoning        │     │ Search           │
       │ Generation       │     │ Retrieval        │
       └─────────┬────────┘     └─────────┬────────┘
                 │                        │
                 └────────────┬───────────┘
                              ▼
                   ┌──────────────────────┐
                   │ CONTEXT-AWARE OUTPUT │
                   └──────────────────────┘
```

### Request Lifecycle

1. The frontend captures the user's question and available visual input.
2. The request is sent to the FastAPI backend.
3. The backend validates and processes the request.
4. Relevant conversation and memory context are prepared.
5. Gemini processes the visual input and prompt.
6. The response is returned to the frontend.
7. Interaction information can be stored for future retrieval.

---

## 🧩 Frontend Architecture

The frontend is built with React and TypeScript.

| Component | Responsibility |
|---|---|
| `CameraPanel` | Camera access, frame capture, and scan guide UI |
| `ChatPanel` | User messages, AI responses, loading, and error states |
| `Navbar` | Application navigation |
| `VisionContext` | Shared visual state across components |
| `useChat` | Chat-related interaction logic |
| `useMemory` | Memory-related interaction logic |
| `analyzeImage` | Communication with the image-analysis API |

The frontend separates camera functionality, conversation UI, and shared vision state to make the application easier to maintain and extend.

## ⚙️ Backend Architecture

The backend uses Python and FastAPI to handle communication between the frontend and the AI services.

The main request flow is:

```text
Frontend
   │
   ▼
POST /analyze
   │
   ▼
Validate Request
   │
   ▼
Process Visual Input
   │
   ▼
Retrieve Relevant Context
   │
   ▼
Build AI Prompt
   │
   ▼
Call Gemini
   │
   ▼
Return AI Response
```

The backend is intended to keep API credentials and AI-service communication away from the public frontend.

## 🔌 API Endpoints

The backend includes the following core endpoints in its current design.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Basic API/root endpoint |
| `GET` | `/health` | Backend health check |
| `POST` | `/analyze` | Analyze visual input using a prompt |

For example, the main analysis endpoint conceptually accepts:

```text
POST /analyze

Input:
  image
  prompt

Processing:
  Visual input + AI context
          ↓
       Gemini

Output:
  AI-generated analysis
```

For the actual request schema and response format, consult the FastAPI documentation at `/docs` when the backend is running.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| React Router | Application routing |
| Axios | HTTP communication |
| React Webcam | Camera integration |
| Lucide React | UI icons |

### Backend and AI

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | API framework |
| Google GenAI SDK | Gemini integration |
| Google Gemini | Multimodal AI processing |

### Mobile

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo | Mobile development tooling |
| TypeScript | Type safety |

---

## 📁 Project Structure

The repository is organized into separate frontend, backend, and mobile applications.

```text
ONAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraPanel/
│   │   │   ├── ChatPanel/
│   │   │   └── Navbar/
│   │   ├── contexts/
│   │   │   └── VisionContext/
│   │   ├── hooks/
│   │   │   ├── useChat/
│   │   │   └── useMemory/
│   │   ├── services/
│   │   │   └── analyzeImage/
│   │   └── pages/
│   │       └── Home/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── services/
│   │   └── gemini_service.py
│   ├── utils/
│   └── requirements.txt
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── assets/
│   └── package.json
│
├── .gitignore
└── README.md
```

*The structure may evolve as development continues.*

---

## 🚀 Getting Started

### Prerequisites

Before running ONAI, make sure you have:

- Python 3.10 or newer.
- Node.js and npm.
- Git.
- A Google Gemini API key.
- A webcam or camera for vision functionality.

For mobile development, you may also need Expo and an Android or iOS development environment.

### 1. Clone the Repository

Replace `YOUR_USERNAME` with the GitHub account or organization hosting the repository.

```bash
git clone https://github.com/YOUR_USERNAME/ONAI.git
cd ONAI
```

### 2. Backend Setup

Create a Python virtual environment from the repository root.

**Windows PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Create a `.env` file in the location expected by the backend configuration and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend from the `backend` directory:

```bash
cd backend
uvicorn main:app --reload
```

The backend should be available at:

- **API:** `http://localhost:8000`
- **Interactive documentation:** `http://localhost:8000/docs`
- **Health check:** `http://localhost:8000/health`

*These commands assume the project structure shown above. Adjust the paths if your local configuration differs.*

### 3. Frontend Setup

Open a separate terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite commonly serves the frontend at:

```text
http://localhost:5173
```

Use the URL printed in your terminal if a different port is selected.

If the frontend requires a backend URL environment variable, configure it according to the variable names used in your code.

**Never expose your Gemini API key in frontend code.**

### 4. Mobile Setup

If the mobile project is configured and ready to run:

```bash
cd mobile
npm install
npx expo start
```

Follow the Expo instructions to launch the app on a compatible emulator or physical device.

---

## 🔐 Security and Privacy

Security matters for an application that works with camera input, voice interaction, and stored memories.

- Never commit API keys, passwords, or other secrets.
- Keep `.env` files out of version control.
- Send Gemini API requests through the backend rather than exposing private credentials in the frontend.
- Treat camera frames, voice input, and stored memories as potentially sensitive information.
- Be transparent about what information is sent to external services and what is stored.
- Review memory retention and deletion behavior before using the application with sensitive data.
- Use secure secret management and appropriate access controls in production.

Example environment configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Add the relevant environment files to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Only include the exception for `.env.example` if that file contains placeholders and no real secrets.

---

## 🧪 Development Philosophy

ONAI is being developed incrementally, with each stage building on the previous one.

```text
Core Vision
    ↓
Camera Integration
    ↓
Conversational Interface
    ↓
Shared Vision Context
    ↓
Scan Guide
    ↓
Vision Memory
    ↓
Memory Search and Retrieval
    ↓
Adaptive Prompt Builder
    ↓
Context Awareness
    ↓
Voice and Hands-Free Interaction
    ↓
Mobile Application
    ↓
Future Multimodal Capabilities
```

This approach allows individual systems to be tested and improved before they are combined into a more complex experience.

---

## 🗺️ Development Roadmap

### ✅ Completed Milestones

- [x] Initial project architecture
- [x] React frontend
- [x] FastAPI backend
- [x] Gemini integration
- [x] Camera integration
- [x] Image analysis
- [x] Conversational chat
- [x] Shared vision context
- [x] Camera scan guide
- [x] Vision memory foundation
- [x] Memory search
- [x] Memory retrieval
- [x] Adaptive prompt builder
- [x] Context awareness
- [x] Voice interaction foundations
- [x] Hands-free interaction foundations

### 🚧 In Progress

- [ ] React Native mobile application
- [ ] Mobile camera integration
- [ ] Mobile voice interaction
- [ ] Cross-platform synchronization
- [ ] Improved memory architecture
- [ ] Improved real-time performance

### 🔮 Future Plans

- [ ] Real-time object tracking
- [ ] AI-generated visual annotations
- [ ] Live object identification
- [ ] Improved OCR and document reading
- [ ] Advanced scene understanding
- [ ] Persistent long-term memory
- [ ] User personalization
- [ ] Offline and edge-AI experimentation
- [ ] Wearable-device integration
- [ ] Smart-glasses compatibility
- [ ] Continuous environmental understanding

---

## 🌍 Potential Applications

The long-term vision for ONAI could support applications such as:

- **Accessibility:** helping users interpret objects and visual information.
- **Education:** explaining objects, concepts, and documents.
- **Productivity:** interacting with information in the physical environment.
- **Document assistance:** helping users understand visible text.
- **Hands-free computing:** interacting through voice and visual context.
- **Personal AI assistance:** connecting current observations with relevant interaction history.
- **Wearable AI:** exploring future smart-glasses and wearable interfaces.

These are potential directions for future development, not a guarantee that every use case is currently implemented.

## 🤝 Contributing

ONAI is currently a personal development project, but feedback, ideas, bug reports, and technical discussions are welcome.

To start working on a change:

```bash
git clone https://github.com/YOUR_USERNAME/ONAI.git
cd ONAI
git checkout -b feature/your-feature
```

Make your changes, test them, and commit with a clear message before opening a pull request.

## 📊 Project Status

| Item | Details |
|---|---|
| Project | ONAI — AI Vision Assistant |
| Status | Active development |
| Latest major milestone | Sprint 12 |
| Milestone focus | Vision memory, memory search and retrieval, adaptive prompt building, and context awareness |
| Current focus | Mobile development and cross-platform multimodal interaction |

## 📄 License

ONAI is currently under active development, and a license has not yet been specified.

Until a license is added to the repository, permission to reuse, modify, or distribute the project should not be assumed.

## 👨‍💻 Author

**Omar Nashiru-Deen**  
Software Engineering Student  
AI & Software Engineering Enthusiast

ONAI is an ongoing exploration of multimodal AI, computer vision, conversational systems, memory architectures, and human-computer interaction.

---

<div align="center">

### ONAI

**See. Understand. Remember.**

*Building toward a more context-aware way to interact with AI and the world around us.*

</div>
