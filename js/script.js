document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SKILL_LEVEL_WIDTH = { primary: 100, strong: 80, familiar: 65 };

  // -------------------------------------------------------------
  // Theme Toggle Logic
  // -------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  function updateThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#060814');
    }
  }

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeColor(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeColor(newTheme);
  });

  // -------------------------------------------------------------
  // Mobile Nav Toggle
  // -------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function setMobileNavOpen(isOpen) {
    navMenu.classList.toggle('active', isOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));

    const icon = mobileNavToggle.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  }

  mobileNavToggle.addEventListener('click', () => {
    setMobileNavOpen(!navMenu.classList.contains('active'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMobileNavOpen(false);
    });
  });

  // Navbar Scroll Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
  });

  // -------------------------------------------------------------
  // Scroll-Spy Navigation
  // -------------------------------------------------------------
  const sectionIds = ['home', 'about', 'experience', 'skills', 'portfolio', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveNavLink(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${id}`);
    });
  }

  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveNavLink(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(section => spyObserver.observe(section));
  }

  // -------------------------------------------------------------
  // Interactive Terminal Emulator
  // -------------------------------------------------------------
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  if (terminalInput && terminalBody) {
    const terminalHistory = [];
    let historyIndex = -1;

    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const commandText = terminalInput.value.trim();
        if (commandText) {
          executeCommand(commandText);
          terminalHistory.push(commandText);
          historyIndex = terminalHistory.length;
        }
        terminalInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = terminalHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < terminalHistory.length - 1) {
          historyIndex++;
          terminalInput.value = terminalHistory[historyIndex];
        } else {
          historyIndex = terminalHistory.length;
          terminalInput.value = '';
        }
        e.preventDefault();
      }
    });

    function executeCommand(cmd) {
      const lowerCmd = cmd.toLowerCase().trim();

      const outputWrapper = document.createElement('div');
      outputWrapper.className = 'terminal-output-block';

      const echoLine = document.createElement('div');
      echoLine.className = 'terminal-input-line';
      echoLine.innerHTML = `<span class="terminal-prompt">></span> <span>${escapeHtml(cmd)}</span>`;
      outputWrapper.appendChild(echoLine);

      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-output';

      if (lowerCmd === 'clear') {
        terminalBody.querySelectorAll('.terminal-output-block').forEach(el => el.remove());
        return;
      }

      const terminalResponses = typeof SITE_CONTENT !== 'undefined' ? SITE_CONTENT.terminal : {};
      const response = terminalResponses[lowerCmd]
        || `Command not recognized: '${escapeHtml(cmd)}'. Type 'help' for valid commands.`;

      responseLine.textContent = response;
      outputWrapper.appendChild(responseLine);
      terminalBody.insertBefore(outputWrapper, terminalInput.parentElement);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // -------------------------------------------------------------
  // Contact Form (mailto)
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !subject || !message) {
        if (formStatus) {
          formStatus.hidden = false;
          formStatus.textContent = 'Please fill in all fields before sending.';
          formStatus.className = 'form-status form-status--error';
        }
        return;
      }

      const recipient = typeof SITE_CONTENT !== 'undefined' ? SITE_CONTENT.email : 'muralichanda@gmail.com';
      const body = `From: ${name} <${email}>\n\n${message}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent = 'Your email client should open shortly. If it does not, email muralichanda@gmail.com directly.';
        formStatus.className = 'form-status form-status--success';
      }
    });
  }

  // -------------------------------------------------------------
  // Footer Year
  // -------------------------------------------------------------
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.textContent = year > 2024 ? `2024–${year}` : String(year);
  }

  // -------------------------------------------------------------
  // Scroll Animation Observer & Counter & Skill Bars
  // -------------------------------------------------------------
  const fadeSections = document.querySelectorAll('.fade-in-section');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const statsElements = document.querySelectorAll('.stat-number');

  if (prefersReducedMotion) {
    fadeSections.forEach(section => section.classList.add('is-visible'));
    skillBars.forEach(bar => {
      const level = bar.getAttribute('data-level') || 'strong';
      bar.style.width = `${SKILL_LEVEL_WIDTH[level] || 80}%`;
    });
    statsElements.forEach(stat => {
      const target = +stat.getAttribute('data-count');
      stat.textContent = target + (stat.id === 'years-stat' ? '+' : '');
    });
  } else {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeSections.forEach(section => sectionObserver.observe(section));

    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillBars.forEach(bar => {
              const level = bar.getAttribute('data-level') || 'strong';
              bar.style.width = `${SKILL_LEVEL_WIDTH[level] || 80}%`;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }

    let statsAnimated = false;
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            statsElements.forEach(stat => {
              const target = +stat.getAttribute('data-count');
              const duration = 2000;
              const stepTime = Math.max(Math.abs(Math.floor(duration / target)), 16);
              let current = 0;

              const timer = setInterval(() => {
                current += 1;
                stat.textContent = current;
                if (current >= target) {
                  stat.textContent = target + (stat.id === 'years-stat' ? '+' : '');
                  clearInterval(timer);
                }
              }, stepTime);
            });
            statsAnimated = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      statsObserver.observe(aboutSection);
    }
  }
});
