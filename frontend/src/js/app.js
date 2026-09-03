// Main application / scene controller.
import Puzzle from "./puzzle.js";
import Gift from "./gift.js";
import Camera from "./camera.js";
import InitMessageSender from "./message.js";


const App = (() => {
  const scenes = {
    puzzle: document.getElementById("puzzleScene"),
    gift: document.getElementById("giftScene"),
    greeting: document.getElementById("greetingScene")
  };

  function showScene(name) {
    Object.entries(scenes).forEach(([key, scene]) => {
      const active = key === name;
      scene.classList.toggle("active", active);
      scene.setAttribute("aria-hidden", String(!active));
    });
  }

  function init() {
    Puzzle.init();
    Gift.init();
    Camera.init();
    InitMessageSender()

    window.addEventListener("puzzle:complete", () => {
      showScene("gift");
    });

    window.addEventListener("gift:complete", () => {
      showScene("greeting");
    });

    showScene("puzzle");
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
