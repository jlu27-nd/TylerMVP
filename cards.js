import { players } from './players.js';
import { cardMarkup } from './card-ui.js';
document.querySelector('#all-cards').innerHTML = players.map(p => `<a class="player-item" href="index.html#player=${p.id}" aria-label="${p.name}, ${p.rarity}, ${p.overall} overall. View profile.">${cardMarkup(p)}<span class="player-caption"><span>#${p.id} / ${p.position}</span><span>${p.rarity}</span></span></a>`).join('');
document.querySelector('#print-cards').addEventListener('click', () => window.print());
