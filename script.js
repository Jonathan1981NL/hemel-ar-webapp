const objects = [
  { id: 'sun', name: 'Zon', type: 'Ster', x: 19, y: 28, className: 'sun', distance: '149,6 miljoen km', fact: 'De energiebron van ons zonnestelsel. In AR wordt dit een belangrijk ankerpunt voor dag/nacht en tijdmachine-functies.' },
  { id: 'mars', name: 'Mars', type: 'Planeet', x: 44, y: 42, className: 'mars', distance: 'Gemiddeld 225 miljoen km', fact: 'De rode planeet. Goede kandidaat voor detailpagina’s met missies, landschap en toekomstige premium content.' },
  { id: 'jupiter', name: 'Jupiter', type: 'Gasreus', x: 68, y: 31, className: 'jupiter', distance: 'Gemiddeld 778 miljoen km', fact: 'De grootste planeet van ons zonnestelsel, ideaal voor schaalvergelijkingen en visuele impact.' },
  { id: 'blackhole', name: 'Zwart gat', type: 'Deep-sky object', x: 79, y: 58, className: 'blackhole', distance: 'Educatieve visualisatie', fact: 'Niet zomaar zichtbaar met het blote oog. In deze app gebruiken we dit als educatieve laag, niet als live claim.' }
];

const skyView = document.querySelector('#skyView');
const objectDetail = document.querySelector('#objectDetail');
const statusMessage = document.querySelector('#statusMessage');
const startSkyButton = document.querySelector('#startSkyButton');
const locationButton = document.querySelector('#locationButton');
const nightModeButton = document.querySelector('#nightModeButton');

function renderSky() {
  objects.forEach((object) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `sky-object ${object.className}`;
    button.style.left = `${object.x}%`;
    button.style.top = `${object.y}%`;
    button.textContent = object.name;
    button.setAttribute('aria-label', `${object.name} bekijken`);
    button.addEventListener('click', () => selectObject(object));
    skyView.appendChild(button);
  });
}

function selectObject(object) {
  objectDetail.innerHTML = `
    <div class="planet-visual ${object.className}"></div>
    <div>
      <p class="eyebrow">${escapeHtml(object.type)}</p>
      <h3>${escapeHtml(object.name)}</h3>
      <p><strong>Afstand:</strong> ${escapeHtml(object.distance)}</p>
      <p>${escapeHtml(object.fact)}</p>
      <p class="helper-text">Volgende fase: echte data, zichtbaarheid, AI-uitleg, 3D-model en premium verdieping.</p>
    </div>
  `;
  statusMessage.textContent = `${object.name} geselecteerd.`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

startSkyButton.addEventListener('click', () => {
  document.querySelector('#sky-title').scrollIntoView({ behavior: 'smooth' });
  statusMessage.textContent = 'Sky View geopend. Kies een object.';
});

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    statusMessage.textContent = 'Locatie wordt niet ondersteund door deze browser.';
    return;
  }
  statusMessage.textContent = 'Locatietoestemming gevraagd...';
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(2);
      const lon = position.coords.longitude.toFixed(2);
      statusMessage.textContent = `Locatie actief: ${lat}, ${lon}. In Stage 1B koppelen we hier echte hemeldata aan.`;
    },
    () => {
      statusMessage.textContent = 'Locatie niet gedeeld. De app blijft werken in demo-modus.';
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
  );
});

nightModeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  nightModeButton.textContent = document.body.classList.contains('light') ? 'Donkere modus' : 'Nachtmodus';
});

renderSky();
