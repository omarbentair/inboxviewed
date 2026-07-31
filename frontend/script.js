"use strict";

const services = [
  {
    icon: '<path d="M4 20 8.8 18.8 19 8.6a2.1 2.1 0 0 0 0-3L18.4 5a2.1 2.1 0 0 0-3 0L5.2 15.2 4 20Z"></path><path d="m13.8 6.6 3.6 3.6M5.2 15.2l3.6 3.6"></path>',
    title: "Premium Figma Design",
    copy: "Pixel-perfect layouts built around your brand, your offer, and the way real customers read.",
    extra: "Modular systems, desktop and mobile frames, ready for development.",
    points: ["Brand-led layouts", "Desktop + mobile frames", "Development-ready systems"]
  },
  {
    icon: '<path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"></path>',
    title: "Hand-Coded HTML",
    copy: "No templates and no builder limitations. Clean email architecture made to render everywhere.",
    extra: "Dark-mode aware, responsive, tested, and built to survive the inbox.",
    points: ["Responsive email code", "Dark-mode aware", "Inbox-tested delivery"]
  },
  {
    icon: '<path d="M4 19V9m6 10V5m6 14v-7m4 7V3"></path><path d="m3 5 5-3 5 3 7-4"></path>',
    title: "Klaviyo Management",
    copy: "Flows, campaigns, segmentation, QA, and optimization managed as one connected retention system.",
    extra: "Strategy and execution inside your account, measured against real performance.",
    points: ["Campaigns + flows", "Segmentation + QA", "Reporting + optimization"]
  },
  {
    icon: '<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5M7.5 10.5l2 2 4-4"></path>',
    title: "Retention Audits",
    copy: "We find where your emails lose attention, clarity, and revenue, then tell you what to fix first.",
    extra: "Flow-by-flow analysis covering creative, conversion, deliverability, and structure.",
    points: ["Creative + conversion", "Deliverability + structure", "Prioritized action plan"]
  },
  {
    icon: '<path d="M12 2l1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Z"></path><path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Zm14-2 .8 2.2 2.2.8-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"></path>',
    title: "Email AI Flows",
    copy: "Behavior-aware flow logic that helps the right message arrive at the right moment.",
    extra: "Layered onto Klaviyo to support the system, never replace thoughtful strategy.",
    points: ["Behavior-aware logic", "Dynamic messaging", "Human-led strategy"]
  }
];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const occasionalFlickerClasses = [
  "flicker-quarter",
  "flicker-three-quarter",
  "flicker-blackout"
];

const bootIntro = document.querySelector("#bootIntro");
const bootCurtain = document.querySelector("#bootCurtain");
const bootMarkCover = document.querySelector("#bootMarkCover");
const headerLight = document.querySelector(".light");
const menuButton = document.querySelector(".menu");
const navigation = document.querySelector("header nav");
const serviceButtons = [...document.querySelectorAll("[data-service]")];
const servicesSection = document.querySelector(".services-section");
const servicesTypedText = document.querySelector("#servicesTypedText");
const serviceList = document.querySelector(".service-list");
const serviceCubes = serviceButtons.map((button) => button.querySelector(".service-cube"));
const serviceDetail = document.querySelector("#service-detail-panel");
const serviceIcon = document.querySelector("#service-icon");
const servicePoints = document.querySelector("#service-points");
const auditSection = document.querySelector(".audit-section");
const auditScoreValue = document.querySelector("#auditScoreValue");
const auditControls = [...document.querySelectorAll("[data-audit]")];
const heroRevealItems = [...document.querySelectorAll(".hero-reveal")];
const teamSection = document.querySelector(".team-section");
const teamPhotoWrap = document.querySelector("#teamPhotoWrap");
const aboutSection = document.querySelector(".about-section");
const contactSection = document.querySelector(".contact");
const contactForm = document.querySelector(".compose");
const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');
const contactFormStatus = contactForm?.querySelector(".form-status");

let occasionalFlickerTimer = 0;
let heroStartFallbackTimer = 0;
let startupUnlockFallbackTimer = 0;
let servicesTypingStarted = false;
let serviceCubeFrame = 0;
let auditRevealStarted = false;

