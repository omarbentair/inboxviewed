const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const customCursor = document.querySelector(".custom-cursor");
const cursorGlow = document.querySelector(".cursor-glow");
const hoverElements = document.querySelectorAll("a, button, .card, .post-card");

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

const heroImages = document.querySelectorAll(".hero-img");
let heroImageIndex = 0;

setInterval(() => {
  heroImages[heroImageIndex].classList.remove("active");

  heroImageIndex = (heroImageIndex + 1) % heroImages.length;

  heroImages[heroImageIndex].classList.add("active");
}, 3500);