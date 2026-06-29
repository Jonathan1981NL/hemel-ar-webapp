const skyObjects = [
  {
    id: "sun",
    name: "Sun",
    type: "Star",
    az: 96,
    alt: 18,
    core: "core-sun",
    visual: "visual-sun",
    distance: "149.6m km",
    size: "1.39m km diameter",
    description: "The Sun is the star at the center of our solar system. It is shown here as a demo sky-dome object."
  },
  {
    id: "moon",
    name: "Moon",
    type: "Natural satellite",
    az: 128,
    alt: 31,
    core: "core-moon",
    visual: "visual-moon",
    distance: "384,400 km avg",
    size: "3,474 km diameter",
    description: "The Moon is Earth's natural satellite. In the next stage this will include real phase and live position."
  },
  {
    id: "mars",
    name: "Mars",
    type: "Planet",
    az: 178,
    alt: 8,
    core: "core-mars",
    visual: "visual-mars",
    distance: "~225m km avg",
    size: "6,779 km diameter",
    description: "Mars is the red planet, known for dust storms, polar caps and future exploration potential."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas giant",
    az: 236,
    alt: 26,
    core: "core-jupiter",
    visual: "visual-jupiter",
    distance: "~778m km avg",
    size: "139,820 km diameter",
    description: "Jupiter is the largest planet in the solar system. Its detail layer will later include moons and live visibility."
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Ringed planet",
    az: 294,
    alt: 15,
    core: "core-saturn",
    visual: "visual-saturn",
    distance: "~1.43bn km avg",
    size: "116,460 km diameter",
    description: "Saturn is known for its spectacular ring system. This object is added to make the sky layer feel richer."
  },
  {
    id: "blackhole",
    name: "Black Hole",
    type: "Deep-space layer",
    az: 342,
    alt: 42,
    core: "core-blackhole",
    visual: "visual-blackhole",
    distance: "Depends on object",
    size: "Depends on mass",
    description: "Black holes are not directly visible like planets. In this app they belong to a premium educational deep-space layer."
  }
];

const state = {
  cameraOn: false,
  motionOn: false,
  locationOn: false,
  heading: 96,
  pitch: 16,
  roll: 0,
  selected: null,
  demoSweep: false,
  demoStart: 0,
  stars: []
};

const el = {
  camera: document.getElementById("cameraFeed"),
  fallback: document.getElementById("cameraFallback"),
  skyLayer: document.getElementById("skyLayer"),
  starCanvas: document.getElementById("starCanvas"),
  start: document.getElementById("startButton"),
  startMini: document.getElementById("startButtonMini"),
  demo: document.getElementById("demoButton"),
  motion: document.getElementById("motionButton"),
  location: document.getElementById("locationButton"),
  what: document.getElementById("whatButton"),
  menu: document.getElementById("menuButton"),
  mission: document.getElementById("missionPanel"),
  closeMission: document.getElementById("closeMission"),
  sheet: document.getElementById("detailSheet"),
  closeSheet: document.getElementById("closeSheet"),
  visual: document.getElementById("detailVisual"),
  eyebrow: document.getElementById("detailEyebrow"),
  title: document.getElementById("detailTitle"),
  description: document.getElementById("detailDescription"),
  distance: document.getElementById("detailDistance"),
  size: document.getElementById("detailSize"),
  position: document.getElementById("detailPosition"),
  journey: document.getElementById("journeyButton"),
  guide: document.getElementById("guideText"),
  headingValue: document.getElementById("headingValue"),
  pitchValue: document.getElementById("pitchValue"),
  locationValue: document.getElementById("locationValue"),
  compassNeedle: document.getElementById("compassNeedle"),
  toast: document.getElementById("toast"),
  modeLabel: document.getElementById("modeLabel")
};

function normalizeAngle(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function shortestAngleDelta(target, current) {
  let delta = normalizeAngle(target) - normalizeAngle(current);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.remove("show"), 2200);
}

function buildSkyObjects() {
  el.skyLayer.innerHTML = "";
  skyObjects.forEach((obj) => {
    const button = document.createElement("button");
    button.className = "sky-object";
    button.type = "button";
    button.dataset.id = obj.id;
    button.innerHTML = `
      <span class="object-core ${obj.core}"></span>
      <span class="object-label"><strong>${obj.name}</strong><small>${obj.type}</small></span>
    `;
    button.addEventListener("click", () => selectObject(obj.id));
    el.skyLayer.appendChild(button);
  });
}

function renderSky() {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  const fovX = 72;
  const fovY = 58;

  skyObjects.forEach((obj) => {
    const node = el.skyLayer.querySelector(`[data-id="${obj.id}"]`);
    if (!node) return;

    const dx = shortestAngleDelta(obj.az, state.heading);
    const dy = obj.alt - state.pitch;

    const visible = Math.abs(dx) < fovX / 1.65 && Math.abs(dy) < fovY / 1.45;
    const x = 50 + (dx / (fovX / 2)) * 50;
    const y = 50 - (dy / (fovY / 2)) * 50;
    const edgeFade = Math.max(Math.abs(dx) / (fovX / 2), Math.abs(dy) / (fovY / 2));
    const scale = Math.max(0.72, 1.08 - edgeFade * 0.2);

    node.style.setProperty("--x", `${x}%`);
    node.style.setProperty("--y", `${y}%`);
    node.style.setProperty("--scale", `${scale}`);
    node.classList.toggle("visible", visible);
    node.classList.toggle("selected", state.selected === obj.id);
  });

  el.headingValue.textContent = `${Math.round(state.heading)}°`;
  el.pitchValue.textContent = `${Math.round(state.pitch)}°`;
  el.compassNeedle.style.transform = `translateX(${shortestAngleDelta(0, state.heading) * -1.2}px)`;
  drawStars();
  window.requestAnimationFrame(renderSky);
}

