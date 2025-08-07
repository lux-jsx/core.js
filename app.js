// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('theme', theme);
  }

  toggle() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
  }
}

// Mobile Navigation
class MobileNavigation {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    // Close menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
  }
}

// Smooth Scrolling
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Handle all anchor links that start with #
    document.addEventListener('click', (e) => {
      // Check if clicked element is a link with href starting with #
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          e.preventDefault();
          this.scrollToTarget(href);
        }
      }
    });
  }

  scrollToTarget(targetId) {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
      
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
      
      // Update URL without triggering page reload
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-aos]');
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkAnimations();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.checkAnimations());
    });
  }

  checkAnimations() {
    this.animatedElements.forEach(element => {
      if (this.isInViewport(element)) {
        element.classList.add('aos-animate');
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * 0.8 && rect.bottom >= 0;
  }
}

// Active Navigation Highlighting
class NavigationHighlight {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.updateActiveLink());
    });
  }

  updateActiveLink() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    // Default to 'home' if no section is detected
    if (!currentSection && window.scrollY < 100) {
      currentSection = 'home';
    }

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    // Validate form data
    if (!this.validateForm(data)) {
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      // Show loading state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      await this.simulateSubmit(data);

      // Show success message
      this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      this.form.reset();

    } catch (error) {
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  validateForm(data) {
    const errors = [];

    if (!data.name.trim()) {
      errors.push('Name is required');
    }

    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.message.trim()) {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      this.showMessage(errors.join('\n'), 'error');
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async simulateSubmit(data) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type === 'error' ? 'status--error' : 'status--success'}`;
    messageElement.style.cssText = `
      padding: 12px 16px;
      margin-bottom: 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      white-space: pre-line;
    `;
    
    if (type === 'error') {
      messageElement.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
      messageElement.style.color = 'var(--color-error)';
      messageElement.style.border = '1px solid rgba(var(--color-error-rgb), 0.2)';
    } else {
      messageElement.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
      messageElement.style.color = 'var(--color-success)';
      messageElement.style.border = '1px solid rgba(var(--color-success-rgb), 0.2)';
    }
    
    messageElement.textContent = message;

    // Insert before form
    this.form.parentNode.insertBefore(messageElement, this.form);

    // Remove message after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }
}

// Performance Observer for animations
class PerformanceOptimizer {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (this.reducedMotion) {
      this.disableAnimations();
    }

    // Listen for changes in motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (e.matches) {
        this.disableAnimations();
      }
    });
  }

  disableAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Intersection Observer for better performance
class IntersectionObserverAnimations {
  constructor() {
    this.observer = null;
    this.animatedElements = document.querySelectorAll('[data-aos]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
      this.observeElements();
    } else {
      // Fallback for older browsers
      new ScrollAnimations();
    }
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay');
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('aos-animate');
            }, parseInt(delay));
          } else {
            entry.target.classList.add('aos-animate');
          }
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }
}

// Utility functions
const utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to ensure all elements are rendered
  setTimeout(() => {
    // Initialize all components
    new ThemeManager();
    new MobileNavigation();
    new SmoothScroll();
    new NavigationHighlight();
    new ContactForm();
    new PerformanceOptimizer();
    new IntersectionObserverAnimations();

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');

    // Log initialization
    console.log('🚀 wifithecoder portfolio initialized successfully!');
  }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page became visible - resume animations if needed
    console.log('Page visible - resuming animations');
  } else {
    // Page hidden - pause animations for performance
    console.log('Page hidden - pausing animations');
  }
});

// Handle resize events
window.addEventListener('resize', utils.debounce(() => {
  // Recalculate dimensions if needed
  console.log('Window resized');
}, 250));

// Export for potential external use
window.PortfolioApp = {
  ThemeManager,
  MobileNavigation,
  SmoothScroll,
  ScrollAnimations,
  NavigationHighlight,
  ContactForm,
  utils
};
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const style = getComputedStyle(canvas);
  const width = parseInt(style.width);
  const height = parseInt(style.height);

  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let currentAudio = null;
let currentSource = null;
let animationId = null;

// To keep track of created MediaElementSources, one per audio element
const sourceMap = new Map();

function togglePlay(id) {
  const audio = document.getElementById(id);
  if (!audio) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // If this beat is already playing, pause it
  if (currentAudio === audio && !audio.paused) {
    audio.pause();
    updateButtonIcon(id, false);
    stopVisualizer();
    currentAudio = null;
    return;
  }

  // Stop currently playing audio and reset buttons
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    updateButtonIcon(currentAudio.id, false);
    stopVisualizer();
  }

  // Play selected audio
  audio.currentTime = 0;
  audio.play();
  updateButtonIcon(id, true);
  currentAudio = audio;

  // Create or reuse MediaElementSource for this audio
  if (!sourceMap.has(audio)) {
    let source = audioCtx.createMediaElementSource(audio);
    sourceMap.set(audio, source);
  }
  currentSource = sourceMap.get(audio);

  // Connect audio to analyser and destination
  currentSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  startVisualizer();
}

function updateButtonIcon(id, isPlaying) {
  const btn = document.getElementById(`btn-${id}`);
  if (!btn) return;
  const playIcon = btn.querySelector('.icon-play');
  const pauseIcon = btn.querySelector('.icon-pause');
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
  } else {
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
  }
}

function visualize() {
  animationId = requestAnimationFrame(visualize);

  analyser.getByteFrequencyData(dataArray);

  const style = getComputedStyle(canvas);
  const WIDTH = parseInt(style.width);
  const HEIGHT = parseInt(style.height);
  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
  ctx.fillStyle = gradient;

  for(let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.globalAlpha = barHeight / 100;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
  ctx.globalAlpha = 1;
}

function startVisualizer() {
  canvas.classList.add('active');
  visualize();
}

function stopVisualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.classList.remove('active');

  // Disconnect analyser to prevent memory leaks
  if (currentSource) {
    currentSource.disconnect();
    currentSource = null;
  }
}

document.body.addEventListener('click', function onFirstClick() {
  const bgAudio = document.querySelector('audio[src="music.mp3"]');
  if (bgAudio) {
    bgAudio.muted = false;
    bgAudio.play();
  }
  document.body.removeEventListener('click', onFirstClick);
});
