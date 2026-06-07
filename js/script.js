document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // Theme Toggle Logic
  // -------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  // Apply theme on load
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // -------------------------------------------------------------
  // Mobile Nav Toggle
  // -------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileNavToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Toggle hamburger icon (simple replacement)
    const icon = mobileNavToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileNavToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Navbar Scroll Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });

  // -------------------------------------------------------------
  // Interactive Terminal Emulator
  // -------------------------------------------------------------
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  
  if (terminalInput && terminalBody) {
    const terminalHistory = [];
    let historyIndex = -1;

    // Focus input on terminal body click
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
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
      
      // Create output block
      const outputWrapper = document.createElement('div');
      outputWrapper.className = 'terminal-output-block';
      
      // Echo command
      const echoLine = document.createElement('div');
      echoLine.className = 'terminal-input-line';
      echoLine.innerHTML = `<span class="terminal-prompt">></span> <span>${escapeHtml(cmd)}</span>`;
      outputWrapper.appendChild(echoLine);

      // Get response content
      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-output';
      
      let response = '';

      switch (lowerCmd) {
        case 'help':
          response = `Available commands:
  bio          Display professional background summary
  skills       View core technical skill sets
  experience   List major career milestones
  projects     Show featured enterprise solutions
  contact      Display communication channels
  clear        Clear the terminal interface`;
          break;
        case 'bio':
          response = `Name: Murali Krishna Chanda
Role: Principal Engineer & Lead Developer
Exp:  19+ Years in Software Engineering & Architecture
Bio:  A veteran builder specializing in Java, AWS, UI technologies, 
      and leading globally distributed engineering teams.`;
          break;
        case 'skills':
          response = `Technical Skill Set:
  - Backend: Java, Spring Boot, Spring Data, REST/GraphQL APIs
  - Cloud: AWS (Lambda, API Gateway, CloudFront, EC2, S3), Azure, GCP
  - Frontend: JavaScript, ReactJS, Angular, Redux, TypeScript, Bootstrap
  - DevOps: Docker, Kubernetes, CI/CD (Jenkins, Maven, Gradle)
  - Databases: MongoDB, MySQL, Oracle
  - Messaging: Apache Kafka, Firebase, Websockets
  - Observability: Splunk, SonarQube, JMeter, Postman, Swagger`;
          break;
        case 'experience':
          response = `Professional Experience:
  - 07/2016 - Present : Principal Engineer / Lead Developer, Seattle, WA
    Technical Architecture, Release Management, AWS Serverless, team leadership
  - 01/2007 - 06/2016 : Full Stack Developer / Team Lead, India
    Full life-cycle development, UI & backend, R&D, mentoring`;
          break;
        case 'projects':
          response = `Key Deliverables:
  1. Multi-Platform Application Architectures (Web, Android, iOS)
  2. Enterprise Integration with Salesforce Commerce Cloud ERP
  3. Scalable AWS API Gateway & Lambda Serverless Infrastructure`;
          break;
        case 'contact':
          response = `Get in Touch:
  Email    : muralichanda@gmail.com
  LinkedIn : linkedin.com (Placeholder)
  GitHub   : github.com/muralichanda
  Location : Seattle, WA`;
          break;
        case 'clear':
          // Remove all previous output elements except welcome messages
          const outputs = terminalBody.querySelectorAll('.terminal-output-block');
          outputs.forEach(el => el.remove());
          return; // Skip adding output
        default:
          response = `Command not recognized: '${escapeHtml(cmd)}'. Type 'help' for valid commands.`;
      }

      responseLine.textContent = response;
      outputWrapper.appendChild(responseLine);
      
      // Insert before input line
      terminalBody.insertBefore(outputWrapper, terminalInput.parentElement);
      
      // Scroll to bottom
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  // -------------------------------------------------------------
  // Scroll Animation Observer & Counter & Skill Bars
  // -------------------------------------------------------------
  const fadeSections = document.querySelectorAll('.fade-in-section');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const statsElements = document.querySelectorAll('.stat-number');
  
  // 1. Intersection Observer for Fade In Sections
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // 2. Intersection Observer for Skills Animate
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const val = bar.getAttribute('data-value');
          bar.style.width = val + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // 3. Counter Animation for About Page Stats
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsElements.forEach(stat => {
          const target = +stat.getAttribute('data-count');
          const duration = 2000; // 2 seconds
          const stepTime = Math.abs(Math.floor(duration / target));
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
  }, { threshold: 0.1 });

  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    statsObserver.observe(aboutSection);
  }
});
