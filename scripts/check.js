import { existsSync, readFileSync } from 'node:fs';
import { players } from '../players.js';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
for (const file of ['index.html', 'cards.html', 'app.js', 'styles.css', 'card-ui.js', 'core.js', 'players.js', 'players.json', 'assets/valera-legendary.webp', ...Array.from({ length: 7 }, (_, i) => `assets/sheet-${i + 1}.webp`)]) assert.ok(existsSync(new URL(file, root)), `Missing site file: ${file}`);
assert.deepEqual(JSON.parse(readFileSync(new URL('players.json', root), 'utf8')), players, 'Roster exports must match');
assert.equal(players.length, 50);
console.log('Static site validation passed: 50 cards, matching data exports, and all required artwork.');
