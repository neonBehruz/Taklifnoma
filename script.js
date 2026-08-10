// Javohir & Sevinch Wedding Invitation Script — Cinematic UX
document.addEventListener('DOMContentLoaded', () => {
  // Core Elements
  const coverOverlay = document.getElementById('coverOverlay');
  const sealBtn = document.getElementById('sealBtn');
  const musicToggle = document.getElementById('musicToggle');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const guestGreetingElem = document.getElementById('guestGreeting');
  const rsvpForm = document.getElementById('rsvpForm');
  const toastElem = document.getElementById('toast');
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const bgAudio = document.getElementById('bgAudio');
  
  let isMusicPlaying = false;
  let audioContext = null;

  // 1. URL Query Parser for Guest Name (?g=...)
  function initGuestGreeting() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('g');
    
    if (guestParam) {
      try {
        const decodedStr = atob(guestParam);
        const guestData = JSON.parse(decodedStr);
        if (guestData && guestData.n) {
          if (guestGreetingElem) guestGreetingElem.textContent = guestData.n;
          const rsvpNameInput = document.getElementById('rsvpName');
          if (rsvpNameInput && !rsvpNameInput.value) {
            rsvpNameInput.value = guestData.n.replace(/^(Hurmatli|Qadrli)\s+/i, '');
          }
        }
      } catch (e) {
        try {
          const rawText = atob(guestParam);
          if (rawText && guestGreetingElem) guestGreetingElem.textContent = rawText;
        } catch (err) {
          console.warn("Could not decode guest param:", err);
        }
      }
    }
  }
  initGuestGreeting();

  // 2. Sticky Navbar & Mobile Menu Logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburgerBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.textContent = '☰';
      });
    });
  }

  // 3. Audio Control Functions (Wedding - Muhammad Al Muqit)
  function playWeddingMusic() {
    if (bgAudio) {
      bgAudio.volume = 0.85;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          if (musicToggle) musicToggle.classList.add('playing');
        }).catch(error => {
          console.warn("Autoplay Error:", error);
          isMusicPlaying = false;
          if (musicToggle) musicToggle.classList.remove('playing');
        });
      }
    }
  }

  function pauseWeddingMusic() {
    if (bgAudio) {
      bgAudio.pause();
      isMusicPlaying = false;
      if (musicToggle) musicToggle.classList.remove('playing');
    }
  }

  function playWaxSealSound() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.6); // A5

      gain.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.2);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }

  // Open Envelope Cover Event
  if (sealBtn) {
    sealBtn.addEventListener('click', () => {
      playWaxSealSound();
      coverOverlay.classList.add('opened');
      playWeddingMusic();
      startPetalsAnimation();

      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('visible');
          }
        });
      }, 400);
    });
  }

  // Audio Toggle Button Event
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (bgAudio && !bgAudio.paused) {
        pauseWeddingMusic();
        showToast("Musiqa o'chirildi 🔇");
      } else {
        playWeddingMusic();
        showToast("Muhammad Al Muqit - Wedding 🎵");
      }
    });
  }

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      if (bgAudio && !bgAudio.paused) {
        pauseWeddingMusic();
      } else {
        playWeddingMusic();
        showToast("Muhammad Al Muqit - Wedding 🎵");
      }
    });
  }

  // 4. Countdown Timer Target: 20 September 2026 18:00
  const targetDate = new Date('2026-09-20T18:00:00+05:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (document.getElementById('days')) document.getElementById('days').textContent = String(days).padStart(2, '0');
      if (document.getElementById('hours')) document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      if (document.getElementById('minutes')) document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      if (document.getElementById('seconds')) document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
      if (document.getElementById('days')) document.getElementById('days').textContent = '00';
      if (document.getElementById('hours')) document.getElementById('hours').textContent = '00';
      if (document.getElementById('minutes')) document.getElementById('minutes').textContent = '00';
      if (document.getElementById('seconds')) document.getElementById('seconds').textContent = '00';
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. Reveal Scroll Observer
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 6. Lightbox Modal Functions
  window.openLightbox = function(src) {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('open');
    }
  };

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
      lightbox.classList.remove('open');
    }
  };

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 7. RSVP Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('rsvpName')?.value.trim();
      const phone = document.getElementById('rsvpPhone')?.value.trim() || '';
      const status = document.querySelector('input[name="attendance"]:checked')?.value || 'Ha, albatta!';

      if (!name) {
        showToast("Iltimos, ismingizni kiriting!");
        return;
      }

      const responses = JSON.parse(localStorage.getItem('taklifnoma_rsvp') || '[]');
      responses.push({ name, phone, status, date: new Date().toISOString() });
      localStorage.setItem('taklifnoma_rsvp', JSON.stringify(responses));

      showToast(`Rahmat, ${name}! Ishtirokingiz tasdiqlandi ✨`);
      rsvpForm.reset();
    });
  }

  // 8. Toast Helper
  function showToast(message) {
    if (!toastElem) return;
    toastElem.textContent = message;
    toastElem.classList.add('show');
    setTimeout(() => {
      toastElem.classList.remove('show');
    }, 3500);
  }

  // 9. Guest Link Generator (For Couple)
  const generateBtn = document.getElementById('generateLinkBtn');
  const customGuestInput = document.getElementById('customGuestInput');
  const generatedUrlInput = document.getElementById('generatedUrlInput');
  const copyLinkBtn = document.getElementById('copyLinkBtn');

  if (generateBtn && customGuestInput) {
    generateBtn.addEventListener('click', () => {
      const guestName = customGuestInput.value.trim();
      if (!guestName) {
        showToast("Mehmon ismini kiriting (masalan: Ali aka)");
        return;
      }

      const jsonPayload = JSON.stringify({ n: guestName });
      const encoded = btoa(unescape(encodeURIComponent(jsonPayload)));
      
      const fullUrl = `${window.location.origin}${window.location.pathname}?g=${encoded}`;
      generatedUrlInput.value = fullUrl;
      document.getElementById('generatedResultArea').style.display = 'block';
    });

    copyLinkBtn.addEventListener('click', () => {
      generatedUrlInput.select();
      navigator.clipboard.writeText(generatedUrlInput.value);
      showToast("Link nusxalandi! Endi mehmonga yuborishingiz mumkin 📩");
    });
  }

  // 10. Rose Petals & Golden Dust Canvas Particle System
  const canvas = document.getElementById('petalsCanvas');
  let animationId = null;

  function startPetalsAnimation() {
    if (!canvas) return;
    canvas.classList.add('active');
    
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = ['#f7c6c7', '#f4b8ba', '#e5989b', '#e8a9b0', '#f4d8dc', '#d8b4bc'];
    const goldColors = ['#ffd700', '#f0dcae', '#cda661', '#fff3cf'];

    const particles = [];
    const numPetals = Math.min(Math.floor(width / 35), 30);
    const numGold = Math.min(Math.floor(width / 25), 40);

    for (let i = 0; i < numPetals; i++) {
      particles.push({
        type: 'petal',
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: 8 + Math.random() * 10,
        speedY: 0.8 + Math.random() * 1.4,
        speedX: Math.random() * 0.6 - 0.3,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0.01 + Math.random() * 0.03,
        scaleX: 0.6 + Math.random() * 0.5,
        scaleY: 0.8 + Math.random() * 0.4,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        alpha: 0.55 + Math.random() * 0.35
      });
    }

    for (let i = 0; i < numGold; i++) {
      particles.push({
        type: 'gold',
        x: Math.random() * width,
        y: Math.random() * height - height,
        radius: 1.2 + Math.random() * 2.2,
        speedY: 0.4 + Math.random() * 1.0,
        speedX: Math.random() * 0.8 - 0.4,
        sparklePhase: Math.random() * Math.PI * 2,
        sparkleSpeed: 0.04 + Math.random() * 0.06,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        alpha: 0.4 + Math.random() * 0.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        if (p.type === 'petal') {
          p.y += p.speedY;
          p.swing += p.swingSpeed;
          p.x += p.speedX + Math.sin(p.swing) * 0.8;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scaleX, p.scaleY);

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.6, p.size * 0.9, p.size * 0.4, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.75, -p.size * 0.6, 0, -p.size);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.restore();

        } else if (p.type === 'gold') {
          p.y += p.speedY;
          p.x += p.speedX;
          p.sparklePhase += p.sparkleSpeed;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }

          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.sparklePhase));

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, currentAlpha);
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    if (!animationId) {
      animate();
    }
  }
});
