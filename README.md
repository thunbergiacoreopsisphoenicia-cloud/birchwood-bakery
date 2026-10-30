# Birchwood Bakery

Order-for-pickup site for a fictional bakery. Plain HTML, CSS and JavaScript, no build step.

## Run it

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## Files

- `index.html`: the page
- `menu.js`: today's bake and the pickup slots
- `app.js`: the board, the slip and the order flow
- `styles.css`: all styling
- `netlify.toml`: tells Netlify to publish this folder as it is

## Releases

- 1.1.0: three or more of the same bake takes 10% off. Slip lines carry a 3+ offer tag.
- 1.0.0: first public release. Menu board, order slip, pickup times.
