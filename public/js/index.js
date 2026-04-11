let timer = 0;
let isHolding=false
let recognition;


function appendMessage(text, sender) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = `<span class="bubble">${text}</span>`;
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
        recognition.start();
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

    setTimeout(() => {
        const text=document.getElementById("transcript").innerText.trim();
        if(text)
        {
            processTranscript(text);
        }},1000);
    }

    function processTranscript(text) {
        appendMessage(text, "user");
        document.getElementById('transcript').innerText = '';
    }


