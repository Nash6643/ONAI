# ONAI — AI Vision Assistant

<p align="center">
  <strong>See. Understand. Remember.</strong>
</p>

<p align="center">
  An AI-powered multimodal assistant that combines computer vision, conversational AI, memory retrieval, and voice interaction to help users understand the world around them.
</p>

---

## 📌 Overview

**ONAI** is a personal AI vision assistant designed to interact with the physical world through a camera.

Traditional AI image-analysis applications generally follow a simple pattern:

```text
Image → AI → Response
```

ONAI aims to go further:

```text
Camera
   ↓
Current Visual Context
   ↓
Conversation
   ↓
Memory Retrieval
   ↓
Adaptive Prompt Construction
   ↓
Multimodal AI
   ↓
Context-Aware Response
   ↓
Memory
   ↓
Future Interactions
```

Instead of treating every image as an isolated request, ONAI is designed to maintain an understanding of the user's ongoing interaction.

For example, a user could point the camera at a **phone**, ask what it is, move the camera toward a **book**, and then ask a follow-up question. ONAI should be able to understand that the visual context has changed rather than blindly relying on an older frame.

The long-term goal is to create an assistant that can **see, reason, remember, and interact naturally with its environment.**

---

# ✨ Core Features

## 📷 Real-Time Vision

ONAI uses the device camera as its primary interface with the physical environment.

The camera system allows the user to:

* Capture visual information.
* Send frames to the AI backend.
* Analyze objects and scenes.
* Ask questions about what is currently visible.
* Continue conversations while the visual environment changes.

The system is designed around **fresh visual context** rather than relying permanently on previously captured images.

---

## 🧠 Multimodal AI

ONAI uses Google's Gemini multimodal models to process both:

* Natural-language prompts
* Visual information

This allows questions such as:

```text
"What am I looking at?"
"What's written on this page?"
"What is this object used for?"
"Can you explain what I'm seeing?"
"Is there anything unusual about this?"
```

The AI response is generated using the combination of the user's request and the available visual context.

---

# 💬 Conversational Interaction

ONAI isn't designed to behave like a one-shot image classifier.

The user can maintain a conversation with the assistant.

Example:

```text
User:
"What is this?"

ONAI:
"That's a mechanical keyboard."

User:
"How does it work?"

ONAI:
"It uses individual switches beneath each key..."

User:
"Would it be good for programming?"

ONAI:
"Yes. Mechanical keyboards are popular for programming because..."
```

The conversation provides additional context that can be used when constructing subsequent AI requests.

---

# 🧠 Vision Memory System

One of ONAI's most important features is its **vision memory system**.

A normal vision assistant might forget everything after generating a response.

ONAI instead stores structured information about previous interactions.

A simplified memory entry can contain:

```text
{
    prompt,
    frame,
    response,
    timestamp
}
```

This allows ONAI to retrieve previous interactions when they are relevant to the current conversation.

### Memory Pipeline

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
Add Context to Prompt
       ↓
Generate Response
```

This provides the foundation for a more persistent AI assistant.

---

# 🔎 Memory Search & Retrieval

Simply storing thousands of previous interactions isn't enough.

ONAI needs to determine which memories are relevant.

The memory system therefore separates:

### Memory Storage

Stores previous interactions and their associated visual/contextual information.

### Memory Retrieval

Searches previous interactions for information that could help answer the current request.

### Context Injection

Relevant memories are then incorporated into the prompt sent to the AI model.

This creates a pipeline similar to:

```text
User Request
      ↓
Memory Search
      ↓
Relevant Memories
      ↓
Current Camera Frame
      ↓
Conversation History
      ↓
Adaptive Prompt
      ↓
Gemini
      ↓
Response
```

---

# 🎯 Adaptive Prompt Builder

ONAI doesn't rely on one static prompt for every interaction.

The prompt can be dynamically constructed based on available context.

Potential context includes:

* Current user question
* Current camera frame
* Previous conversation
* Relevant memories
* Previous visual context
* Current interaction state

Conceptually:

```text
Base Instructions
       +