const setHeaderLightState = (className, enabled = true) => {
  if (!headerLight) return;
  headerLight.classList.toggle(className, enabled);
  document.documentElement.classList.toggle(`light-${className}`, enabled);
};

const typeServicesHeading = () => {
  if (servicesTypingStarted || !servicesTypedText) return;
  servicesTypingStarted = true;

  const text = "One studio.\nThe whole system.";
  const firstLineLength = "One studio.".length;
  let index = 0;
  servicesTypedText.textContent = "";

  const typeNextCharacter = () => {
    if (index >= text.length) {
      servicesSection?.classList.add("typing-complete");
      return;
    }

    servicesTypedText.textContent += text[index];
    index += 1;
    if (index === firstLineLength) {
      servicesSection?.classList.add("first-line-complete");
    }

    const delay = index === firstLineLength ? 780 : text[index - 1] === "\n" ? 180 : 58;
    window.setTimeout(typeNextCharacter, delay);
  };

  typeNextCharacter();
};

if (servicesSection && servicesTypedText) {
  servicesSection.classList.add("services-motion-ready");

  if (reducedMotion.matches) {
    servicesSection.classList.add("in-view", "first-line-complete", "typing-complete");
  } else {
    servicesTypedText.textContent = "";
    const servicesObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      servicesSection.classList.add("in-view");
      typeServicesHeading();
      observer.disconnect();
    }, { threshold: 0.18 });

    servicesObserver.observe(servicesSection);
  }
}

const resetServiceCubes = () => {
  serviceCubes.forEach((cube) => {
    if (!cube) return;
    cube.style.setProperty("--cube-rx", "-7deg");
    cube.style.setProperty("--cube-ry", "8deg");
    cube.style.setProperty("--cube-lift", "0px");
    cube.style.setProperty("--cube-response", "0");
    cube.closest(".service-number-cube")?.classList.remove("cube-reacting");
  });
};

const distanceToRect = (x, y, rect) => {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
};

const updateServiceCubes = (clientX, clientY) => {
  if (!serviceList || serviceButtons.length === 0) return;

  const listRect = serviceList.getBoundingClientRect();
  const outsideRadius = 170;
  const nearList =
    clientX >= listRect.left - outsideRadius &&
    clientX <= listRect.right + outsideRadius &&
    clientY >= listRect.top - outsideRadius &&
    clientY <= listRect.bottom + outsideRadius;

  if (!nearList) {
    resetServiceCubes();
    return;
  }

  const rowRects = serviceButtons.map((button) => button.getBoundingClientRect());
  const insideIndex = rowRects.findIndex(
    (rect) =>
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
  );

  let reactingIndexes = [];

  if (insideIndex >= 0) {
    reactingIndexes = [insideIndex];
  } else {
    const centers = rowRects.map((rect) => rect.top + rect.height / 2);
    const betweenIndex = centers.findIndex(
      (center, index) =>
        index < centers.length - 1 &&
        clientY >= center &&
        clientY <= centers[index + 1]
    );

    reactingIndexes =
      betweenIndex >= 0
        ? [betweenIndex, betweenIndex + 1]
        : [
            centers.reduce(
              (nearest, center, index) =>
                Math.abs(center - clientY) < Math.abs(centers[nearest] - clientY) ? index : nearest,
              0
            )
          ];

    reactingIndexes = reactingIndexes.filter(
      (index) => distanceToRect(clientX, clientY, rowRects[index]) <= outsideRadius
    );
  }

  serviceCubes.forEach((cube, index) => {
    if (!cube) return;
    const wrapper = cube.closest(".service-number-cube");

    if (!reactingIndexes.includes(index)) {
      cube.style.setProperty("--cube-rx", "-7deg");
      cube.style.setProperty("--cube-ry", "8deg");
      cube.style.setProperty("--cube-lift", "0px");
      cube.style.setProperty("--cube-response", "0");
      wrapper?.classList.remove("cube-reacting");
      return;
    }

    const cubeRect = wrapper.getBoundingClientRect();
    const cubeX = cubeRect.left + cubeRect.width / 2;
    const cubeY = cubeRect.top + cubeRect.height / 2;
    const dx = clientX - cubeX;
    const dy = clientY - cubeY;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const influenceRadius =
      insideIndex === index ? Math.hypot(rowRects[index].width, rowRects[index].height) * 0.92 : 280;
    const proximity = Math.max(
      insideIndex === index ? 0.16 : 0,
      Math.min(1, 1 - distance / influenceRadius)
    );

    if (proximity <= 0) {
      cube.style.setProperty("--cube-rx", "-7deg");
      cube.style.setProperty("--cube-ry", "8deg");
      cube.style.setProperty("--cube-lift", "0px");
      cube.style.setProperty("--cube-response", "0");
      wrapper?.classList.remove("cube-reacting");
      return;
    }

    const maxAngle = 32;
    const rotateX = Math.max(-38, Math.min(38, -7 - (dy / distance) * maxAngle * proximity));
    const rotateY = Math.max(-38, Math.min(38, 8 + (dx / distance) * maxAngle * proximity));

    cube.style.setProperty("--cube-rx", `${rotateX.toFixed(2)}deg`);
    cube.style.setProperty("--cube-ry", `${rotateY.toFixed(2)}deg`);
    cube.style.setProperty("--cube-lift", `${(-3.5 * proximity).toFixed(2)}px`);
    cube.style.setProperty("--cube-response", proximity.toFixed(3));
    wrapper?.classList.add("cube-reacting");
  });
};

