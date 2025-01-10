// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const colors = ["blue", "red", "yellow", "green"];
  let index = 0;
  const element = document.querySelector(".animated-text");

  function animateColors() {
    if (element) {
      element.style.color = colors[index];
      index = (index + 1) % colors.length;
    }
  }

  setInterval(animateColors, 1000); // Change color every second
});
