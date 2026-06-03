const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setupCursorObject() {
  const cursor = document.querySelector(".cursor-object");
  if (!cursor || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let previousX = currentX;
  let previousY = currentY;
  let rotation = -7;
  let visible = false;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!visible) {
      visible = true;
      cursor.style.opacity = "1";
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    visible = false;
    cursor.style.opacity = "0";
  });

  function tick() {
    previousX = currentX;
    previousY = currentY;
    currentX += (mouseX - currentX) * 0.13;
    currentY += (mouseY - currentY) * 0.13;

    const velocityX = currentX - previousX;
    const velocityY = currentY - previousY;
    const targetRotation = Math.max(-22, Math.min(22, velocityX * 0.75 + velocityY * 0.2));
    rotation += (targetRotation - rotation) * 0.1;

    cursor.style.transform = `translate3d(${currentX - 37}px, ${currentY - 37}px, 0) rotate(${rotation}deg)`;
    requestAnimationFrame(tick);
  }

  tick();
}

function activateNavigation() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-38% 0px -52% 0px",
      threshold: [0, 0.2, 0.5, 0.8]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function duplicateMarquees() {
  document.querySelectorAll(".ticker-track, .stack-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

function prepareRevealElements() {
  document
    .querySelectorAll(".hero-copy, .hero-note, .route-stage, .work-row, .proof-grid a, .stack-notes p, .place-section > *, .contact-section > *")
    .forEach((element) => element.classList.add("js-reveal"));
}

function finishIntro() {
  document.body.classList.remove("is-loading");
  document.querySelector(".intro")?.setAttribute("aria-hidden", "true");
}

function setupIntro(gsap) {
  const intro = document.querySelector(".intro");

  if (!intro || prefersReducedMotion) {
    finishIntro();
    return;
  }

  document.body.classList.add("is-loading");

  const introPath = intro.querySelector(".intro-route path");
  const introLetters = gsap.utils.toArray(".intro-name span");
  const pathLength = introPath.getTotalLength();

  gsap.set(introPath, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });

  const closeIntro = () => {
    if (intro.dataset.done === "true") return;
    intro.dataset.done = "true";
    gsap.to(intro, {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut",
      onComplete: () => {
        intro.remove();
        finishIntro();
      }
    });
  };

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".intro-kicker", { y: 18, autoAlpha: 0, duration: 0.5 })
    .from(introLetters, {
      yPercent: 120,
      rotate: () => gsap.utils.random(-10, 10),
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.055
    }, "-=0.1")
    .add(() => intro.classList.add("is-lit"), "-=0.45")
    .from(".intro-route span", {
      y: 14,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.06
    }, "-=0.2")
    .to(introPath, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.45")
    .to({}, { duration: 0.35 })
    .add(closeIntro);
}

function setupGsap() {
  if (!window.gsap || prefersReducedMotion) {
    finishIntro();
    document.querySelectorAll(".js-reveal").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  setupIntro(gsap);

  gsap.from(".site-header", {
    y: -18,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 2.8
  });

  gsap.to(".js-reveal", {
    y: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.08,
    ease: "power3.out",
    delay: 2.9
  });

  if (!ScrollTrigger) return;

  gsap.utils.toArray(".work-row, .proof-grid a, .stack-notes p, .place-section > *, .contact-section > *").forEach((element) => {
    gsap.fromTo(
      element,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%"
        }
      }
    );
  });

  const routePath = document.querySelector(".route-line path");
  if (routePath) {
    const length = routePath.getTotalLength();
    gsap.set(routePath, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(routePath, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".route-stage",
        start: "top 72%",
        end: "bottom 36%",
        scrub: true
      }
    });
  }

  gsap.to(".route-photo", {
    yPercent: -18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".danish-letters span", {
    yPercent: (index) => [-22, 14, -10][index],
    ease: "none",
    scrollTrigger: {
      trigger: ".route-stage",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".ticker-track", {
    xPercent: -50,
    ease: "none",
    duration: 28,
    repeat: -1
  });

  gsap.to(".stack-track", {
    xPercent: -50,
    ease: "none",
    duration: 34,
    repeat: -1
  });
}

function init() {
  duplicateMarquees();
  prepareRevealElements();
  setupCursorObject();
  activateNavigation();
  setupGsap();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
