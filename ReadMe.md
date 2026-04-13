# AI ROLEPLAY PROTOTYPE

Voice AI Roleplay prototype is an AI conversation simulation application where a customer (AI) interacts with the store executive (You). The store executive speaks using hold-to-talk voice input. Speech is converted to text, sent to AI, and the AI responds in character. At the end of the session, the system evaluates the candidate and generates a scorecard.

This application is deployed on Render.


### Tech Stack

FRONTEND- HTML, CSS, JAVASCRIPT, BOOTSTRAP  
BACKEND- [NODE.JS/EXPRESS.JS](http://NODE.JS/EXPRESS.JS)  
DATABASE- MONGODB

### PROJECT FLOW

1. Home page start chat button is clicked. It call a session id generate API to generate a session Id to store the full one time conversation.
2. when hold mic to speak, it record the audio and call AssemblyAI API (speech to text convert). Send the transcript to the client.
3. The Transcript gets appended to chat box with audio playback.
4. Call an Claude API for response.
5. The chats get stored in mongoDB.
6. Claude sends the response and it get converted to speech using Web Speech API.
7. End Session button clicked to call feedback APi.
8. Sserver load the full chat using session ID and give feedback.

### API used

Speech to text- AssemblyAI API  
Text to Speech- Web speech API  
Ai Response- Claude Sonnet API



### Local Setup

1. Clone Repository  
   

git clone \<your-repo-url\>  
cd project-name

2. Install Dependencies

npm  install

3. Create .env file

PORT=4000  
MONGO\_URI= \*\*\*\*\*\*\*\*\*\*\*  
CLAUDE\_API\_KEY= \*\*\*\*\*\*\*\*\*\*  
ASSEMBLYAI\_API\_KEY= \*\*\*\*\*\*\*\*\*\*\*\*\*  
PROTOCOL= http(or https)  
HOST= localhost

4. Run server

node [app.js](http://app.js)



### API ENDPOINTS

1. GET /create/uuid

Response  
{  
  "uuid": "generated-session-id"  
}

2. POST /generate/transcript

Form Data- Audio file

Response  
{  
  "transcript": "hello hello"  
}

3. POST /api/ai/chat

Body  
{  
  "transcription": "Sir my phone was stolen",  
  "uuid": "session-id"  
}

Response  
{  
  "message": "Yes please help me quickly"  
}

4. POST /api/ai/feedback

Body  
{  
  "uuid": "session-id"  
}

Response  
{  
  "feedback": {  
    "communication": 8,  
    "professionalism": 7,  
    "resolution": 9,  
    "knowledge": 8,  
    "feedback": "You handled ………………."  
  }  
}

