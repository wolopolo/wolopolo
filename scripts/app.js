/* Main Application entry and Routing */
import { initBlog } from './blog.js';
import { initLove, pauseLoveMusic } from './love.js';

// Typewriter Roles Array (Vietnamese titles)
const TYPEWRITER_ROLES = [
  'Kỹ sư Phần mềm',
  'Lập trình viên Fullstack',
  'Người yêu thích UI/UX',
  'Kẻ đam mê Công nghệ'
];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initTypewriter();
  initBlog();
  initLove();
});

function initApp() {
  // Mobile Hamburger Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when links are clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Theme Toggler (Professional mode: Dark/Light switcher)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('preferred-theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('theme-light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = document.body.classList.contains('theme-light');
      
      if (isCurrentlyLight) {
        document.body.classList.remove('theme-light');
        localStorage.setItem('preferred-theme', 'dark');
      } else {
        document.body.classList.add('theme-light');
        localStorage.setItem('preferred-theme', 'light');
      }
    });
  }

  // Routing initialization
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Call on initial load
}

function handleRoute() {
  const routes = ['portfolio', 'blog', 'love'];
  let currentHash = window.location.hash.substring(1);

  if (!routes.includes(currentHash)) {
    currentHash = 'portfolio';
    window.location.hash = '#portfolio';
    return;
  }

  // Toggle active class on Navigation links
  const navItems = document.querySelectorAll('.nav-links .nav-link');
  navItems.forEach(item => {
    const tabName = item.getAttribute('data-tab');
    if (tabName === currentHash) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle active class on SPA Page Sections
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => {
    if (section.id === currentHash) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Dynamic Theme Shift Manager
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (currentHash === 'love') {
    // Shifting to Love Zone mode
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-love');
    if (themeToggleBtn) {
      // Hide light/dark toggle because Love theme is beautiful and unique
      themeToggleBtn.style.display = 'none';
    }
  } else {
    // Shifting back to Professional mode (apply saved dark/light preferences)
    document.body.classList.remove('theme-love');
    if (themeToggleBtn) {
      themeToggleBtn.style.display = 'flex';
    }
    
    const savedTheme = localStorage.getItem('preferred-theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    // Pause romantic background music when leaving Love Zone
    pauseLoveMusic();
  }

  // Scroll window to top on route change
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function initTypewriter() {
  const typewriterText = document.getElementById('typewriter-text');
  if (!typewriterText) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 150;

  function type() {
    const currentRole = TYPEWRITER_ROLES[roleIndex];

    if (isDeleting) {
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 80;
    } else {
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of typing
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % TYPEWRITER_ROLES.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  // Start typing loop
  setTimeout(type, 1000);
}
