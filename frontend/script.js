/* ===== Neon bar — boot flicker then settle ===== */
const neonBar = document.getElementById("neonBar");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let startNeonBoot = () => {};

if (neonBar) {
  let neonScheduleTimer = null;
  let neonResetTimer = null;
  let neonIsFlickering = false;

  const NEON_FLICKER_CLASSES = ["flicker-quarter", "flicker-three-quarter", "flicker-blackout"];

  const settleNeon = () => {
    neonBar.classList.remove("booting", ...NEON_FLICKER_CLASSES);
    neonBar.classList.add("steady");
    neonIsFlickering = false;
  };

  const triggerNeonFlicker = (chance = 1) => {
    if (reducedMotion.matches || neonIsFlickering || Math.random() > chance) return;

    neonIsFlickering = true;
    neonBar.classList.remove(...NEON_FLICKER_CLASSES);

    // Pick one of the three occasional events: dim to 25%, dim to 75%,
    // or a full blackout-then-blip-then-back-on. Blackout is the rarest.
    const roll = Math.random();
    const flickerClass =
      roll < 0.2 ? "flicker-blackout" : roll < 0.6 ? "flicker-quarter" : "flicker-three-quarter";
    const duration = flickerClass === "flicker-blackout" ? 620 : 420;

    // Restart the selected animation cleanly without adding another timer chain.
    void neonBar.offsetWidth;
    neonBar.classList.add(flickerClass);

    clearTimeout(neonResetTimer);
    neonResetTimer = setTimeout(() => {
      neonBar.classList.remove(flickerClass);
      neonIsFlickering = false;
    }, duration);
  };

  const scheduleNeonFlicker = () => {
    if (reducedMotion.matches) return;

    clearTimeout(neonScheduleTimer);
    const delay = 28000 + Math.random() * 32000;

    neonScheduleTimer = setTimeout(() => {
      triggerNeonFlicker(0.72);
      scheduleNeonFlicker();
    }, delay);
  };

  const handleReducedMotionChange = () => {
    clearTimeout(neonScheduleTimer);
    clearTimeout(neonResetTimer);
    settleNeon();

    if (!reducedMotion.matches) {
      scheduleNeonFlicker();
    }
  };

  // Called once the boot intro has fully resolved (curtain zoomed away, or
  // skipped instantly for reduced motion) — the light should never be visibly
  // "on" while the red screen is still covering the page.
  let neonHasBooted = false;
  startNeonBoot = () => {
    if (neonHasBooted) return;
    neonHasBooted = true;

    if (reducedMotion.matches) {
      settleNeon();
    } else {
      neonBar.classList.add("booting");
      setTimeout(() => {
        settleNeon();
        scheduleNeonFlicker();
      }, 3400);
    }
  };

  reducedMotion.addEventListener("change", handleReducedMotionChange);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      // Navigation-triggered flickers are intentionally uncommon.
      setTimeout(() => triggerNeonFlicker(0.18), 520);
    });
  });
}