if (
  serviceList &&
  serviceCubes.some(Boolean) &&
  window.matchMedia("(pointer: fine)").matches &&
  !reducedMotion.matches
) {
  document.addEventListener("pointermove", (event) => {
    window.cancelAnimationFrame(serviceCubeFrame);
    serviceCubeFrame = window.requestAnimationFrame(() => {
      updateServiceCubes(event.clientX, event.clientY);
    });
  });

  document.addEventListener("pointerleave", resetServiceCubes);
  window.addEventListener("blur", resetServiceCubes);
}

const unlockStartup = () => {
  window.clearTimeout(startupUnlockFallbackTimer);
  document.documentElement.classList.remove("boot-locked");
};

const revealHero = () => {
  if (document.documentElement.classList.contains("hero-ready")) return;
  window.clearTimeout(heroStartFallbackTimer);

  if (reducedMotion.matches || heroRevealItems.length === 0) {
    document.documentElement.classList.remove("hero-pending");
    document.documentElement.classList.add("hero-ready");
    unlockStartup();
    return;
  }

  const completedItems = new Set();
  const markItemComplete = (event) => {
    if (event.target !== event.currentTarget) return;
    completedItems.add(event.currentTarget);
    if (completedItems.size === heroRevealItems.length) unlockStartup();
  };

  heroRevealItems.forEach((item) => {
    item.addEventListener("animationend", markItemComplete, { once: true });
  });

  document.documentElement.classList.remove("hero-pending");
  document.documentElement.classList.add("hero-ready");
  startupUnlockFallbackTimer = window.setTimeout(unlockStartup, 2500);
};

const scheduleOccasionalFlicker = (delay = 5000 + Math.random() * 6000) => {
  if (!headerLight || reducedMotion.matches) return;

  window.clearTimeout(occasionalFlickerTimer);
  occasionalFlickerTimer = window.setTimeout(() => {
    const flickerClass = occasionalFlickerClasses[
      Math.floor(Math.random() * occasionalFlickerClasses.length)
    ];
    setHeaderLightState(flickerClass);
  }, delay);
};

if (headerLight) {
  document.documentElement.addEventListener("animationend", (event) => {
    if (event.target !== document.documentElement) return;

    if (event.animationName === "warehouse-light-boot") {
      setHeaderLightState("booting", false);
      setHeaderLightState("is-lit");
      scheduleOccasionalFlicker(3500);
      return;
    }

    const completedFlicker = occasionalFlickerClasses.find((className) =>
      headerLight.classList.contains(className)
    );

    if (completedFlicker) {
      setHeaderLightState(completedFlicker, false);
      scheduleOccasionalFlicker();
    }
  });
}

