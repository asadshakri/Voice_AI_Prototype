# AI ROLEPLAY PROTOTYPE

Voice AI Roleplay prototype is an AI conversation simulation application where a customer (AI) interacts with the store executive (You). The store executive speaks using hold-to-talk voice input. Speech is converted to text, sent to AI, and the AI responds in character. At the end of the session, the system evaluates the candidate and generates a scorecard.

This application is deployed on Render.


### Tech Stack

FRONTEND- HTML, CSS, JAVASCRIPT, BOOTSTRAP  
BACKEND- [NODE.JS/EXPRESS.JS](http://NODE.JS/EXPRESS.JS)  
DATABASE- MONGODB

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

