# Sky Explorer AR — Stage 2B Flightpath — 2026-06-30

Major technical/product step.

## Added

- AR Flight Journey: red flightpath + moving spaceship between targets.
- Journey happens in the AR layer, not only in a separate screen.
- Scale inspector compares selected object with both Earth and Sun.
- Large stars bigger than the Sun now show a Sun reference.
- Bright naked-eye Milky Way star database with RA/Dec, magnitude, spectral class and expert notes.
- GPS updates:
  - Sun approximate position
  - Moon simplified position
  - bright stars from RA/Dec to azimuth/altitude
- Explore Atlas remains secondary mode.

## Known limitation

Phone compass/orientation accuracy depends on device sensors and browser permissions. For true “spot on” recognition, the next milestone should add calibration against known stars and/or computer vision star-pattern matching.

## Deploy

Extract into:

`C:\Users\Admin\Documents\GitHub\hemel-ar-webapp-live`

Commit and push via GitHub Desktop.
