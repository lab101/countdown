import './style.css'

let targetTime = Date.parse('2025-11-19T11:00:10'); // Set your target date and time here
const MOVE_STEP = 10;
const FONT_STEP = 5;
let posX = 0;
let posY = 0;


function moveElement(dx, dy) {
  posX += dx;
  posY += dy;
  document.getElementById('time').style.transform = `translate(${posX}px, ${posY}px)`;
  saveState();
}

function changeFont(delta) {
  const el = document.getElementById('time');
  const current = parseInt(getComputedStyle(el).fontSize, 10);
  el.style.fontSize = `${current + delta}px`;
  saveState();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
}



function saveState() {
  const el = document.getElementById('time');
  const computed = getComputedStyle(el);

  localStorage.setItem('clockState', JSON.stringify({
    posX,
    posY,
    fontSize: parseInt(computed.fontSize, 10)
  }));
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem('clockState'));
  if (!saved) return;

  posX = saved.posX ?? 0;
  posY = saved.posY ?? 0;

  const el = document.getElementById('time');
  el.style.transform = `translate(${posX}px, ${posY}px)`;

  if (saved.fontSize) {
    el.style.fontSize = saved.fontSize + 'px';
  }
}

function clearState() {
  localStorage.removeItem('clockState');
}



// ========== KEYBOARD ==========
document.addEventListener('keydown', (event) => {
  const key = event.key;

  switch (key) {
    case 'ArrowUp':
      moveElement(0, -MOVE_STEP);
      break;
    case 'ArrowDown':
      moveElement(0, MOVE_STEP);
      break;
    case 'ArrowLeft':
      moveElement(-MOVE_STEP, 0);
      break;
    case 'ArrowRight':
      moveElement(MOVE_STEP, 0);
      break;

    case 'i':
      changeFont(FONT_STEP);
      break;
    case 'o':
      changeFont(-FONT_STEP);
      break;
    case 'c':    
      clearState();
      window.location.reload();
      
      break;

    case 'f':
      toggleFullscreen();
      break;

    default:
      return; 
  }

  event.preventDefault(); // Stop arrow-key scrolling
});



setInterval(() => {
  const timeElement = document.getElementById('time');

  let hours = 0;
  let minutes = 20;
  let seconds = 0;

  let currentTime = Date.now();
  let timeDifference = targetTime - currentTime;

  if (timeDifference < 0) {
    timeDifference = 0; // Countdown has ended
  }

  // Calculate hours, minutes, and seconds remaining
  hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  seconds = Math.floor((timeDifference / 1000) % 60);

  // Format time as HH:MM:SS
  const formattedTime = 
    String(hours).padStart(2, '0') + ':' + 
    String(minutes).padStart(2, '0') + ':' + 
    String(seconds).padStart(2, '0');
  
  // update the display
  timeElement.textContent = formattedTime;

  

}, 1000);


window.onload = () => {
  loadState();
};