/* ===== Boot intro — X mark fades away, then zooms through ===== */
const bootIntro = document.getElementById("bootIntro");
const bootCurtain = document.getElementById("bootCurtain");
const bootMarkCover = document.getElementById("bootMarkCover");
const bootReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (bootIntro) {
  const bootAssetUrls = [
    "assets/brand/boot-symbol-hole.png",
    "assets/brand/boot-symbol-mask.png",
  ];
  const introTimers = new Set();
  const introCleanups = [];
  let introFinished = false;
  let introPhase = "loading";

  const setIntroTimer = (callback, delay) => {
    const timer = setTimeout(() => {
      introTimers.delete(timer);
      callback();
    }, delay);

    introTimers.add(timer);
    return timer;
  };

  const clearIntroResources = () => {
    introTimers.forEach((timer) => clearTimeout(timer));
    introTimers.clear();
    introCleanups.splice(0).forEach((cleanup) => cleanup());
  };

  const readCssTime = (propertyName, fallbackMs) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();

    if (!value) return fallbackMs;
    if (value.endsWith("ms")) return Number.parseFloat(value) || fallbackMs;
    if (value.endsWith("s")) return (Number.parseFloat(value) || 0) * 1000 || fallbackMs;
    return Number.parseFloat(value) || fallbackMs;
  };

  const waitForNextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const preloadAndDecodeImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      callback(value);
    };

    const resolveLoadedImage = async () => {
      try {
        if (typeof image.decode === "function") {
          await image.decode();
        }
      } catch (error) {
        // Some browsers reject decode() even after a successful load. The
        // decoded pixels are still allowed to paint, so loading remains valid.
      }

      finish(resolve, image);
    };

    image.onload = resolveLoadedImage;
    image.onerror = () => finish(reject, new Error(`Unable to load intro asset: ${src}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      resolveLoadedImage();
    }
  });

  const preloadIntroAssets = () => {
    const assetPromise = Promise.all(bootAssetUrls.map(preloadAndDecodeImage));
    const timeoutPromise = new Promise((_, reject) => {
      setIntroTimer(() => reject(new Error("Intro asset preload timed out.")), 2400);
    });

    return Promise.race([assetPromise, timeoutPromise]);
  };

  const finishBootIntro = () => {
    if (introFinished) return;
    introFinished = true;
    introPhase = "intro-complete";

    clearIntroResources();
    document.documentElement.classList.remove("boot-locked");
    bootIntro.remove();
    startNeonBoot();
  };

  const runSimpleReveal = (className) => {
    if (introFinished) return;
    introPhase = className;

    const handleRevealEnd = (event) => {
      if (event.target === bootIntro && event.propertyName === "opacity") {
        finishBootIntro();
      }
    };

    bootIntro.addEventListener("transitionend", handleRevealEnd);
    introCleanups.push(() => bootIntro.removeEventListener("transitionend", handleRevealEnd));

    requestAnimationFrame(() => bootIntro.classList.add(className));
    setIntroTimer(finishBootIntro, 420);
  };

  const startCutoutExpansion = () => {
    if (introFinished || introPhase === "cutout-expanding") return;
    introPhase = "cutout-expanding";

    const handleCurtainEnd = (event) => {
      if (event.target === bootCurtain && event.animationName === "boot-curtain-zoom") {
        finishBootIntro();
      }
    };

    if (bootCurtain) {
      bootCurtain.addEventListener("animationend", handleCurtainEnd);
      introCleanups.push(() => bootCurtain.removeEventListener("animationend", handleCurtainEnd));
    }

    bootIntro.classList.add("intro-cutout-ready", "intro-cutout-expanding");

    const zoomDuration = readCssTime("--intro-cutout-zoom-duration", 1500);
    setIntroTimer(finishBootIntro, zoomDuration + 350);
  };

  const startLogoFade = () => {
    if (introFinished || introPhase !== "logo-visible") return;
    introPhase = "logo-fading";

    const handleLogoFadeEnd = (event) => {
      if (event.target === bootMarkCover && event.propertyName === "opacity") {
        startCutoutExpansion();
      }
    };

    if (bootMarkCover) {
      bootMarkCover.addEventListener("transitionend", handleLogoFadeEnd);
      introCleanups.push(() => bootMarkCover.removeEventListener("transitionend", handleLogoFadeEnd));
    }

    bootIntro.classList.add("intro-logo-fading");

    // transitionend is the sequencing source of truth. This timeout is only a
    // bounded failure-safe for browsers that suppress the event unexpectedly.
    const fadeDuration = readCssTime("--intro-logo-fade-duration", 800);
    setIntroTimer(startCutoutExpansion, fadeDuration + 180);
  };

  const beginIntroSequence = async () => {
    document.documentElement.classList.add("boot-locked");
    bootIntro.classList.add("intro-loading");

    // One bounded global escape hatch ensures no failed asset, animation, or
    // backgrounded tab can leave the red curtain permanently covering the site.
    setIntroTimer(() => {
      if (!introFinished) {
        console.warn("InboxViewed intro exceeded its safety window; completing the reveal.");
        finishBootIntro();
      }
    }, 6200);

    try {
      await preloadIntroAssets();
      if (introFinished) return;

      bootIntro.classList.remove("intro-loading");
      bootIntro.classList.add("intro-assets-ready", "intro-logo-visible");
      introPhase = "logo-visible";

      // Give the decoded mask and white cover a committed paint before any
      // opacity change. This keeps the two pixel-identical silhouettes locked.
      await waitForNextPaint();
      if (introFinished) return;

      if (bootReducedMotion.matches) {
        const reducedHold = Math.min(
          readCssTime("--intro-logo-hold-duration", 320),
          220
        );
        setIntroTimer(() => runSimpleReveal("intro-reduced-reveal"), reducedHold);
        return;
      }

      const logoHoldDuration = readCssTime("--intro-logo-hold-duration", 320);
      setIntroTimer(startLogoFade, logoHoldDuration);
    } catch (error) {
      console.warn("InboxViewed intro assets could not be prepared; using a simplified reveal.", error);
      runSimpleReveal("intro-fallback-reveal");
    }
  };

  beginIntroSequence();
} else {
  // No boot intro present on the page for some reason — start the light normally.
  startNeonBoot();
}

/* ===== Mobile nav toggle ===== */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

/* ===== Scroll reveal ===== */
const revealSections = document.querySelectorAll(".reveal");
const revealRows = document.querySelectorAll(".reveal-row");

function revealOnScroll() {
  revealSections.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });

  revealRows.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("in-view");
    }
  });
}
setTimeout(revealOnScroll, 100);

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ===== Custom cursor ===== */
const customCursor = document.querySelector(".custom-cursor");
const cursorGlow = document.querySelector(".cursor-glow");
const hoverElements = document.querySelectorAll(
  "a, button, .mail-item, .post-card, .contact-card, .review-card, .client-badge, input, textarea"
);

document.addEventListener("mousemove", (event) => {
  customCursor.style.left = `${event.clientX}px`;
  customCursor.style.top = `${event.clientY}px`;

  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

hoverElements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    customCursor.classList.add("hover");
  });

  element.addEventListener("mouseleave", () => {
    customCursor.classList.remove("hover");
  });
});

/* ===== Work — post image sliders ===== */
const postCards = document.querySelectorAll(".post-card");

postCards.forEach((card) => {
  const track = card.querySelector(".post-track");
  const images = card.querySelectorAll(".post-track img");
  let index = 0;

  setInterval(() => {
    index = (index + 1) % images.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 3000);
});

/* ===== Hero attachment image slider ===== */
const heroImages = document.querySelectorAll(".hero-img");
let heroImageIndex = 0;

if (heroImages.length) {
  setInterval(() => {
    heroImages[heroImageIndex].classList.remove("active");
    heroImageIndex = (heroImageIndex + 1) % heroImages.length;
    heroImages[heroImageIndex].classList.add("active");
  }, 3500);
}

/* ===== Services — Outlook-style mail app ===== */
const mailItems = document.querySelectorAll(".mail-item");
const mailReadings = document.querySelectorAll(".mail-reading");

mailItems.forEach((item) => {
  item.setAttribute("aria-pressed", item.classList.contains("active") ? "true" : "false");

  item.addEventListener("click", () => {
    const service = item.dataset.service;

    mailItems.forEach((i) => {
      i.classList.remove("active");
      i.setAttribute("aria-pressed", "false");
    });
    item.classList.add("active");
    item.setAttribute("aria-pressed", "true");

    mailReadings.forEach((reading) => {
      reading.classList.toggle("active", reading.dataset.service === service);
    });
  });
});

/* ===== Team photo — hover reveal ===== */
const teamPhotoWrap = document.getElementById("teamPhotoWrap");

if (teamPhotoWrap) {
  const hotspots = Array.from(teamPhotoWrap.querySelectorAll(".photo-hotspot"));
  const photoCards = Array.from(teamPhotoWrap.querySelectorAll(".photo-card"));
  let activePerson = null;
  let activeHotspot = null;
  let activeCard = null;
  let hidePhotoCardTimer = null;

  const clearHidePhotoCardTimer = () => {
    clearTimeout(hidePhotoCardTimer);
    hidePhotoCardTimer = null;
  };

  const getInteractionPerson = (element) => {
    if (!(element instanceof Element)) return null;

    const hotspot = element.closest(".photo-hotspot");
    if (hotspot && teamPhotoWrap.contains(hotspot)) return hotspot.dataset.person;

    const card = element.closest(".photo-card");
    if (card && teamPhotoWrap.contains(card)) return card.dataset.card;

    return null;
  };

  const clearPhotoCardState = (exceptPerson = null) => {
    hotspots.forEach((hotspot) => {
      const isException = hotspot.dataset.person === exceptPerson;
      hotspot.classList.toggle("active", isException);
      hotspot.setAttribute("aria-expanded", isException ? "true" : "false");
    });

    photoCards.forEach((card) => {
      const isException = card.dataset.card === exceptPerson;
      card.classList.toggle("visible", isException);
      card.setAttribute("aria-hidden", isException ? "false" : "true");
    });
  };

  const showPhotoCard = (hotspot) => {
    const person = hotspot.dataset.person;
    const card = teamPhotoWrap.querySelector(`.photo-card[data-card="${person}"]`);

    if (!card) return;

    clearHidePhotoCardTimer();
    clearPhotoCardState(person);

    activePerson = person;
    activeHotspot = hotspot;
    activeCard = card;

    teamPhotoWrap.style.setProperty("--hx", hotspot.dataset.x);
    teamPhotoWrap.style.setProperty("--hy", hotspot.dataset.y);
    teamPhotoWrap.classList.add("revealing");
  };

  const closeActivePhotoCard = () => {
    clearHidePhotoCardTimer();
    clearPhotoCardState();
    teamPhotoWrap.classList.remove("revealing");

    activePerson = null;
    activeHotspot = null;
    activeCard = null;
  };

  const activeInteractionContains = (element) => {
    return Boolean(activePerson && getInteractionPerson(element) === activePerson);
  };

  const scheduleActivePhotoCardClose = (event) => {
    if (!activePerson || activeInteractionContains(event?.relatedTarget)) return;

    clearHidePhotoCardTimer();
    const personAtSchedule = activePerson;

    hidePhotoCardTimer = setTimeout(() => {
      if (activePerson !== personAtSchedule) return;

      const focusedElement = document.activeElement;
      const pointerStillInside =
        (activeHotspot && activeHotspot.matches(":hover")) ||
        (activeCard && activeCard.matches(":hover"));
      const focusStillInside =
        (activeHotspot && activeHotspot === focusedElement) ||
        (activeCard && activeCard.contains(focusedElement));

      if (!pointerStillInside && !focusStillInside) {
        closeActivePhotoCard();
      }
    }, 90);
  };

  hotspots.forEach((hotspot) => {
    hotspot.setAttribute("aria-expanded", "false");

    hotspot.addEventListener("pointerenter", () => showPhotoCard(hotspot));
    hotspot.addEventListener("focus", () => showPhotoCard(hotspot));
    hotspot.addEventListener("pointerleave", scheduleActivePhotoCardClose);
    hotspot.addEventListener("blur", scheduleActivePhotoCardClose);

    // Touch devices: tap to toggle since there's no hover state
    hotspot.addEventListener("click", (event) => {
      event.preventDefault();
      const person = hotspot.dataset.person;

      if (activePerson === person) {
        closeActivePhotoCard();
      } else {
        showPhotoCard(hotspot);
      }
    });
  });

  photoCards.forEach((card) => {
    card.setAttribute("aria-hidden", "true");

    card.addEventListener("pointerenter", () => {
      clearHidePhotoCardTimer();

      if (activePerson !== card.dataset.card) {
        const hotspot = hotspots.find((item) => item.dataset.person === card.dataset.card);
        if (hotspot) showPhotoCard(hotspot);
      }
    });
    card.addEventListener("pointerleave", scheduleActivePhotoCardClose);
    card.addEventListener("focusin", clearHidePhotoCardTimer);
    card.addEventListener("focusout", scheduleActivePhotoCardClose);
  });

  teamPhotoWrap.addEventListener("pointerleave", scheduleActivePhotoCardClose);
  teamPhotoWrap.addEventListener("pointercancel", closeActivePhotoCard);
}

/* ===== Audit teardown — marks + notes ===== */
const marks = document.querySelectorAll(".mark");
const notes = document.querySelectorAll(".note");

function setActiveMark(id) {
  notes.forEach((note) => {
    note.classList.toggle("active", note.dataset.mark === id);
  });
}

marks.forEach((mark) => {
  mark.addEventListener("click", () => {
    const id = mark.textContent.trim();
    setActiveMark(id);
    const note = document.querySelector(`.note[data-mark="${id}"]`);
    if (note) note.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

/* ===== Compose form — mailto handoff ===== */
const composeForm = document.getElementById("composeForm");

if (composeForm) {
  composeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const subject = document.getElementById("composeSubject").value;
    const message = document.getElementById("composeMessage").value;

    const mailto = `mailto:service@enigmail.space?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailto;
  });
}
