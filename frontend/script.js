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
const revealElements = document.querySelectorAll(".reveal, .reveal-row");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
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
  "a, button, .inbox-row, .post-card, .contact-card, input, textarea"
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
