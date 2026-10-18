import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { players, rarities } from '../players.js';
import { rarityForRoll, drawPack, filterPlayers, validateOwned } from '../core.js';
import { cardMarkup } from '../card-ui.js';
test('complete roster: 50 unique IDs, 6 goalkeepers, expected rarity counts, and valid stats', () => {
  assert.equal(players.length, 50); assert.equal(new Set(players.map(p => p.id)).size, 50);
  assert.equal(players.filter(p => p.position === 'GK').length, 6);
  assert.deepEqual(Object.fromEntries(Object.keys(rarities).map(r => [r, players.filter(p => p.rarity === r).length])), { Common: 22, Rare: 16, Epic: 8, Legendary: 4 });
  for (const p of players) {
    assert.ok(p.nationality && p.countryCode); assert.ok(p.overall >= 1 && p.overall <= 99);
    assert.deepEqual(Object.keys(p.stats), p.position === 'GK' ? ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'] : ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']);
    for (const v of Object.values(p.stats)) assert.ok(Number.isInteger(v) && v >= 1 && v <= 99);
    assert.ok(p.tile < (p.sheet === 1 ? 6 : p.sheet <= 3 ? 8 : 7));
  }
});
test('all card text comes from authoritative player stats', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../players.json', import.meta.url), 'utf8')), players);
  for (const p of players) { const markup = cardMarkup(p); assert.ok(markup.includes(p.name)); assert.ok(markup.includes(p.nationality)); for (const [key, value] of Object.entries(p.stats)) assert.ok(markup.includes(`<b>${value}</b>${key}`)); }
});
test('10,000 evenly spaced draws produce the advertised rarity distribution', () => {
  const counts = { Common: 0, Rare: 0, Epic: 0, Legendary: 0 };
  for (let i = 0; i < 10000; i++) counts[rarityForRoll(i / 10000)]++;
  assert.deepEqual(counts, { Common: 7000, Rare: 2400, Epic: 500, Legendary: 100 });
  for (const bad of [-1, 1, NaN, Infinity]) assert.throws(() => rarityForRoll(bad));
});
test('packs can contain all common cards or all legendary cards; every rarity member is reachable', () => {
  assert.ok(drawPack(() => 0).every(p => p.rarity === 'Common'));
  assert.ok(drawPack(() => .9999).every(p => p.rarity === 'Legendary'));
  for (const [rarity, roll] of Object.entries({ Common: .1, Rare: .8, Epic: .95, Legendary: .995 })) {
    const pool = players.filter(p => p.rarity === rarity);
    for (let i = 0; i < pool.length; i++) { let calls = 0; const pack = drawPack(() => ++calls % 2 === 1 ? roll : (i + .5) / pool.length); assert.equal(pack[0].id, pool[i].id); }
  }
});
test('collection filters combine country, position, rarity and ownership', () => {
  assert.equal(filterPlayers({ search: 'japan' }).length, 2);
  assert.equal(filterPlayers({ rarity: 'Legendary', search: 'portugal' })[0].id, '050');
  assert.equal(filterPlayers({ ownedOnly: true, owned: [] }).length, 0);
  assert.equal(filterPlayers({ ownedOnly: true, owned: ['001', '050'] }).length, 2);
  assert.deepEqual(validateOwned(['001', '001', 'bogus', 50, '050']), ['001', '050']);
  assert.deepEqual(validateOwned({}), []);
});
