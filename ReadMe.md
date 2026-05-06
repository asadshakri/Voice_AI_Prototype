# 🎭 AI Roleplay Prototype

An AI-powered **voice conversation simulation platform** where a customer (AI) interacts with a store executive (user). The executive communicates via **hold-to-talk voice input**, and the system evaluates performance at the end of the session.

🌐 **Deployment:** Render

---

## Demo
```
https://drive.google.com/file/d/1Hk59mf4sq8Y8Rj2ybwtdztMiNk0TdAXG/view?usp=drive_link
```

## 🚀 Features

* 🎤 Voice-based interaction (hold-to-talk)
* 🧠 AI-generated responses (Claude Sonnet)
* 🔊 Text-to-Speech playback
* 📝 Speech-to-Text transcription
* 💾 Chat history stored in MongoDB
* 📊 AI-generated performance scorecard

---

## 🧱 Tech Stack

**Frontend:** HTML, CSS, JavaScript, Bootstrap
**Backend:** Node.js, Express.js
**Database:** MongoDB

---

## 🔄 Project Flow

1. **Start Session**

   * User clicks *Start Chat*
   * API generates a unique `sessionId`

2. **Voice Input**

   * User holds mic to speak
   * Audio is recorded

3. **Speech-to-Text**

   * Audio sent to **AssemblyAI API**
   * Transcript returned

4. **Chat UI Update**

   * Transcript displayed in chat
   * Audio playback available

5. **AI Response Generation**

   * Transcript sent to **Claude API**
   * AI responds in character

6. **Store Conversation**

   * Messages stored in MongoDB using sessionId

7. **Text-to-Speech**

   * AI response converted to voice using **Web Speech API**

8. **End Session**

   * User clicks *End Session*
   * Feedback API is triggered

9. **Evaluation**

   * Server fetches full conversation
   * AI generates scorecard

---

## 🔌 APIs Used

* 🗣️ **Speech-to-Text:** AssemblyAI API
* 🔊 **Text-to-Speech:** Web Speech API
* 🤖 **AI Responses:** Claude Sonnet API

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd project-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
PORT=4000
MONGO_URI=************
CLAUDE_API_KEY=************
ASSEMBLYAI_API_KEY=************
PROTOCOL=http
HOST=localhost
```

### 4. Run Server

```bash
node app.js
```

---

## 📡 API Endpoints

### 1️⃣ Create Session

**GET** `/create/uuid`

**Response**

```json
{
  "uuid": "generated-session-id"
}
```

---

### 2️⃣ Generate Transcript

**POST** `/generate/transcript`

**Body:** Form-data (Audio file)

**Response**

```json
{
  "transcript": "hello hello"
}
```

---

### 3️⃣ AI Chat

**POST** `/api/ai/chat`

**Request Body**

```json
{
  "transcription": "Sir my phone was stolen",
  "uuid": "session-id"
}
```

**Response**

```json
{
  "message": "Yes please help me quickly"
}
```

---

### 4️⃣ AI Feedback

**POST** `/api/ai/feedback`

**Request Body**

```json
{
  "uuid": "session-id"
}
```

**Response**

```json
{
  "feedback": {
    "communication": 8,
    "professionalism": 7,
    "resolution": 9,
    "knowledge": 8,
    "feedback": "You handled the situation effectively with clear communication."
  }
}
```

---

## 🎯 Key Highlights

* Real-time voice interaction system
* AI-driven evaluation and scoring
* Session-based conversation tracking
* Scalable architecture with external APIs



