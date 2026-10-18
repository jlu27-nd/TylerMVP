import { players } from './players.js';
export function rarityForRoll(roll) {
  if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new RangeError('A roll must be between 0 inclusive and 1 exclusive.');
  if (roll < .70) return 'Common';
  if (roll < .94) return 'Rare';
  if (roll < .99) return 'Epic';
  return 'Legendary';
}
export function drawPlayer(random = Math.random) {
  const rarity = rarityForRoll(random());
  const pool = players.filter(player => player.rarity === rarity);
  const index = Math.floor(random() * pool.length);
  if (index < 0 || index >= pool.length) throw new RangeError('Invalid player roll.');
  return pool[index];
}
export function drawPack(random = Math.random) { return Array.from({ length: 3 }, () => drawPlayer(random)); }
export function filterPlayers({ rarity = 'All', search = '', ownedOnly = false, owned = [] } = {}) {
  const query = search.toLowerCase().trim();
  return players.filter(p => (rarity === 'All' || p.rarity === rarity) && (!ownedOnly || owned.includes(p.id)) && `${p.name} ${p.nationality} ${p.position}`.toLowerCase().includes(query));
}
export function validateOwned(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => players.some(p => p.id === id)))] : [];
}
