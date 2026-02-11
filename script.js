const starter = {
  javascript: `// JS Starter\nconsole.log("Hello Chaos!");`,
  python: `# Python Starter\nprint("Hello Chaos!")`,
  cpp: `// C++ Starter\n#include <iostream>\nusing namespace std;\nint main(){ \n\tcout<<"Hello Chaos!"; \n\treturn 0; \n}`
};

const errors = [
  "SyntaxError: Unexpected 'success' near line 42",
  "RuntimeError: Infinite loop of regret detected.",
  "Segmentation fault: You blinked too fast.",
  "SyntaxError: 'fun' is not defined.",
  "MemoryLeakError: Your code is crying.",
  "TypeError: Expected genius, got confusion.",
  "StackOverflow: Your logic fell down the stairs.",
  "Warning: You fixed one bug and created three.",
  "FatalError: Coffee not found ☕"
];

const sarcasm = [
  "Probably running fine. Probably.",
  "Looks okay... if you squint hard enough.",
  "It compiled! That’s suspicious.",
  "Wow, zero errors? Impossible.",
  "Your code runs on pure chaos energy.",
  "Working as intended... maybe?",
  "Error: You're too optimistic."
];

let countdown = 15;
let timer;
const cdEl = document.getElementById("countdown");
const logEl = document.getElementById("consoleLog");
const outputBox = document.getElementById("outputBox");
const langSelect = document.getElementById("langSelect");

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setValue(starter.python, -1);

let baseCode = starter.python;
let isCorrupted = false;
let suppressChange = false;

function setEditorValue(value) {
  suppressChange = true;
  editor.setValue(value, -1);
  suppressChange = false;
}

function log(msg) {
  if (logEl.textContent.length > 0) {
    logEl.textContent += "\n";
  }
  logEl.textContent += msg;
  logEl.scrollTop = logEl.scrollHeight;
}

function setOutputPlaceholder() {
  outputBox.textContent = "Nothing yet. Try running or giving up 😈";
}

function setOutput(message, output, messageClass) {
  outputBox.innerHTML = "";
  if (message) {
    const msgEl = document.createElement("div");
    if (messageClass) {
      msgEl.className = messageClass;
    }
    msgEl.textContent = message;
    outputBox.appendChild(msgEl);
  }
  if (output !== undefined && output !== null && output !== "") {
    const outEl = document.createElement("div");
    outEl.className = "correctOutput";
    outEl.textContent = String(output);
    outputBox.appendChild(outEl);
  }
}

function startTimer() {
  countdown = 15;
  cdEl.textContent = countdown;
  clearInterval(timer);
  timer = setInterval(() => {
    countdown--;
    cdEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      runCode(true);
    }
  }, 1000);
}

function corruptCode(code) {
  const pos = Math.floor(Math.random() * code.length);
  const insert = ["#", "@", "!", "???", "// oops"][Math.floor(Math.random() * 5)];
  return code.slice(0, pos) + insert + code.slice(pos);
}

function emulateCpp(code) {
  let output = "";
  code.split("\n").forEach((line) => {
    if (line.includes("cout<<")) {
      const val = line
        .split("<<")[1]
        .replace(/;/g, "")
        .replace(/"/g, "");
      output += val + "\n";
    }
  });
  return output.trim();
}

function runJavascript(code) {
  const logs = [];
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  const push = (prefix, args) => {
    const parts = args.map((arg) =>
      typeof arg === "string" ? arg : JSON.stringify(arg)
    );
    logs.push(prefix + parts.join(" "));
  };

  console.log = (...args) => push("", args);
  console.warn = (...args) => push("Warn: ", args);
  console.error = (...args) => push("Error: ", args);

  try {
    const fn = new Function(code);
    const result = fn();
    if (result !== undefined) {
      logs.push(String(result));
    }
  } catch (e) {
    logs.push(e.toString());
  } finally {
    console.log = original.log;
    console.warn = original.warn;
    console.error = original.error;
  }

  return logs.join("\n");
}

function skulptRead(path) {
  if (window.Sk && Sk.builtinFiles && Sk.builtinFiles.files[path]) {
    return Sk.builtinFiles.files[path];
  }
  throw new Error("File not found: " + path);
}

async function runPython(code) {
  if (window.Sk) {
    let output = "";
    Sk.configure({
      output: (text) => {
        output += text;
      },
      read: skulptRead
    });
    try {
      await Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, code, true)
      );
      return output.trim();
    } catch (e) {
      return e.toString();
    }
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if (!response.ok) {
      return `Server error: ${response.status}`;
    }
    const data = await response.json();
    return (data && data.output) || "";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Error connecting to the Python server. Is it running?";
  }
}

async function runCode(auto = false) {
  const lang = langSelect.value;
  const code = editor.getValue();

  if (!auto) {
    const err = errors[Math.floor(Math.random() * errors.length)];
    const sar = sarcasm[Math.floor(Math.random() * sarcasm.length)];
    log("💥 " + err);
    setOutput(sar, "", "sarcastic");
    if (!isCorrupted) {
      baseCode = code;
    }
    setEditorValue(corruptCode(code));
    isCorrupted = true;
    startTimer();
    return;
  }

  setEditorValue(baseCode);
  isCorrupted = false;
  let correctOutput = "";

  if (lang === "javascript") {
    correctOutput = runJavascript(baseCode);
  } else if (lang === "python") {
    correctOutput = await runPython(baseCode);
  } else if (lang === "cpp") {
    correctOutput = emulateCpp(baseCode);
  }

  const displayOutput =
    correctOutput === "" ? "(no output)" : correctOutput;
  setOutput("Ahhhhhh! I won! Now the output is:", displayOutput, "correctMsg");
  log("✅ Auto-correct executed, showing real output.");
}

document.getElementById("runBtn").onclick = () => runCode(false);
document.getElementById("giveUpBtn").onclick = () => {
  clearInterval(timer);
  runCode(true);
  log("You gave up. Auto-fix reveals itself.");
};

document.getElementById("resetBtn").onclick = () => {
  clearInterval(timer);
  const lang = langSelect.value;
  setEditorValue(starter[lang]);
  editor.session.setMode(
    lang === "javascript"
      ? "ace/mode/javascript"
      : lang === "python"
      ? "ace/mode/python"
      : "ace/mode/c_cpp"
  );
  baseCode = starter[lang];
  isCorrupted = false;
  setOutputPlaceholder();
  cdEl.textContent = "15";
  log("Editor reset. Fresh chaos awaits.");
};

langSelect.addEventListener("change", () => {
  clearInterval(timer);
  const lang = langSelect.value;
  editor.session.setMode(
    lang === "javascript"
      ? "ace/mode/javascript"
      : lang === "python"
      ? "ace/mode/python"
      : "ace/mode/c_cpp"
  );
  setEditorValue(starter[lang]);
  baseCode = starter[lang];
  isCorrupted = false;
  setOutputPlaceholder();
  cdEl.textContent = "15";
  log("Language switched to " + lang.toUpperCase() + ". Prepare for chaos.");
});

editor.session.on("change", () => {
  if (suppressChange) {
    return;
  }
  baseCode = editor.getValue();
  isCorrupted = false;
});

log("Language switched to PYTHON. Prepare for chaos.");
