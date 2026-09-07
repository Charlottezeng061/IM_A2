// I stored each atmosphere as one object in an array. Keeping its filename,
// description and theme together means loadTrack can update the whole player
// without repeating a separate set of instructions for every song.


// Information about the three music tracks
const tracks = [
  {
    mood: "Warm Morning",
    file: "slow morning.mp3",
    description:
     "Ease into the day with soft and unhurried sounds.",
    theme: "morning-theme"
  },

  {
    mood: "Cozy Study",
    file: "lofi study.mp3",
    description:
       "Gentle beats to help you read, write and stay focused.",
    theme: "study-theme"
  },

  {
    mood: "Rainy Night",
    file: "lofi night.mp3",
    description:
      "A calm evening atmosphere for late-night study.",
    theme: "night-theme"
  }
];


// Find the HTML elements
const audio = document.querySelector("#audio-player");

const moodName = document.querySelector("#mood-name");
const moodDescription = document.querySelector("#mood-description");
const trackNumber = document.querySelector("#track-number");

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

const surpriseButton = document.querySelector("#surprise-button");
const playerFeedback = document.querySelector("#player-feedback");

const moodCards = document.querySelectorAll(".mood-card");


// The player starts with the first track
let currentTrack = 0;
let repeatIsOn = false;


// Show a small message under the player
function showFeedback(message) {
  playerFeedback.textContent = message;
}


// Change seconds into minutes and seconds
function formatTime(time) {
  if (isNaN(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
}


// Highlight the selected mood card
function updateMoodCards() {
  moodCards.forEach(function (card, index) {
    if (index === currentTrack) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}


// Load a selected track
function loadTrack(trackIndex) {
  currentTrack = trackIndex;

  const selectedTrack = tracks[currentTrack];

  audio.src = "assets/audio/" + selectedTrack.file;

  moodName.textContent = selectedTrack.mood;
  moodDescription.textContent = selectedTrack.description;

  trackNumber.textContent =
    "0" + (currentTrack + 1) + " / 03";

  // Remove the old theme before adding the new one
  document.body.classList.remove(
    "morning-theme",
    "study-theme",
    "night-theme"
  );

  document.body.classList.add(selectedTrack.theme);

  progressFill.style.width = "0%";
  currentTimeText.textContent = "0:00";
  durationText.textContent = "0:00";

  updateMoodCards();
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


// Choose a random atmosphere
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


// Surprise Me button
surpriseButton.addEventListener(
  "click",
  randomAtmosphere
);


// Change the play icon when music starts
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


// Change the volume
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


// Turn repeat on and off
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


// Update the time and progress bar
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
audio.addEventListener("ended", function () {
  if (repeatIsOn === false) {
    nextTrack();
  }
});


// Make each mood card clickable
moodCards.forEach(function (card) {
  card.addEventListener("click", function () {
    const selectedTrack =
      Number(card.dataset.track);

    loadTrack(selectedTrack);
    audio.play();

    showFeedback(
      "Selected " +
      tracks[selectedTrack].mood +
      "."
    );
  });
});


// Set the starting volume
audio.volume = volumeSlider.value;