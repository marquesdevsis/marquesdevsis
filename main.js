/* ═══════════════════════════════════════════════════
   marquesDevsis — JavaScript
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════
     PARTICLE CANVAS
  ══════════════════════ */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = randomBetween(0, W);
      this.y = initial ? randomBetween(0, H) : H + 10;
      this.size = randomBetween(0.8, 2.5);
      this.speedY = randomBetween(0.15, 0.55);
      this.speedX = randomBetween(-0.15, 0.15);
      this.opacity = randomBetween(0.15, 0.6);
      this.opacityDelta = randomBetween(0.003, 0.008) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.5
        ? `rgba(22, 150, 243, ${this.opacity})`
        : `rgba(34, 211, 238, ${this.opacity})`;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += this.opacityDelta;

      if (this.opacity <= 0.05 || this.opacity >= 0.65) {
        this.opacityDelta *= -1;
      }

      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 10000);
    const finalCount = Math.min(Math.max(count, 40), 120);
    for (let i = 0; i < finalCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = '#1696F3';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  }

  function startParticles() {
    resizeCanvas();
    initParticles();
    animateParticles();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      startParticles();
    }, 200);
  });

  startParticles();


  /* ══════════════════════
     CUSTOM CURSOR
  ══════════════════════ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let cursorVisible = false;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorVisible) {
        cursorVisible = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.querySelectorAll('a, button, .service-card, .portfolio-card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
  }


  /* ══════════════════════
     HEADER SCROLL
  ══════════════════════ */
  const header = document.getElementById('siteHeader');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  /* ══════════════════════
     ACTIVE NAV LINKS
  ══════════════════════ */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ══════════════════════
     HAMBURGER MENU
  ══════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  /* ══════════════════════
     SMOOTH SCROLL
  ══════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════
     SCROLL REVEAL
  ══════════════════════ */
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('is-visible');
        }, parseInt(delay));
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));


  /* ══════════════════════
     COUNTER ANIMATION
  ══════════════════════ */
  const counters = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const step = (timestamp, start, startVal) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(startVal + (target - startVal) * eased);
        if (progress < 1) requestAnimationFrame(ts => step(ts, start, startVal));
        else counter.textContent = target;
      };
      requestAnimationFrame(ts => step(ts, ts, 0));
    });
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }


  /* ══════════════════════
     PORTFOLIO FILTER
  ══════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ══════════════════════
     TESTIMONIAL SLIDER
  ══════════════════════ */
  const track = document.getElementById('testimonialsTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;
  let autoSlideInterval;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    if (!track || cards.length === 0) return;
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  if (prevBtn && nextBtn && cards.length > 0) {
    buildDots();
    startAutoSlide();

    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        stopAutoSlide();
        goToSlide(currentSlide + (delta > 0 ? 1 : -1));
        startAutoSlide();
      }
    });
  }


  /* ══════════════════════
     SCROLL TO TOP
  ══════════════════════ */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════
     FOOTER YEAR
  ══════════════════════ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ══════════════════════
     CONTACT FORM
  ══════════════════════ */
  const form = document.getElementById('contatoForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    // Phone mask
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
      telefoneInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) {
          v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
          v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
          v = `(${v}`;
        }
        this.value = v;
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#F87171';
          field.addEventListener('input', () => field.style.borderColor = '', { once: true });
          valid = false;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('[required]:placeholder-shown, [required][value=""]');
        return;
      }

      // Show loading
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const btnIcon = submitBtn.querySelector('.btn-icon');

      submitBtn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (btnLoading) { btnLoading.removeAttribute('hidden'); btnLoading.classList.add('show'); }
      if (btnIcon) btnIcon.hidden = true;

      // Simulate send (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 1600));

      // Show success
      submitBtn.hidden = true;
      if (formSuccess) formSuccess.removeAttribute('hidden');
      form.reset();
    });
  }


  /* ══════════════════════
     SERVICE CARD TILT EFFECT
  ══════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
    const serviceCards = document.querySelectorAll('.service-card-inner');

    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -4;
        const rotY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ══════════════════════
     TYPING EFFECT ON HERO BADGE
  ══════════════════════ */
  const heroBadge = document.querySelector('.hero-badge span:last-child');
  if (heroBadge) {
    const messages = [
      'Transformando ideias em tecnologia',
      'Sistemas que fazem sua empresa crescer',
      'Suporte especializado quando você precisar',
      'Soluções digitais sob medida para você'
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer;

    function typeText() {
      const currentMsg = messages[msgIndex];
      if (isDeleting) {
        heroBadge.textContent = currentMsg.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          msgIndex = (msgIndex + 1) % messages.length;
          typingTimer = setTimeout(typeText, 400);
          return;
        }
      } else {
        heroBadge.textContent = currentMsg.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentMsg.length) {
          typingTimer = setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 3200);
          return;
        }
      }
      typingTimer = setTimeout(typeText, isDeleting ? 32 : 58);
    }

    // Start after 2s delay
    setTimeout(typeText, 2000);
  }


  /* ══════════════════════
     HERO GLOW PARALLAX
  ══════════════════════ */
  const heroGlow1 = document.querySelector('.hero-glow-1');
  const heroGlow2 = document.querySelector('.hero-glow-2');

  if (heroGlow1 && heroGlow2) {
    document.addEventListener('mousemove', (e) => {
      if (window.scrollY > window.innerHeight) return;
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      const moveX1 = (xRatio - 0.5) * 40;
      const moveY1 = (yRatio - 0.5) * 30;
      const moveX2 = (xRatio - 0.5) * -30;
      const moveY2 = (yRatio - 0.5) * -25;
      heroGlow1.style.transform = `translate(${moveX1}px, ${moveY1}px) scale(1)`;
      heroGlow2.style.transform = `translate(${moveX2}px, ${moveY2}px) scale(1)`;
    });
  }


  /* ══════════════════════
     TECH TAG HOVER WAVE
  ══════════════════════ */
  const techTags = document.querySelectorAll('.tech-tag');
  techTags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 30}ms`;
  });

  const techStack = document.querySelector('.sobre-tech-stack');
  if (techStack) {
    const stackObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        techTags.forEach((tag, i) => {
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 60);
        });
        stackObserver.disconnect();
      }
    }, { threshold: 0.5 });

    // Initial state
    techTags.forEach(tag => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(10px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    stackObserver.observe(techStack);
  }


  /* ══════════════════════
     PORTFOLIO CARDS FLIP ON HOVER (Visual enhancement)
  ══════════════════════ */
  const pCards = document.querySelectorAll('.portfolio-card');
  pCards.forEach(card => {
    const visual = card.querySelector('.pcard-visual');
    if (!visual) return;

    card.addEventListener('mouseenter', () => {
      visual.style.transition = 'transform 0.4s ease';
    });
  });


  /* ══════════════════════
     NETWORK NODE ANIMATION
  ══════════════════════ */
  const networkNodes = document.querySelectorAll('.network-node');
  networkNodes.forEach((node, i) => {
    node.style.animation = `pulse-dot ${1.5 + i * 0.3}s ease-in-out infinite`;
    node.style.animationDelay = `${i * 0.3}s`;
  });


  /* ══════════════════════
     INIT LOG
  ══════════════════════ */
  console.log('%cmarquesDevsis', 'font-size:18px; font-weight:bold; color:#1696F3;');
  console.log('%cSistemas e soluções digitais — marquesdevsis.com.br', 'font-size:12px; color:#22D3EE;');

})();
