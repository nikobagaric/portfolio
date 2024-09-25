document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".header__hamburger");
    const mobileNav = document.querySelector(".header__mobile-nav");
    const mobileNavLinks = document.querySelectorAll(".header__mobile-nav__link");
  
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  
    mobileNavLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
      });
    });
  });