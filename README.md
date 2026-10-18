# Pack2Pitch

Tyler's original soccer card game prototype. A responsive hero page, 50-player card collection, and a free three-card pack-opening demo.

## Run it

Install Node.js 20 or newer. No dependencies or account setup are needed.

```sh
npm start
```

Open http://localhost:3000. Run `npm test` to check the roster and random draws; `npm run build` validates the static site files.

## Tyler's editing guide

- `players.json`: a reusable copy of all 50 player records, with nationalities and six position-specific attributes.
- `players.js`: the same roster used by the website, plus pack odds. Keep both roster copies in sync when editing.
- `styles.css`: colors, card frames, mobile layouts, and animations.
- `card-ui.js`: one card template that generates every player card with exact text and stats.
- `app.js`: pack reveals, filters, player profiles, and browser collection saving.
- `assets/`: generated original fictional player artwork and the Legendary hero card. Sheets contain equal portrait tiles, in roster order.
- `cards.html`: all 50 cards in one printable gallery.

Try one small change at a time: change a player's pace, change a card color, or write a new pack reveal message. Then refresh the page and see what happened.

## Current scope

All players and ratings are fictional. The demo uses independent per-card rarity rolls: Common 70%, Rare 24%, Epic 5%, Legendary 1%, then selects uniformly within that rarity. Duplicates are possible. Roster counts do not determine rarity odds. Collections save in localStorage when available; there is no account, payment, real-money value, multiplayer market, or server-authoritative inventory.

Matches, trading, virtual club coins, and expansion packs are future development ideas, described as planned on the page.

## Vercel

This is a plain static site. Framework: Other. No install or build command is required. Publish the repository root. The included security headers allow only local assets. No secrets or environment variables are needed.

## Artwork

AI-generated fictional athletes and original card design. The visual reference card is an image; all collection card names and numerical attributes are rendered from the structured roster to keep them exact.
