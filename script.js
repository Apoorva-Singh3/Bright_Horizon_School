// Toggle mobile menu
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});

// Smooth scrolling
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });

    // close menu on click (mobile)
    nav.style.display = "none";
  });
});

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").style.boxShadow =
    window.scrollY > 10 ? "0 2px 5px rgba(0,0,0,0.3)" : "none";
});