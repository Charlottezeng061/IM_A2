// I put the three tracks into one array so I can control them with
// the same code instead of writing separate code for each song.
// currentTrack stores which track is selected, and loadTrack()
// changes the audio source to that track's file. Then audio.play()
// starts playing it. The previous, next and random buttons all use
// this same track system.
// Sources:
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play

///// the three music tracks/////
const tracks = [
  { mood: "Warm Morning",
    file: "https://archive.org/download/slow-morning/slow%20morning.mp3",
    description: "Ease into the day with soft and unhurried sounds.",
    theme: "morning-theme"},

  { mood: "Cozy Study",
    file: "https://archive.org/download/lofi-study_202609/lofi%20study.mp3",
    description: "Gentle beats to help you read, write and stay focused.",
    theme: "study-theme"},

  { mood: "Rainy Night",
    file: "https://archive.org/download/lofi-night/lofi%20night.mp3",
    description: "A calm evening atmosphere for late-night study.",
    theme: "night-theme"}
];


// Find the HTML elements//
const audio = document.querySelector("#audio-player");
const moodName = document.querySelector("#mood-name");
const moodDescription = document.querySelector("#mood-description");
const playButton = document.querySelector("#play-button");
const playIcon = document.querySelector("#play-icon");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const muteButton = document.querySelector("#mute-button");
const muteIcon = document.querySelector("#mute-icon");
const repeatButton = document.querySelector("#repeat-button");
const volumeSlider = document.querySelector("#volume-slider");
const progressBar = document.querySelector("#progress-bar");
const progressFill = document.querySelector("#progress-fill");
const currentTimeText = document.querySelector("#current-time");
const durationText = document.querySelector("#duration");
const randomButton = document.querySelector("#random-button");
const playerFeedback = document.querySelector("#player-feedback");

// The player starts with the first track
let currentTrack = 0;
let repeatIsOn = false;

// Show a small message under the player//
// I added this feedback because an icon button does not always show whether an action worked.
// Changing one short sentence confirms play, mute and repeat actions without adding a pop-up 
// that would interrupt the calm experience.
// The HTML creates the place for the message, CSS controls its appearance, and this function changes
// its words. Each player action calls showFeedback with a different message. I used textContent because
// the feedback is plain text.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

function showFeedback(message) {
  playerFeedback.textContent = message;
}

// Change seconds into minutes and seconds
function formatTime(time) {
  if (isNaN(time)) {return "0:00";}
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) { seconds = "0" + seconds;}
  return minutes + ":" + seconds;
}

// Load a selected track//
// This function is reused by the mood cards, next and previous controls and the
// random feature. It changes the audio source, visible information and body class
// together, so the sound and colour theme always match.

function loadTrack(trackIndex) {
  currentTrack = trackIndex;

  const selectedTrack = tracks[currentTrack];

  audio.src = selectedTrack.file; 

  moodName.textContent = selectedTrack.mood;
  moodDescription.textContent = selectedTrack.description;

// Remove the old theme before adding the new one//
// I use classList to remove the previous colour theme and add the
// theme for the newly selected track. This lets the page background
// change when the mood changes.
// I also reset the progress bar and time display when a new track
// loads, so the player starts from a clear state.
// Sources:
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
// https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

  document.body.classList.remove(
    "morning-theme",
    "study-theme",
    "night-theme"
  );

  document.body.classList.add(selectedTrack.theme);
  progressFill.style.width = "0%";
  currentTimeText.textContent = "0:00";
  durationText.textContent = "0:00";
}

// Play or pause the music
function togglePlay() {
  if (audio.paused) {
    audio.play();
    showFeedback("Music is playing.");
  } else {
    audio.pause();
    showFeedback("Music paused.");
  }
}


// Go to the next track
function nextTrack() {
  currentTrack = currentTrack + 1;

  if (currentTrack >= tracks.length) {
    currentTrack = 0;
  }

  loadTrack(currentTrack);
  audio.play();

  showFeedback("Playing the next atmosphere.");
}

