const starter = {
  javascript:`// JS Starter\nconsole.log("Hello Chaos!");`,
  python:`# Python Starter\nprint("Hello Chaos!")`,
  cpp:`// C++ Starter\n#include <iostream>\nusing namespace std;\nint main(){ \n\tcout<<"Hello Chaos!"; \n\treturn 0; \n}`
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

let countdown=45, timer;
const cdEl=document.getElementById("countdown");
const logEl=document.getElementById("consoleLog");
const outputBox=document.getElementById("outputBox");
const langSelect=document.getElementById("langSelect");

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setValue(starter.python, -1);

let currentCode = starter.javascript;

function log(msg){
  logEl.innerHTML += "\n"+msg;
  logEl.scrollTop = logEl.scrollHeight;
}

function startTimer(){
  countdown=15;
  cdEl.textContent=countdown;
  clearInterval(timer);
  timer=setInterval(()=>{
    countdown--;
    cdEl.textContent=countdown;
    if(countdown<=0){ clearInterval(timer); runCode(true); }
  },1000);
}

function corruptCode(code){
  const pos=Math.floor(Math.random()*code.length);
  const insert=["#","@","!","???","// oops"][Math.floor(Math.random()*5)];
  return code.slice(0,pos)+insert+code.slice(pos);
}

// Python emulation
function emulatePython(code){
  let output="";
  let lines=code.split("\n").map(l=>l.trim()).filter(l=>l!=="");
  for(let l of lines){
    if(l.startsWith("print(")){
      let val=l.match(/print\((.*)\)/)[1].trim();
      val=val.replace(/["']/g,"");
      output+=val+"\n";
    } else if(l.startsWith("for ")){
      let m=l.match(/for (\w+) in \[(.*)\]:/);
      if(m){
        let arr=m[2].split(",").map(v=>v.trim().replace(/["']/g,""));
        for(let v of arr) output+=v+"\n";
      }
    } else if(l.startsWith("if ") || l.startsWith("else:")){
      // simple placeholder for if/else emulation
    }
  }
  return output;
}

// C++ emulation
function emulateCpp(code){
  let output="";
  code.split("\n").forEach(l=>{
    if(l.includes("cout<<")){
      let val=l.split("<<")[1].replace(/;/g,"").replace(/"/g,"");
      output+=val+"\n";
    }
  });
  return output;
}

// Run code logic
function runCode(auto=false){
  const lang=langSelect.value;
  const code=editor.getValue();

  if(!auto){
    const err=errors[Math.floor(Math.random()*errors.length)];
    const sar=sarcasm[Math.floor(Math.random()*sarcasm.length)];
    log("💥 "+err);
    outputBox.innerHTML=`<div class="sarcastic">${sar}</div>`;
    currentCode=code;
    editor.setValue(corruptCode(code),-1);
    startTimer();
  }else{
    editor.setValue(currentCode,-1);
    let correctOutput="";
    if(lang==="javascript"){
      try{ correctOutput=eval(currentCode)||""; }catch(e){ correctOutput=e.toString(); }
    } else if(lang==="python"){
      correctOutput=emulatePython(currentCode);
    } else if(lang==="cpp"){
      correctOutput=emulateCpp(currentCode);
    }
    outputBox.innerHTML=`<div class="correctMsg">Ahhhhhh! I won! Now the output is:</div>
                         <div class="correctOutput">${correctOutput}</div>`;
    log("✅ Auto-correct executed, showing real output.");
  }
}

// Event listeners
document.getElementById("runBtn").onclick = ()=> runCode(false);
document.getElementById("giveUpBtn").onclick = ()=>{
  clearInterval(timer);
  runCode(true);
  log("You gave up. Auto-fix reveals itself.");
};

document.getElementById("resetBtn").onclick = ()=>{
  clearInterval(timer);
  const lang=langSelect.value;
  editor.setValue(starter[lang],-1);
  editor.session.setMode(lang==="javascript"?"ace/mode/javascript":lang==="python"?"ace/mode/python":"ace/mode/c_cpp");
  currentCode=starter[lang];
  outputBox.innerHTML="Nothing yet. Try running or giving up 😈";
  cdEl.textContent="15";
  log("Editor reset. Fresh chaos awaits.");
};

// Language switch
langSelect.addEventListener("change", ()=>{
  const lang=langSelect.value;
  editor.session.setMode(lang==="javascript"?"ace/mode/javascript":lang==="python"?"ace/mode/python":"ace/mode/c_cpp");
  editor.setValue(starter[lang],-1);
  currentCode=starter[lang];
  outputBox.innerHTML="Nothing yet. Try running or giving up 😈";
  cdEl.textContent="15";
  log("Language switched to "+lang.toUpperCase()+". Prepare for chaos.");
});
