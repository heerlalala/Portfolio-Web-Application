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
    occasio: {
      title: "Ocassio",
      tech: "Node.js • AngularJS • HTML • CSS",
      url: "https://heerlalala.github.io/ocassio-frontend/",
      points: [
        "A full-stack role-based event booking and ticket management system.",
        "Built separate dashboards for guests and organizers to manage events and check-ins.",
        "Implemented real-time ticket checkout with automated ticketing workflow.",
        "Integrated secure backend route (/sendTicketEmail) for automated HTML mail distribution of tickets."
      ]
    },
    voyage: {
      title: "Voyage - Smart Trip Planner",
      tech: "HTML • CSS • JavaScript",
      url: "https://heerlalala.github.io/trip-planner/",
      points: [
        "Designed an interactive smart trip planning dashboard helping users draft and organize itineraries.",
        "Supports dynamic day-by-day task lists, activity groupings, and destination status tags.",
        "Engineered using fluid CSS grid structures with clean glassmorphic design elements.",
        "Optimized for legibility and cross-device responsive layout rendering."
      ]
    },
    portfolio: {
      title: "Portfolio Web Application",
      tech: "HTML • CSS • JS • GSAP Animation",
      url: "https://heerlalala.github.io/Portfolio-Web-Application/",
      points: [
        "Created a highly interactive custom horizontal slider showcasing developer records and skills.",
        "Implements GSAP slide movement, transition lock screens, and tabbed terminal dashboard widgets.",
        "Includes a custom HTML5 canvas Flappy Bird game and responsive touch gestures for mobile screens.",
        "Designed with CSS HSL variables, cyberpunk animations, and clean responsive stacking."
      ]
    },
    campusNetwork: {
      title: "Campus Network Design",
      tech: "Cisco Packet Tracer • Routing & Switching • VLANs • Subnetting",
      url: "https://github.com/heerlalala/campus-network",
      points: [
        "Designed and simulated a comprehensive enterprise-grade network topology for a campus environment.",
        "Configured Inter-VLAN routing, VLAN assignments, and dynamic routing protocols (OSPF/RIP) for subnets.",
        "Integrated essential infrastructure services including DHCP, DNS, and HTTP servers inside the topology.",
        "Secured departmental boundaries using access control lists (ACLs) to manage traffic flows."
      ],
      diagramSvg: `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <line x1="200" y1="40" x2="100" y2="120" stroke="#63b3ed" stroke-width="2" filter="url(#glow)"/>
  <line x1="200" y1="40" x2="300" y2="120" stroke="#63b3ed" stroke-width="2" filter="url(#glow)"/>
  <line x1="100" y1="120" x2="50" y2="200" stroke="#63b3ed" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="100" y1="120" x2="120" y2="200" stroke="#63b3ed" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="300" y1="120" x2="220" y2="200" stroke="#63b3ed" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="300" y1="120" x2="350" y2="200" stroke="#63b3ed" stroke-width="1.5" stroke-dasharray="4"/>
  <circle cx="200" cy="40" r="22" fill="#1a202c" stroke="#63b3ed" stroke-width="2" filter="url(#glow)"/>
  <text x="200" y="45" font-size="16" text-anchor="middle">🌐</text>
  <text x="200" y="15" font-size="10" fill="#a0aec0" text-anchor="middle" font-weight="bold">Core Router</text>
  <text x="200" y="74" font-size="9" fill="#a0aec0" text-anchor="middle">192.168.1.1</text>
  <circle cx="100" cy="120" r="18" fill="#1a202c" stroke="#319795" stroke-width="2"/>
  <text x="100" y="125" font-size="14" text-anchor="middle">🖧</text>
  <text x="100" y="95" font-size="10" fill="#81e6d9" text-anchor="middle" font-weight="bold">Academics SW</text>
  <text x="100" y="148" font-size="8" fill="#81e6d9" text-anchor="middle">VLAN 10</text>
  <circle cx="300" cy="120" r="18" fill="#1a202c" stroke="#9f7aea" stroke-width="2"/>
  <text x="300" y="125" font-size="14" text-anchor="middle">🖧</text>
  <text x="300" y="95" font-size="10" fill="#d6bcfa" text-anchor="middle" font-weight="bold">Admin SW</text>
  <text x="300" y="148" font-size="8" fill="#d6bcfa" text-anchor="middle">VLAN 20</text>
  <circle cx="50" cy="200" r="14" fill="#2d3748" stroke="#319795" stroke-width="1.5"/>
  <text x="50" y="204" font-size="12" text-anchor="middle">🖥️</text>
  <text x="50" y="224" font-size="8" fill="#a0aec0" text-anchor="middle">Lab PC</text>
  <circle cx="120" cy="200" r="14" fill="#2d3748" stroke="#319795" stroke-width="1.5"/>
  <text x="120" y="204" font-size="12" text-anchor="middle">🖥️</text>
  <text x="120" y="224" font-size="8" fill="#a0aec0" text-anchor="middle">Local Server</text>
  <circle cx="220" cy="200" r="14" fill="#2d3748" stroke="#9f7aea" stroke-width="1.5"/>
  <text x="220" y="204" font-size="12" text-anchor="middle">🖥️</text>
  <text x="220" y="224" font-size="8" fill="#a0aec0" text-anchor="middle">Staff PC</text>
  <circle cx="350" cy="200" r="14" fill="#2d3748" stroke="#9f7aea" stroke-width="1.5"/>
  <text x="350" y="204" font-size="12" text-anchor="middle">🖥️</text>
  <text x="350" y="224" font-size="8" fill="#a0aec0" text-anchor="middle">Billing PC</text>
</svg>`,
      cliCommands: `! --- CAMPUS NETWORK ROUTER CONFIG ---
Router> enable
Router# configure terminal

! 1. Configure Subnets & VLAN encapsulation
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit

Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit

! 2. Configure dynamic OSPF Routing
Router(config)# router ospf 1
Router(config-router)# network 192.168.10.0 0.0.0.255 area 0
Router(config-router)# network 192.168.20.0 0.0.0.255 area 0
Router(config-router)# exit

! 3. Configure Security Access Control List (ACL)
Router(config)# access-list 101 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
Router(config)# access-list 101 permit ip any any
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# ip access-group 101 out
Router(config-subif)# end
Router# write memory`
    },
    hotelNetwork: {
      title: "Hotel Management Network",
      tech: "Cisco Packet Tracer • Network Security • Wireless LAN • DHCP",
      url: "https://github.com/heerlalala/hotel-management-network",
      points: [
        "Architected a scalable enterprise network model for a multi-floor hospitality establishment.",
        "Implemented secure guest Wi-Fi access points isolated from the core administration networks using VLANs.",
        "Configured network address translation (NAT/PAT) and dynamic IP allocation workflows (DHCP server).",
        "Simulated end-to-end connectivity, local routing tables, and switchport security configurations."
      ],
      diagramSvg: `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <line x1="200" y1="40" x2="200" y2="105" stroke="#a3bffa" stroke-width="2" filter="url(#glow2)"/>
  <line x1="200" y1="105" x2="80" y2="160" stroke="#f687b3" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="200" y1="105" x2="200" y2="180" stroke="#4fd1c5" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="200" y1="105" x2="320" y2="160" stroke="#f6ad55" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="80" y1="160" x2="80" y2="215" stroke="#f687b3" stroke-width="1"/>
  <circle cx="200" cy="40" r="22" fill="#1a202c" stroke="#a3bffa" stroke-width="2" filter="url(#glow2)"/>
  <text x="200" y="45" font-size="16" text-anchor="middle">🌐</text>
  <text x="200" y="15" font-size="10" fill="#a0aec0" text-anchor="middle" font-weight="bold">Gateway Router</text>
  <text x="200" y="74" font-size="9" fill="#a0aec0" text-anchor="middle">NAT/PAT Active</text>
  <circle cx="200" cy="105" r="18" fill="#1a202c" stroke="#4cbd97" stroke-width="2"/>
  <text x="200" y="110" font-size="14" text-anchor="middle">🖧</text>
  <text x="242" y="110" font-size="10" fill="#81e6d9" font-weight="bold">Core SW</text>
  <circle cx="80" cy="160" r="16" fill="#1a202c" stroke="#f687b3" stroke-width="2"/>
  <text x="80" y="165" font-size="13" text-anchor="middle">📡</text>
  <text x="80" y="138" font-size="10" fill="#f687b3" text-anchor="middle" font-weight="bold">Guest AP</text>
  <text x="80" y="186" font-size="8" fill="#f687b3" text-anchor="middle">VLAN 30 (Guest)</text>
  <circle cx="320" cy="160" r="16" fill="#1a202c" stroke="#f6ad55" stroke-width="2"/>
  <text x="320" y="165" font-size="13" text-anchor="middle">🖧</text>
  <text x="320" y="138" font-size="10" fill="#f6ad55" text-anchor="middle" font-weight="bold">Lobby SW</text>
  <text x="320" y="186" font-size="8" fill="#f6ad55" text-anchor="middle">VLAN 40 (Admin)</text>
  <circle cx="200" cy="205" r="16" fill="#1a202c" stroke="#4fd1c5" stroke-width="2"/>
  <text x="200" y="210" font-size="13" text-anchor="middle">💾</text>
  <text x="200" y="233" font-size="8" fill="#4fd1c5" text-anchor="middle">Admin Server</text>
  <circle cx="80" cy="225" r="10" fill="#2d3748" stroke="#f687b3" stroke-width="1.5"/>
  <text x="80" y="228" font-size="9" text-anchor="middle">📱</text>
</svg>`,
      cliCommands: `! --- HOTEL NETWORK CONFIGURATION ---
Switch> enable
Switch# configure terminal

! 1. Configure Port Security on Switch FastEthernet ports
Switch(config)# interface range fastEthernet 0/1 - 12
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 30
Switch(config-if-range)# switchport port-security
Switch(config-if-range)# switchport port-security maximum 2
Switch(config-if-range)# switchport port-security violation shutdown
Switch(config-if-range)# exit

! 2. Configure DHCP IP Pool for guest Wireless clients
Router(config)# ip dhcp pool GuestPool
Router(config-dhcp)# network 172.16.30.0 255.255.255.0
Router(config-dhcp)# default-router 172.16.30.1
Router(config-dhcp)# dns-server 8.8.8.8
Router(config-dhcp)# exit

! 3. Configure Dynamic NAT Overload (PAT)
Router(config)# access-list 1 permit 172.16.30.0 0.0.0.255
Router(config)# ip nat inside source list 1 interface gigabitEthernet 0/1 overload
Router(config)# end
Router# write memory`
    }
  };

  const projectButtons = document.querySelectorAll(".project-item");
  const projectDetails = document.getElementById("projectDetails");

  function renderProject(key) {
    if (!projectDetails || !projectData[key]) return;

    const p = projectData[key];
    const isNetworking = key.includes("Network");
    const buttonText = isNetworking ? "📂 View Repository" : "🖥️ Live Preview";

    let showcaseHtml = "";
    if (isNetworking) {
      showcaseHtml = `
        <div class="project-showcase-tabs">
          <button class="showcase-tab active" data-showcase="diagram">Topology Diagram</button>
          <button class="showcase-tab" data-showcase="commands">Cisco IOS CLI</button>
        </div>
        <div class="showcase-content active" id="showcase-diagram">
          <div class="network-diagram-container">
            ${p.diagramSvg}
          </div>
        </div>
        <div class="showcase-content" id="showcase-commands">
          <div class="cisco-terminal">
            <div class="terminal-bar">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">Cisco IOS Switch/Router Console</span>
            </div>
            <pre class="terminal-body"><code>${p.cliCommands}</code></pre>
          </div>
        </div>
      `;
    }

    projectDetails.innerHTML = `
      <div class="project-details-split">
        <div class="project-info-side">
          <div class="project-details-header">
            <h3>${p.title}</h3>
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="preview-btn">${buttonText}</a>
          </div>
          <div class="tech">${p.tech}</div>
          <ul class="project-points">
            ${p.points.map(pt => `<li>${pt}</li>`).join("")}
          </ul>
        </div>
        ${isNetworking ? `
        <div class="project-showcase-side">
          ${showcaseHtml}
        </div>
        ` : ""}
      </div>
    `;

    // Wire up showcase tab clicking
    if (isNetworking) {
      const tabs = projectDetails.querySelectorAll(".showcase-tab");
      const contents = projectDetails.querySelectorAll(".showcase-content");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          contents.forEach(c => c.classList.remove("active"));
          tab.classList.add("active");
          const target = projectDetails.querySelector(`#showcase-${tab.dataset.showcase}`);
          if (target) target.classList.add("active");
        });
      });
    }
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
    renderProject("occasio");
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

  if (bird && pipe && scoreEl && gameOverBox && birdGame) {
    let birdY = 200;
    let velocity = 0;
    const gravity = 0.5;
    const jumpForce = -7.5;

    let pipeX = 640;
    const speed = 3.5;

    let score = 0;
    let gameRunning = false;
    let paused = false;

    // Helper to get game bounds dynamically
    function getGameHeight() {
      return birdGame.clientHeight || 260;
    }

    function getGameWidth() {
      return birdGame.clientWidth || 840;
    }

    function randomizePipeHeight() {
      const gameH = getGameHeight();
      // Leave at least 115px gap for the bird to fly through (bird is ~36px)
      const minHeight = 50;
      const maxHeight = gameH - 115;
      const randomH = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipe.style.height = randomH + "px";
    }

    function resetGame() {
      const gameH = getGameHeight();
      const gameW = getGameWidth();
      birdY = Math.floor(gameH / 2) - 15;
      velocity = 0;
      pipeX = gameW;
      score = 0;
      scoreEl.textContent = score;
      gameRunning = true;
      paused = false;
      if (pauseBtn) pauseBtn.textContent = "⏸";
      gameOverBox.classList.add("hidden");
      bird.style.top = birdY + "px";
      bird.style.transform = "rotate(0deg)";
      pipe.style.left = pipeX + "px";
      randomizePipeHeight();
    }

    function jump() {
      if (!gameRunning || paused) return;
      velocity = jumpForce;
      bird.style.transform = "rotate(-20deg)";
    }

    document.addEventListener("keydown", e => {
      if (e.code === "Space") {
        const contactSlideIndex = Array.from(slides).indexOf(document.querySelector(".slide.contact"));
        if (currentSlide !== contactSlideIndex) return;

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

      birdGame.addEventListener("click", (e) => {
        if (!gameRunning) {
          resetGame();
        }
        jump();
      });
    }

    function endGame() {
      gameRunning = false;
      gameOverBox.classList.remove("hidden");
      bird.style.transform = "rotate(70deg)";
    }

    // Game loop
    setInterval(() => {
      if (!gameRunning || paused) return;

      const gameH = getGameHeight();
      const gameW = getGameWidth();

      velocity += gravity;
      birdY += velocity;
      bird.style.top = birdY + "px";

      // Rotate bird based on velocity
      if (velocity > 0) {
        // Falling
        const degree = Math.min(70, velocity * 7);
        bird.style.transform = `rotate(${degree}deg)`;
      } else {
        // Jumping
        bird.style.transform = "rotate(-20deg)";
      }

      pipeX -= speed;
      pipe.style.left = pipeX + "px";

      if (pipeX < -50) {
        pipeX = gameW;
        score++;
        scoreEl.textContent = score;
        randomizePipeHeight();
      }

      const birdRect = bird.getBoundingClientRect();
      const pipeRect = pipe.getBoundingClientRect();

      // Check collision with the pipe
      if (
        birdRect.right > pipeRect.left &&
        birdRect.left < pipeRect.right &&
        birdRect.bottom > pipeRect.top
      ) {
        endGame();
      }

      // Check boundary collision: floor or ceiling
      // Bird size is roughly 36px. Ground height is 6px.
      if (birdY > (gameH - 42) || birdY < 0) {
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
      pauseBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent trigger jump/restart on birdGame click
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