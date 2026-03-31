/* =========================================
   BRIGHT HORIZON SCHOOL — script.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ==============================
     1. STICKY HEADER ON SCROLL
  ============================== */
  const header = document.getElementById('mainHeader');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ==============================
     2. HAMBURGER / MOBILE NAV
  ============================== */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });


  /* ==============================
     3. REVEAL ON SCROLL
  ============================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ==============================
     4. TESTIMONIAL TABS
  ============================== */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content with fade
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.style.opacity = '0';
      });

      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.add('active');
        // Fade in
        requestAnimationFrame(() => {
          targetContent.style.transition = 'opacity 0.4s ease';
          targetContent.style.opacity   = '1';
        });
      }
    });
  });

  // Set initial tab opacity
  document.querySelectorAll('.tab-content.active').forEach(c => {
    c.style.opacity = '1';
  });


  /* ==============================
     5. SMOOTH SCROLL FOR ANCHORS
  ============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ==============================
     6. COUNTER ANIMATION (Stats)
  ============================== */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const animateCounter = (el) => {
    const rawText = el.textContent.trim();
    const numMatch = rawText.match(/[\d,]+/);
    if (!numMatch) return;

    const target   = parseInt(numMatch[0].replace(/,/g, ''));
    const suffix   = rawText.replace(/[\d,]+/, '');
    const duration = 1600;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
    }, step);
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNums.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  /* ==============================
     7. ACTIVE NAV HIGHLIGHT
  ============================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item > a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ==============================
     8. NEWS CARD HOVER PARALLAX
  ============================== */
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = y * -4;
      const rotY   = x *  4;
      card.style.transform = `translateY(-5px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
    });
  });


  /* ==============================
     9. ANNOUNCEMENT BAR DISMISS
  ============================== */
  const annBar = document.querySelector('.announcement-bar');
  if (annBar) {
    // Auto-dismiss after 10 seconds with a smooth collapse
    setTimeout(() => {
      annBar.style.transition = 'max-height 0.5s ease, opacity 0.5s ease, padding 0.5s ease';
      annBar.style.maxHeight  = annBar.offsetHeight + 'px';

      requestAnimationFrame(() => {
        annBar.style.maxHeight = '0';
        annBar.style.opacity   = '0';
        annBar.style.overflow  = 'hidden';
        annBar.style.padding   = '0';
      });
    }, 10000);
  }


  /* ==============================
     10. LOGO IMAGE FALLBACK
  ============================== */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      // If logo fails to load, show a text crest fallback
      if (this.alt.toLowerCase().includes('logo') || this.alt.toLowerCase().includes('crest')) {
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          width: ${this.width || 60}px;
          height: ${this.height || 60}px;
          background: #1B2A4A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 700;
        `;
        fallback.textContent = 'BH';
        this.parentNode.replaceChild(fallback, this);
      }
    });
  });

});