// Go to the previous track
function previousTrack() {
  currentTrack = currentTrack - 1;
  if (currentTrack < 0) {
    currentTrack = tracks.length - 1;
  }
  loadTrack(currentTrack);
  audio.play();
  showFeedback("Playing the previous atmosphere.");
}

/////Choose a random atmosphere/////
// I chose random atmosphere as the extra feature because users studying or
// relaxing may not want to spend time choosing a track. Math.random creates a
// random value and Math.floor changes it into an array position.
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function randomAtmosphere() {
  let randomTrack =
    Math.floor(Math.random() * tracks.length);

  // Try again if the random result is the current track
  while (randomTrack === currentTrack) {
    randomTrack =
      Math.floor(Math.random() * tracks.length);
  }

  loadTrack(randomTrack);
  audio.play();

  showFeedback(
    "Your new atmosphere is " +
    tracks[randomTrack].mood +
    "."
  );
}

// Play button
playButton.addEventListener("click", togglePlay);

// Previous and next buttons
previousButton.addEventListener("click", previousTrack);
nextButton.addEventListener("click", nextTrack);

// Random button
randomButton.addEventListener(
  "click",
  randomAtmosphere
);

// Change the play icon when music starts//
// The audio play and pause events update both the icon and the is-playing class.
// This gives visual feedback and lets the CSS background move with the music.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event

audio.addEventListener("play", function () {
  playIcon.src = "assets/icon/pause.png";
  playIcon.alt = "Pause";
  playButton.setAttribute("aria-label", "Pause");
  document.body.classList.add("is-playing");
});


// Change the pause icon back to play
audio.addEventListener("pause", function () {
  playIcon.src = "assets/icon/play.png";
  playIcon.alt = "Play";
  playButton.setAttribute("aria-label", "Play");
  document.body.classList.remove("is-playing");
});


// Mute and unmute
muteButton.addEventListener("click", function () {
  audio.muted = !audio.muted;

  if (audio.muted) {
    muteIcon.src = "assets/icon/mute.png";
    muteIcon.alt = "Sound off";

    muteButton.setAttribute("aria-label", "Unmute");

    showFeedback("Sound muted.");
  } else {
    muteIcon.src = "assets/icon/volume.png";
    muteIcon.alt = "Sound on";

    muteButton.setAttribute("aria-label", "Mute");

    showFeedback("Sound is back on.");
  }

  muteButton.setAttribute("aria-pressed", audio.muted);
});

/// Change the volume///
// The range input gives a value between 0 and 1, which matches the audio volume
// property. Moving the slider also turns mute off so the new volume can be heard.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume

volumeSlider.addEventListener("input", function () {
  audio.volume = volumeSlider.value;

  // Moving the volume slider turns sound back on
  audio.muted = false;

  muteIcon.src = "assets/icon/volume.png";
  muteIcon.alt = "Sound on";

  muteButton.setAttribute("aria-label", "Mute");
  muteButton.setAttribute("aria-pressed", "false");

  showFeedback(
    "Volume: " +
    Math.round(audio.volume * 100) +
    "%."
  );
});


// Turn repeat on and off///
// Sources:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed
repeatButton.addEventListener("click", function () {
  repeatIsOn = !repeatIsOn;
  audio.loop = repeatIsOn;

  if (repeatIsOn) {
    repeatButton.setAttribute("aria-label", "Repeat on");
    repeatButton.setAttribute("aria-pressed", "true");

    showFeedback("Repeat is on.");
  } else {
    repeatButton.setAttribute("aria-label", "Repeat off");
    repeatButton.setAttribute("aria-pressed", "false");

    showFeedback("Repeat is off.");
  }
});

// Get the duration when a track loads
audio.addEventListener("loadedmetadata", function () {
  durationText.textContent = formatTime(audio.duration);
});

/// Update the time and progress bar ///
// The timeupdate event runs while the track plays. I divide currentTime by the
// full duration to calculate a percentage, then use it as the fill width.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event

