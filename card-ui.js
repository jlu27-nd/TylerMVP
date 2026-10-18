import { rarities } from './players.js';
export function cardMarkup(player) {
  const column = player.tile % player.columns, row = Math.floor(player.tile / player.columns);
  const color = rarities[player.rarity].color;
  return `<div class="player-card" style="--rarity:${color}">
    <div class="card-art" style="--cols:${player.columns};--col:${column};--row:${row}"><img src="assets/sheet-${player.sheet}.webp" alt="${player.name} in action" loading="lazy" decoding="async"></div>
    <div class="card-corner"><span class="card-overall">${player.overall}</span><span class="card-position">${player.position}</span><span class="card-country-code">${player.countryCode}</span></div>
    <div class="card-info"><div class="card-name">${player.name}</div><div class="card-nationality">${player.nationality}</div><div class="card-stats">${Object.entries(player.stats).map(([key, value]) => `<span class="card-stat"><b>${value}</b>${key}</span>`).join('')}</div><div class="card-rarity">${player.rarity}</div><div class="card-edition">PACK2PITCH · SEASON 01 · ${player.id}</div></div>
  </div>`;
}
export function playerLabel(p) { return `${p.name}, ${p.nationality}, ${p.position}, ${p.overall} overall, ${p.rarity}. View player profile.`; }