if (bootIntro) {
  let introComplete = false;

  const readCssTime = (name, fallback) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallback;
    if (raw.endsWith("ms")) return Number.parseFloat(raw);
    if (raw.endsWith("s")) return Number.parseFloat(raw) * 1000;
    return fallback;
  };

  const preloadImage = (url) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = async () => {
      try {
        if (image.decode) await image.decode();
      } catch {
        // A completed load is enough when decode() is unavailable or rejected.
      }
      resolve();
    };
    image.onerror = reject;
    image.src = url;
  });

  const finishIntro = () => {
    if (introComplete) return;
    introComplete = true;
    bootIntro.remove();
    if (reducedMotion.matches) {
      setHeaderLightState("is-lit");
      revealHero();
    } else {
      setHeaderLightState("booting");
      revealHero();
      heroStartFallbackTimer = window.setTimeout(revealHero, 3100);
    }
  };

  const expandCutout = () => {
    if (introComplete) return;
    bootIntro.classList.add("intro-cutout-expanding");

    const finishOnAnimation = (event) => {
      if (event.target === bootCurtain && event.animationName === "boot-curtain-zoom") {
        finishIntro();
      }
    };

    bootCurtain?.addEventListener("animationend", finishOnAnimation, { once: true });
    window.setTimeout(finishIntro, readCssTime("--intro-cutout-zoom-duration", 1500) + 350);
  };

  const fadeLogo = () => {
    if (introComplete) return;
    bootIntro.classList.add("intro-logo-fading");

    const expandOnFade = (event) => {
      if (event.target === bootMarkCover && event.propertyName === "opacity") {
        expandCutout();
      }
    };

    bootMarkCover?.addEventListener("transitionend", expandOnFade, { once: true });
    window.setTimeout(expandCutout, readCssTime("--intro-logo-fade-duration", 800) + 180);
  };

  window.addEventListener("load", async () => {
    window.setTimeout(finishIntro, 6200);

    try {
      await Promise.all([
        preloadImage("assets/brand/boot-symbol-hole.png"),
        preloadImage("assets/brand/boot-symbol-mask.png")
      ]);

      if (introComplete) return;
      bootIntro.classList.remove("intro-loading");
      bootIntro.classList.add("intro-assets-ready");

      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });

      if (reducedMotion.matches) {
        bootIntro.classList.add("intro-reduced-reveal");
        window.setTimeout(finishIntro, 240);
        return;
      }

      window.setTimeout(fadeLogo, readCssTime("--intro-logo-hold-duration", 320));
    } catch {
      bootIntro.classList.add("intro-fallback-reveal");
      window.setTimeout(finishIntro, 240);
    }
  });
} else if (headerLight) {
  setHeaderLightState("is-lit");
  revealHero();
  scheduleOccasionalFlicker();
} else {
  revealHero();
}

window.addEventListener("pageshow", () => {
  window.scrollTo(0, 0);
}, { once: true });

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("nav-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const selectService = (button) => {
  const index = Number(button.dataset.service);
  const selected = services[index];
  const serviceNumber = String(index + 1).padStart(2, "0");

  serviceButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
    item.setAttribute("tabindex", active ? "0" : "-1");
  });

  serviceDetail?.setAttribute("aria-labelledby", button.id);
  serviceIcon.innerHTML = selected.icon;
  document.querySelector("#service-meta").textContent = `Service ${serviceNumber} · Opened`;
  document.querySelector("#service-title").textContent = selected.title;
  document.querySelector("#service-copy").textContent = selected.copy;
  document.querySelector("#service-extra").textContent = selected.extra;
  document.querySelector("#service-count").textContent = `${serviceNumber} / 05`;
  servicePoints.innerHTML = selected.points.map((point) => `<li>${point}</li>`).join("");

  if (!reducedMotion.matches && serviceDetail) {
    serviceDetail.classList.remove("service-detail-refresh");
    void serviceDetail.offsetWidth;
    serviceDetail.classList.add("service-detail-refresh");
  }
};

