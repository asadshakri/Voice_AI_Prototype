let timer = 0;
let isHolding=false
let recognition;
let mediaRecord;
let audioChunks=[];
let interval;


async function AudioInitiate(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecord = new MediaRecorder(stream);

        mediaRecord.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };

        mediaRecord.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
           
        setTimeout(() => {
            const text = document.getElementById('transcript').innerText.trim();
            if (text) {
                processTranscript(text, audioUrl);
            }
            
            audioChunks = [];
            document.getElementById('transcript').innerText = '';
        }, 500);
    }

    }
    catch(err)
    {
        console.log("Audio initiation error:", err);
    }
}

AudioInitiate();

function appendMessage(text, sender,audioUrl=null) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    let msgContent = `<span class="bubble">${text}`;

    if(audioUrl)
    {
        msgContent += `
        <div class="audio-container mt-2">
          <audio 
            src="${audioUrl}" 
            controls 
            preload="metadata"
            style="height:35px; width:220px; display:block;">
          </audio>
        </div>`;
    }
    msgContent += `</span>`;
    div.innerHTML = msgContent;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }


function startSimulation() {
    document.getElementById('homeScreen').style.display = "none"
    document.getElementById('roleplayScreen').style.display = "block"
    interval = setInterval(() => {
      timer++;
      document.getElementById('timer').innerText = timer + 's';
    }, 1000);

    appendMessage("Hello! My Phone got stolen. Can you help to replace the sim card?", "ai");
    
  }



const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (e) => {
    let transcript = '';
    for (let i = 0; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    document.getElementById('transcript').innerText = transcript;
  };
}


  window.addEventListener("keydown", (event) => {
    if(event.code==="Space" && !isHolding)
    {
      event.preventDefault();
      handlePressDown();
     }
    }
    );

window.addEventListener("keyup", (event) => {
    if(event.code==="Space")
    {
        event.preventDefault();
        handlePressUp();
     }
    }
    );

function handlePressDown(event){
    if(event)
        event.preventDefault();

    if(isHolding)
        return;

    isHolding=true;
    document.getElementById("micBtn").classList.replace("btn-danger","btn-success");
    document.getElementById("micBtn").innerText="Recording... Release to send";
    document.getElementById("statusMic").classList.add("status-act");

    try{
        audioChunks=[];

        recognition.start();

        if(mediaRecord && mediaRecord.state === "inactive")
        {
            mediaRecord.start();
        }
    }
    catch(err)
    {
        console.log("Speech recognition error:", err);
    }

}

function handlePressUp(event) {
    if(event)
        event.preventDefault();
    if (!isHolding) return;
    
    isHolding = false;
    document.getElementById('micBtn').classList.replace('btn-success', 'btn-danger');
    document.getElementById('micBtn').innerText = "🎤 Hold to Talk (or Spacebar)";
    document.getElementById('statusMic').classList.remove('status-act');
    
    recognition.stop();
    if(mediaRecord && mediaRecord.state !== "inactive")
    {
        mediaRecord.stop();
    }
}

    function processTranscript(text,audioUrl) {
        appendMessage(text, "user", audioUrl);
        
    }


