import { players, rarities } from './players.js';
import { drawPack, filterPlayers, validateOwned } from './core.js';
import { cardMarkup, playerLabel } from './card-ui.js';
const $ = selector => document.querySelector(selector);
const state = { rarity: 'All', search: '', ownedOnly: false, limit: 12, owned: [], storageAvailable: true };
try { state.owned = validateOwned(JSON.parse(localStorage.getItem('pack2pitch-collection-v1') || '[]')); }
catch { state.storageAvailable = false; }
const rarityOrder = { Legendary: 0, Epic: 1, Rare: 2, Common: 3 };
let currentPack = [], revealed = new Set(), packOpener;
const packDialog = $('#pack-dialog'), playerDialog = $('#player-dialog');
const cryptographicRandom = () => {
  if (!globalThis.crypto?.getRandomValues) return Math.random();
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
};
function saveOwned() {
  try { localStorage.setItem('pack2pitch-collection-v1', JSON.stringify(state.owned)); }
  catch { state.storageAvailable = false; }
  $('#storage-notice').hidden = state.storageAvailable;
}
function renderCollection() {
  const matches = filterPlayers(state).sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity] || b.overall - a.overall);
  const shown = matches.slice(0, state.limit);
  $('#player-grid').innerHTML = shown.map(p => `<button class="player-item" data-player="${p.id}" aria-label="${playerLabel(p)}">${cardMarkup(p)}<span class="player-caption" style="--rarity:${rarities[p.rarity].color}"><span>#${p.id} / ${p.position}</span><span>${state.owned.includes(p.id) ? 'COLLECTED ✓' : p.rarity.toUpperCase()}</span></span></button>`).join('');
  $('#result-count').textContent = `Showing ${shown.length} of ${matches.length} players`;
  $('#owned-count').textContent = `${state.owned.length}/50`;
  $('#empty-state').hidden = matches.length !== 0;
  $('#load-more').hidden = shown.length === matches.length;
}
function showPlayer(id) {
  const p = players.find(p => p.id === id);
  if (!p) return;
  $('#player-detail').innerHTML = `<div class="player-detail-layout">${cardMarkup(p)}<div><p class="profile-rarity" style="--rarity:${rarities[p.rarity].color}">${p.rarity} / #${p.id}</p><h2 id="player-detail-title">${p.name}</h2><p class="muted">${p.nationality} · ${p.position} · ${p.overall} overall</p><div class="profile-stats">${Object.entries(p.stats).map(([key, value]) => `<div><strong>${value}</strong><span>${key}</span></div>`).join('')}</div><p class="small muted" style="margin-top:24px">Original fictional player. Attributes use a 1–99 scale. Overall is a separate design rating. Rarity describes availability, rather than a guarantee of stronger attributes.</p></div></div>`;
  playerDialog.showModal();
}
function newPack() {
  currentPack = drawPack(cryptographicRandom);
  revealed = new Set();
  $('#pack-cards').innerHTML = currentPack.map((_, index) => `<div class="pack-slot" data-slot="${index}"><button class="pack-reveal" data-reveal="${index}" aria-label="Reveal card ${index + 1} of 3"><span class="pack-emblem" aria-hidden="true">P2P</span><span>PACK2PITCH</span><small>TAP TO REVEAL / 0${index + 1}</small></button></div>`).join('');
  $('#pack-instructions').textContent = 'Tap a card to reveal your player.';
  $('#reveal-all').disabled = false;
  $('#another-pack').disabled = true;
  $('#storage-notice').hidden = state.storageAvailable;
  $('#pack-announcement').textContent = 'Three cards ready to reveal.';
}
function reveal(index) {
  if (revealed.has(index) || !currentPack[index]) return;
  const p = currentPack[index];
  revealed.add(index);
  const slot = document.querySelector(`[data-slot="${index}"]`);
  slot.innerHTML = `<div class="reveal-enter" role="img" aria-label="${p.name}, ${p.rarity}, ${p.overall} overall, ${p.position}, ${p.nationality}">${cardMarkup(p)}</div><div class="player-caption"><span>${p.nationality}</span><span>${p.rarity}</span></div>`;
  if (!state.owned.includes(p.id)) state.owned.push(p.id);
  saveOwned(); renderCollection();
  $('#pack-announcement').textContent = `Card ${index + 1}: ${p.name}, ${p.rarity}, ${p.overall} overall.`;
  if (revealed.size === 3) {
    $('#pack-instructions').textContent = 'Your three players are in your demo collection.';
    $('#reveal-all').disabled = true;
    $('#another-pack').disabled = false;
    $('#another-pack').focus({ preventScroll: true });
  } else {
    document.querySelector('.pack-reveal')?.focus({ preventScroll: true });
  }
}
$('#hero-epic').innerHTML = cardMarkup(players.find(p => p.id === '031'));
$('#hero-rare').innerHTML = cardMarkup(players.find(p => p.id === '039'));
const rarityDescriptions = { Common: 'The foundations of your club.', Rare: 'A fresh spark for your lineup.', Epic: 'The players who change a game.', Legendary: 'The pull you will remember.' };
$('#rarity-grid').innerHTML = Object.entries(rarities).map(([name, info], index) => `<article class="rarity-tile" style="--rarity:${info.color}"><span class="rarity-sigil" aria-hidden="true">${['◇', '◈', '✧', '✦'][index]}</span><h3>${name}</h3><p>${rarityDescriptions[name]}</p><div class="rarity-bottom"><strong>${Math.round(info.probability * 100)}%</strong><span>PER CARD</span></div></article>`).join('');
document.querySelectorAll('[data-open-pack]').forEach(button => button.addEventListener('click', () => { packOpener = button; newPack(); packDialog.showModal(); }));
document.querySelectorAll('[data-close-pack]').forEach(button => button.addEventListener('click', () => packDialog.close()));
packDialog.addEventListener('close', () => packOpener?.focus({ preventScroll: true }));
$('#pack-cards').addEventListener('click', event => { const button = event.target.closest('[data-reveal]'); if (button) reveal(Number(button.dataset.reveal)); });
$('#reveal-all').addEventListener('click', () => [0, 1, 2].forEach(reveal));
$('#another-pack').addEventListener('click', () => { newPack(); document.querySelector('.pack-reveal')?.focus(); });
$('#close-player').addEventListener('click', () => playerDialog.close());
$('#player-grid').addEventListener('click', event => { const button = event.target.closest('[data-player]'); if (button) showPlayer(button.dataset.player); });
document.querySelectorAll('[data-rarity]').forEach(button => button.addEventListener('click', () => {
  state.rarity = button.dataset.rarity; state.limit = 12;
  document.querySelectorAll('[data-rarity]').forEach(other => { const selected = other === button; other.classList.toggle('active', selected); other.setAttribute('aria-pressed', String(selected)); });
  renderCollection();
}));
$('#player-search').addEventListener('input', event => { state.search = event.target.value; state.limit = 12; renderCollection(); });
$('#owned-only').addEventListener('change', event => { state.ownedOnly = event.target.checked; state.limit = 12; renderCollection(); });
$('#load-more').addEventListener('click', () => { state.limit += 12; renderCollection(); });
renderCollection();
const requested = new URLSearchParams(location.hash.replace(/^#/, '')).get('player');
if (requested) showPlayer(requested);
