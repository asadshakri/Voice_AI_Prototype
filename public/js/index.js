const backendUrl = "hhttps://voice-ai-prototype.onrender.com";

let timer = 0;
let isHolding = false;
let mediaRecord = null;
let audioChunks = [];
let interval;
let stream = null;

function getSupportedMimeType() {
  return ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t)) || '';
}

function appendMessage(text, sender, audioUrl = null) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  let msgContent = `<span class="bubble">${text}`;
  if (audioUrl) {
    msgContent += `
      <div class="audio-container mt-2">
        <audio src="${audioUrl}" controls preload="metadata"
          style="height:35px; width:160px; display:block;">
        </audio>
      </div>`;
  }
  msgContent += `</span>`;
  div.innerHTML = msgContent;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function startSimulation() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("roleplayScreen").style.display = "block";

  const uuid = await axios.get(`${backendUrl}/create/uuid`);
  localStorage.setItem("uuid", uuid.data.uuid);

  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = timer + "s";
  }, 1000);

  appendMessage("Hello! My Phone got stolen. Can you help to replace the sim card?", "ai");
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !isHolding) {
    event.preventDefault();
    handlePressDown();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    handlePressUp();
  }
});

function handlePressDown(event) {
  if (event) 
    event.preventDefault();
  if (isHolding) 
    return;
  isHolding = true;

  document.getElementById("micBtn").classList.replace("btn-danger", "btn-success");
  document.getElementById("micBtn").innerText = "Recording... Release to send";
  document.getElementById("statusMic").classList.add("status-act");
  document.getElementById("transcript").innerText = "Listening...";


  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(s => {
      stream = s;
      audioChunks = [];
      const mimeType = getSupportedMimeType();
      mediaRecord = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecord.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecord.start(250);
    })
    .catch(err => {
      console.error("Mic error:", err);
      isHolding = false;
      document.getElementById("micBtn").classList.replace("btn-success", "btn-danger");
      document.getElementById("micBtn").innerText = "🎤 Hold to Talk (or Spacebar)";
      document.getElementById("statusMic").classList.remove("status-act");
      document.getElementById("transcript").innerText = "";
    });
}

async function handlePressUp(event) {
  if (event) 
    event.preventDefault();
  if (!isHolding) 
    return;
  isHolding = false;

  document.getElementById("micBtn").classList.replace("btn-success", "btn-danger");
  document.getElementById("micBtn").innerText = "🎤 Hold to Talk (or Spacebar)";
  document.getElementById("statusMic").classList.remove("status-act");
  document.getElementById("transcript").innerText = "Transcribing...";

  if (mediaRecord && mediaRecord.state !== "inactive") {
    mediaRecord.stop();
  }
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }

  setTimeout(async () => {
    if (audioChunks.length === 0) {
      document.getElementById("transcript").innerText = "No audio captured.";
      return;
    }

    const mimeType = getSupportedMimeType() || "audio/webm";
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioChunks = [];

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await axios.post(`${backendUrl}/generate/transcript`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const text = response.data.transcript?.trim();
      document.getElementById("transcript").innerText = text || "";
      if (text)
         processTranscript(text, audioUrl);
    } catch (err) {
      console.error("Transcription failed:", err);
      document.getElementById("transcript").innerText = "Transcription failed.";
    }
  }, 300);
}

async function processTranscript(text, audioUrl) {
  appendMessage(text, "user", audioUrl);
  try {
    const uuid = localStorage.getItem("uuid");
    const response = await axios.post(`${backendUrl}/api/ai/chat`, {
      transcription: text,
      uuid: uuid,
    });
    if (response.data.message) {
      appendMessage(response.data.message, "ai");
      speakRahul(response.data.message);
    }
  } catch (err) {
    console.error("Connection error:", err);
    appendMessage("System error: Could not reach Rahul.", "ai");
  }
}

function speakRahul(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  window.speechSynthesis.speak(utterance);
}

const getBarColor = (score) => {
  if (score >= 7) return "bg-success";
  else if (score >= 4) return "bg-warning";
  else return "bg-danger";
};

async function endSession() {
  clearInterval(interval);
  const uuid = localStorage.getItem("uuid");

  document.getElementById("roleplayScreen").style.display = "none";
  document.getElementById("loadingScreen").style.display = "block";

  try {
    const response = await axios.post(`${backendUrl}/api/ai/feedback`, { uuid });
    if (response.data.feedback) {
      const scores = response.data.feedback;
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("score").style.display = "block";

      document.getElementById("scoreBody").innerHTML = `
        <div class="card mb-4 border-0 bg-light">
          <div class="card-body">
            <h5 class="card-title">Rahul Feedback</h5>
            <p class="card-text">"${scores.feedback}"</p>
          </div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>Communication</span><span class="fw-bold">${scores.communication}</span>
          </div>
          <div class="progress" style="height:12px;">
            <div class="progress-bar ${getBarColor(scores.communication)}" style="width:${scores.communication * 10}%"></div>
          </div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>Professionalism</span><span class="fw-bold">${scores.professionalism}</span>
          </div>
          <div class="progress" style="height:12px;">
            <div class="progress-bar ${getBarColor(scores.professionalism)}" style="width:${scores.professionalism * 10}%"></div>
          </div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>Resolution</span><span class="fw-bold">${scores.resolution}</span>
          </div>
          <div class="progress" style="height:12px;">
            <div class="progress-bar ${getBarColor(scores.resolution)}" style="width:${scores.resolution * 10}%"></div>
          </div>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>Knowledge</span><span class="fw-bold">${scores.knowledge}</span>
          </div>
          <div class="progress" style="height:12px;">
            <div class="progress-bar ${getBarColor(scores.knowledge)}" style="width:${scores.knowledge * 10}%"></div>
          </div>
        </div>`;
    }
  } catch (err) 
  {
    alert("Could not fetch feedback. Please try again later.");
    document.getElementById("loadingScreen").style.display = "none";
    window.location.reload();
  }
}