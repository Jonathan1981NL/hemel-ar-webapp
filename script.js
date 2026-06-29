const DATA = window.SKY_EXPLORER_DATA || { featured: [], catalog: [], tours: [] };

const state = {
  cameraOn: false,
  motionOn: false,
  locationOn: false,
  demoOn: false,
  headingRaw: 95,
  pitchRaw: 18,
  heading: 95,
  pitch: 18,
  headingOffset: 0,
  selectedId: null,
  lockedId: null,
  filter: "featured",
  stars: [],
  lastGuide: "",
  demoStart: 0
};

const el = {
  camera: document.getElementById("cameraFeed"),
  startOverlay: document.getElementById("startOverlay"),
  starCanvas: document.getElementById("starCanvas"),
  skyLayer: document.getElementById("skyLayer"),
  edgeLayer: document.getElementById("edgeLayer"),
  headingChip: document.getElementById("headingChip"),
  pitchChip: document.getElementById("pitchChip"),
  gpsChip: document.getElementById("gpsChip"),
  compassTrack: document.getElementById("compassTrack"),
  guide: document.getElementById("guideText"),
  modeText: document.getElementById("modeText"),
  toast: document.getElementById("toast"),
  sheet: document.getElementById("objectSheet"),
  visual: document.getElementById("objectVisual"),
  tier: document.getElementById("objectTier"),
  title: document.getElementById("objectTitle"),
  summary: document.getElementById("objectSummary"),
  distance: document.getElementById("objectDistance"),
  size: document.getElementById("objectSize"),
  find: document.getElementById("objectFind"),
  story: document.getElementById("objectStory"),
  finder: document.getElementById("finderDrawer"),
  targetList: document.getElementById("targetList"),
  searchInput: document.getElementById("searchInput"),
  tourDrawer: document.getElementById("tourDrawer"),
  tourList: document.getElementById("tourList")
};

const featured = DATA.featured || [];
const catalog = DATA.catalog || [];
const skyObjects = featured.map((obj) => ({ ...obj, featured: true }));

function norm(deg) {
  return ((deg % 360) + 360) % 360;
}

function delta(target, current) {
  let d = norm(target) - norm(current);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerpAngle(current, target, amount) {
  const d = delta(target, current);
  return norm(current + d * amount);
}

function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.toast.classList.remove("show"), 2100);
}

function buildSky() {
  el.skyLayer.innerHTML = "";
  for (const obj of skyObjects) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sky-object";
    button.dataset.id = obj.id;
    button.innerHTML = `
      <span class="object-core ${obj.core}"></span>
      <span class="object-label"><strong>${obj.name}</strong><small>${obj.type}</small></span>
    `;
    button.addEventListener("click", () => openObject(obj.id));
    el.skyLayer.appendChild(button);
  }
}

function render() {
  if (state.demoOn && !state.motionOn) {
    const t = (performance.now() - state.demoStart) / 1000;
    state.headingRaw = norm(95 + Math.sin(t * 0.32) * 165 + t * 4.4);
    state.pitchRaw = 21 + Math.sin(t * 0.61) * 19;
  }

  state.heading = lerpAngle(state.heading, norm(state.headingRaw + state.headingOffset), 0.12);
  state.pitch = state.pitch + (state.pitchRaw - state.pitch) * 0.14;

  renderObjects();
  renderEdges();
  renderHud();
  drawStars();
  requestAnimationFrame(render);
}

function renderObjects() {
  const fovX = 62;
  const fovY = 50;

  for (const obj of skyObjects) {
    const node = el.skyLayer.querySelector(`[data-id="${obj.id}"]`);
    if (!node) continue;

    const dx = delta(obj.az, state.heading);
    const dy = obj.alt - state.pitch;
    const visible = Math.abs(dx) <= fovX / 2 && Math.abs(dy) <= fovY / 2;
    const x = 50 + (dx / (fovX / 2)) * 50;
    const y = 50 - (dy / (fovY / 2)) * 50;
    const edgeFactor = Math.max(Math.abs(dx) / (fovX / 2), Math.abs(dy) / (fovY / 2));
    const scale = clamp(1.08 - edgeFactor * .18, .72, 1.12);

    node.style.setProperty("--x", `${x}%`);
    node.style.setProperty("--y", `${y}%`);
    node.style.setProperty("--scale", `${scale}`);
    node.classList.toggle("visible", visible);
    node.classList.toggle("selected", state.selectedId === obj.id);
    node.classList.toggle("locked", state.lockedId === obj.id);
  }
}

