// Sticky navbar effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.style.display =
    navMenu.style.display === "block" ? "none" : "block";
});

// Smooth scrolling
document.querySelectorAll("nav ul li").forEach(item => {
  item.addEventListener("click", () => {
    window.scrollTo({
      top: document.body.scrollHeight / 4,
      behavior: "smooth"
    });
  });
});