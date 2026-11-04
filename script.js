const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = [];

    for (let x = 0; x < width; x += 32) {
        for (let y = 0; y < height; y += 32) {
            particles.push({
                x, y,
                baseX: x,
                baseY: y,
                vx: 0,
                vy: 0
            });
        }
    }
}

window.addEventListener("resize", resize);

window.addEventListener("pointermove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("pointerout", e => {
    if (!e.relatedTarget) {
        mouse.x = -1000;
        mouse.y = -1000;
    }
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 170 && distance > 0) {
            const force = (170 - distance) / 170;
            p.vx += dx / distance * force * 0.7;
            p.vy += dy / distance * force * 0.7;
        }

        p.vx += (p.baseX - p.x) * 0.025;
        p.vy += (p.baseY - p.y) * 0.025;

        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        const glow = Math.max(0, 1 - distance / 170);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + glow, 0, Math.PI * 2);
        ctx.fillStyle =
            `rgba(255, ${115 + glow * 50}, 45, ${0.25 + glow * 0.65})`;
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

resize();
animate();

// TERMINAL

const form = document.getElementById("terminalForm");
const input = document.getElementById("command");
const output = document.getElementById("output");

const skullCount = document.getElementById("skullCount");
const threatLevel = document.getElementById("threatLevel");
const toast = document.getElementById("toast");

let skulls = 777;
let history = [];
let historyIndex = 0;
let toastTimer;

function print(message = "") {
    output.textContent += message + "\n";
    output.scrollTop = output.scrollHeight;
}

function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

const skeleton = String.raw`
       .-.
      (o.o)
       |=|
      __|__
    //.=|=.\\
   // .=|=. \\
   \\(_=_)//
    (:| |:)
     || ||
     () ()
     || ||
     || ||
    ==' '==
`;

const fortunes = [
    "THE BONES YOU SEEK ARE ALREADY IN YOUR CLOSET.",
    "A QUIET KEYBOARD HIDES A LOUD SKELETON.",
    "777 DOORS. ONE IS UNLOCKED. GOOD LUCK.",
    "THE NEXT BUG IS WATCHING YOU.",
    "SOMEWHERE, A SEMICOLON IS MISSING."
];

const commands = {
    help: () => `AVAILABLE COMMANDS
------------------
help       list commands
about      information about this crypt
skele      print a skeleton
skull      display a skull
dance      skeleton dance
matrix     enter the void
scan       simulated scan
status     show system status
whoami     identify yourself
projects   list projects
fortune    receive a dark fortune
secret     reveal a hidden message
hello      greet the skeletons
jumpscare  definitely don't run this
clear      clear terminal
echo       print your own message
addskull   increase the skull count`,

    about: () =>
        "TheUknowskeleton_ // BUILD 777\nA spooky hacker hideout.",

    skele: () => skeleton,

    skull: () => `       .-.
      (o.o)
       |=|
      __|__
     /|   |\\
    (_|   |_)
      /   \\
     _|   |_`,

    dance: () => `(\\__/)
 ( •ᴗ•)  ♪
 / >🦴   ♪

THE SKELETON HAS MOVES.`,

    matrix: () => `01010111 01000101 01001100 01000011 01001111 01001101 01000101
10100101 01011010 11001010 01101001 01010101 10010110
01010100 01001000 01000101 00100000 01010110 01001111 01001001 01000100

THE VOID STARES BACK.`,

    scan: () => `STARTING SIMULATED SCAN...
[####................] 20%
[########............] 40%
[############........] 60%
[################....] 80%
[####################] 100%

SCAN COMPLETE.
No actual network was scanned.`,

    status: () => `CRYPT STATUS: ONLINE
SITE BUILD: 777
PARTICLE FIELD: ACTIVE
TERMINAL: ACTIVE
JAVASCRIPT: RUNNING
C# API: OPTIONAL`,

    whoami: () =>
        "YOU ARE THE VISITOR.\nYOUR CLEARANCE LEVEL: QUESTIONABLE.",

    projects: () => `PROJECT ARCHIVE
[01] PYTHON EXPERIMENTS
[02] NASM 64-BIT ASSEMBLY LAB
[03] THE CRYPT WEB INTERFACE`,

    fortune: () =>
        fortunes[Math.floor(Math.random() * fortunes.length)],

    secret: () => `YOU FOUND THE SECRET.

THE NUMBER IS 777.
THE SKELETONS HAVE BEEN EXPECTING YOU.`,

    hello: () =>
        "THE SKELETONS SAY HELLO. THEY WOULD SHAKE YOUR HAND, BUT...",

    jumpscare: () =>
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAA!\n\nJUST KIDDING. PROBABLY."
};

async function runCommand(raw) {
    const cmd = raw.trim();

    if (!cmd) return;

    print("root@crypt:~$ " + cmd);

    history.push(cmd);
    historyIndex = history.length;

    const lower = cmd.toLowerCase();

    if (lower === "clear" || lower === "cls") {
        output.textContent = "";
        return;
    }

    if (lower === "echo" || lower.startsWith("echo ")) {
        print(cmd.slice(4).trim());
        return;
    }

    if (lower.startsWith("addskull ")) {
        const amount = Number(lower.slice(9));

        if (Number.isInteger(amount) && amount > 0 && amount <= 10000) {
            skulls += amount;
            skullCount.textContent = skulls;
            print(`ADDED ${amount} SKULL(S). TOTAL: ${skulls}`);
        } else {
            print("USAGE: addskull <number from 1 to 10000>");
        }
        return;
    }

    if (commands[lower]) {
        if (lower === "skele") {
            skulls++;
            skullCount.textContent = skulls;
        }

        if (lower === "jumpscare") {
            threatLevel.textContent = "???";
            document.body.classList.add("scare");
            setTimeout(() => {
                document.body.classList.remove("scare");
                threatLevel.textContent = "LOW";
            }, 450);
        }

        print(commands[lower]());
        return;
    }

    // Optional C# backend. Local commands still work without it.
    try {
        const response = await fetch("/api/terminal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ command: cmd })
        });

        if (!response.ok) {
            throw new Error("Backend unavailable");
        }

        const data = await response.json();
        print(data.output ?? "THE BACKEND RETURNED NO OUTPUT.");
    } catch {
        print(`UNKNOWN COMMAND: ${cmd}`);
        print('TYPE "help" TO SEE AVAILABLE COMMANDS.');
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const cmd = input.value;
    input.value = "";

    await runCommand(cmd);
});

document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("click", () => {
        runCommand(button.dataset.command);
        input.focus();
    });
});

document.getElementById("summonButton").addEventListener("click", () => {
    runCommand("skele");
    notify("A SKELETON HAS BEEN SUMMONED.");
    document.getElementById("terminal").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("fortuneButton").addEventListener("click", () => {
    runCommand("fortune");
    document.getElementById("terminal").scrollIntoView({
        behavior: "smooth"
    });
});

// Arrow keys recall previous commands.
input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
        e.preventDefault();
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = history[historyIndex] || "";
    }
});

// Live clock.
function updateClock() {
    const now = new Date().toLocaleTimeString();

    document.getElementById("systemClock").textContent = now;
    document.getElementById("heroClock").textContent = now;
}

updateClock();
setInterval(updateClock, 1000);