Current Question
       +
Current Visual Context
       +
Conversation Context
       +
Retrieved Memories
       ↓
Adaptive Prompt
       ↓
Gemini
```

This allows the AI to receive only the context that is relevant to the current interaction.

---

# 👁️ Context Awareness

One of the challenges with vision assistants is **stale visual context**.

For example:

```text
1. Camera sees a phone.
2. ONAI identifies the phone.
3. User moves the camera.
4. Camera now sees a book.
5. User asks about the book.
```

A poorly designed system may continue talking about the phone because an old frame remains in memory.

ONAI addresses this by distinguishing between:

### Current Visual Context

What the camera is seeing **right now**.

### Historical Context

What ONAI saw during previous interactions.

This distinction allows memory to provide useful historical information without overriding the current visual state.

---

# 📐 Scan Guide

ONAI includes a visual scan guide to help users focus the camera on a particular region.

Conceptually:

```text
┌─────────────────────────────┐
│                             │
│        CAMERA VIEW          │
│                             │
│       ┌───────────┐         │
│       │           │         │
│       │   SCAN    │         │
│       │   AREA    │         │
│       │           │         │
│       └───────────┘         │
│                             │
│                             │
└─────────────────────────────┘
```

The guide is an interface feature rather than a restriction on the camera itself.

The camera can still provide the full image to the backend while the interface helps the user visually target the object or area they want ONAI to understand.

---

# 🎙️ Voice Interaction

ONAI is being designed for interaction that doesn't require constant typing.

Voice functionality allows users to interact with the assistant through spoken commands.

A typical interaction can become:

```text
User speaks
     ↓
Voice Input
     ↓
Text / Command
     ↓
Vision + Memory
     ↓
AI Response
     ↓
Text-to-Speech
     ↓
User hears response
```

This makes ONAI more suitable for situations where the user's hands are occupied.

---

# 🙌 Hands-Free Mode

ONAI also explores a more natural hands-free interaction model.

Instead of requiring the user to:

```text
Open camera
→ Take image
→ Type question
→ Wait
→ Repeat
```

the long-term interaction model is closer to:

```text
Look
 ↓
Ask
 ↓
ONAI understands
 ↓
Responds
 ↓
Continue
```

This is particularly important for the long-term goal of making ONAI feel like an **assistant rather than an image-analysis tool**.

---

# 🏗️ System Architecture

ONAI is divided into several major components.

```text
                    ┌─────────────────────┐
                    │       USER          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │                     │
                    │ React + TypeScript  │
                    │ Camera Interface    │
                    │ Chat Interface      │
                    │ Voice Interface     │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │      FASTAPI        │
                    │      BACKEND        │
                    │                     │
                    │ API Routes          │
                    │ Request Handling    │
                    │ AI Integration      │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
        ┌─────────────────┐       ┌──────────────────┐
        │   GEMINI AI     │       │  MEMORY SYSTEM   │
        │                 │       │                  │
        │ Vision          │       │ Storage          │
        │ Reasoning       │       │ Retrieval        │
        │ Generation      │       │ Context          │
        └────────┬────────┘       └────────┬─────────┘
                 │                         │
                 └────────────┬────────────┘
                              ▼
                    ┌─────────────────────┐
                    │  CONTEXT-AWARE      │
                    │     RESPONSE        │
                    └─────────────────────┘
```

---

# 🧩 Frontend Architecture

The frontend is built with **React and TypeScript**.

Major components include:

```text
CameraPanel
ChatPanel
Navbar
```

### CameraPanel

Responsible for:

* Camera access
* Capturing frames
* Displaying the live camera
* Scan guide UI
* Connecting camera state with the vision system

### ChatPanel

Responsible for:

* User messages
* AI responses
* Conversation display
* Loading states
* Error states
* Interaction with the chat system

### Vision Context

The application maintains shared vision state so that components can access the current visual frame without tightly coupling the camera component to the rest of the application.

---

# ⚙️ Backend Architecture

The backend uses **FastAPI**.

The backend provides API endpoints for communication between the frontend and the AI system.

A simplified request flow:

```text
Frontend
   │
   │ POST /analyze
   ▼