function selectObject(id) {
  const obj = skyObjects.find((item) => item.id === id);
  if (!obj) return;

  state.selected = id;
  el.eyebrow.textContent = obj.type;
  el.title.textContent = obj.name;
  el.description.textContent = obj.description;
  el.distance.textContent = obj.distance;
  el.size.textContent = obj.size;
  el.position.textContent = `Az ${obj.az}° / Alt ${obj.alt}°`;
  el.visual.className = `detail-visual ${obj.visual}`;
  el.sheet.classList.add("open");

  el.guide.textContent = `${obj.name} selected. The detail panel stays inside the AR screen, so you do not leave the camera experience.`;
  showToast(`${obj.name} selected`);
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast("Camera not supported in this browser");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    el.camera.srcObject = stream;
    el.camera.style.display = "block";
    el.fallback.classList.add("hidden");
    state.cameraOn = true;
    el.modeLabel.textContent = "Camera active";
    showToast("AR camera active");
  } catch (error) {
    showToast("Camera permission denied");
  }
}

async function enableMotion() {
  try {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        showToast("Motion permission denied");
        return;
      }
    }

    window.addEventListener("deviceorientation", onOrientation, true);
    state.motionOn = true;
    state.demoSweep = false;
    el.modeLabel.textContent = "Motion sky-dome active";
    showToast("Motion tracking enabled");
  } catch (error) {
    showToast("Motion unavailable on this device");
  }
}

function onOrientation(event) {
  if (typeof event.alpha === "number") {
    state.heading = normalizeAngle(event.alpha);
  }

  if (typeof event.beta === "number") {
    const pitch = 90 - Math.abs(event.beta);
    state.pitch = Math.max(-20, Math.min(70, pitch));
  }

  if (typeof event.gamma === "number") {
    state.roll = event.gamma;
  }
}

function enableLocation() {
  if (!navigator.geolocation) {
    showToast("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.locationOn = true;
      el.locationValue.textContent = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
      showToast("Location enabled");
    },
    () => showToast("Location permission denied"),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function startDemoSweep() {
  state.demoSweep = !state.demoSweep;
  state.demoStart = performance.now();
  if (state.demoSweep) {
    el.fallback.classList.add("hidden");
    showToast("Demo sweep active");
    el.modeLabel.textContent = "Demo sweep active";
  } else {
    showToast("Demo sweep paused");
  }
}

function updateDemoSweep(time) {
  if (state.demoSweep && !state.motionOn) {
    const t = (time - state.demoStart) / 1000;
    state.heading = normalizeAngle(96 + Math.sin(t * 0.34) * 170 + t * 6);
    state.pitch = 22 + Math.sin(t * 0.72) * 18;
  }
  window.requestAnimationFrame(updateDemoSweep);
}

function explainCurrentView() {
  const inView = skyObjects
    .map((obj) => ({ obj, dx: Math.abs(shortestAngleDelta(obj.az, state.heading)), dy: Math.abs(obj.alt - state.pitch) }))
    .filter((item) => item.dx < 44 && item.dy < 34)
    .sort((a, b) => (a.dx + a.dy) - (b.dx + b.dy))
    .map((item) => item.obj.name);

  if (inView.length) {
    el.guide.textContent = `In this demo sky direction you are near: ${inView.join(", ")}. Stage 1D will replace demo positions with real astronomical calculations.`;
  } else {
    el.guide.textContent = "No demo object is centered right now. Slowly pan left or right and the augmented objects will enter the camera view.";
  }
  showToast("Guide updated");
}

function startJourney() {
  const selected = skyObjects.find((item) => item.id === state.selected);
  if (!selected) return;
  el.guide.textContent = `Cosmic Journey preview: travelling to ${selected.name}. Next stage can turn this into a premium scale-and-distance simulator.`;
  showToast("Journey preview queued");
}

function setupStars() {
  const canvas = el.starCanvas;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  state.stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.25,
    a: Math.random() * 0.7 + 0.25
  }));
}

function drawStars() {
  const canvas = el.starCanvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(ratio, ratio);

  const parallaxX = shortestAngleDelta(state.heading, 180) * 0.4;
  const parallaxY = state.pitch * -0.9;

  state.stars.forEach((star) => {
    const x = ((star.x * window.innerWidth + parallaxX) % window.innerWidth + window.innerWidth) % window.innerWidth;
    const y = ((star.y * window.innerHeight + parallaxY) % window.innerHeight + window.innerHeight) % window.innerHeight;
    ctx.beginPath();
    ctx.globalAlpha = star.a;
    ctx.fillStyle = "#ffffff";
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

el.start.addEventListener("click", async () => {
  await startCamera();
  await enableMotion();
});

el.startMini.addEventListener("click", startCamera);
el.motion.addEventListener("click", enableMotion);
el.location.addEventListener("click", enableLocation);
el.demo.addEventListener("click", startDemoSweep);
el.what.addEventListener("click", explainCurrentView);
el.menu.addEventListener("click", () => el.mission.classList.add("open"));
el.closeMission.addEventListener("click", () => el.mission.classList.remove("open"));
el.closeSheet.addEventListener("click", () => el.sheet.classList.remove("open"));
el.journey.addEventListener("click", startJourney);

window.addEventListener("resize", setupStars);

buildSkyObjects();
setupStars();
selectObject("sun");
el.sheet.classList.remove("open");
window.requestAnimationFrame(renderSky);
window.requestAnimationFrame(updateDemoSweep);
