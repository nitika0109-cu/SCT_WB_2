const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const historyList = document.getElementById("history-list");
const clickSound = document.getElementById("click-sound");
const themeToggle = document.getElementById("theme-toggle");
const animationToggle = document.getElementById("animation-toggle");
const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

let expression = "";
let history = [];
let useAltAnimation = false;
let soundEnabled = true;

// Handle button clicks
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (soundEnabled) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 150);

    const value = btn.textContent;

    if (btn.id === "clear") {
      expression = "";
    } else if (value === "=" || btn.id === "equals") {
      try {
        const result = eval(expression
          .replace("√", "Math.sqrt")
          .replace("^", "**")
          .replace(/log/g, "Math.log10")
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan"));

        const resultStr = result.toString();
        display.classList.add("flash");
        setTimeout(() => display.classList.remove("flash"), 250);

        addToHistory(`${expression} = ${resultStr}`);
        expression = resultStr;
      } catch {
        expression = "Error";
        display.classList.add("shake");
        setTimeout(() => display.classList.remove("shake"), 500);
      }
    } else {
      expression += value;
    }

    display.value = expression;
  });
});

function addToHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyList.appendChild(li);

  // Limit to 6 history items
  if (historyList.children.length > 6) {
    historyList.removeChild(historyList.firstChild);
  }
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.classList.toggle("active");
});

// Animation toggle
animationToggle.addEventListener("click", () => {
  useAltAnimation = !useAltAnimation;
  animationToggle.classList.toggle("active");
});

// Sound toggle (optional)
const soundToggle = document.getElementById("sound-toggle");
if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
  });
}

// Canvas animation setup
let symbols = [];
const chars = ['+', '-', '*', '/', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '=', '^', '√'];

function initSymbols(count) {
  symbols = [];
  for (let i = 0; i < count; i++) {
    symbols.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: chars[Math.floor(Math.random() * chars.length)],
      size: Math.random() * 24 + 12,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
    });
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initSymbols(60);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let sym of symbols) {
    ctx.fillStyle = useAltAnimation ? "#ff4081" : "#6c63ff";
    ctx.font = `${sym.size}px monospace`;
    ctx.fillText(sym.char, sym.x, sym.y);

    sym.x += sym.dx;
    sym.y += sym.dy;

    if (sym.x < 0 || sym.x > canvas.width) sym.dx *= -1;
    if (sym.y < 0 || sym.y > canvas.height) sym.dy *= -1;
  }
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();