function renderEdges() {
  const fovX = 62;
  const fovY = 50;
  el.edgeLayer.innerHTML = "";

  const targets = skyObjects
    .map((obj) => {
      const dx = delta(obj.az, state.heading);
      const dy = obj.alt - state.pitch;
      const visible = Math.abs(dx) <= fovX / 2 && Math.abs(dy) <= fovY / 2;
      return { obj, dx, dy, visible, score: Math.abs(dx) + Math.abs(dy) * 0.8 };
    })
    .filter((item) => !item.visible)
    .sort((a, b) => {
      if (a.obj.id === state.lockedId) return -1;
      if (b.obj.id === state.lockedId) return 1;
      return a.score - b.score;
    })
    .slice(0, 5);

  targets.forEach((item) => {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.className = "edge-indicator";
    indicator.dataset.id = item.obj.id;

    const marginX = window.innerWidth < 740 ? 56 : 74;
    const marginY = window.innerWidth < 740 ? 108 : 90;
    const isLeftRight = Math.abs(item.dx) > Math.abs(item.dy) * 1.1;

    let x = 50 + (item.dx / 140) * 50;
    let y = 50 - (item.dy / 100) * 50;
    x = clamp(x, marginX / window.innerWidth * 100, 100 - marginX / window.innerWidth * 100);
    y = clamp(y, marginY / window.innerHeight * 100, 100 - marginY / window.innerHeight * 100);

    if (isLeftRight) {
      x = item.dx < 0 ? marginX / window.innerWidth * 100 : 100 - marginX / window.innerWidth * 100;
    } else {
      y = item.dy > 0 ? marginY / window.innerHeight * 100 : 100 - marginY / window.innerHeight * 100;
    }

    const arrow = Math.abs(item.dx) > Math.abs(item.dy)
      ? (item.dx > 0 ? "→" : "←")
      : (item.dy > 0 ? "↑" : "↓");

    const turn = item.dx > 0 ? `turn right ${Math.round(Math.abs(item.dx))}°` : `turn left ${Math.round(Math.abs(item.dx))}°`;
    const tilt = item.dy > 0 ? `up ${Math.round(Math.abs(item.dy))}°` : `down ${Math.round(Math.abs(item.dy))}°`;

    indicator.style.left = `${x}%`;
    indicator.style.top = `${y}%`;
    indicator.innerHTML = `
      <span class="edge-dot"></span>
      <span class="edge-copy"><strong>${item.obj.name}</strong><small>${turn}, ${tilt}</small></span>
      <span class="edge-arrow">${arrow}</span>
    `;
    indicator.addEventListener("click", () => openObject(item.obj.id));
    el.edgeLayer.appendChild(indicator);
  });
}

function renderHud() {
  el.headingChip.textContent = `HDG ${Math.round(state.heading)}°`;
  el.pitchChip.textContent = `PIT ${Math.round(state.pitch)}°`;
  el.compassTrack.style.transform = `translateX(${delta(0, state.heading) * -1.05}px)`;

  if (state.lockedId) {
    const obj = skyObjects.find((o) => o.id === state.lockedId);
    if (obj) {
      const dx = delta(obj.az, state.heading);
      const dy = obj.alt - state.pitch;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        setGuide(`Target locked: ${obj.name} is centered. Tap it for the AR story.`);
      } else {
        const turn = dx > 0 ? `turn right ${Math.round(Math.abs(dx))}°` : `turn left ${Math.round(Math.abs(dx))}°`;
        const tilt = dy > 0 ? `tilt up ${Math.round(Math.abs(dy))}°` : `tilt down ${Math.round(Math.abs(dy))}°`;
        setGuide(`Locked on ${obj.name}: ${turn}, ${tilt}.`);
      }
    }
  }
}

function setGuide(text) {
  if (text !== state.lastGuide) {
    el.guide.textContent = text;
    state.lastGuide = text;
  }
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast("Camera not supported");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    el.camera.srcObject = stream;
    el.camera.style.display = "block";
    el.startOverlay.classList.add("hidden");
    state.cameraOn = true;
    el.modeText.textContent = "Camera active";
    toast("Camera active");
  } catch (e) {
    toast("Camera permission denied");
  }
}

