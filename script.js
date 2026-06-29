const objectData = {
  sun: {
    title: "Sun",
    type: "Star",
    description: "The Sun is the star at the center of our solar system. It powers life on Earth and dominates the sky with light and energy.",
    distance: "149.6 million km",
    size: "Diameter 1.39 million km",
    highlight: "Source of light and heat",
    visualClass: "visual-sun"
  },
  mars: {
    title: "Mars",
    type: "Planet",
    description: "Mars is the red planet, known for its dusty landscapes, giant volcanoes, and strong potential for future exploration.",
    distance: "~225 million km avg",
    size: "Diameter 6,779 km",
    highlight: "Known as the Red Planet",
    visualClass: "visual-mars"
  },
  jupiter: {
    title: "Jupiter",
    type: "Gas Giant",
    description: "Jupiter is the largest planet in our solar system, famous for its massive storms and the Great Red Spot.",
    distance: "~778 million km avg",
    size: "Diameter 139,820 km",
    highlight: "Largest planet in the solar system",
    visualClass: "visual-jupiter"
  },
  blackhole: {
    title: "Black Hole",
    type: "Extreme Object",
    description: "A black hole is a region where gravity is so strong that not even light can escape. They are among the most fascinating objects in the universe.",
    distance: "Varies by example",
    size: "Depends on mass",
    highlight: "Gravity so strong that light cannot escape",
    visualClass: "visual-blackhole"
  }
};

const detailTitle = document.getElementById("detailTitle");
const detailType = document.getElementById("detailType");
const detailDescription = document.getElementById("detailDescription");
const detailDistance = document.getElementById("detailDistance");
const detailSize = document.getElementById("detailSize");
const detailHighlight = document.getElementById("detailHighlight");
const detailVisual = document.getElementById("detailVisual");
const statusMessage = document.getElementById("statusMessage");
const themeToggle = document.getElementById("themeToggle");
const launchArButton = document.getElementById("launchArButton");
const locationButton = document.getElementById("locationButton");
const cameraFeed = document.getElementById("cameraFeed");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");
const objectButtons = Array.from(document.querySelectorAll(".sky-object"));

function updateDetails(key) {
  const data = objectData[key];
  if (!data) return;

  detailTitle.textContent = data.title;
  detailType.textContent = data.type;
  detailDescription.textContent = data.description;
  detailDistance.textContent = data.distance;
  detailSize.textContent = data.size;
  detailHighlight.textContent = data.highlight;
  detailVisual.className = `detail-visual ${data.visualClass}`;

  objectButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.object === key);
  });

  statusMessage.textContent = `${data.title} selected.`;
}

objectButtons.forEach((button) => {
  button.addEventListener("click", () => updateDetails(button.dataset.object));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "Dark mode" : "Night mode";
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    statusMessage.textContent = "Geolocation is not supported on this device.";
    return;
  }

  statusMessage.textContent = "Requesting location permission...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      statusMessage.textContent = `Location enabled. Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}.`;
    },
    () => {
      statusMessage.textContent = "Location permission denied or unavailable.";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

launchArButton.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusMessage.textContent = "Camera access is not supported in this browser.";
    return;
  }

  try {
    statusMessage.textContent = "Opening camera...";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
      audio: false
    });

    cameraFeed.srcObject = stream;
    cameraFeed.style.display = "block";
    cameraPlaceholder.style.display = "none";
    statusMessage.textContent = "AR View active. Tap any overlay object.";
  } catch (error) {
    statusMessage.textContent = "Camera permission denied or unavailable.";
  }
});
