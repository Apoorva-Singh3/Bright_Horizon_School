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

    /* ==============================
     11. ADMISSION FORM
  ============================== */

  const admissionForm = document.getElementById('admissionForm');

  if (admissionForm) {

    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');
    const spinner    = submitBtn.querySelector('.spinner');
    const formMsg    = document.getElementById('formMessage');

    let isSubmitting = false;

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzmyiYRo9CZYBvgtKtdKin4Vpzq0nkho-Ey5_xnhAgNGR8CyzI5ZpkTm8r2q3G-_c0-/exec";

    function showMessage(message, type = "success") {

      formMsg.className = `form-message ${type}`;
      formMsg.textContent = message;

      formMsg.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    function clearErrors() {

      admissionForm
        .querySelectorAll('.form-group')
        .forEach(group => {
          group.classList.remove('error');
        });

      admissionForm
        .querySelectorAll('.error-text')
        .forEach(error => {
          error.textContent = '';
        });
    }

    function setError(input, message) {

      const group = input.closest('.form-group');

      if (!group) return;

      group.classList.add('error');

      const errorText =
        group.querySelector('.error-text');

      if (errorText) {
        errorText.textContent = message;
      }
    }

    function validateForm() {

      clearErrors();

      let valid = true;

      const studentName =
        document.getElementById('studentName');

      const parentName =
        document.getElementById('parentName');

      const mobile =
        document.getElementById('mobile');

      const whatsapp =
        document.getElementById('whatsapp');

      const email =
        document.getElementById('email');

      const address =
        document.getElementById('address');

      const dob =
        document.getElementById('dob');

      const gender =
        document.getElementById('gender');

      const classApplying =
        document.getElementById('classApplying');

      if (!studentName.value.trim()) {
        setError(studentName,
          'Student name is required');
        valid = false;
      }

      if (!parentName.value.trim()) {
        setError(parentName,
          'Parent name is required');
        valid = false;
      }

      if (!dob.value) {
        setError(dob,
          'Date of birth is required');
        valid = false;
      }

      if (!gender.value) {
        setError(gender,
          'Please select gender');
        valid = false;
      }

      if (!classApplying.value) {
        setError(classApplying,
          'Please select class');
        valid = false;
      }

      if (!address.value.trim()) {
        setError(address,
          'Address is required');
        valid = false;
      }

      const mobileRegex = /^[6-9]\d{9}$/;

      if (!mobileRegex.test(mobile.value.trim())) {
        setError(
          mobile,
          'Enter valid 10-digit mobile number'
        );
        valid = false;
      }

      if (
        whatsapp.value.trim() &&
        !mobileRegex.test(whatsapp.value.trim())
      ) {
        setError(
          whatsapp,
          'Enter valid WhatsApp number'
        );
        valid = false;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.value.trim())) {
        setError(
          email,
          'Enter valid email address'
        );
        valid = false;
      }

      return valid;
    }

    admissionForm.addEventListener(
      'submit',
      async function (e) {

        e.preventDefault();

        if (isSubmitting) return;

        formMsg.className = 'form-message';
        formMsg.textContent = '';

        if (!validateForm()) return;

        isSubmitting = true;

        submitBtn.disabled = true;

        btnText.textContent =
          'Submitting...';

        spinner.classList.remove('hidden');

        const formData = {
          studentName:
            document.getElementById('studentName').value,

          dob:
            document.getElementById('dob').value,

          gender:
            document.getElementById('gender').value,

          classApplying:
            document.getElementById('classApplying').value,

          parentName:
            document.getElementById('parentName').value,

          mobile:
            document.getElementById('mobile').value,

          whatsapp:
            document.getElementById('whatsapp').value,

          email:
            document.getElementById('email').value,

          address:
            document.getElementById('address').value,

          previousSchool:
            document.getElementById('previousSchool').value,

          notes:
            document.getElementById('notes').value
        };

        try {

          const response =
            await fetch(
              GOOGLE_SCRIPT_URL,
              {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type':
                    'application/json'
                },
                body: JSON.stringify(formData)
              }
            );

          const result =
            await response.json();

          if (result.success) {

            showMessage(
              'Admission enquiry submitted successfully. Our admissions team will contact you shortly.',
              'success'
            );

            admissionForm.reset();

          } else {

            showMessage(
              result.message ||
              'Submission failed. Please try again.',
              'error'
            );
          }

        } catch (error) {

          console.error(error);

          showMessage(
            'Unable to submit the form. Please try again later.',
            'error'
          );

        } finally {

          isSubmitting = false;

          submitBtn.disabled = false;

          btnText.textContent =
            'Submit Admission Enquiry';

          spinner.classList.add('hidden');
        }
      }
    );

    /* Numbers only */

    ['mobile', 'whatsapp'].forEach(id => {

      const input =
        document.getElementById(id);

      if (!input) return;

      input.addEventListener('input', () => {

        input.value =
          input.value.replace(/\D/g, '');

        if (input.value.length > 10) {
          input.value =
            input.value.slice(0, 10);
        }
      });
    });

  }

});
