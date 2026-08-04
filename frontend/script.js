"use strict";

const GA_MEASUREMENT_ID = "G-D8FFDHV665";
const ANALYTICS_CONSENT_KEY = "inboxviewed.analytics-consent.v1";

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() {
  window.dataLayer.push(arguments);
};

window.gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
window.gtag("set", "ads_data_redaction", true);

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
const bootIntro = document.querySelector("#bootIntro");
const bootCurtain = document.querySelector("#bootCurtain");
const bootMarkCover = document.querySelector("#bootMarkCover");
const menuButton = document.querySelector(".menu");
const navigation = document.querySelector("header nav");
const serviceButtons = [...document.querySelectorAll("[data-service]")];
const servicesSection = document.querySelector(".services-section");
const servicesTypedText = document.querySelector("#servicesTypedText");
const serviceList = document.querySelector(".service-list");
const serviceCubes = serviceButtons.map((button) => button.querySelector(".service-cube"));
const heroCapabilityCards = [...document.querySelectorAll(".cap-card")];
const heroCubes = heroCapabilityCards.map((card) => card.querySelector(".hero-cube"));
const heroSection = document.querySelector(".hero");
const heroVideo = document.querySelector("[data-desktop-video]");
const desktopHeroVideo = window.matchMedia("(min-width: 1101px)");
const serviceDetail = document.querySelector("#service-detail-panel");
const serviceIcon = document.querySelector("#service-icon");
const servicePoints = document.querySelector("#service-points");
const auditSection = document.querySelector(".audit-section");
const auditModule = document.querySelector(".audit");
const auditNotes = auditModule?.querySelector(".notes");
const auditScoreValue = document.querySelector("#auditScoreValue");
const auditControls = [...document.querySelectorAll("[data-audit]")];
const auditEmailViewport = document.querySelector("#auditEmailViewport");
const auditEmailStage = document.querySelector("#auditEmailStage");
const heroRevealItems = [...document.querySelectorAll(".hero-reveal")];
const teamSection = document.querySelector(".team-section");
const teamPhotoWrap = document.querySelector("#teamPhotoWrap");
const aboutSection = document.querySelector(".about-section");
const contactSection = document.querySelector(".contact");
const contactForm = document.querySelector(".compose");
const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');
const contactFormStatus = contactForm?.querySelector(".form-status");
const analyticsConsent = document.querySelector("[data-analytics-consent]");
const analyticsConsentButtons = [...document.querySelectorAll("[data-consent-choice]")];
const analyticsSettingsButtons = [...document.querySelectorAll("[data-consent-settings]")];

let startupUnlockFallbackTimer = 0;
let servicesTypingStarted = false;
let serviceCubeFrame = 0;
let heroCubeFrame = 0;
let heroVideoFrame = 0;
let analyticsLoaded = false;

function readAnalyticsConsent() {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch (error) {
    return null;
  }
}

function storeAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch (error) {
    // The choice still applies for this page when browser storage is unavailable.
  }
}

function clearAnalyticsCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.inboxviewed.com; SameSite=Lax`;
  });
}

function loadGoogleAnalytics() {
  if (analyticsLoaded) return;

  analyticsLoaded = true;
  window.gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "granted",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  analyticsScript.dataset.googleAnalytics = "true";
  document.head.append(analyticsScript);
}

function showAnalyticsConsent() {
  if (!analyticsConsent) return;
  analyticsConsent.hidden = false;
  analyticsConsent.querySelector("button")?.focus({ preventScroll: true });
}

function hideAnalyticsConsent() {
  if (analyticsConsent) analyticsConsent.hidden = true;
}

function applyAnalyticsConsent(value) {
  storeAnalyticsConsent(value);

  if (value === "accepted") {
    loadGoogleAnalytics();
    hideAnalyticsConsent();
    return;
  }

  clearAnalyticsCookies();
  hideAnalyticsConsent();

  if (analyticsLoaded) {
    window.location.reload();
  } else {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }
}

const savedAnalyticsConsent = readAnalyticsConsent();

if (savedAnalyticsConsent === "accepted") {
  loadGoogleAnalytics();
} else if (!savedAnalyticsConsent) {
  showAnalyticsConsent();
}

analyticsConsentButtons.forEach((button) => {
  button.addEventListener("click", () => applyAnalyticsConsent(button.dataset.consentChoice));
});

analyticsSettingsButtons.forEach((button) => {
  button.addEventListener("click", showAnalyticsConsent);
});
let heroVideoStarted = false;
let auditRevealStarted = false;

const phoneOverlapsHeroCopy = (time) =>
  (time >= 5 && time <= 8) || (time >= 12 && time <= 15);

const phoneOverlapsHeroServices = (time) =>
  (time >= 3.75 && time <= 6.75) ||
  (time >= 11.65 && time <= 14.35) ||
  time >= 18.5;

const syncHeroVideoComposition = () => {
  if (!heroVideo || !heroSection) return;
  heroSection.classList.toggle("hero-phone-over-copy", phoneOverlapsHeroCopy(heroVideo.currentTime));
  heroSection.classList.toggle("hero-phone-over-services", phoneOverlapsHeroServices(heroVideo.currentTime));

  if (!heroVideo.paused && !heroVideo.ended) {
    heroVideoFrame = window.requestAnimationFrame(syncHeroVideoComposition);
  }
};

const prepareHeroVideo = () => {
  if (!heroVideo || !heroSection || !desktopHeroVideo.matches) return;
  heroSection.classList.add("hero-video-enabled");

  if (!heroVideo.getAttribute("src")) {
    heroVideo.src = heroVideo.dataset.src;
    heroVideo.load();
  }
};

const startHeroVideo = () => {
  if (!heroVideo || !heroSection || !desktopHeroVideo.matches) return;
  prepareHeroVideo();

  if (reducedMotion.matches) {
    heroVideo.pause();
    heroVideo.currentTime = 0;
    heroSection.classList.remove("hero-phone-over-copy", "hero-phone-over-services");
    return;
  }

  if (!heroVideoStarted) {
    heroVideo.currentTime = 0;
    heroVideoStarted = true;
  }

  heroVideo.play().catch(() => {
    // The poster remains visible if a browser declines background autoplay.
  });
};

if (heroVideo && heroSection) {
  heroVideo.addEventListener("loadeddata", () => {
    heroSection.classList.add("hero-video-ready");
  });
  heroVideo.addEventListener("play", () => {
    window.cancelAnimationFrame(heroVideoFrame);
    heroVideoFrame = window.requestAnimationFrame(syncHeroVideoComposition);
  });
  heroVideo.addEventListener("pause", () => {
    window.cancelAnimationFrame(heroVideoFrame);
  });

  const handleHeroVideoBreakpoint = () => {
    if (desktopHeroVideo.matches) {
      prepareHeroVideo();
      if (document.documentElement.classList.contains("hero-ready")) startHeroVideo();
      return;
    }

    heroVideo.pause();
    heroSection.classList.remove(
      "hero-video-enabled",
      "hero-phone-over-copy",
      "hero-phone-over-services"
    );
  };

  desktopHeroVideo.addEventListener("change", handleHeroVideoBreakpoint);
  prepareHeroVideo();
}

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

const resetHeroCubes = () => {
  heroCubes.forEach((cube) => {
    if (!cube) return;
    cube.style.setProperty("--hero-cube-rx", "-7deg");
    cube.style.setProperty("--hero-cube-ry", "8deg");
    cube.style.setProperty("--hero-cube-lift", "0px");
    cube.closest(".hero-cube-wrap")?.classList.remove("cube-reacting");
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

const updateHeroCubes = (clientX, clientY) => {
  if (heroCapabilityCards.length === 0) return;

  const cardRects = heroCapabilityCards.map((card) => card.getBoundingClientRect());
  const insideIndex = cardRects.findIndex(
    (rect) => clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  );

  heroCubes.forEach((cube, index) => {
    if (!cube) return;
    const wrapper = cube.closest(".hero-cube-wrap");

    if (insideIndex !== index) {
      cube.style.setProperty("--hero-cube-rx", "-7deg");
      cube.style.setProperty("--hero-cube-ry", "8deg");
      cube.style.setProperty("--hero-cube-lift", "0px");
      wrapper?.classList.remove("cube-reacting");
      return;
    }

    const cubeRect = wrapper.getBoundingClientRect();
    const dx = clientX - (cubeRect.left + cubeRect.width / 2);
    const dy = clientY - (cubeRect.top + cubeRect.height / 2);
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const influenceRadius = Math.hypot(cardRects[index].width, cardRects[index].height) * 0.92;
    const proximity = Math.max(0.16, Math.min(1, 1 - distance / influenceRadius));
    const maxAngle = 32;
    const rotateX = Math.max(-38, Math.min(38, -7 - (dy / distance) * maxAngle * proximity));
    const rotateY = Math.max(-38, Math.min(38, 8 + (dx / distance) * maxAngle * proximity));

    cube.style.setProperty("--hero-cube-rx", `${rotateX.toFixed(2)}deg`);
    cube.style.setProperty("--hero-cube-ry", `${rotateY.toFixed(2)}deg`);
    cube.style.setProperty("--hero-cube-lift", `${(-3.5 * proximity).toFixed(2)}px`);
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

if (
  heroCubes.some(Boolean) &&
  window.matchMedia("(pointer: fine)").matches &&
  !reducedMotion.matches
) {
  document.addEventListener("pointermove", (event) => {
    window.cancelAnimationFrame(heroCubeFrame);
    heroCubeFrame = window.requestAnimationFrame(() => {
      updateHeroCubes(event.clientX, event.clientY);
    });
  });

  document.addEventListener("pointerleave", resetHeroCubes);
  window.addEventListener("blur", resetHeroCubes);
}

const unlockStartup = () => {
  window.clearTimeout(startupUnlockFallbackTimer);
  document.documentElement.classList.remove("boot-locked");
};

const revealHero = () => {
  startHeroVideo();
  if (document.documentElement.classList.contains("hero-ready")) return;
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
    revealHero();
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

const clearAuditZoom = () => {
  if (!auditEmailStage) return;
  auditEmailStage.classList.remove("is-zoomed");
  auditEmailStage.style.removeProperty("--focus-x");
  auditEmailStage.style.removeProperty("--focus-y");
  auditEmailStage.style.removeProperty("--focus-scale");
};

const scrollAuditEmailTo = (percent, behavior = "smooth") => {
  if (!auditEmailViewport || !auditEmailStage) return;
  const position = Number(percent);
  if (!Number.isFinite(position)) return;
  const stageTop = auditEmailStage.offsetTop;
  const stageHeight = auditEmailStage.offsetHeight;
  const imageBottom = stageTop + stageHeight;
  const target = stageTop + (stageHeight * position / 100) - (auditEmailViewport.clientHeight / 2);
  const maximum = Math.max(0, imageBottom - auditEmailViewport.clientHeight);
  auditEmailViewport.scrollTo({
    top: Math.max(0, Math.min(target, maximum)),
    behavior: reducedMotion.matches ? "auto" : behavior,
  });
};

const activateAuditFinding = (control) => {
  const index = control.dataset.audit;
  const matchingPin = document.querySelector(`.audit-image-pin[data-audit="${index}"]`);
  const matchingNote = document.querySelector(`.notes > button[data-audit="${index}"]`);
  const scrollY = matchingNote?.dataset.scrollY || matchingPin?.dataset.focusY;

  auditControls.forEach((item) => item.classList.toggle("active", item.dataset.audit === index));
  scrollAuditEmailTo(scrollY);

  if (matchingPin && auditEmailStage && matchingPin.dataset.panOnly !== "true") {
    auditEmailStage.style.setProperty("--focus-x", `${matchingPin.dataset.focusX}%`);
    auditEmailStage.style.setProperty("--focus-y", `${matchingPin.dataset.focusY}%`);
    auditEmailStage.style.setProperty("--focus-scale", matchingPin.dataset.focusScale || "1.12");
    window.requestAnimationFrame(() => auditEmailStage.classList.add("is-zoomed"));
  } else {
    clearAuditZoom();
  }

  if (control.classList.contains("audit-image-pin") && matchingNote) {
    matchingNote.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest" });
  }
};

const syncAuditPaneHeight = () => {
  if (!auditModule || !auditNotes) return;

  const notesClone = auditNotes.cloneNode(true);
  notesClone.setAttribute("aria-hidden", "true");
  Object.assign(notesClone.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    width: `${auditNotes.getBoundingClientRect().width}px`,
    height: "auto",
    minHeight: "0",
    overflow: "visible",
    visibility: "hidden",
    pointerEvents: "none",
  });

  const cloneFindings = [...notesClone.querySelectorAll(":scope > button[data-audit]")];
  notesClone.querySelectorAll(".audit-finding-copy").forEach((copy) => {
    copy.style.transition = "none";
  });
  cloneFindings.forEach((finding) => finding.classList.remove("active"));
  document.body.appendChild(notesClone);

  let requiredHeight = notesClone.scrollHeight;
  cloneFindings.forEach((finding) => {
    cloneFindings.forEach((item) => item.classList.remove("active"));
    finding.classList.add("active");
    requiredHeight = Math.max(requiredHeight, notesClone.scrollHeight);
  });

  notesClone.remove();
  const fittedHeight = `${Math.ceil(requiredHeight + 2)}px`;
  auditModule.style.setProperty("--audit-findings-height", fittedHeight);

  if (window.matchMedia("(min-width: 821px)").matches) {
    auditModule.style.setProperty("--audit-pane-height", fittedHeight);
  } else {
    auditModule.style.removeProperty("--audit-pane-height");
  }
};

let auditResizeFrame = 0;
const scheduleAuditPaneHeight = () => {
  window.cancelAnimationFrame(auditResizeFrame);
  auditResizeFrame = window.requestAnimationFrame(syncAuditPaneHeight);
};

scheduleAuditPaneHeight();
if (document.fonts?.ready) document.fonts.ready.then(scheduleAuditPaneHeight);
window.addEventListener("resize", scheduleAuditPaneHeight, { passive: true });

auditControls.forEach((control) => {
  control.addEventListener("click", () => activateAuditFinding(control));
});

if (auditEmailViewport) {
  auditEmailViewport.addEventListener("wheel", clearAuditZoom, { passive: true });
  auditEmailViewport.addEventListener("touchmove", clearAuditZoom, { passive: true });
  auditEmailViewport.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) clearAuditZoom();
  });
}

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

    if (!contactForm.reportValidity()) return;

    const originalButtonText = contactSubmitButton.textContent;
    const requestController = new AbortController();
    const requestTimeout = window.setTimeout(() => requestController.abort(), 15000);
    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = "Sending...";
    contactFormStatus.textContent = "Sending securely";
    contactFormStatus.classList.remove("success", "error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
        credentials: "omit",
        referrerPolicy: "strict-origin-when-cross-origin",
        signal: requestController.signal
      });
      const result = await response.json();
      const sent = response.ok && (result.success === true || result.success === "true");

      if (!sent) throw new Error("The inquiry could not be delivered.");

      contactForm.reset();
      contactFormStatus.textContent = "Inquiry sent - we'll reply by email";
      contactFormStatus.classList.add("success");
      if (analyticsLoaded) {
        window.gtag("event", "generate_lead", { method: "contact_form" });
      }
    } catch (error) {
      contactFormStatus.textContent = "Could not send - please try again";
      contactFormStatus.classList.add("error");
    } finally {
      window.clearTimeout(requestTimeout);
      contactSubmitButton.disabled = false;
      contactSubmitButton.textContent = originalButtonText;
    }
  });
}