FastAPI
   │
   ├── Validate request
   │
   ├── Process image
   │
   ├── Build AI context
   │
   ├── Retrieve memory
   │
   └── Call Gemini
            │
            ▼
        AI Response
            │
            ▼
        FastAPI
            │
            ▼
        Frontend
```

---

# 🔌 API

The backend currently exposes core endpoints such as:

### `GET /`

Basic API/root endpoint.

### `GET /health`

Health-check endpoint used to determine whether the backend is running.

### `POST /analyze`

Main vision-analysis endpoint.

Conceptually:

```text
POST /analyze

Input:
    image
    prompt

Processing:
    image → Gemini Vision

Output:
    AI-generated analysis
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| React        | UI framework              |
| TypeScript   | Type safety               |
| Vite         | Development/build tooling |
| Tailwind CSS | Styling                   |
| React Router | Application routing       |
| Axios        | HTTP communication        |
| React Webcam | Camera integration        |
| Lucide React | UI icons                  |

## Backend

| Technology       | Purpose            |
| ---------------- | ------------------ |
| Python           | Backend language   |
| FastAPI          | API framework      |
| Google GenAI SDK | Gemini integration |
| Gemini           | Multimodal AI      |

## Mobile

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React Native | Mobile UI                   |
| Expo         | Mobile development platform |
| TypeScript   | Type safety                 |

---

# 📁 Project Structure

The project is organized around separate frontend, backend, and mobile applications.

```text
ONAI/
│
├── frontend/
│   │
│   ├── src/
│   │   │
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
│   │
│   ├── main.py
│   ├── services/
│   │   └── gemini_service.py
│   ├── utils/
│   └── requirements.txt
│
├── mobile/
│   │
│   ├── app/
│   ├── components/
│   ├── assets/
│   └── package.json
│
├── .gitignore
├── README.md
└── ...
```

> The project structure may change as development continues.

---

# 🚀 Getting Started

## Prerequisites

Before running ONAI, make sure you have:

* Python 3.10+
* Node.js
* npm
* Git
* A Google Gemini API key
* A webcam/camera for vision functionality

For mobile development:

* Expo
* Android Studio and/or an Android device
* Or an iOS development environment

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ONAI.git

cd ONAI
```

---

# 2. Backend Setup

Create a Python virtual environment:

```bash
python -m venv venv
```

Windows:

```powershell
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API should then be available at:

```text
http://localhost:8000
```

FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

---

# 3. Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

---

# 4. Mobile Setup

Navigate to the mobile project:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

You can then run the application using:

* Android emulator
* iOS simulator
* Physical Android device
* Physical iPhone

---

# 🔐 Environment Variables

API keys should **never** be committed to the repository.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Make sure your environment file is ignored:

```text
.env
.env.local
```

A production deployment should use a secure secret-management system rather than exposing API credentials to the frontend.

---

# 🧪 Development Philosophy

ONAI is being developed incrementally using development sprints.

Each sprint focuses on a specific capability rather than attempting to build the entire system at once.

The development process has included:

```text
Core Vision
     ↓
Camera Integration
     ↓
Conversational Interface
     ↓
Vision Context
     ↓
Scan Interface
     ↓
Memory
     ↓
Memory Retrieval
     ↓
Adaptive Prompts
     ↓
Context Awareness
     ↓
Voice / Hands-Free Interaction
     ↓
Mobile Application
     ↓
Future Multimodal Capabilities
```

This approach makes it possible to test each major subsystem independently before combining them.

---

# 🗺️ Development Roadmap

## ✅ Completed

