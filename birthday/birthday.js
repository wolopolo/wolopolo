// ===== Customize here =====
const WISH_MESSAGE = `Chúc pà chã hơm tuổi mới thật nhiều sức khỏe, xinh đẹp, giỏi giang, ngập tràn niềm vui,...
Chúc pà chã tốt nghiệp thành công, ra trường tìm được công việc như ý
Và quan trọng nhất là luôn luôn hạnh phúc cùng ăm chã húi nè ♥️
Yêu pà chã nhiều nhiềuuuu 😘
Chúc mừng sinh nhật pà chã 🎉🎉🎉
♥️♥️♥️`;

// Put images in birthday/photos/ and list them here
const PHOTOS = [
  { src: "photos/1.jpg", caption: "Pà chã hơm xinh gái nèeee ♥️" },
  { src: "photos/2.jpg", caption: "Cute quá tròi 😘" },
  { src: "photos/3.jpg", caption: "Đón sinh nhật cùm ăm chả nè 😘" },
  { src: "photos/4.jpg", caption: "Haha iu iu 😘" },
  { src: "photos/5.jpg", caption: "Hí hí 😘" },
];
// ==========================

const cake = document.getElementById("cake");
const cakeStage = document.getElementById("cakeStage");
const flash = document.getElementById("flash");
const wishStage = document.getElementById("wishStage");

function createStars() {
  const stars = document.getElementById("stars");
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    stars.appendChild(star);
  }
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  PHOTOS.forEach((photo, i) => {
    const figure = document.createElement("figure");
    figure.className = "photo";
    figure.style.animationDelay = 0.6 + i * 0.25 + "s";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "";
    figure.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption;
      figure.appendChild(caption);
    }
    gallery.appendChild(figure);
  });
}

function launchConfetti() {
  const container = document.getElementById("confetti");
  const colors = ["#ff8fab", "#ffd166", "#7ec8e3", "#b8f2e6", "#cdb4db"];
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    piece.style.animationDelay = Math.random() * 1.5 + "s";
    container.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

// Happy Birthday melody: [frequency Hz, beats]
const MELODY = [
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523.25, 1], [493.88, 2],
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587.33, 1], [523.25, 2],
  [392, 0.75], [392, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 2],
  [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
];
const BEAT = 0.5; // seconds per beat

let audioCtx = null;
let masterGain = null;
let musicOn = true;

function playMelody() {
  let t = audioCtx.currentTime + 0.1;
  MELODY.forEach(([freq, beats]) => {
    const dur = beats * BEAT;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);
    osc.connect(gain).connect(masterGain);
    osc.start(t);
    osc.stop(t + dur);
    t += dur;
  });
  const total = t - audioCtx.currentTime;
  setTimeout(playMelody, (total + 1.5) * 1000); // loop with a short pause
}

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.6;
  masterGain.connect(audioCtx.destination);
  playMelody();

  const toggle = document.getElementById("musicToggle");
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    musicOn = !musicOn;
    masterGain.gain.value = musicOn ? 0.6 : 0;
    toggle.classList.toggle("muted", !musicOn);
  });
}

cake.addEventListener("click", () => {
  startMusic();
  flash.classList.add("active");
  cakeStage.classList.add("hide");

  setTimeout(() => {
    cakeStage.hidden = true;
    document.getElementById("wishMessage").textContent = WISH_MESSAGE;
    renderGallery();
    wishStage.hidden = false;
    launchConfetti();
  }, 400);
}, { once: true });

createStars();
