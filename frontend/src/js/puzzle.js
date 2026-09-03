// // Greeting Web 1.0.01
// // Puzzle logic: each generated question resolves to the next target digit.

// const Puzzle = (() => {
//   const TARGET_CODE = [3, 7, 5]; // Change this to customize the 3-digit unlock code.
//   const state = {
//     index: 0,
//     input: "",
//     question: null
//   };

//   const els = {};

//   function randomQuestionForAnswer(answer) {
//     // Generate a simple + / - equation with a one-digit result.
//     const candidates = [];

//     for (let a = 0; a <= 9; a++) {
//       for (let b = 0; b <= 9; b++) {
//         if (a + b === answer) candidates.push({ a, b, op: "+" });
//         if (a - b === answer) candidates.push({ a, b, op: "-" });
//         if (b - a === answer) candidates.push({ a: b, b: a, op: "-" });
//       }
//     }

//     // Avoid boring "0 + answer" when alternatives exist.
//     const filtered = candidates.filter(q => q.a !== 0 && q.b !== 0);
//     const pool = filtered.length ? filtered : candidates;
//     return pool[Math.floor(Math.random() * pool.length)];
//   }

//   function renderQuestion() {
//     const target = TARGET_CODE[state.index];
//     state.question = randomQuestionForAnswer(target);
//     state.input = "";

//     els.questionNumber.textContent = String(state.index + 1);
//     els.questionText.textContent =
//       `${state.question.a} ${state.question.op} ${state.question.b} = ?`;
//     els.answerDisplay.textContent = "";
//     els.feedback.textContent = "";
//     els.feedback.className = "feedback";

//     els.progressDots.forEach((dot, i) => {
//       dot.classList.toggle("active", i === state.index);
//       dot.classList.toggle("done", i < state.index);
//     });
//   }

//   function appendDigit(digit) {
//     if (state.input.length >= 1) return;
//     state.input = String(digit);
//     els.answerDisplay.textContent = state.input;
//   }

//   function backspace() {
//     state.input = "";
//     els.answerDisplay.textContent = "";
//   }

//   function submit() {
//     if (!state.input) {
//       showError("Masukkan jawabannya dulu ✨");
//       return;
//     }

//     const answer = Number(state.input);
//     const expected = TARGET_CODE[state.index];

//     if (answer !== expected) {
//       showError("Oops, coba lagi! 💕");
//       els.puzzleCard.classList.remove("shake");
//       void els.puzzleCard.offsetWidth;
//       els.puzzleCard.classList.add("shake");
//       backspace();
//       return;
//     }

//     els.feedback.textContent = "Benar! ✨";
//     els.feedback.className = "feedback success";

//     setTimeout(() => {
//       state.index += 1;
//       if (state.index >= TARGET_CODE.length) {
//         window.dispatchEvent(new CustomEvent("puzzle:complete"));
//         return;
//       }
//       renderQuestion();
//     }, 550);
//   }

//   function showError(message) {
//     els.feedback.textContent = message;
//     els.feedback.className = "feedback error";
//   }

//   function init() {
//     els.puzzleCard = document.querySelector(".puzzle-card");
//     els.questionNumber = document.getElementById("questionNumber");
//     els.questionText = document.getElementById("questionText");
//     els.answerDisplay = document.getElementById("answerDisplay");
//     els.feedback = document.getElementById("feedback");
//     els.progressDots = [...document.querySelectorAll(".progress-dot")];

//     document.querySelectorAll(".key").forEach(button => {
//       button.addEventListener("click", () => {
//         const digit = button.dataset.key;
//         const action = button.dataset.action;
//         if (digit !== undefined) appendDigit(digit);
//         if (action === "backspace") backspace();
//         if (action === "submit") submit();
//       });
//     });

//     window.addEventListener("keydown", event => {
//       if (!document.getElementById("puzzleScene").classList.contains("active")) return;
//       if (/^\d$/.test(event.key)) appendDigit(event.key);
//       if (event.key === "Backspace") backspace();
//       if (event.key === "Enter") submit();
//     });

//     renderQuestion();
//   }

//   return { init };
// })();




// Greeting Web 1.0.01
// Puzzle logic
// User langsung submit ketika memilih angka.

