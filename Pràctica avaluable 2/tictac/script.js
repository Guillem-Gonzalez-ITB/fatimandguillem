// Variables
const currentTimeDisplay = document.getElementById("current-time");
const timeLeftDisplay = document.getElementById("time-left");
const endTimeInput = document.getElementById("end-time");
const countdownInput = document.getElementById("countdown");
const startButton = document.getElementById("start-timer");
const alarmSound = document.getElementById("alarm-sound");
const alarmSelect = document.getElementById("alarm-sound-select");
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;
const timer = document.querySelectorAll(".timer");
const clock = document.querySelectorAll(".clock");
const text = document.querySelectorAll("h1, h2, p");

let timerInterval; // Variable per al temporitzador
let isRunning = false; // Estat del temporitzador (false: aturat, true: en marxa)

// Funció per actualitzar l'hora actual
function updateCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Funció per iniciar o detenir el temporitzador
function toggleTimer() {
  if (isRunning) {
    // Si el temporitzador està en marxa, atura'l
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Iniciar Temporitzador";
    timeLeftDisplay.textContent = "--:--:--";
  } else {
    // Inicia el temporitzador
    startTimer();
  }
}

alarmSelect.addEventListener("change", () => {
  alarmSound.src = alarmSelect.value;
});

// Funció per iniciar el temporitzador
function startTimer() {
  clearInterval(timerInterval);

  const endTimeValue = endTimeInput.value;
  const countdownValue = countdownInput.value;

  let targetTime;

  if (endTimeValue) {
    // Calcula l'hora de finalització
    const now = new Date();
    const [hour, minute] = endTimeValue.split(":").map(Number);
    targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  } else if (countdownValue) {
    // Calcula el temps restant
    const now = new Date();
    targetTime = new Date(now.getTime() + countdownValue * 1000);
  } else {
    alert("Introdueix una hora de finalització o un compte enrere.");
    return;
  }

  isRunning = true;
  startButton.textContent = "Detenir";

  timerInterval = setInterval(() => {
    const now = new Date();
    const timeLeft = targetTime - now;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startButton.textContent = "Iniciar Temporitzador";
      timeLeftDisplay.textContent = "00:00:00";
      alarmSound.play();
      alert("⏰ El temps ha finalitzat!");
    } else {
      const hours = String(Math.floor((timeLeft / 1000 / 60 / 60))).padStart(2, "0"); // Hores
      const minutes = String(Math.floor((timeLeft / 1000 / 60) % 60)).padStart(2, "0"); // Minuts
      const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0"); // Segons
      timeLeftDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }, 1000);
}

// Afegir Event Listener al botó
themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  timer.forEach(timer => timer.classList.toggle("dark-theme"));
  clock.forEach(clock => clock.classList.toggle("dark-theme"));
  text.forEach(text => text.classList.toggle("dark-theme"));
  
  // Actualitza el text del botó
  if (body.classList.contains("dark-theme")) {
    themeToggleButton.textContent = "Activa el Tema Clar";
  } else {
    themeToggleButton.textContent = "Activa el Tema Fosc";
  }
});


// Event Listeners
startButton.addEventListener("click", toggleTimer);
setInterval(updateCurrentTime, 1000); // Actualitza l'hora cada segon
updateCurrentTime();
