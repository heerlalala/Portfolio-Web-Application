document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SLIDE STATE
  ========================== */

  let currentSlide = 0;
  const slider = document.getElementById("slider");
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  let isUnlocked = false;

  /* =========================
     SLIDE-1 ONLY WIDGET CONTROL
  ========================== */

  const slide1Widgets = document.querySelectorAll(".slide1-only");

  function updateSlide1Widgets() {
    slide1Widgets.forEach(el => {
      el.classList.toggle("hidden", currentSlide !== 0);
    });
  }

  /* =========================
     SLIDE NAVIGATION (GSAP)
  ========================== */

  function goToSlide(index) {
    if (!slider || index < 0 || index >= totalSlides) return;

    // BLOCK slide 2 until unlocked
    if (!isUnlocked && currentSlide === 0 && index === 1) return;

    currentSlide = index;

    gsap.to(slider, {
      x: `-${currentSlide * 100}vw`,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });

    updateSlide1Widgets();
  }

  updateSlide1Widgets(); // initialize on load

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
  });

  let scrollLock = false;
  document.addEventListener("wheel", e => {
    e.preventDefault();
    if (scrollLock) return;
    scrollLock = true;

    e.deltaY > 0
      ? goToSlide(currentSlide + 1)
      : goToSlide(currentSlide - 1);

    setTimeout(() => scrollLock = false, 450);
  }, { passive: false });

  // Swipe Gestures for Mobile
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener("touchstart", e => {
    if (e.target.closest(".bird-game") || e.target.closest(".game-controls") || e.target.closest(".game-panel")) {
      return;
    }
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener("touchend", e => {
    if (e.target.closest(".bird-game") || e.target.closest(".game-controls") || e.target.closest(".game-panel")) {
      return;
    }
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: true });

  /* =========================
     QUICK ACTION BUTTONS
  ========================== */

  const qaButtons = document.querySelectorAll(".qa-btn");
  const slideIndexMap = {
    projects: document.querySelector(".slide.projects"),
    skills: document.querySelector(".slide.skills"),
    contact: document.querySelector(".slide.contact")
  };

  qaButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = slideIndexMap[btn.dataset.go];
      if (!target) return;

      const index = Array.from(slides).indexOf(target);
      if (index >= 0) goToSlide(index);
    });
  });

  /* =========================
     LIVE TECH INSIGHT
  ========================== */

  const insights = [
    "JavaScript remains the most widely used language in web development.",
    "Full-stack developers are among the most in-demand internship roles.",
    "Dashboards and automation are core tools for data-driven organizations.",
    "Web systems focusing on UX outperform static portfolios.",
    "Automation skills significantly boost early-career developer profiles."
  ];

  const insightEl = document.getElementById("insightText");
  let insightIndex = 0;

  if (insightEl) {
    setInterval(() => {
      if (currentSlide !== 0) return;

      insightEl.style.opacity = "0";
      insightEl.style.transform = "translateY(6px)";

      setTimeout(() => {
        insightIndex = (insightIndex + 1) % insights.length;
        insightEl.textContent = insights[insightIndex];
        insightEl.style.opacity = "1";
        insightEl.style.transform = "translateY(0)";
      }, 400);
    }, 5000);
  }

  /* =========================
     SKILLS BOWL ANIMATION
  ========================== */

  const skills = document.querySelectorAll(".skill");
  const bowl = document.getElementById("bowl");

  if (bowl && skills.length) {
    const velocities = [];

    skills.forEach((skill, i) => {
      skill.style.left = Math.random() * (bowl.clientWidth - 60) + "px";
      skill.style.top = Math.random() * (bowl.clientHeight - 40) + "px";

      velocities[i] = {
        x: (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
        y: (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1)
      };
    });

    function animateSkills() {
      skills.forEach((skill, i) => {
        let x = skill.offsetLeft + velocities[i].x;
        let y = skill.offsetTop + velocities[i].y;

        if (x <= 0 || x >= bowl.clientWidth - skill.offsetWidth) velocities[i].x *= -1;
        if (y <= 0 || y >= bowl.clientHeight - skill.offsetHeight) velocities[i].y *= -1;

        skill.style.left = x + "px";
        skill.style.top = y + "px";
      });

      requestAnimationFrame(animateSkills);
    }

    animateSkills();
  }

  /* =========================
     THEME TOGGLE
  ========================== */

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      toggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
    });
  }

  /* =========================
     UNLOCK AREA (KEY + LOCK)
  ========================== */

  const keyIcon = document.getElementById("keyIcon");
  const lockIcon = document.getElementById("lockIcon");
  const unlockArea = document.getElementById("unlockArea");

  if (keyIcon && lockIcon && unlockArea) {
    keyIcon.addEventListener("click", () => {
      if (isUnlocked) return;

      isUnlocked = true;

      gsap.to(keyIcon, {
        x: -40,
        y: -20,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.out"
      });

      setTimeout(() => {
        lockIcon.textContent = "🔓";
        unlockArea.classList.add("unlocked");
        goToSlide(1);
      }, 450);
    });
  }

  /* =========================
     SLIDE 3 – TECH STACK CARD ANIMATIONS
  ========================== */

  // Elegant staggered reveal for floating tech cards
  gsap.from(".orbit-ui .layer", {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.out"
  });

  gsap.from(".orbit-backend .layer", {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.4,
    ease: "power3.out"
  });

  gsap.from(".orbit-infra .layer", {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    ease: "power3.out"
  });

  // Core badge animation
  gsap.from(".core", {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  });

  /* =========================
     SLIDE 4 – SKILLS JAR
  ========================== */

  const jar = document.getElementById("jarTrigger");
  const skillsContainer = document.getElementById("skillsGroups");

  if (jar && skillsContainer) {
    let opened = false;

    jar.addEventListener("click", () => {
      if (opened) return;
      opened = true;

      jar.classList.add("open");
      skillsContainer.classList.add("show");
    });
  }

  /* =========================
     SLIDE 5 – PROJECTS
  ========================== */

  const projectData = {
    portal: {
      title: "Portal",
      tech: "HTML • CSS • Backend",
      points: [
        "This project simulates a real institutional system used in colleges and universities.",
        "Designed a centralized college portal with role-based access control for students, faculty, and administrators.",
        "Built separate dashboards for each role, ensuring users only access features relevant to their permissions.",
        "Implemented secure authentication with session handling and protected routes.",
        "Enabled dynamic content rendering based on user roles (announcements, uploads, approvals).",
        "Focused on clean UI, intuitive navigation, and scalability for future academic modules."
      ]
    },
    budget: {
      title: "Budget Manager",
      tech: "Python • Finance Engine • GUI",
      points: [
        "Demonstrates strong problem-solving, data handling, and system design skills.",
        "Developed a custom-built finance engine in Python to track income, expenses, and budget limits.",
        "Designed an interactive GUI allowing users to add, edit, undo actions, and navigate data seamlessly.",
        "Integrated Excel/data entry support for importing and managing real-world financial records.",
        "Automated spending analysis to provide insight-driven feedback for better financial decisions.",
        "Built entirely from scratch without third-party finance libraries."
      ]
    },
    ngo: {
      title: "NGO Activity & Biodiversity Dashboard",
      tech: "HTML • CSS • PHP • MySQL",
      points: [
        "This project combines environmental awareness with full-stack web development and content automation.",
        "Dashboard to track NGO activities by category and event type.",
        "Biodiversity module with slideshow widgets and auto-generated pages.",
        "Delete-sync system for images, data, and content.",
        "Categorized NGO initiatives by activity type, region, and event.",
        "Enabled structured data visualization for impact monitoring.",
        "Allowed editable content storage for biodiversity descriptions and images.",
        "Enabled non-technical users to update information easily."
      ]
    },
    event: {
      title: "Event Management Website (Ocassio)",
      tech: "HTML • CSS • Node.js • AngularJS",
      points: [
        "Simulates a production-ready event booking and ticketing system.",
        "Built a role-based event platform where organizers create and manage events, while users receive live updates.",
        "Implemented a real-time payment workflow integrated with automated ticket generation.",
        "Engineered an email automation system that sends instant, personalized HTML tickets upon successful payment.",
        "Designed a robust backend endpoint (/sendTicketEmail) to handle high-volume, error-controlled email delivery.",
        "Ensured seamless coordination between frontend actions and backend services."
      ]
    },
    hotel: {
      title: "Hotel Management Network",
      tech: "Cisco Packet Tracer",
      points: [
        "Demonstrates practical understanding of enterprise-level network design.",
        "Designed a multi-building hotel network with a unified static IP-based WiFi infrastructure.",
        "Configured routing to enable seamless communication between hotel blocks and departments.",
        "Implemented packet tracing to monitor data flow and troubleshoot connectivity.",
        "Simulated real-world hotel networking scenarios including device management and inter-block communication."
      ]
    },
    school: {
      title: "School Management Network",
      tech: "Cisco Packet Tracer",
      points: [
        "Represents a real-world academic campus networking model.",
        "Designed a campus-wide network connecting multiple academic buildings.",
        "Configured VLANs to segment traffic between departments (Admin, Faculty, Students).",
        "Implemented DHCP for dynamic IP allocation and SSH for secure remote access.",
        "Used ICMP protocols to test and validate network connectivity.",
        "Applied packet tracing to ensure efficient, secure, and monitored communication across all blocks."
      ]
    }
  };

  const projectButtons = document.querySelectorAll(".project-item");
  const projectDetails = document.getElementById("projectDetails");

  function renderProject(key) {
    if (!projectDetails || !projectData[key]) return;

    const p = projectData[key];
    projectDetails.innerHTML = `
      <h3>${p.title}</h3>
      <div class="tech">${p.tech}</div>
      <ul>
        ${p.points.map(pt => `<li>${pt}</li>`).join("")}
      </ul>
    `;
  }

  if (projectButtons.length && projectDetails) {
    projectButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        projectButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProject(btn.dataset.project);
      });
    });

    // Render default project
    renderProject("portal");
  }

  /* =========================
     SLIDE 6 – FLAPPY BIRD GAME
  ========================== */

  const bird = document.querySelector(".bird");
  const pipe = document.querySelector(".pipe");
  const scoreEl = document.getElementById("score");
  const gameOverBox = document.querySelector(".game-over");
  const pauseBtn = document.getElementById("pauseBtn");
  const playBtn = document.querySelector(".game-btn:not(.ghost)");
  const restartBtn = document.querySelector(".game-btn.ghost");
  const birdGame = document.querySelector(".bird-game");

  if (bird && pipe && scoreEl && gameOverBox) {
    let birdY = 70;
    let velocity = 0;
    const gravity = 0.6;
    const jumpForce = -8;

    let pipeX = 420;
    const speed = 3;

    let score = 0;
    let gameRunning = false;
    let paused = false;

    function resetGame() {
      birdY = 70;
      velocity = 0;
      pipeX = 420;
      score = 0;
      scoreEl.textContent = score;
      gameRunning = true;
      paused = false;
      if (pauseBtn) pauseBtn.textContent = "⏸";
      gameOverBox.classList.add("hidden");
      bird.style.top = birdY + "px";
      pipe.style.left = pipeX + "px";
    }

    function jump() {
      if (!gameRunning || paused) return;
      velocity = jumpForce;
    }

    document.addEventListener("keydown", e => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!gameRunning) {
          resetGame();
        }
        jump();
      }
    });

    if (birdGame) {
      // Prevent touch events in game from scrolling the page
      birdGame.addEventListener("touchstart", e => {
        e.preventDefault();
        if (!gameRunning) {
          resetGame();
        }
        jump();
      }, { passive: false });

      birdGame.addEventListener("click", () => {
        if (!gameRunning) {
          resetGame();
        }
        jump();
      });
    }

    function endGame() {
      gameRunning = false;
      gameOverBox.classList.remove("hidden");
    }

    // Game loop
    setInterval(() => {
      if (!gameRunning || paused) return;

      velocity += gravity;
      birdY += velocity;
      bird.style.top = birdY + "px";

      pipeX -= speed;
      pipe.style.left = pipeX + "px";

      if (pipeX < -40) {
        pipeX = 420;
        score++;
        scoreEl.textContent = score;
      }

      const birdRect = bird.getBoundingClientRect();
      const pipeRect = pipe.getBoundingClientRect();

      if (
        birdRect.right > pipeRect.left &&
        birdRect.left < pipeRect.right &&
        birdRect.bottom > pipeRect.top
      ) {
        endGame();
      }

      if (birdY > 130 || birdY < 0) {
        endGame();
      }
    }, 20);

    // Bottom play/restart buttons
    if (playBtn) playBtn.addEventListener("click", resetGame);
    if (restartBtn) restartBtn.addEventListener("click", resetGame);

    // Game-over restart button
    const gameOverRestartBtn = document.getElementById("restartGame");
    if (gameOverRestartBtn) {
      gameOverRestartBtn.addEventListener("click", resetGame);
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        if (!gameRunning) return;
        paused = !paused;
        pauseBtn.textContent = paused ? "▶" : "⏸";
      });
    }
  }

  /* =========================
     SLIDE 7 – FLASHCARD (CONTACT)
  ========================== */

  const flashcards = document.querySelectorAll('.flashcard-container .flashcard');
  const nextBtn = document.getElementById('nextCard');
  const byeMsg = document.querySelector('.bye-card');
  const flashcardContainer = document.querySelector('.flashcard-container');
  const flashcardControls = document.querySelector('.flashcard-controls');
  const backBtn = document.getElementById('backBtn');

  if (flashcards.length && nextBtn && byeMsg && flashcardContainer && flashcardControls) {
    let flashIndex = 0;

    function showFlashcard(idx) {
      flashcards.forEach((card, i) => {
        card.classList.toggle('active', i === idx);
      });
    }

    showFlashcard(flashIndex);

    nextBtn.addEventListener('click', () => {
      flashIndex++;

      if (flashIndex < flashcards.length) {
        showFlashcard(flashIndex);
      } else {
        flashcardContainer.style.display = 'none';
        flashcardControls.style.display = 'none';
        byeMsg.classList.remove('hidden');
      }
    });

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        flashIndex = 0;
        byeMsg.classList.add('hidden');
        flashcardContainer.style.display = '';
        flashcardControls.style.display = '';
        showFlashcard(flashIndex);
      });
    }
  }

  /* ==========================================
     INTERACTIVE CYBERPUNK DASHBOARD (SLIDE 2)
     ========================================== */

  const dashTabs = document.querySelectorAll(".dash-tab");
  const dashPanels = document.querySelectorAll(".dash-panel");
  const timelineNodes = document.querySelectorAll(".timeline-node");
  const timelineDetail = document.getElementById("timeline-detail");
  const consoleLogs = document.getElementById("consoleLogs");

  // Tab switching
  dashTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      dashTabs.forEach(t => t.classList.remove("active"));
      dashPanels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      // Initialize logs stream if log tab activated
      if (tab.dataset.tab === "logs") {
        startConsoleLogs();
      } else {
        stopConsoleLogs();
      }
    });
  });

  // Timeline node clicking
  timelineNodes.forEach(node => {
    node.addEventListener("click", () => {
      timelineNodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");

      // Typewriter/Terminal description effect
      const descText = node.dataset.desc;
      if (timelineDetail) {
        timelineDetail.style.opacity = "0";
        setTimeout(() => {
          timelineDetail.textContent = `> ${descText}`;
          timelineDetail.style.opacity = "1";
        }, 150);
      }
    });
  });

  // Simulated Console Logs Stream
  let logInterval = null;
  const mockLogsList = [
    "loading core dev modules...",
    "establishing connection to database: NMIMS_DB... SUCCESS",
    "checking memory levels... OK (98.4%)",
    "checking system variables...",
    "running diagnostic checks: html, css, js... ACTIVE",
    "initializing automation_engine... SUCCESS",
    "warning: coffee levels low (14%). please refill.",
    "diagnosing skills matrix... angularjs, nodejs, tailwind detected",
    "running PHP/XAMPP server diagnostic... local environment ONLINE",
    "compiling fresh project code... SUCCESS",
    "status report: Heer Shah portfolio fully optimized."
  ];

  function startConsoleLogs() {
    if (!consoleLogs) return;
    
    // Clear and add initial logs
    consoleLogs.innerHTML = "";
    addLogLine("system booting...", "info");
    addLogLine("authenticating user: HEER_SHAH... access GRANTED", "success");

    let counter = 0;
    
    // Stop any existing interval
    if (logInterval) clearInterval(logInterval);

    logInterval = setInterval(() => {
      const log = mockLogsList[counter % mockLogsList.length];
      const isWarn = log.includes("warning");
      const isSuccess = log.includes("SUCCESS") || log.includes("ONLINE") || log.includes("GRANTED");
      let type = "info";
      if (isWarn) type = "warn";
      if (isSuccess) type = "success";
      
      addLogLine(log, type);
      counter++;
    }, 1500);
  }

  function stopConsoleLogs() {
    if (logInterval) {
      clearInterval(logInterval);
      logInterval = null;
    }
  }

  function addLogLine(text, type = "info") {
    if (!consoleLogs) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-text">${text}</span>`;
    
    consoleLogs.appendChild(line);
    
    // Auto scroll to bottom
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

}); // END DOMContentLoaded