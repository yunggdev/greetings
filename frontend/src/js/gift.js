// // Gift interaction and flower explosion.

// const Gift = (() => {
//   // els.placeholder = document.getElementById("photoPlaceholder");
//   const state = { taps: 0, exploded: false };
//   let giftButton;
//   let count;
//   let instruction;
//   let flowerLayer;

//   const flowerEmojis = ["🌸", "🌼", "🌷", "✿", "❀", "💮","🌸", "🌼", "🌷", "✿", "❀", "💮"];

//   function animateTap(className) {
//     giftButton.classList.remove("tap-one", "tap-two");
//     void giftButton.offsetWidth;
//     giftButton.classList.add(className);
//   }

//   function createFlowers() {
//     flowerLayer.innerHTML = "";
//     const total = 58;

//     for (let i = 0; i < total; i++) {
//       const flower = document.createElement("span");
//       flower.className = "flower";
//       flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

//       const angle = Math.random() * Math.PI * 2;
//       const distance = 230 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * .7;
//       const x = Math.cos(angle) * distance;
//       const y = Math.sin(angle) * distance;
//       const size = `${.75 + Math.random() * 1.25}rem`;
//       const duration = `${.75 + Math.random() * .8}s`;
//       const delay = `${Math.random() * .12}s`;
//       const rotate = `${-240 + Math.random() * 480}deg`;

//       flower.style.setProperty("--x", `${x}px`);
//       flower.style.setProperty("--y", `${y}px`);
//       flower.style.setProperty("--size", size);
//       flower.style.setProperty("--duration", duration);
//       flower.style.setProperty("--delay", delay);
//       flower.style.setProperty("--rotate", rotate);


//       flowerLayer.appendChild(flower);
//     }
//   }

//   function fallFlowers() {
//     [...flowerLayer.querySelectorAll(".flower")].forEach((flower, i) => {
//       const x = `${(Math.random() - .5) * window.innerWidth * .35}px`;
//       flower.style.setProperty("--x", x);
//       flower.style.setProperty("--rotate", `${-180 + Math.random() * 360}deg`);
//       flower.style.animationDelay = `${(i % 15) * .025}s`;
//       flower.classList.add("fall");
//     });
//   }

//   function explode() {
//     state.exploded = true;
//     giftButton.classList.add("explode");
//     instruction.textContent = "A little surprise is coming... 🌸";
//     createFlowers();

//     // Keep flowers over the screen for 2 seconds, then let them fall.
//     setTimeout(fallFlowers, 2000);

//     // Give the fall animation a moment before revealing the greeting.
//     setTimeout(() => {
//       window.dispatchEvent(new CustomEvent("gift:complete"));
//     }, 3250);
//   }

//   function handleTap() {
//     if (state.exploded) return;

//     state.taps += 1;
//     count.textContent = `${state.taps} / 3`;

//     if (state.taps === 1) {
//       animateTap("tap-one");
//       instruction.textContent = "Something is happening... ✨";
//     } else if (state.taps === 2) {
//       animateTap("tap-two");
//       instruction.textContent = "One more tap! 👀";
//     } else {
//       explode();
//     }
//   }

//   function init() {
//     giftButton = document.getElementById("giftButton");
//     count = document.getElementById("giftTapCount");
//     instruction = document.getElementById("giftInstruction");
//     flowerLayer = document.getElementById("flowerLayer");
//     giftButton.addEventListener("click", handleTap);
//   }

//   return { init };
// })();

// export default Gift















// Gift interaction and flower explosion.

const Gift = (() => {
  const state = { taps: 0, exploded: false };
  let giftButton;
  let count;
  let instruction;
  let flowerLayer;

  const flowerEmojis = ["🌸", "🌼", "🌷", "✿", "❀", "💮"];

  function animateTap(className) {
    giftButton.classList.remove("tap-one", "tap-two");
    void giftButton.offsetWidth;
    giftButton.classList.add(className);
  }

  // function createFlowers() {
  //   flowerLayer.innerHTML = "";
  //   const total = 58;

  //   for (let i = 0; i < total; i++) {
  //     const flower = document.createElement("span");
  //     flower.className = "flower";
  //     flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

  //     const angle = Math.random() * Math.PI * 2;
  //     const distance = 230 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * .7;
  //     const x = Math.cos(angle) * distance;
  //     const y = Math.sin(angle) * distance;
  //     const size = `${.75 + Math.random() * 1.25}rem`;
  //     const duration = `${.75 + Math.random() * .8}s`;
  //     const delay = `${Math.random() * .12}s`;
  //     const rotate = `${-240 + Math.random() * 480}deg`;

  //     flower.style.setProperty("--x", `${x}px`);
  //     flower.style.setProperty("--y", `${y}px`);
  //     flower.style.setProperty("--size", size);
  //     flower.style.setProperty("--duration", duration);
  //     flower.style.setProperty("--delay", delay);
  //     flower.style.setProperty("--rotate", rotate);

  //     flowerLayer.appendChild(flower);
  //   }
  // }

  // function fallFlowers() {
  //   [...flowerLayer.querySelectorAll(".flower")].forEach((flower, i) => {
  //     const x = `${(Math.random() - .5) * window.innerWidth * .35}px`;
  //     flower.style.setProperty("--x", x);
  //     flower.style.setProperty("--rotate", `${-180 + Math.random() * 360}deg`);
  //     flower.style.animationDelay = `${(i % 15) * .025}s`;
  //     flower.classList.add("fall");
  //   });
  // }

  function explode() {
    state.exploded = true;
    giftButton.classList.add("explode");
    instruction.textContent = "A little surprise is coming... 🌸";
    // createFlowers();

    // Keep flowers over the screen for 2 seconds, then let them fall.
    // setTimeout(fallFlowers, 2000);

    // Give the fall animation a moment before revealing the greeting.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("gift:complete"));
    }, 1250);
  }

  function handleTap() {
    if (state.exploded) return;

    state.taps += 1;
    count.textContent = `${state.taps} / 3`;

    if (state.taps === 1) {
      animateTap("tap-one");
      instruction.textContent = "Something is happening... ✨";
    } else if (state.taps === 2) {
      animateTap("tap-two");
      instruction.textContent = "One more tap! 👀";
    } else {
      explode();
    }
  }

  function init() {
    giftButton = document.getElementById("giftButton");
    count = document.getElementById("giftTapCount");
    instruction = document.getElementById("giftInstruction");
    flowerLayer = document.getElementById("flowerLayer");
    giftButton.addEventListener("click", handleTap);
  }

  return { init };
})();

export default Gift

