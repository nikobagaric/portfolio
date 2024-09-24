import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { horizontalLoop } from "./helper/horizontalLoop";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
// Hero section elements
const heroTitle = document.querySelector(".hero__title");

// About section elements
const about = document.getElementById("about");
const aboutLeft = document.querySelector(".about__left");
const aboutRight = document.querySelector(".about__right");

// Marquee
const marqueeItems = gsap.utils.toArray(".marquee__item");

// Project section elements
const projectGroups = gsap.utils.toArray(".project__group");

let isMobileDevice = isMobile();

function isMobile() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

window.addEventListener("resize", () => {
  isMobileDevice = isMobile();
}
);

// Smooth scroll for anchor links, overwriting due to errors with
// the default scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetID = this.getAttribute("href");
    const targetElement = document.querySelector(targetID);

    if (targetElement) {
      gsap.to(window, {
        scrollTo: { y: targetElement.offsetTop, autoKill: false },
        duration: 1, // Adjust duration for smoothness
        ease: "power1.inOut",
      });
    }
  });
});

// Hero section animations
gsap.to(heroTitle, {
  opacity: 0,
  scrollTrigger: {
    trigger: about,
    start: "top center", // When the top of the about section hits the center of the viewport
    end: "top 100px", // When the top of the about section hits 100px from the top of the viewport
    scrub: true, // Smoothly animate the opacity
  },
});

// about section animations
gsap.fromTo(
  aboutLeft,
  {
    opacity: 0,
    y: 100,
  },
  {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: about,
      start: "top center",
      end: "top 100px",
      scrub: true,
    },
  }
);

gsap.fromTo(
  aboutRight,
  {
    opacity: 0,
    x: 100,
  },
  {
    opacity: 1,
    x: 0,
    scrollTrigger: {
      trigger: about,
      start: "top center",
      end: "top 100px",
      scrub: true,
    },
  }
);

// Marquee animation
const loop = horizontalLoop(marqueeItems, {
  paused: false,
  repeat: -1,
  speed: 1,
});

// Project horizontal pin animation
if(!isMobileDevice) {
  gsap.to(projectGroups, {
    xPercent: -100 * (projectGroups.length - 1),
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: "#project",
      start: "top top", // Adjust start point as needed
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      snap: 1 / (projectGroups.length - 1),
      end: () => "+=" + document.querySelector("#project").offsetWidth,
    },
  });
};