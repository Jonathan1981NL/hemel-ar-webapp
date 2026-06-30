# Sky Explorer AR — Stage 2E Horizon — 2026-06-30

Final recovery/sprint build.

## Core corrections

- AR is primary.
- Launch AR also requests motion tracking so phone movement can drive the sky.
- No random demo sweep by default.
- 3D Voyager is optional and opens only when selected.
- AR object sizes are proportional but screen-safe:
  - Jupiter appears larger than Moon/Mars;
  - Sun is large but not screen-breaking;
  - stars are screen-safe.
- Correct scale rule:
  - Sun is compared only with Earth.
  - Objects larger than the Sun are compared with the Sun.
  - Everything else is compared with Earth.
- Better graphics:
  - Sun has animated flare corona.
  - Jupiter has bands and a Great Red Spot.
  - Saturn has rings.
  - Atmospheric planets have cloud overlays.
- Larger expert database:
  - solar-system bodies;
  - bright stars with RA/Dec, magnitude, spectral class, constellation and expert notes;
  - 2,200 prototype deep-sky records.

## Deploy

Extract into:

`C:\Users\Admin\Documents\GitHub\hemel-ar-webapp-live`

Commit and push via GitHub Desktop.