serviceButtons.forEach((button, buttonIndex) => {
  button.addEventListener("click", () => selectService(button));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = buttonIndex;
    if (event.key === "ArrowDown") nextIndex = (buttonIndex + 1) % serviceButtons.length;
    if (event.key === "ArrowUp") nextIndex = (buttonIndex - 1 + serviceButtons.length) % serviceButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = serviceButtons.length - 1;

    serviceButtons[nextIndex].focus();
    selectService(serviceButtons[nextIndex]);
  });
});

auditControls.forEach((control) => {
  control.addEventListener("click", () => {
    const index = control.dataset.audit;
    auditControls.forEach((item) => item.classList.toggle("active", item.dataset.audit === index));
  });
});

const countAuditScore = () => {
  if (!auditScoreValue || auditRevealStarted) return;
  auditRevealStarted = true;

  if (reducedMotion.matches) {
    auditScoreValue.textContent = "42";
    return;
  }

  const finalScore = 42;
  const duration = 1050;
  const startTime = performance.now();

  const updateScore = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    auditScoreValue.textContent = String(Math.round(finalScore * easedProgress));

    if (progress < 1) {
      window.requestAnimationFrame(updateScore);
    }
  };

  window.requestAnimationFrame(updateScore);
};

if (auditSection && auditScoreValue) {
  auditSection.classList.add("audit-motion-ready");

  if (reducedMotion.matches) {
    auditSection.classList.add("in-view");
    countAuditScore();
  } else {
    auditScoreValue.textContent = "0";
    const auditObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      auditSection.classList.add("in-view");
      window.setTimeout(countAuditScore, 1180);
      observer.disconnect();
    }, { threshold: 0.16 });

    auditObserver.observe(auditSection);
  }
}

if (teamSection) {
  teamSection.classList.add("team-motion-ready");

  if (reducedMotion.matches) {
    teamSection.classList.add("in-view");
  } else {
    const teamObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      teamSection.classList.add("in-view");
      observer.disconnect();
    }, { threshold: 0.14 });

    teamObserver.observe(teamSection);
  }
}

[aboutSection, contactSection].forEach((section) => {
  if (!section) return;

  section.classList.add(section === aboutSection ? "about-motion-ready" : "contact-motion-ready");

  if (reducedMotion.matches) {
    section.classList.add("in-view");
    return;
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    section.classList.add("in-view");
    observer.disconnect();
  }, { threshold: 0.14 });

  sectionObserver.observe(section);
});