const Puzzle = (() => {

  const TARGET_CODE = [3, 7, 5];

  const state = {
    index: 0,
    question: null,
    locked: false
  };

  const els = {};

  // ==========================================
  // GENERATE RANDOM QUESTION
  // ==========================================

  function randomQuestionForAnswer(answer) {

    const candidates = [];

    for (let a = 0; a <= 9; a++) {
      for (let b = 0; b <= 9; b++) {

        // Penjumlahan
        if (a + b === answer) {
          candidates.push({
            a,
            b,
            op: "+"
          });
        }

        // Pengurangan
        if (a - b === answer) {
          candidates.push({
            a,
            b,
            op: "-"
          });
        }

        // Pengurangan terbalik
        if (b - a === answer) {
          candidates.push({
            a: b,
            b: a,
            op: "-"
          });
        }
      }
    }

    // Hindari soal seperti 0 + 3
    const filtered = candidates.filter(
      q => q.a !== 0 && q.b !== 0
    );

    const pool = filtered.length
      ? filtered
      : candidates;

    return pool[
      Math.floor(Math.random() * pool.length)
    ];
  }


  // ==========================================
  // RENDER QUESTION
  // ==========================================

  function renderQuestion() {

    const target = TARGET_CODE[state.index];

    state.question =
      randomQuestionForAnswer(target);

    state.locked = false;

    els.questionNumber.textContent =
      String(state.index + 1);

    els.questionText.textContent =
      `${state.question.a} ${state.question.op} ${state.question.b} = ?`;

    els.feedback.textContent = "";

    els.feedback.className =
      "feedback";


    // Update progress
    els.progressDots.forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === state.index
      );

      dot.classList.toggle(
        "done",
        i < state.index
      );

    });
  }


  // ==========================================
  // HANDLE ANSWER
  // ==========================================

  function handleAnswer(selectedNumber) {

    // Mencegah double click ketika sedang
    // menjalankan animasi feedback.
    if (state.locked) return;

    const expected =
      TARGET_CODE[state.index];


    // ========================================
    // JAWABAN BENAR
    // ========================================

    if (selectedNumber === expected) {

      state.locked = true;

      els.feedback.textContent =
        "Benar! ✨";

      els.feedback.className =
        "feedback success";


      // Tandai progress selesai
      els.progressDots[state.index]
        .classList.remove("active");

      els.progressDots[state.index]
        .classList.add("done");


      // Jika semua soal selesai
      if (state.index === TARGET_CODE.length - 1) {

        setTimeout(() => {

          window.dispatchEvent(
            new CustomEvent("puzzle:complete")
          );

        }, 650);

        return;
      }


      // Lanjut ke progress berikutnya
      setTimeout(() => {

        state.index++;

        renderQuestion();

      }, 650);

    }


    // ========================================
    // JAWABAN SALAH
    // ========================================

    else {

      els.feedback.textContent =
        "Oops, coba lagi! 💕";

      els.feedback.className =
        "feedback error";


      // Animasi shake keypad
      els.keypad.classList.remove("shake");

      void els.keypad.offsetWidth;

      els.keypad.classList.add("shake");


      // Animasi tombol yang diklik
      const wrongButton =
        document.querySelector(
          `.key[data-key="${selectedNumber}"]`
        );

      if (wrongButton) {

        wrongButton.classList.remove(
          "wrong-answer"
        );

        void wrongButton.offsetWidth;

        wrongButton.classList.add(
          "wrong-answer"
        );
      }


      // ======================================
      // SOAL DI-RESET
      // TAPI INDEX TIDAK BERUBAH
      // ======================================

      setTimeout(() => {

        renderQuestion();

      }, 650);
    }
  }


  // ==========================================
  // INIT
  // ==========================================

  function init() {

    els.puzzleCard =
      document.querySelector(".puzzle-card");

    els.keypad =
      document.querySelector(".keypad");

    els.questionNumber =
      document.getElementById(
        "questionNumber"
      );

    els.questionText =
      document.getElementById(
        "questionText"
      );

    els.feedback =
      document.getElementById(
        "feedback"
      );

    els.progressDots =
      [
        ...document.querySelectorAll(
          ".progress-dot"
        )
      ];


    // ========================================
    // KEYPAD
    // ========================================

    document.querySelectorAll(
      ".key[data-key]"
    ).forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const number =
            Number(button.dataset.key);

          handleAnswer(number);

        }
      );

    });


    // ========================================
    // PHYSICAL KEYBOARD
    // ========================================

    window.addEventListener(
      "keydown",
      event => {

        if (
          !document
            .getElementById("puzzleScene")
            .classList
            .contains("active")
        ) {
          return;
        }


        if (/^\d$/.test(event.key)) {

          handleAnswer(
            Number(event.key)
          );

        }

      }
    );


    // Soal pertama
    renderQuestion();
  }


  return {
    init
  };

})();

export default Puzzle