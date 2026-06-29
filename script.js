const objectData = {
  sun: {
    title: "Sun",
    type: "Star",
    description: "The Sun is the star at the center of our solar system. It gives Earth light, warmth and the energy that makes life possible.",
    distance: "149.6 million km",
    size: "1.39 million km diameter",
    visibility: "Daytime only",
    visual: "visual-sun",
    guide: "You selected the Sun. In the final app, this object will be positioned using your time, location and sky direction."
  },
  moon: {
    title: "Moon",
    type: "Natural satellite",
    description: "The Moon is Earth's companion and the brightest object in the night sky. Its phase changes as it orbits Earth.",
    distance: "384,400 km avg",
    size: "3,474 km diameter",
    visibility: "Often visible day or night",
    visual: "visual-moon",
    guide: "You selected the Moon. Next we will add moon phase, rise/set time and real position."
  },
  mars: {
    title: "Mars",
    type: "Planet",
    description: "Mars is the red planet, known for dusty landscapes, polar caps, ancient river valleys and future human exploration potential.",
    distance: "~225 million km avg",
    size: "6,779 km diameter",
    visibility: "Night sky when above horizon",
    visual: "visual-mars",
    guide: "You selected Mars. Later, this will include live visibility and constellation context."
  },
  jupiter: {
    title: "Jupiter",
    type: "Gas giant",
    description: "Jupiter is the largest planet in the solar system. It has powerful storms, dozens of moons and a huge magnetic field.",
    distance: "~778 million km avg",
    size: "139,820 km diameter",
    visibility: "Bright when visible",
    visual: "visual-jupiter",
    guide: "You selected Jupiter. In Stage 1C we will add real azimuth and altitude calculations."
  },
  blackhole: {
    title: "Black Hole",
    type: "Extreme cosmic object",
    description: "A black hole is a region where gravity is so intense that not even light can escape beyond the event horizon.",
    distance: "Depends on object",
    size: "Depends on mass",
    visibility: "Not directly visible",
    visual: "visual-blackhole",
    guide: "You selected a black hole. In the final app, this can become an educational deep-space layer rather than a live visible sky object."
  }
};

const els = {
  launch: document.getElementById("launchArButton"),
  location: document.getElementById("locationButton"),
  motion: document.getElementById("motionButton"),
  theme: document.getElementById("themeToggle"),
  video: document.getElementById("cameraFeed"),
  placeholder: document.getElementById("cameraPlaceholder"),
  status: document.getElementById("statusMessage"),
  locationReadout: document.getElementById("locationReadout"),
  motionReadout: document.getElementById("motionReadout"),
  headingReadout: document.getElementById("headingReadout"),
  title: document.getElementById("detailTitle"),
  type: document.getElementById("detailType"),
  description: document.getElementById("detailDescription"),
  distance: document.getElementById("detailDistance"),
  size: document.getElementById("detailSize"),
  visibility: document.getElementById("detailVisibility"),
  visual: document.getElementById("detailVisual"),
  guide: document.getElementById("guideText"),
  whatSeeing: document.getElementById("whatSeeingButton"),
  objects: Array.from(document.querySelectorAll(".sky-object"))
};

let selectedObject = null;

function selectObject(key) {
  const data = objectData[key];
  if (!data) return;

  selectedObject = key;
  els.title.textContent = data.title;
  els.type.textContent = data.type;
  els.description.textContent = data.description;
  els.distance.textContent = data.distance;
  els.size.textContent = data.size;
  els.visibility.textContent = data.visibility;
  els.guide.textContent = data.guide;
  els.visual.className = `detail-visual ${data.visual}`;

  els.objects.forEach((button) => {
    button.classList.toggle("active", button.dataset.object === key);
  });

  els.status.textContent = `${data.title} selected.`;
}

els.objects.forEach((button) => {
  button.addEventListener("click", () => selectObject(button.dataset.object));
});

els.launch.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    els.status.textContent = "Camera access is not supported in this browser.";
    return;
  }

  try {
    els.status.textContent = "Opening camera...";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });

    els.video.srcObject = stream;
    els.video.style.display = "block";
    els.placeholder.style.display = "none";
    els.status.textContent = "AR View active. Tap the floating objects.";
  } catch (error) {
    els.status.textContent = "Camera permission denied or unavailable.";
  }
});

els.location.addEventListener("click", () => {
  if (!navigator.geolocation) {
    els.status.textContent = "Geolocation is not supported on this device.";
    return;
  }

  els.status.textContent = "Requesting location permission...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(2);
      const lon = pos.coords.longitude.toFixed(2);
      els.locationReadout.textContent = `Location: ${lat}, ${lon}`;
      els.status.textContent = "Location enabled for future sky positioning.";
    },
    () => {
      els.status.textContent = "Location permission denied or unavailable.";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

els.motion.addEventListener("click", async () => {
  try {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        els.status.textContent = "Motion permission denied.";
        return;
      }
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
    els.motionReadout.textContent = "Motion: enabled";
    els.status.textContent = "Motion enabled. Demo overlay will react to phone orientation.";
  } catch (error) {
    els.status.textContent = "Motion permission unavailable on this device.";
  }
});

function handleOrientation(event) {
  const alpha = Number.isFinite(event.alpha) ? Math.round(event.alpha) : null;
  const beta = Number.isFinite(event.beta) ? Math.round(event.beta) : null;
  const gamma = Number.isFinite(event.gamma) ? Math.round(event.gamma) : null;

  if (alpha !== null) els.headingReadout.textContent = `Heading: ${alpha}°`;
  els.motionReadout.textContent = `Motion: ${beta ?? "—"} / ${gamma ?? "—"}`;

  document.documentElement.style.setProperty("--tilt-x", `${(gamma || 0) * 0.2}px`);
  document.documentElement.style.setProperty("--tilt-y", `${(beta || 0) * 0.12}px`);
}

els.theme.addEventListener("click", () => {
  document.body.classList.toggle("light");
  els.theme.textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

els.whatSeeing.addEventListener("click", () => {
  const objectName = selectedObject ? objectData[selectedObject].title : "the demo sky overlay";
  els.guide.textContent = `Prototype guide: you are viewing ${objectName}. In Stage 1C this will become a real sky interpretation based on GPS, time, compass heading and object altitude.`;
});

selectObject("sun");
