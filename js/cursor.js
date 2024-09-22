import gsap from "gsap";

const $bigBall = document.querySelector(".cursor__ball--big");
const $smallBall = document.querySelector(".cursor__ball--small");
const $hoverables = document.querySelectorAll(".hoverable");

// Set initial position of the cursor elements
gsap.set($bigBall, {
  xPercent: -50,
  yPercent: -50
});
gsap.set($smallBall, {
  xPercent: -50,
  yPercent: -50
});

// Listeners
document.body.addEventListener("mousemove", onMouseMove);
$hoverables.forEach($hoverable => {
  $hoverable.addEventListener("mouseenter", onMouseHover);
  $hoverable.addEventListener("mouseleave", onMouseHoverOut);
});

// Move the cursor
function onMouseMove(e) {
  gsap.to($bigBall, {
    duration: 0.3,
    x: e.clientX,
    y: e.clientY
  });
  gsap.to($smallBall, {
    duration: 0.1,
    x: e.clientX,
    y: e.clientY
  });
}

// Hover an element
function onMouseHover() {
  gsap.to($bigBall, {
    duration: 0.3,
    scale: 4
  });
}

function onMouseHoverOut() {
  gsap.to($bigBall, {
    duration: 0.3,
    scale: 1
  });
}