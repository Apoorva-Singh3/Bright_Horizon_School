/* ============================================
   CHDS SCHOOL WEBSITE — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. STICKY HEADER SHADOW
     ========================================== */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ==========================================
     2. HAMBURGER / MOBILE MENU
     ========================================== */
  const hamburger      = document.getElementById('hamburger');
  const mobileOverlay  = document.getElementById('mobile-overlay');
  const mobileClose    = document.getElementById('mobile-close');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileOverlay.classList.add('open');
    mobileOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileOverlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileClose.addEventListener('click', closeMenu);

  // Close when clicking the backdrop (not the drawer itself)
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeSearch();
    }
  });


  /* ==========================================
     3. MOBILE ACCORDION SUB-MENUS
     ========================================== */
  document.querySelectorAll('.mobile-parent').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const sub      = document.getElementById(targetId);
      const isOpen   = sub.classList.contains('open');

      // Close all open subs
      document.querySelectorAll('.mobile-sub.open').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.mobile-parent.active').forEach(b => b.classList.remove('active'));

      if (!isOpen) {
        sub.classList.add('open');
        btn.classList.add('active');
      }
    });
  });


  /* ==========================================
     4. SEARCH BAR TOGGLE
     ========================================== */
  const searchBtn   = document.getElementById('search-btn');
  const searchBar   = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');

  function openSearch() {
    searchBar.classList.add('open');
    searchBar.removeAttribute('aria-hidden');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearch() {
    searchBar.classList.remove('open');
    searchBar.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
  }

  searchBtn.addEventListener('click', () => {
    searchBar.classList.contains('open') ? closeSearch() : openSearch();
  });

  searchClose.addEventListener('click', closeSearch);

  // Search form submission (demo — replace with real search)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        alert(`Searching for: "${query}"\n\n(Connect this to your real search system)`);
        closeSearch();
      }
    }
  });


  /* ==========================================
     5. TESTIMONIAL / QUOTE SLIDER
     ========================================== */
  const track  = document.getElementById('testimonial-track');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let autoplayTimer;

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function nextSlide() {
    goToSlide((current + 1) % dots.length);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX   = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        stopAutoplay();
        if (diff > 0) {
          goToSlide((current + 1) % dots.length);
        } else {
          goToSlide((current - 1 + dots.length) % dots.length);
        }
        startAutoplay();
      }
    }, { passive: true });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();


  /* ==========================================
     6. SCROLL REVEAL ANIMATION
     ========================================== */
  const aosElements = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const siblings = Array.from(entry.target.parentElement.children);
          const delay    = siblings.indexOf(entry.target) * 120;
          setTimeout(() => {
            entry.target.classList.add('aos-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    aosElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for old browsers
    aosElements.forEach(el => el.classList.add('aos-visible'));
  }


  /* ==========================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu(); // also close mobile menu if open

      const headerHeight = header.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ==========================================
     8. ACTIVE NAV LINK ON SCROLL
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === `#${entry.target.id}` ? 'var(--green-dark)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => sectionObserver.observe(s));


  /* ==========================================
     9. BACK TO TOP (auto-inject button)
     ========================================== */
  const btt = document.createElement('button');
  btt.setAttribute('aria-label', 'Back to top');
  btt.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 500;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: var(--green-dark);
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  `;
  btt.innerHTML = '↑';
  document.body.appendChild(btt);

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btt.style.opacity       = show ? '1' : '0';
    btt.style.pointerEvents = show ? 'all' : 'none';
    btt.style.transform     = show ? 'translateY(0)' : 'translateY(10px)';
  }, { passive: true });


  /* ==========================================
     10. INLINE FORM FEEDBACK (Contact / Inquiry)
         Demo-ready: shows confirmation toast
     ========================================== */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    const bg = type === 'success' ? 'var(--green-dark)' : '#c0392b';
    toast.style.cssText = `
      position: fixed;
      bottom: 5rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: ${bg};
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      opacity: 0;
      transition: all 0.35s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Attach toast to CTA buttons as demo feedback
  document.querySelectorAll('.btn-hero-primary, .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.textContent.trim();
      if (text === 'Apply Now' || text === 'Apply') {
        // Allow navigation — don't intercept real links
        // showToast('Redirecting to application portal…');
      }
    });
  });

  // Expose showToast globally for use in any page
  window.showToast = showToast;

}); // end DOMContentLoaded