if (teamPhotoWrap) {
  const hotspots = [...teamPhotoWrap.querySelectorAll(".photo-hotspot")];
  const photoCards = [...teamPhotoWrap.querySelectorAll(".photo-card")];
  let activePerson = null;
  let activeHotspot = null;
  let activeCard = null;
  let hideTimer = null;

  const clearHideTimer = () => {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  };

  const getInteractionPerson = (element) => {
    if (!(element instanceof Element)) return null;
    const hotspot = element.closest(".photo-hotspot");
    if (hotspot && teamPhotoWrap.contains(hotspot)) return hotspot.dataset.person;
    const card = element.closest(".photo-card");
    if (card && teamPhotoWrap.contains(card)) return card.dataset.card;
    return null;
  };

  const setPhotoState = (person = null) => {
    hotspots.forEach((hotspot) => {
      const active = hotspot.dataset.person === person;
      hotspot.classList.toggle("active", active);
      hotspot.setAttribute("aria-expanded", String(active));
    });

    photoCards.forEach((card) => {
      const active = card.dataset.card === person;
      card.classList.toggle("visible", active);
      card.setAttribute("aria-hidden", String(!active));
    });
  };

  const showPhotoCard = (hotspot) => {
    const person = hotspot.dataset.person;
    const card = teamPhotoWrap.querySelector(`.photo-card[data-card="${person}"]`);
    if (!card) return;

    clearHideTimer();
    setPhotoState(person);
    activePerson = person;
    activeHotspot = hotspot;
    activeCard = card;
    teamPhotoWrap.style.setProperty("--hx", hotspot.dataset.x);
    teamPhotoWrap.style.setProperty("--hy", hotspot.dataset.y);
    teamPhotoWrap.classList.add("revealing");
  };

  const closePhotoCard = () => {
    clearHideTimer();
    setPhotoState();
    teamPhotoWrap.classList.remove("revealing");
    activePerson = null;
    activeHotspot = null;
    activeCard = null;
  };

  const schedulePhotoCardClose = (event) => {
    if (!activePerson || getInteractionPerson(event?.relatedTarget) === activePerson) return;
    clearHideTimer();
    const personAtSchedule = activePerson;

    hideTimer = window.setTimeout(() => {
      if (activePerson !== personAtSchedule) return;
      const focusedElement = document.activeElement;
      const pointerStillInside =
        (activeHotspot && activeHotspot.matches(":hover")) ||
        (activeCard && activeCard.matches(":hover"));
      const focusStillInside =
        activeHotspot === focusedElement ||
        (activeCard && activeCard.contains(focusedElement));

      if (!pointerStillInside && !focusStillInside) closePhotoCard();
    }, 90);
  };

  hotspots.forEach((hotspot) => {
    hotspot.setAttribute("aria-expanded", "false");
    hotspot.addEventListener("pointerenter", () => showPhotoCard(hotspot));
    hotspot.addEventListener("focus", () => showPhotoCard(hotspot));
    hotspot.addEventListener("pointerleave", schedulePhotoCardClose);
    hotspot.addEventListener("blur", schedulePhotoCardClose);
    hotspot.addEventListener("click", (event) => {
      event.preventDefault();
      if (activePerson === hotspot.dataset.person) closePhotoCard();
      else showPhotoCard(hotspot);
    });
  });

  photoCards.forEach((card) => {
    card.setAttribute("aria-hidden", "true");
    card.addEventListener("pointerenter", () => {
      clearHideTimer();
      if (activePerson !== card.dataset.card) {
        const hotspot = hotspots.find((item) => item.dataset.person === card.dataset.card);
        if (hotspot) showPhotoCard(hotspot);
      }
    });
    card.addEventListener("pointerleave", schedulePhotoCardClose);
    card.addEventListener("focusin", clearHideTimer);
    card.addEventListener("focusout", schedulePhotoCardClose);
  });

  teamPhotoWrap.addEventListener("pointerleave", schedulePhotoCardClose);
  teamPhotoWrap.addEventListener("pointercancel", closePhotoCard);
}

const customCursor = document.querySelector(".custom-cursor");
const cursorGlow = document.querySelector(".cursor-glow");

if (customCursor && cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  document.documentElement.classList.add("custom-cursor-enabled");

  document.addEventListener("pointermove", (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    customCursor.classList.add("visible");
    cursorGlow.classList.add("visible");
  });

  document.addEventListener("pointerover", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    customCursor.classList.toggle(
      "hover",
      Boolean(target?.closest(
        "a, button, input, textarea, select, label, [role='button'], [tabindex]:not([tabindex='-1']), .social-card"
      ))
    );
  });

  document.addEventListener("pointerleave", () => {
    customCursor.classList.remove("visible", "hover");
    cursorGlow.classList.remove("visible");
  });
}

if (contactForm && contactSubmitButton && contactFormStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonText = contactSubmitButton.textContent;
    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = "Sending...";
    contactFormStatus.textContent = "Sending securely";
    contactFormStatus.classList.remove("success", "error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });
      const result = await response.json();
      const sent = response.ok && (result.success === true || result.success === "true");

      if (!sent) throw new Error("The inquiry could not be delivered.");

      contactForm.reset();
      contactFormStatus.textContent = "Inquiry sent - we'll reply by email";
      contactFormStatus.classList.add("success");
    } catch (error) {
      contactFormStatus.textContent = "Could not send - please try again";
      contactFormStatus.classList.add("error");
    } finally {
      contactSubmitButton.disabled = false;
      contactSubmitButton.textContent = originalButtonText;
    }
  });
}