async function enableMotion() {
  try {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        toast("Motion permission denied");
        return;
      }
    }
    window.addEventListener("deviceorientation", onOrientation, true);
    state.motionOn = true;
    state.demoOn = false;
    el.modeText.textContent = "Motion tracking";
    toast("Motion tracking enabled");
  } catch (e) {
    toast("Motion unavailable");
  }
}

function onOrientation(event) {
  if (typeof event.alpha === "number") {
    state.headingRaw = norm(event.alpha);
  }
  if (typeof event.beta === "number") {
    // Approximation: beta changes depending on device orientation. This remains a web-prototype calibration layer.
    state.pitchRaw = clamp(90 - Math.abs(event.beta), -25, 75);
  }
}

function enableLocation() {
  if (!navigator.geolocation) {
    toast("Location not supported");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.locationOn = true;
      el.gpsChip.textContent = "GPS on";
      toast(`Location ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
    },
    () => toast("Location permission denied"),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function calibrateNorth() {
  state.headingOffset = norm(state.headingOffset - state.headingRaw);
  toast("Current direction calibrated as North");
  setGuide("Calibration applied. In the real astronomy engine, this will align camera heading with actual sky coordinates.");
}

function demoSweep() {
  state.demoOn = !state.demoOn;
  state.demoStart = performance.now();
  el.startOverlay.classList.add("hidden");
  el.modeText.textContent = state.demoOn ? "Demo sweep" : "Stage 1D";
  toast(state.demoOn ? "Demo sweep active" : "Demo sweep stopped");
}

function openObject(id) {
  const obj = skyObjects.find((o) => o.id === id);
  if (!obj) return;

  state.selectedId = id;
  el.tier.textContent = obj.tier || "Catalog";
  el.title.textContent = obj.name;
  el.summary.textContent = obj.summary;
  el.distance.textContent = obj.distance;
  el.size.textContent = obj.size;
  const dx = delta(obj.az, state.heading);
  const dy = obj.alt - state.pitch;
  el.find.textContent = `${dx > 0 ? "Right" : "Left"} ${Math.round(Math.abs(dx))}° / ${dy > 0 ? "Up" : "Down"} ${Math.round(Math.abs(dy))}°`;
  el.story.textContent = obj.story;
  el.visual.className = `object-visual ${obj.visual}`;
  el.sheet.classList.add("open");
  el.finder.classList.remove("open");
  el.tourDrawer.classList.remove("open");
  setGuide(`${obj.name}: ${obj.usp}. Use Lock Target to keep guidance arrows active.`);
  toast(`${obj.name} selected`);
}

function lockSelectedTarget() {
  if (!state.selectedId) return;
  state.lockedId = state.selectedId;
  const obj = skyObjects.find((o) => o.id === state.lockedId);
  toast(`${obj.name} locked`);
  setGuide(`Target locked: follow the edge arrows to find ${obj.name}.`);
}

function journeySelectedTarget() {
  const obj = skyObjects.find((o) => o.id === state.selectedId);
  if (!obj) return;
  setGuide(`Cosmic Journey preview: ${obj.name}. This is the premium path: scale, distance, travel time and story in one AR flow.`);
  toast("Journey preview");
}

function openFinder() {
  el.finder.classList.add("open");
  el.sheet.classList.remove("open");
  el.tourDrawer.classList.remove("open");
  renderTargetList();
}

function renderTargetList() {
  const q = el.searchInput.value.trim().toLowerCase();
  let list = [];

  if (state.filter === "featured") list = featured;
  if (state.filter === "bright") list = [...featured, ...catalog.filter((o) => o.mag <= 2.2)].slice(0, 120);
  if (state.filter === "deep") list = catalog.filter((o) => ["Nebula","Galaxy","Star Cluster","Supernova Remnant","Quasar","Exoplanet System"].includes(o.type)).slice(0, 160);
  if (state.filter === "all") list = [...featured, ...catalog.slice(0, 260)];

  if (q) {
    list = [...featured, ...catalog].filter((o) => `${o.name} ${o.type} ${o.constellation || ""}`.toLowerCase().includes(q)).slice(0, 80);
  }

  el.targetList.innerHTML = "";
  list.slice(0, 60).forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "target-card";
    const itemAz = item.az || 0;
    const itemAlt = item.alt || 0;
    const dx = delta(itemAz, state.heading);
    const arrow = Math.abs(dx) < 8 ? "•" : dx > 0 ? "→" : "←";
    card.innerHTML = `
      <span class="target-mini"></span>
      <span><strong>${item.name}</strong><small>${item.type}${item.constellation ? " · " + item.constellation : ""}</small></span>
      <span class="target-arrow">${arrow}</span>
    `;
    card.addEventListener("click", () => {
      if (item.featured || skyObjects.some((o) => o.id === item.id)) {
        openObject(item.id);
      } else {
        // Promote catalog object into temporary AR layer.
        const temp = {
          id: item.id,
          name: item.name,
          type: item.type,
          az: item.az,
          alt: item.alt,
          mag: item.mag,
          distance: `${item.distanceLy} ly`,
          size: "Catalog object",
          visibility: item.mag <= 6 ? "Potentially visible" : "Needs optics",
          core: item.type.includes("Galaxy") ? "core-blackhole" : "core-moon",
          visual: item.type.includes("Galaxy") ? "visual-blackhole" : "visual-moon",
          tier: "Catalog",
          usp: item.constellation || "Sky object",
          summary: item.summary,
          story: "This is a local catalog record. Future versions can attach verified astronomy data, images and guided context."
        };
        skyObjects.push(temp);
        buildSky();
        openObject(item.id);
      }
    });
    el.targetList.appendChild(card);
  });
}

function renderTours() {
  el.tourList.innerHTML = "";
  (DATA.tours || []).forEach((tour) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "tour-card";
    card.innerHTML = `<strong>${tour.title}</strong><small>${tour.duration} · ${tour.description}</small>`;
    card.addEventListener("click", () => {
      el.tourDrawer.classList.remove("open");
      setGuide(`${tour.title}: ${tour.description} This is a premium guided journey concept.`);
      toast("Guided journey selected");
    });
    el.tourList.appendChild(card);
  });
}

function setupStars() {
  const canvas = el.starCanvas;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  state.stars = Array.from({ length: 260 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + .2,
    a: Math.random() * .75 + .18
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
  const px = delta(state.heading, 180) * .42;
  const py = state.pitch * -.9;
  for (const s of state.stars) {
    const x = ((s.x * window.innerWidth + px) % window.innerWidth + window.innerWidth) % window.innerWidth;
    const y = ((s.y * window.innerHeight + py) % window.innerHeight + window.innerHeight) % window.innerHeight;
    ctx.globalAlpha = s.a;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

document.getElementById("startAr").addEventListener("click", async () => { await startCamera(); await enableMotion(); });
document.getElementById("startMini").addEventListener("click", startCamera);
document.getElementById("motionBtn").addEventListener("click", enableMotion);
document.getElementById("locationBtn").addEventListener("click", enableLocation);
document.getElementById("calibrateBtn").addEventListener("click", calibrateNorth);
document.getElementById("demoMode").addEventListener("click", demoSweep);
document.getElementById("finderButton").addEventListener("click", openFinder);
document.getElementById("closeFinder").addEventListener("click", () => el.finder.classList.remove("open"));
document.getElementById("closeObject").addEventListener("click", () => el.sheet.classList.remove("open"));
document.getElementById("tourBtn").addEventListener("click", () => { el.tourDrawer.classList.add("open"); el.finder.classList.remove("open"); el.sheet.classList.remove("open"); });
document.getElementById("closeTour").addEventListener("click", () => el.tourDrawer.classList.remove("open"));
document.getElementById("lockTarget").addEventListener("click", lockSelectedTarget);
document.getElementById("journeyTarget").addEventListener("click", journeySelectedTarget);
document.getElementById("brandButton").addEventListener("click", () => setGuide("Sky Explorer USP: a guided AR cockpit for both visible objects and invisible cosmic layers."));
el.searchInput.addEventListener("input", renderTargetList);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    state.filter = tab.dataset.filter;
    renderTargetList();
  });
});

window.addEventListener("resize", setupStars);

buildSky();
renderTours();
setupStars();
render();
openObject("sun");
el.sheet.classList.remove("open");
