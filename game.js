console.log("GAME.JS FILE LOADED");

const GameState = {
    currentSceneId: null,
    foundFragments: {},
    branchChoice: null,
    viewer: null,
    flashlight: { x: 0, y: 0 },
    lastTouch: null
};

// --- AUDIO MANAGER ---
const AudioManager = {
    ambient: new Audio("ambient_horror.mp3"),
    typing: new Audio("typing.mp3"),
    click: new Audio("clickmp3.mp3"),
    init: function () {
        this.ambient.loop = true;
        this.ambient.volume = 0.3;
    },
    playAmbient: function () {
        this.ambient.play().catch(e => console.log("Audio play blocked", e));
    },
    playTyping: function () {
        // Only play if not already playing or to overlap (depending on file type)
        // For a long typing loop file:
        if (this.typing.paused) this.typing.play().catch(() => { });
    },
    stopTyping: function () {
        this.typing.pause();
        this.typing.currentTime = 0;
    },
    playClick: function () {
        this.click.currentTime = 0;
        this.click.play().catch(() => { });
    }
};
AudioManager.init();

window.addEventListener('load', () => {
    // 1. Setup Flashlight tracking
    // Initialize to center
    GameState.flashlight = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    updateFlashlightDOM(GameState.flashlight.x, GameState.flashlight.y);

    // Mouse (Desktop) - Absolute position
    document.addEventListener("mousemove", (e) => {
        GameState.flashlight.x = e.clientX;
        GameState.flashlight.y = e.clientY;
        updateFlashlightDOM(e.clientX, e.clientY);
    });

    // 2. Button Listeners
    document.getElementById("venture-btn").addEventListener("click", onVentureClicked);
    document.getElementById("open-code-panel").addEventListener("click", openCodeModal);
    document.getElementById("close-code").addEventListener("click", () => document.getElementById("code-modal").classList.add("hidden"));
    document.getElementById("clear-code").addEventListener("click", clearCodeInput);
    document.getElementById("submit-code").addEventListener("click", submitCode);
    document.getElementById("branch-hale").addEventListener("click", () => handleBranchDecision('hale_cafe'));
    document.getElementById("branch-nicholson").addEventListener("click", () => handleBranchDecision('nicholson_rotunda'));
    document.getElementById("close-intel-btn").addEventListener("click", () => document.getElementById("intel-modal").classList.add("hidden"));

    // 3. Initialize Viewer (Hidden initially)
    initViewer();

    // 4. START SEQUENCE
    runOpeningSequence();
});

function runOpeningSequence() {
    // Phase 1: Intro Dialogue (5 seconds)
    const intro = document.getElementById("intro-dialogue");
    const title = document.getElementById("title-screen");

    // Wait for the CSS animation (5s) to finish
    setTimeout(() => {
        intro.classList.add("hidden");
        title.classList.remove("hidden"); // Show Title Screen
    }, 5000);
}

function onVentureClicked() {
    // Phase 2: User clicked "Venture if you dare"
    document.getElementById("title-screen").classList.add("hidden");

    // START AUDIO
    AudioManager.playAmbient();

    // Load the first scene (which triggers the Pre-Scene transition)
    // Check for save data, else start fresh
    const savedScene = localStorage.getItem("lightsOut_savedScene");
    const sceneToLoad = savedScene && SCENES[savedScene] ? savedScene : "wheatley_classroom";

    loadScene(sceneToLoad);
}

function initViewer() {
    GameState.viewer = pannellum.viewer("pano", {
        type: "equirectangular",
        panorama: "wheatley_classroom.jpg",
        autoLoad: true,
        showControls: false, // Must be false to hide default UI
        yaw: 0, pitch: 0, hfov: 100, compass: false
    });
}

