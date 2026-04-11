let timer = 0;

function startSimulation() {
    document.getElementById('homeScreen').style.display = "none"
    document.getElementById('roleplayScreen').style.display = "block"
    interval = setInterval(() => {
      timer++;
      document.getElementById('timer').innerText = timer + 's';
    }, 1000);
    
  }