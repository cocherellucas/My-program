// Génère une page locale pour relire les images de tournage et nommer chaque
// clip. Tout est hors-ligne : les images sont chargées depuis le dossier voisin,
// rien n'est envoyé nulle part. La liste des 186 exercices de la fiche sert
// d'autocomplétion — on choisit, on ne tape pas.
import fs from 'node:fs';
import path from 'node:path';

const dossier = path.join(process.cwd(), 'program-data', 'images-tournage');
const idx = JSON.parse(fs.readFileSync(path.join(dossier, '_index.json'), 'utf8'));

// Noms d'exercices, dans l'ordre de la fiche de tournage
const fods = fs.readFileSync(path.join(process.cwd(), 'program-data', 'videos-exercices.fods'), 'utf8');
const body = fods.slice(fods.indexOf('<office:body'));
const noms = [];
let groupe = '';
for (const r of body.matchAll(/<table:table-row[\s\S]*?<\/table:table-row>/g)) {
  const t = [...r[0].matchAll(/<text:p[^>]*>([\s\S]*?)<\/text:p>/g)]
    .map((c) => c[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  if (!t.length) continue;
  if (t[0].startsWith('\u25BC')) { groupe = t[0].replace('\u25BC', '').trim().split(' ')[0]; continue; }
  if (t[0] === '\u2610 Faite') continue;
  noms.push({ nom: t[0], groupe });
}
const deja = new Set(idx.map((e) => e.exercice).filter(Boolean));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const cartes = idx.map((e) => `
    <figure class="carte ${e.exercice ? 'ok' : 'todo'}" data-rang="${e.rang}">
      <div class="num">${String(e.rang).padStart(2, '0')}</div>
      <img src="./${esc(e.image)}" alt="clip ${e.rang}" loading="lazy">
      <figcaption>
        <div class="meta">${esc(e.fichier)} · ${esc(e.heure)} · ${e.duree}s</div>
        <input list="exos" value="${esc(e.exercice || '')}"
               placeholder="${esc(e.hypothese || 'nom de l\u2019exercice')}"
               data-rang="${e.rang}">
      </figcaption>
    </figure>`).join('');

const options = noms.map((n) => `<option value="${esc(n.nom)}">${esc(n.groupe)}${deja.has(n.nom) ? ' \u2713 deja utilise' : ''}</option>`).join('');

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Tournage \u2014 nommer les clips</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; padding:24px; background:#1e0050; color:#fff;
         font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
  h1 { font-size:22px; margin:0 0 4px; }
  .sous { color:#ffffff99; margin:0 0 20px; font-size:14px; }
  .barre { position:sticky; top:0; z-index:5; background:#1e0050ee; backdrop-filter:blur(8px);
           padding:12px 0 14px; margin-bottom:12px; border-bottom:1px solid #ffffff26;
           display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  button { background:#fff; color:#5b21b6; border:0; border-radius:10px; padding:9px 16px;
           font-weight:700; font-size:14px; cursor:pointer; }
  button.sec { background:#ffffff1a; color:#fff; border:1px solid #ffffff33; }
  .compteur { color:#ffffff99; font-size:14px; }
  .grille { display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }
  .carte { margin:0; background:#ffffff14; border:1px solid #ffffff26; border-radius:14px;
           overflow:hidden; position:relative; }
  .carte.ok { border-color:#22c55e66; }
  .carte.todo { border-color:#f59e0b88; }
  .num { position:absolute; top:8px; left:8px; background:#000000b3; padding:2px 9px;
         border-radius:20px; font-weight:700; font-size:13px; }
  img { width:100%; display:block; background:#000; cursor:zoom-in; }
  figcaption { padding:10px 12px 12px; }
  .meta { color:#ffffff80; font-size:12px; margin-bottom:7px; }
  input { width:100%; box-sizing:border-box; background:#00000040; color:#fff;
          border:1px solid #ffffff33; border-radius:8px; padding:8px 10px; font-size:14px; }
  input:focus { outline:none; border-color:#a855f7; }
  #sortie { width:100%; box-sizing:border-box; min-height:150px; margin-top:16px; display:none;
            background:#00000059; color:#fff; border:1px solid #ffffff33; border-radius:10px;
            padding:12px; font-family:ui-monospace,Consolas,monospace; font-size:13px; }
  dialog { border:0; background:#000; padding:0; max-width:96vw; }
  dialog img { cursor:zoom-out; max-height:92vh; width:auto; }
</style></head><body>
<h1>Tournage du 16 août \u2014 nommer les clips</h1>
<p class="sous">Bordure verte : identifié. Bordure orange : à toi de jouer. Clique une image pour l\u2019agrandir.</p>
<div class="barre">
  <button id="copier">Copier le tableau</button>
  <button class="sec" id="vider">Ne montrer que les manquants</button>
  <span class="compteur" id="compteur"></span>
</div>
<div class="grille">${cartes}</div>
<datalist id="exos">${options}</datalist>
<textarea id="sortie" readonly></textarea>
<dialog id="zoom"><img></dialog>
<script>
  const champs = [...document.querySelectorAll('input[data-rang]')];
  const maj = () => {
    const n = champs.filter((c) => c.value.trim()).length;
    document.getElementById('compteur').textContent = n + ' / ' + champs.length + ' nommés';
    champs.forEach((c) => {
      const carte = c.closest('.carte');
      carte.classList.toggle('ok', !!c.value.trim());
      carte.classList.toggle('todo', !c.value.trim());
    });
  };
  champs.forEach((c) => c.addEventListener('input', maj));
  maj();

  document.getElementById('copier').onclick = async () => {
    const lignes = champs.map((c) => c.dataset.rang.padStart(2, '0') + ' = ' + (c.value.trim() || '?'));
    const texte = lignes.join(String.fromCharCode(10));
    const zone = document.getElementById('sortie');
    zone.style.display = 'block';
    zone.value = texte;
    zone.select();
    try { await navigator.clipboard.writeText(texte); } catch (e) { document.execCommand('copy'); }
  };

  let filtre = false;
  document.getElementById('vider').onclick = (ev) => {
    filtre = !filtre;
    ev.target.textContent = filtre ? 'Tout remontrer' : 'Ne montrer que les manquants';
    document.querySelectorAll('.carte').forEach((k) => {
      const vide = !k.querySelector('input').value.trim();
      k.style.display = (!filtre || vide) ? '' : 'none';
    });
  };

  const zoom = document.getElementById('zoom');
  document.querySelectorAll('.grille img').forEach((im) => {
    im.onclick = () => { zoom.querySelector('img').src = im.src; zoom.showModal(); };
  });
  zoom.onclick = () => zoom.close();
<\/script>
</body></html>`;

const sortie = path.join(dossier, 'index.html');
fs.writeFileSync(sortie, html, 'utf8');
console.log('page ecrite : ' + sortie);
console.log('clips : ' + idx.length + ' | noms proposes en autocompletion : ' + noms.length);
