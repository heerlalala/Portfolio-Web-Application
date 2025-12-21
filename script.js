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
      if (currentSlide !== 0) return; // pause when not on slide 1

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
  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent =
      document.body.classList.contains("light") ? "☀️" : "🌙";
  });

  const keyIcon = document.getElementById("keyIcon");
const lockIcon = document.getElementById("lockIcon");
const unlockArea = document.getElementById("unlockArea");

if (keyIcon && lockIcon) {
  keyIcon.addEventListener("click", () => {
    if (isUnlocked) return;

    isUnlocked = true;

    // Animate key into lock
    gsap.to(keyIcon, {
      x: -40,
      y: -20,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.out"
    });

    // Unlock effect
    setTimeout(() => {
      lockIcon.textContent = "🔓";
      unlockArea.classList.add("unlocked");

      // Auto move to slide 2
      goToSlide(1);
    }, 450);
  });
}

//slide 3 

gsap.from(".layer", {
  y: 40,
  opacity: 0,
  stagger: 0.25,
  duration: 0.8,
  ease: "power3.out"
});

gsap.to(".orbit-ui", {
  rotation: 360,
  duration: 42,
  repeat: -1,
  ease: "none"
});

gsap.to(".orbit-backend", {
  rotation: -360,
  duration: 58,
  repeat: -1,
  ease: "none"
});

gsap.to(".orbit-infra", {
  rotation: 360,
  duration: 75,
  repeat: -1,
  ease: "none"
});

gsap.to(".orbit-ambient", {
  rotation: -360,
  duration: 90,
  repeat: -1,
  ease: "none"
});

});

// Slide 4 – Skills Jar
const jar = document.getElementById("jarTrigger");
const skillsContainer = document.getElementById("skillsGroups");

let opened = false;

jar.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  // Open jar visually (lid animation)
  jar.classList.add("open");

  // Trigger CSS pour-out animation
  skillsContainer.classList.add("show");
});

//slide 5 

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
  },

};

const buttons = document.querySelectorAll(".project-item");
const details = document.getElementById("projectDetails");

function renderProject(key) {
  const p = projectData[key];
  details.innerHTML = `
    <h3>${p.title}</h3>
    <div class="tech">${p.tech}</div>
    <ul>
      ${p.points.map(pt => `<li>${pt}</li>`).join("")}
    </ul>
  `;
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProject(btn.dataset.project);
  });
});

// =========================
// PROJECTS (already working)
renderProject("portal");

//slide 6 
// =========================
// CHROME DINO STYLE GAME
// =========================
const bird = document.querySelector(".bird");
const pipe = document.querySelector(".pipe");
const scoreEl = document.getElementById("score");
const gameOverBox = document.querySelector(".game-over");
const pauseBtn = document.getElementById("pauseBtn");

const playBtn = document.querySelector(".game-btn:not(.ghost)");
const restartBtn = document.querySelector(".game-btn.ghost");

let birdY = 70;
let velocity = 0;
let gravity = 0.6;
let jumpForce = -8;

let pipeX = 420;
let speed = 3;

let score = 0;
let gameRunning = false;
let paused = false;

// RESET GAME
function resetGame() {
  birdY = 70;
  velocity = 0;
  pipeX = 420;
  score = 0;
  scoreEl.textContent = score;
  gameRunning = true;
  paused = false;
  pauseBtn.textContent = "⏸";
  gameOverBox.classList.add("hidden");
}

// JUMP
function jump() {
  if (!gameRunning || paused) return;
  velocity = jumpForce;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.querySelector(".bird-game").addEventListener("click", jump);

// GAME LOOP
setInterval(() => {
  if (!gameRunning || paused) return;

  // GRAVITY
  velocity += gravity;
  birdY += velocity;
  bird.style.top = birdY + "px";

  // PIPE MOVE
  pipeX -= speed;
  pipe.style.left = pipeX + "px";

  // RESET PIPE
  if (pipeX < -40) {
    pipeX = 420;
    score++;
    scoreEl.textContent = score;
  }

  // COLLISION
  const birdRect = bird.getBoundingClientRect();
  const pipeRect = pipe.getBoundingClientRect();

  if (
    birdRect.right > pipeRect.left &&
    birdRect.left < pipeRect.right &&
    birdRect.bottom > pipeRect.top
  ) {
    endGame();
  }

  // HIT GROUND / CEILING
  if (birdY > 130 || birdY < 0) {
    endGame();
  }
}, 20);

// GAME OVER
function endGame() {
  gameRunning = false;
  gameOverBox.classList.remove("hidden");
}

// BUTTONS
playBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", resetGame);

// PAUSE
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶" : "⏸";
});

// FLASHCARD LOGIC (Contact Slide)
const flashcards = document.querySelectorAll('.flashcard-container .flashcard');
const nextBtn = document.getElementById('nextCard');
const byeMsg = document.querySelector('.bye-card');
const flashcardContainer = document.querySelector('.flashcard-container');
const flashcardControls = document.querySelector('.flashcard-controls');
const backBtn = document.getElementById('backBtn');

let flashIndex = 0;

function showFlashcard(idx) {
  flashcards.forEach((card, i) => {
    card.classList.toggle('active', i === idx);
  });
}

if (nextBtn && flashcards.length) {
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
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    flashIndex = 0;
    byeMsg.classList.add('hidden');
    flashcardContainer.style.display = '';
    flashcardControls.style.display = '';
    showFlashcard(flashIndex);
  });
}
