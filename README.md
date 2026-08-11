# ONAI — AI Vision Assistant

> **See. Understand. Remember.**

ONAI is an AI-powered vision assistant that uses a camera, computer vision, and conversational AI to help users understand the world around them.

Instead of simply analyzing a single image, ONAI is designed to maintain conversational context, remember previous interactions, retrieve relevant visual memories, and provide more context-aware responses.

## ✨ Features

* 📷 **Real-Time Vision Analysis** — Analyze what the camera is seeing using Gemini Vision.
* 💬 **Conversational AI** — Ask questions about objects, scenes, and visual information.
* 🧠 **Vision Memory** — Stores previous visual interactions for later retrieval.
* 🔎 **Memory Search & Retrieval** — Finds relevant previous interactions when generating responses.
* 🎯 **Adaptive Prompting** — Builds prompts dynamically based on the current conversation and visual context.
* 🧩 **Context Awareness** — Combines current camera information with previous interactions.
* 📐 **Scan Guide** — Provides a visual guide for focusing on a specific area.
* 🎙️ **Voice Interaction** — Supports voice-based interaction for a more hands-free experience.
* 🙌 **Hands-Free Mode** — Designed for natural interaction without constantly touching the interface.
* 📱 **Mobile Development** — Mobile application development using React Native and Expo.

## 🏗️ Architecture

ONAI is built around a frontend/backend architecture:

```text
                    ┌─────────────────────┐
                    │      Camera         │
                    │   Live Video Feed   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ • Camera UI         │
                    │ • Chat Interface    │
                    │ • Vision Context    │
                    │ • Voice Interaction  │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI API      │
                    │                     │
                    │ • Image Analysis    │
                    │ • Prompt Handling   │
                    │ • Context Handling  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Gemini AI       │
                    │                     │
                    │ Vision + Reasoning  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Memory System     │
                    │                     │
                    │ • Store Memories    │
                    │ • Search Memories   │
                    │ • Retrieve Context  │
                    └─────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Webcam
* Lucide React

### Backend

* Python
* FastAPI
* Google Gemini API
* Google GenAI SDK

### Mobile

* React Native
* Expo
* TypeScript

### AI

* Google Gemini
* Multimodal vision analysis
* Context-aware prompting
* Vision memory and retrieval

## 📁 Project Structure

```text
ONAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraPanel/
│   │   │   ├── ChatPanel/
│   │   │   └── Navbar/
│   │   │
│   │   ├── contexts/
│   │   │   └── VisionContext/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useChat/
│   │   │   └── useMemory/
│   │   │
│   │   ├── services/
│   │   │   └── analyzeImage/
│   │   │
│   │   └── pages/
│   │       └── Home/
│   │
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── services/
│   │   └── gemini_service.py
│   └── ...
│
├── mobile/
│   ├── app/
│   ├── components/
│   └── ...
│
└── README.md
```

> The exact directory structure may evolve as ONAI continues to develop.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ONAI.git
cd ONAI
```

### 2. Set up the backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://localhost:8000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

### 4. Mobile application

The mobile application is built using Expo.

```bash
cd mobile
npm install
npx expo start
```

You can then run the application using an Android/iOS emulator or a physical device through Expo.

## 🔐 Environment Variables

Never commit API keys or other secrets to GitHub.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Make sure `.env` is included in `.gitignore`.

## 🧠 Vision Memory

One of ONAI's core features is its ability to use previous visual interactions as context.

A simplified interaction can be represented as:

```text
User asks a question
        ↓
Camera captures current frame
        ↓
Current image + prompt
        ↓
Memory retrieval
        ↓
Relevant previous context
        ↓
Adaptive prompt construction
        ↓
Gemini Vision
        ↓
Context-aware response
        ↓
Interaction stored as memory
```

This allows ONAI to move beyond simple image recognition toward a more continuous assistant experience.

## 🗺️ Development Roadmap

ONAI is being developed incrementally through development sprints.

### Completed

* [x] Initial AI vision assistant
* [x] Camera integration
* [x] Gemini vision analysis
* [x] Conversational chat
* [x] Vision context
* [x] Scan-area interface
* [x] Vision memory
* [x] Memory search and retrieval
* [x] Adaptive prompt builder
* [x] Context awareness
* [x] Voice interaction
* [x] Hands-free interaction

### In Progress

* [ ] React Native mobile application
* [ ] Improved mobile camera experience
* [ ] Expanded memory capabilities
* [ ] More advanced visual overlays
* [ ] Improved real-time interaction
* [ ] Performance optimization

## 🎯 Long-Term Vision

The goal of ONAI is to become a personal multimodal assistant capable of understanding a user's environment rather than simply responding to isolated prompts.

Future versions may explore:

* Continuous visual understanding
* Object tracking
* Real-time AI annotations
* Improved long-term memory
* Personalized user context
* Offline/edge capabilities
* More natural voice conversations
* Wearable-device integration

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes.
5. Open a pull request.

## 📄 License

This project is currently under development.

License information will be added as the project matures.

---

**ONAI — an AI assistant designed to see, understand, and remember.**
