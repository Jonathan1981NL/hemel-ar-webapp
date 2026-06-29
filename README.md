# Sky Explorer AR — Stage 2C Voyager — 2026-06-30

Last-night build with a bigger product jump.

## Main changes

- Start page now has one primary button only: Launch.
- Launch enters Voyager AR immediately.
- Automatic AR journey:
  - starts from the Sun;
  - flies outward through solar-system bodies and Milky Way stars;
  - red AR flightpath;
  - moving spaceship;
  - auto-target lock;
  - automatic step progression.
- Calibration mode:
  - choose a known bright star;
  - point the phone at it;
  - tap Align Current View;
  - heading and pitch offsets are corrected.
- Direction/positioning:
  - default approximate location fallback;
  - GPS refines Sun, Moon and bright-star positions;
  - bright stars use RA/Dec to local azimuth/altitude.
- Scale logic:
  - the Sun is compared only against Earth;
  - objects larger than the Sun show both Earth and Sun reference;
  - planets and smaller objects use appropriate compressed scale.
- Expert database:
  - expanded bright-star database with magnitude, spectral class, constellation, RA/Dec and expert notes;
  - larger local deep-sky prototype catalogue with object categories and science notes.

## Deploy

Extract directly into:

`C:\Users\Admin\Documents\GitHub\hemel-ar-webapp-live`

Commit and push via GitHub Desktop.