function updateFlashlightDOM(x, y) {
    const mask = document.getElementById("flashlight-mask");

    // Updates gradient position
    mask.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, transparent 10%, rgba(0, 0, 0, 0.98) 40%, black 100%)`;
}



// --- CORE GAME LOGIC ---

function loadScene(sceneId) {
    console.log(`Loading scene: ${sceneId}`);
    localStorage.setItem("lightsOut_savedScene", sceneId);
    GameState.currentSceneId = sceneId;
    const sceneData = SCENES[sceneId];

    // --- PHASE 3: PRE-SCENE TRANSITION ---
    const overlay = document.getElementById("transition-overlay");
    overlay.classList.remove("hidden"); // Show black overlay
    overlay.style.opacity = "1";

    // Clear previous text
    document.getElementById("transition-title").innerHTML = "";
    document.getElementById("transition-text").innerHTML = "";

    // Typewriter Effect
    typeWriter(sceneData.name, "transition-title", 100, () => {
        typeWriter(sceneData.description, "transition-text", 50, () => {
            // Wait 2 seconds after typing finishes, then reveal game
            setTimeout(() => {
                overlay.style.transition = "opacity 1s ease";
                overlay.style.opacity = "0";
                setTimeout(() => {
                    overlay.classList.add("hidden");
                }, 1000);
            }, 2000);
        });
    });

    // Init Logic for Fragments FIRST (before counter update)
    if (!GameState.foundFragments[sceneId]) {
        GameState.foundFragments[sceneId] = new Set();
    }

    // Update HUD Bottom (now safe because fragments are initialized)
    updateFragmentCounter();

    // Refresh viewer hotspots
    refreshViewerHotspots(sceneData);
}

function refreshViewerHotspots(sceneData) {
    if (GameState.viewer) GameState.viewer.destroy();

    console.log(`Refreshing Hotspots for ${sceneData.id}. Total defined: ${sceneData.hotspots.length}`); // DEBUG

    const hotspotsConfig = [];
    sceneData.hotspots.forEach(hs => {
        // Check if already found
        const isFound = GameState.foundFragments[GameState.currentSceneId].has(hs.fragmentId);

        if (!isFound) {
            const fragment = sceneData.fragments.find(f => f.id === hs.fragmentId);
            if (!fragment) {
                console.error(`ERROR: Fragment def missing for hotspot ${hs.fragmentId}`);
                return;
            }

            console.log(`Adding Hotspot: ${hs.fragmentId}, Value: ${fragment.value}`); // DEBUG

            hotspotsConfig.push({
                pitch: hs.pitch,
                yaw: hs.yaw,
                cssClass: "fragment-hotspot",
                createTooltipFunc: (hotSpotDiv) => {
                    hotSpotDiv.innerHTML = `<img src="no${fragment.value}.png" style="width: 25px; height: auto; display: block;">`;
                },
                clickHandlerFunc: (evt) => onFragmentFound(hs.fragmentId, evt)
            });
        } else {
            console.log(`Skipping found fragment: ${hs.fragmentId}`);
        }
    });

    console.log("Hotspot Config:", hotspotsConfig); // DEBUG

    GameState.viewer = pannellum.viewer("pano", {
        type: "equirectangular",
        panorama: sceneData.image,
        autoLoad: true,
        showControls: false,
        yaw: 0, pitch: 0, hfov: 100, compass: false,
        hotSpots: hotspotsConfig
    });
}

function typeWriter(text, elementId, speed, callback) {
    const elem = document.getElementById(elementId);
    elem.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            elem.innerHTML += text.charAt(i);
            // Continuous sound trigger (safe for both single hits or loops)
            AudioManager.playTyping();
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            AudioManager.stopTyping(); // STOP SOUND IMMEDIATELY
            callback();
        }
    }
    type();
}

function onFragmentFound(fragmentId, evt) {
    const target = evt.target || evt.srcElement;
    GameState.foundFragments[GameState.currentSceneId].add(fragmentId);
    target.style.display = 'none'; // Hide immediately
    updateFragmentCounter();
    checkAllFragmentsFound();
}

function updateFragmentCounter() {
    const sceneId = GameState.currentSceneId;
    if (!SCENES[sceneId]) return;
    const found = GameState.foundFragments[sceneId].size;
    const total = SCENES[sceneId].totalFragments;
    document.getElementById("fragment-count").innerText = `${found}/${total} Fragments`;
}

function checkAllFragmentsFound() {
    const sceneId = GameState.currentSceneId;
    const found = GameState.foundFragments[sceneId].size;
    const total = SCENES[sceneId].totalFragments;

    if (found >= total) {
        const btn = document.getElementById("open-code-panel");
        btn.disabled = false;
        btn.innerHTML = "ENTER CODE 🔓";
        btn.classList.add("pulse");
    }
}

// --- MODAL & BRANCH LOGIC (Keep your existing functions for Code Entry here) ---
// [Paste your existing openCodeModal, submitCode, etc. here]
// I have omitted them for brevity, but they should remain unchanged unless you want visual tweaks.
// Ensure you include the variable `let currentInput = [];`
let currentInput = [];

function openCodeModal() {
    if (document.getElementById("open-code-panel").disabled) return;

    const sceneData = SCENES[GameState.currentSceneId];
    const modal = document.getElementById("code-modal");

    // Initialize input array
    if (!currentInput.length || currentInput.length !== sceneData.finalCode.length) {
        currentInput = new Array(sceneData.finalCode.length).fill("");
    }

    // Clear previous state
    document.getElementById("code-input").value = currentInput.map(c => c || "_").join(" ");
    document.getElementById("code-feedback").innerText = "";

    // Render fragment buttons
    renderCodeButtons();

    // Show modal
    modal.classList.remove("hidden");
}

// Helper to re-render buttons (Moved from your old monolithic code)
function renderCodeButtons() {
    const sceneData = SCENES[GameState.currentSceneId];
    if (!currentInput.length) currentInput = new Array(sceneData.finalCode.length).fill("");

    const container = document.getElementById("collected-fragments");
    container.innerHTML = "";

    sceneData.fragments.forEach(frag => {
        const btn = document.createElement("button");
        btn.className = "frag-btn";
        btn.innerHTML = `<img src="no${frag.value}.png" />`;
        btn.onclick = () => {
            AudioManager.playClick(); // SFX
            const emptyIndex = currentInput.findIndex(val => val === "");
            if (emptyIndex !== -1) {
                currentInput[emptyIndex] = frag.value;
                document.getElementById("code-input").value = currentInput.join(" ");
            }
        };
        container.appendChild(btn);
    });
}

function clearCodeInput() {
    const sceneData = SCENES[GameState.currentSceneId];
    currentInput = new Array(sceneData.finalCode.length).fill("");
    document.getElementById("code-input").value = "_ _ _";
}

function submitCode() {
    const sceneData = SCENES[GameState.currentSceneId];
    const finalCode = sceneData.finalCode;

    // Check correctness per slot
    let isComplete = true;
    let isCorrect = true;

    // Create new input state preserving only correct digits
    const newInput = currentInput.map((char, index) => {
        if (char === "") {
            isComplete = false;
            return "";
        }
        if (char === finalCode[index]) {
            return char; // Keep correct
        } else {
            isCorrect = false;
            return ""; // Remove wrong
        }
    });

    currentInput = newInput;
    document.getElementById("code-input").value = currentInput.join(" ");

    if (isComplete && isCorrect) {
        // Success
        console.log("CODE CORRECT! Triggering success..."); // DEBUG
        document.getElementById("code-feedback").style.color = "var(--success)";
        document.getElementById("code-feedback").innerText = "ACCESS GRANTED";
        setTimeout(() => {
            document.getElementById("code-modal").classList.add("hidden");
            console.log("Calling handleSceneSuccess()"); // DEBUG
            handleSceneSuccess();
        }, 1000);
    } else {
        // Fail
        console.log(`CODE INCORRECT - Complete: ${isComplete}, Correct: ${isCorrect}`); // DEBUG
        document.getElementById("code-feedback").style.color = "var(--error)";
        document.getElementById("code-feedback").innerText = "INCORRECT ENTRIES REMOVED";
        const display = document.getElementById("lcd-display");
        display.classList.add("shake");
        setTimeout(() => display.classList.remove("shake"), 500);
    }
}

function handleSceneSuccess() {
    const sceneData = SCENES[GameState.currentSceneId];
    console.log(`handleSceneSuccess called for ${GameState.currentSceneId}`); // DEBUG
    console.log(`Next scene: ${sceneData.nextScene}`); // DEBUG

    if (sceneData.nextScene === "BRANCH_DECISION") {
        console.log("Showing branch modal"); // DEBUG
        showBranchModal();
    } else if (sceneData.nextScene === null) {
        console.log("END GAME - calling showEndGame()"); // DEBUG
        showEndGame();
    } else {
        console.log(`Transitioning to: ${sceneData.nextScene}`); // DEBUG
        transitionToScene(sceneData.nextScene);
    }
}

function transitionToScene(nextSceneId) {
    const overlay = document.getElementById("transition-overlay");
    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";

    // Update text
    document.getElementById("transition-title").innerText = "LOADING...";
    document.getElementById("transition-text").innerText = "You come to… but not where you were...";
    document.getElementById("start-btn").style.display = "none";

    // Wait then load
    setTimeout(() => {
        loadScene(nextSceneId);
    }, 2000);
}

// --- Branching Logic ---
function showBranchModal() {
    document.getElementById("branch-modal").classList.remove("hidden");
}

function handleBranchDecision(choice) {
    GameState.branchChoice = choice;
    localStorage.setItem("lightsOut_branchChoice", choice); // Save choice
    document.getElementById("branch-modal").classList.add("hidden");

    if (choice === 'hale_cafe') {
        loadScene("hale_cafe");
    } else {
        loadScene("nicholson_rotunda");
    }
}

// --- End Game ---
function showEndGame() {
    const overlay = document.getElementById("transition-overlay");
    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";

    document.getElementById("transition-title").innerText = "The lights return… but the truth doesn’t.";

    let pathText = "You navigated the blackout successfully.";
    if (GameState.branchChoice === 'hale_cafe') {
        pathText += " You can see again. But you still don’t understand what happened.";
    } else {
        pathText += "And somewhere deep in the building… the blackout hums again.";
    }

    document.getElementById("transition-text").innerText = pathText;

    const btn = document.getElementById("start-btn");
    btn.style.display = "block";
    btn.innerText = "PLAY AGAIN";
    btn.classList.remove("hidden");
    btn.onclick = () => {
        localStorage.removeItem("lightsOut_savedScene");
        window.location.reload();
    };
}

function showIntelModal(message, value) {
    const modal = document.getElementById("intel-modal");
    document.getElementById("intel-message").innerHTML = message;
    document.getElementById("intel-image-container").innerHTML = `<img src="no${value}.png" style="width: 100px; height: auto; filter: drop-shadow(0 0 10px var(--success));">`;
    modal.classList.remove("hidden");
}
