/* ===== Neon bar — boot flicker then settle ===== */
const neonBar = document.getElementById("neonBar");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let startNeonBoot = () => {};

if (neonBar) {
  let neonScheduleTimer = null;
  let neonResetTimer = null;
  let neonIsFlickering = false;

  const settleNeon = () => {
    neonBar.classList.remove("booting", "flicker-once", "flicker-double");
    neonBar.classList.add("steady");
    neonIsFlickering = false;
  };

  const triggerNeonFlicker = (chance = 1) => {
    if (reducedMotion.matches || neonIsFlickering || Math.random() > chance) return;

    neonIsFlickering = true;
    neonBar.classList.remove("flicker-once", "flicker-double");

    const flickerClass = Math.random() < 0.34 ? "flicker-double" : "flicker-once";
    const duration = flickerClass === "flicker-double" ? 500 : 320;

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
      }, 3050);
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
const bootReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (bootIntro) {
  const finishBootIntro = () => {
    document.documentElement.classList.remove("boot-locked");
    bootIntro.remove();
    startNeonBoot();
  };

  if (bootReducedMotion.matches) {
    // CSS already skips the fade/zoom and hides the overlay instantly for
    // this case; just clean up the element and let the header light start.
    finishBootIntro();
  } else {
    document.documentElement.classList.add("boot-locked");
    const curtainTarget = bootCurtain || bootIntro;
    curtainTarget.addEventListener("animationend", finishBootIntro, { once: true });
    // Safety net in case the animationend event is ever missed (e.g. tab was
    // backgrounded mid-animation) so the site is never left covered and the
    // light never gets stuck off.
    setTimeout(finishBootIntro, 2600);
  }
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