* [x] Initial project architecture
* [x] React frontend
* [x] FastAPI backend
* [x] Gemini integration
* [x] Camera integration
* [x] Image analysis
* [x] Conversational chat
* [x] Vision context
* [x] Camera scan guide
* [x] Vision memory
* [x] Memory search
* [x] Memory retrieval
* [x] Adaptive prompt builder
* [x] Context awareness
* [x] Voice interaction
* [x] Hands-free interaction

## 🚧 In Progress

* [ ] React Native mobile application
* [ ] Mobile camera integration
* [ ] Mobile voice interaction
* [ ] Cross-platform synchronization
* [ ] Improved memory architecture
* [ ] Improved real-time performance

## 🔮 Future

* [ ] Real-time object tracking
* [ ] AI-generated visual annotations
* [ ] Live object identification
* [ ] OCR improvements
* [ ] Scene understanding
* [ ] Persistent long-term memory
* [ ] User personalization
* [ ] Offline/edge AI experimentation
* [ ] Wearable-device integration
* [ ] Smart-glasses compatibility
* [ ] Continuous environmental understanding

---

# 🧪 Example Interaction

Imagine the user is sitting at a desk.

### Step 1 — Camera

ONAI sees:

```text
Laptop
Notebook
Phone
Coffee cup
```

### Step 2 — User

```text
"What objects are on my desk?"
```

### Step 3 — Vision Model

Gemini analyzes the current frame.

### Step 4 — ONAI

The response might be:

```text
"I can see a laptop, a notebook, a phone,
and a coffee cup on your desk."
```

### Step 5 — Follow-up

The user moves the camera toward the notebook:

```text
"What is this used for?"
```

ONAI should prioritize the **current notebook frame**, while still using previous conversation context where appropriate.

This distinction between **current perception** and **historical memory** is fundamental to the design of ONAI.

---

# 🧠 Why ONAI?

The project explores an important question:

> **What happens when an AI assistant can continuously perceive and remember the environment around its user?**

Most AI assistants primarily interact through text or isolated images.

ONAI experiments with a different model:

```text
Language
   +
Vision
   +
Memory
   +
Voice
   +
Context
   =
Personal Multimodal Assistant
```

The goal isn't simply to make another chatbot.

The goal is to build an AI system that can develop an understanding of an ongoing interaction with the physical world.

---

# 🎯 Long-Term Vision

The long-term vision for ONAI is a personal AI assistant that can accompany the user throughout their day.

A future version could potentially:

```text
See an environment
      ↓
Understand objects
      ↓
Understand the user's request
      ↓
Remember relevant history
      ↓
Reason about the situation
      ↓
Respond through voice
      ↓
Continue observing
```

This could eventually enable applications such as:

* Accessibility assistance
* Educational assistance
* Object and scene explanation
* Reading and document assistance
* Navigation assistance
* Personal productivity
* Hands-free computing
* Real-world AI tutoring
* Wearable AI interfaces

---

# 📊 Project Status

**Current Stage:** Active Development

**Latest Major Milestone:** Sprint 12 — Smarter Vision Memory, Memory Search & Retrieval, Adaptive Prompt Builder & Context Awareness

**Current Focus:** Mobile application development and expanding ONAI into a cross-platform multimodal assistant.

---

# 🤝 Contributing

ONAI is currently a personal development project, but feedback, ideas, and technical discussion are welcome.

To contribute:

```bash
git clone https://github.com/YOUR_USERNAME/ONAI.git
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, commit them, and open a pull request.

---

# 📄 License

ONAI is currently under active development.

License information will be added as the project reaches a stable release.

---

# 👨‍💻 Author

**Omar Nashiru-Deen**

Software Engineering Student
AI / Software Engineering Enthusiast

ONAI is an ongoing exploration into multimodal AI, computer vision, conversational systems, memory architectures, and human-computer interaction.

---

<p align="center">
  <strong>ONAI</strong>
  <br>
  <em>See. Understand. Remember.</em>
</p>
