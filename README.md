# Sky Explorer AR — Stage 2A Nova — 2026-06-30

Major UI and functionality reset.

## Major changes

- Visible build version on the start page and top chip.
- New Nova UI structure: AR, Atlas and Journey are separate modes.
- Stars added from our Milky Way layer: Sirius, Vega, Polaris, Betelgeuse, Rigel, Aldebaran, Altair and Deneb.
- Journey mode now has actual step-by-step progression with Back / Next Target and progress bar.
- Scale engine now uses visible true-diameter comparison:
  - if selected object is larger than Earth, Earth becomes visibly smaller;
  - if selected object is smaller than Earth, the selected body becomes visibly smaller;
  - Sun uses compressed scaling but Earth is intentionally tiny.
- Explore Atlas remains secondary to AR but is now a separate full-screen mode.
- Version name shown in the GitHub Pages start screen: Stage 2A Nova — 2026-06-30.

## Deploy

Extract directly into:

`C:\Users\Admin\Documents\GitHub\hemel-ar-webapp-live`

Commit and push via GitHub Desktop.
