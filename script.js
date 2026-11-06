/**
 * Abishek S R — Full Stack Developer Portfolio
 * Vanilla JavaScript (No external libraries or frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Mobile Navigation Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  /* ==========================================================================
     2. Navbar Scroll Effect & Active Section Tracker
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const handleNavScroll = () => {
    const scrollY = window.pageYOffset;

    // Navbar background blur/border enhancement
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active link highlighting based on scroll position
    const navHeight = navbar ? navbar.offsetHeight + 60 : 100;
    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on initial load

  /* ==========================================================================
     3. Hero Role Typewriter Animation
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  const roles = [
    'Full Stack Developer',
    'Backend Developer'
   
  ];

  if (typingElement) {
    if (prefersReducedMotion) {
      typingElement.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 90;

      const type = () => {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
          typingElement.textContent = currentRole.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 45;
        } else {
          typingElement.textContent = currentRole.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
          // Pause at end of word
          typingSpeed = 1800;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          // Finished deleting, move to next role
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingSpeed = 350;
        }

        setTimeout(type, typingSpeed);
      };

      // Start typewriter after a slight initial delay
      setTimeout(type, 600);
    }
  }

  /* ==========================================================================
     4. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Unobserve once animated
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     5. Skill Bars Fill Animation (IntersectionObserver)
     ========================================================================== */
  const skillBars = document.querySelectorAll('.skill-progress-fill');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-level') || '75%';
            bar.style.width = targetWidth;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.25 }
    );

    skillBars.forEach((bar) => skillsObserver.observe(bar));
  } else {
    // Fill immediately
    skillBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-level') || '75%';
      bar.style.width = targetWidth;
    });
  }

  /* ==========================================================================
     6. Smooth Scrolling for Anchor Links (with header offset)
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = navbar ? navbar.offsetHeight + 16 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Set focus for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  /* ==========================================================================
     7. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ==========================================================================
     8. Interactive Contact Form with Validation & Toast Notification
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const toastNotification = document.getElementById('toast-notification');

  const showToast = (message, isError = false) => {
    if (!toastNotification) return;

    toastNotification.textContent = message;
    toastNotification.className = 'toast-notification show';
    if (isError) {
      toastNotification.classList.add('toast-error');
    }

    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email || !subject || !message) {
        showToast('Please fill in all required fields.', true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', true);
        return;
      }

      // Button loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Preparing Message...</span>
      `;

      // Simulate clean handoff to mail client & reset
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Construct mailto link so user's message actually reaches Abishek
        const mailtoUrl = `mailto:abisheksr680@gmail.com?subject=${encodeURIComponent(
          `[Portfolio Contact] ${subject} - From ${name}`
        )}&body=${encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        showToast(`Thank you, ${name}! Opening your email client to send...`);
        contactForm.reset();

        // Open mailto link
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  /* ==========================================================================
     9. Interactive Skill Filter Tabs (Optional Enhancement)
     ========================================================================== */
  const skillCategoryTabs = document.querySelectorAll('.skills-category-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (skillCategoryTabs.length > 0 && skillCards.length > 0) {
    skillCategoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');

        // Update active tab
        skillCategoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter cards
        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }
});

