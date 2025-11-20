import './style.css'

let targetTime = Date.parse('2025-11-20T19:00:00'); // Set your target date and time here
const MOVE_STEP = 10;
const SCALE_STEP = 5;
let posX = 0;
let posY = 0;

let scale = 1.0;
let rotation = 0;

let perspective = 480;

function moveElement(dx, dy) {
  posX += dx;
  posY += dy;

  setTransform();
  saveState();
}

function changeScale(delta) {
  scale += delta / 100;
  setTransform();
  saveState();
}

function changeRotation(delta) {
  rotation += delta;
  setTransform();
  saveState();
}

function changePerspective(delta) {
  perspective += delta;
  document.getElementById('app').style.perspective = `${perspective}px`;
  saveState();
}

function setTransform() {
  document.getElementById('time').style.transform = `translate(${posX}px, 
  ${posY}px) scale(${scale}) 
  rotateX(${rotation}deg)`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
}


function toggleHelp() {
  const helpElement = document.getElementById('help');
  if (helpElement) {
    if (helpElement.style.display === 'none' || helpElement.style.display === '') {
      helpElement.style.display = 'block';
    } else {
      helpElement.style.display = 'none';
    }
  }
}


function saveState() {

  localStorage.setItem('clockState', JSON.stringify({
    posX,
    posY,
    scale,
    rotation,
    perspective: perspective
  }));
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem('clockState'));
  if (!saved) return;

  posX = saved.posX ?? 0;
  posY = saved.posY ?? 0;
  scale = saved.scale ?? 1;
  rotation = saved.rotation ?? 0;
  perspective = saved.perspective ?? 480;

  setTransform();

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

    case 'y':
      changeScale(SCALE_STEP);
      break;
    case 'h':
      changeScale(-SCALE_STEP);
      break;
    case 'u':
      changeRotation(-5);
      break;
    case 'j':
      changeRotation(5);
      break;

      case 'i':
      changePerspective(-20);
      break;
    case 'k':
      changePerspective(20);
      break;

    case ' ':
      toggleHelp();
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

  setCurrentTime();

}, 1000);


window.onload = () => {
  loadState();
};

function setCurrentTime() {
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
  const formattedTime = String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');


  let hoursElement = document.getElementById('hours');
  let minutesElement = document.getElementById('minutes');
  let secondsElement = document.getElementById('seconds');

  hoursElement.textContent = String(hours).padStart(2, '0');
  minutesElement.textContent = String(minutes).padStart(2, '0');
  secondsElement.textContent = String(seconds).padStart(2, '0');
}



setCurrentTime();