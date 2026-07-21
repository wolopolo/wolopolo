/* Love Zone script logic */

// Set dating anniversary start date: 2023-10-20T18:00:00 (October 20, 2023, 6 PM)
const ANNIVERSARY_DATE = new Date('2023-10-20T18:00:00');
let counterIntervalId = null;

export function initLove() {
  // 1. Start Anniversary Counter
  startAnniversaryCounter();

  // 2. Secret Envelope Interaction
  const envelope = document.getElementById('secret-envelope');
  if (envelope) {
    envelope.addEventListener('click', (e) => {
      // Toggle open state on envelope wrapper
      envelope.classList.toggle('open');
      e.stopPropagation(); // Avoid triggering heart animations from clicking envelope
    });
  }

  // 3. Polaroid Lightbox Gallery
  initLightbox();

  // 4. Click Floating Heart Effects
  initFloatingHearts();

  // 5. Background Music Control
  initLoveMusic();
}

function startAnniversaryCounter() {
  const daysVal = document.getElementById('counter-days');
  const hoursVal = document.getElementById('counter-hours');
  const minutesVal = document.getElementById('counter-minutes');
  const secondsVal = document.getElementById('counter-seconds');

  if (!daysVal || !hoursVal || !minutesVal || !secondsVal) return;

  // Clear any existing timer
  if (counterIntervalId) {
    clearInterval(counterIntervalId);
  }

  function updateCounter() {
    const now = new Date();
    const diffMs = now - ANNIVERSARY_DATE;

    if (diffMs < 0) {
      // Date is in the future
      daysVal.textContent = '00';
      hoursVal.textContent = '00';
      minutesVal.textContent = '00';
      secondsVal.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Pad double digits
    daysVal.textContent = String(days).padStart(2, '0');
    hoursVal.textContent = String(hours).padStart(2, '0');
    minutesVal.textContent = String(minutes).padStart(2, '0');
    secondsVal.textContent = String(seconds).padStart(2, '0');
  }

  // Initial call and set interval
  updateCounter();
  counterIntervalId = setInterval(updateCounter, 1000);
}

function initLightbox() {
  const gallery = document.getElementById('love-gallery');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!gallery || !modal) return;

  const cards = gallery.querySelectorAll('.polaroid-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const imgSrc = card.getAttribute('data-img');
      const captionText = card.getAttribute('data-caption');

      modalImg.src = imgSrc;
      modalCaption.textContent = captionText;

      modal.classList.add('active');
      e.stopPropagation(); // Avoid triggering heart animations from clicking image cards
    });
  });

  // Close lightbox modal click logic
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modalImg.src = '';
      modalCaption.textContent = '';
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'lightbox-close') {
      closeModal();
    }
  });

  // ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initFloatingHearts() {
  const loveSection = document.getElementById('love');
  if (!loveSection) return;

  const heartIcons = ['❤️', '💖', '💝', '💕', '💗', '💓', '💘'];

  loveSection.addEventListener('click', (e) => {
    // Generate multiple heart particles on click
    const heartCount = 3 + Math.floor(Math.random() * 3); // 3-5 hearts
    
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      
      // Choose random heart icon
      heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      
      // Position heart exactly at cursor with slight random offset
      const offsetX = (Math.random() - 0.5) * 40; // -20px to 20px
      const offsetY = (Math.random() - 0.5) * 40; // -20px to 20px
      
      heart.style.left = `${e.clientX + offsetX}px`;
      heart.style.top = `${e.clientY + offsetY}px`;
      
      // Add random visual variables
      const scale = 0.5 + Math.random() * 1.0; // 0.5x to 1.5x
      const rotation = Math.random() * 360; // 0 to 360 deg
      const duration = 3.5 + Math.random() * 2.5; // 3.5s to 6s (slower & more romantic)
      
      heart.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      heart.style.animationDuration = `${duration}s`;
      
      document.body.appendChild(heart);
      
      // Remove element once the float animation finishes
      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }
  });
}

// Background Music State Variables
let audio = null;
let musicToggleBtn = null;

function initLoveMusic() {
  audio = document.getElementById('love-music');
  musicToggleBtn = document.getElementById('love-music-toggle');
  if (!audio || !musicToggleBtn) return;
  
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering heart animations from clicking play button
    toggleMusicState();
  });
}

function toggleMusicState() {
  if (!audio || !musicToggleBtn) return;
  const statusText = musicToggleBtn.querySelector('.music-status');
  
  if (audio.paused) {
    audio.play().then(() => {
      musicToggleBtn.classList.add('playing');
      if (statusText) statusText.textContent = 'Tắt nhạc';
    }).catch(err => {
      console.log('Audio autoplay prevented by browser. Click again to play.', err);
    });
  } else {
    audio.pause();
    musicToggleBtn.classList.remove('playing');
    if (statusText) statusText.textContent = 'Bật nhạc';
  }
}

export function pauseLoveMusic() {
  if (audio && !audio.paused) {
    audio.pause();
    if (musicToggleBtn) {
      musicToggleBtn.classList.remove('playing');
      const statusText = musicToggleBtn.querySelector('.music-status');
      if (statusText) statusText.textContent = 'Bật nhạc';
    }
  }
}