audio.addEventListener("timeupdate", function () {
  currentTimeText.textContent =
    formatTime(audio.currentTime);

  if (audio.duration) {
    const progress =
      audio.currentTime / audio.duration * 100;

    progressFill.style.width = progress + "%";

    progressBar.setAttribute(
      "aria-valuenow",
      Math.floor(progress)
    );
  }
});

// Click the progress bar to move through the track
/*
 I used offsetX to find where the user clicked inside the progress
bar. I divided this position by the full offsetWidth of the bar to
create a value between 0 and 1. Multiplying this value by the audio
duration gives the new playback time. I then applied the result to
audio.currentTime so the user can move through the track.
Sources:
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
*/

progressBar.addEventListener("click", function (event) {
  if (audio.duration) {
    const clickedPosition =
      event.offsetX / progressBar.offsetWidth;

    audio.currentTime =
      clickedPosition * audio.duration;

    showFeedback(
      "Moved to " + formatTime(audio.currentTime) + "."
    );
  }
});

// Move to the next song when the current song finishes
/*
I learned about the ended event from the MDN HTMLMediaElement
documentation. This event runs when the current audio reaches the
end. If repeat is false, I call the existing nextTrack function so
the player automatically continues to the next atmosphere.
Source:https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
*/

audio.addEventListener("ended", function () {
  if (repeatIsOn === false) {
    nextTrack();
  }
});

// Set the starting volume
audio.volume = volumeSlider.value;


///////// Timer///////////
const timer = document.getElementById("timer");
const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");
const timerButton = document.getElementById("timer-button");
const resetTimerButton = document.getElementById("reset-timer");

let isRunning = false;
let time = 25 * 60;
let setTime = 25 * 60;
let startTime = 0;

// Start / Pause
timerButton.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startTime = 0;
    timerButton.innerText = "PAUSE";
    requestAnimationFrame(timerFrame);
  }
  else {
    isRunning = false;
    timerButton.innerText = "START";
  }
});

// Minus 5 minutes
minusButton.addEventListener("click", () => {
  if (!isRunning && time > 5 * 60) {
    time = time - 5 * 60;
    setTime = time;
    showTime();
  }
});


// Plus 5 minutes
plusButton.addEventListener("click", () => {
  if (!isRunning) {
    time = time + 5 * 60;
    setTime = time;
    showTime();
  }
});

// Show minutes and seconds
function showTime() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timer.innerText = minutes + ":" + seconds;
}

// Reset timer
resetTimerButton.addEventListener("click", () => {
  isRunning = false;
  time = setTime;
  startTime = 0;
  timerButton.innerText = "START";
  showTime();
});

// Timer animation
function timerFrame(ms) {
 if (startTime === 0) {
    startTime = ms;
  }
const secondsElapsed = Math.floor((ms - startTime) / 1000);
const timeLeft = time - secondsElapsed;
const minutes = Math.floor(timeLeft / 60);
let seconds = timeLeft % 60;
 if (seconds < 10) {
  seconds = "0" + seconds;
}
timer.innerText = minutes + ":" + seconds;
if (isRunning && timeLeft > 0) {
    requestAnimationFrame(timerFrame);
  }
}


///// Moving gradient background ////////
function backgroundFrame(ms) {
const angle = ms / 100;

// Move the background when music or timer is running
// I use OR (||) because either one can start the background movement.
  if (!audio.paused || isRunning) {

   if (document.body.classList.contains("morning-theme")) {
    document.body.style.background =
      `linear-gradient(${angle}deg, #f7d9c8, #f3c7bd, #f6dfc5, #f5eadb)`;
  }

 if (document.body.classList.contains("study-theme")) {
  document.body.style.background =
    `linear-gradient(${angle}deg, #8f9873, #c2c59e, #e6ddcdff, #f2e5cf)`;
}

if (document.body.classList.contains("night-theme")) {
  document.body.style.background =
    `linear-gradient(${angle}deg, #24212b 0%, #352d46 35%, #51416b 75%, #b56f70 100%)`;
}
}
// Start the background animation
  requestAnimationFrame(backgroundFrame);
}
// Request the next animation frame
requestAnimationFrame(backgroundFrame);


