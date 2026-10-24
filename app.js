'use strict';

// ---------- Dati fissi ----------
const CATEGORIES = [
  { id: 'top', label: 'Magliette & Top', emoji: '👕' },
  { id: 'shirt', label: 'Camicie', emoji: '👔' },
  { id: 'knit', label: 'Maglioni & Felpe', emoji: '🧶' },
  { id: 'outer', label: 'Giacche & Cappotti', emoji: '🧥' },
  { id: 'pants', label: 'Pantaloni & Jeans', emoji: '👖' },
  { id: 'skirt', label: 'Gonne & Shorts', emoji: '🩳' },
  { id: 'dress', label: 'Vestiti', emoji: '👗' },
  { id: 'shoes', label: 'Scarpe', emoji: '👟' },
  { id: 'bag', label: 'Borse', emoji: '👜' },
  { id: 'acc', label: 'Accessori', emoji: '🧣' },
];

const COLORS = [
  { id: 'black', label: 'Nero', hex: '#111111' },
  { id: 'white', label: 'Bianco', hex: '#ffffff' },
  { id: 'grey', label: 'Grigio', hex: '#9e9e9e' },
  { id: 'beige', label: 'Beige', hex: '#d8c3a5' },
  { id: 'brown', label: 'Marrone', hex: '#7b4a2d' },
  { id: 'navy', label: 'Blu navy', hex: '#1f2f5c' },
  { id: 'blue', label: 'Blu', hex: '#2f6fd6' },
  { id: 'lightblue', label: 'Azzurro', hex: '#8ec5ff' },
  { id: 'green', label: 'Verde', hex: '#3a8a4f' },
  { id: 'yellow', label: 'Giallo', hex: '#f2c94c' },
  { id: 'orange', label: 'Arancione', hex: '#f2994a' },
  { id: 'red', label: 'Rosso', hex: '#d63a3a' },
  { id: 'pink', label: 'Rosa', hex: '#f3a6c0' },
  { id: 'purple', label: 'Viola', hex: '#8e5bd1' },
  { id: 'multi', label: 'Fantasia', hex: 'conic-gradient(#d63a3a, #f2c94c, #3a8a4f, #2f6fd6, #8e5bd1, #d63a3a)' },
];

const SEASONS = [
  { id: 'spring', label: 'Primavera' },
  { id: 'summer', label: 'Estate' },
  { id: 'autumn', label: 'Autunno' },
  { id: 'winter', label: 'Inverno' },
];

const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const colorById = Object.fromEntries(COLORS.map(c => [c.id, c]));
const seasonById = Object.fromEntries(SEASONS.map(s => [s.id, s]));

// ---------- Database (IndexedDB, tutto resta sul dispositivo) ----------
const DB_NAME = 'armadio';
const STORE = 'items';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const dbPromise = openDb();

async function tx(mode, fn) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const result = fn(store);
    t.oncomplete = () => resolve(result && 'result' in result ? result.result : undefined);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const db = {
  all: () => tx('readonly', s => s.getAll()),
  put: item => tx('readwrite', s => s.put(item)),
  remove: id => tx('readwrite', s => s.delete(id)),
};

// ---------- Stato ----------
const state = {
  items: [],
  category: '',
  color: '',
  season: '',
  favOnly: false,
  query: '',
  sort: 'new',
  editingId: null,
  pendingPhoto: undefined, // Blob nuovo scelto nel form (undefined = nessun cambio)
  detailId: null,
};

const urlCache = new Map(); // id -> objectURL della foto

function photoUrl(item) {
  if (!item.photo) return null;
  const cached = urlCache.get(item.id);
  if (cached && cached.blob === item.photo) return cached.url;
  if (cached) URL.revokeObjectURL(cached.url);
  const url = URL.createObjectURL(item.photo);
  urlCache.set(item.id, { blob: item.photo, url });
  return url;
}

// ---------- Utility ----------
const $ = sel => document.querySelector(sel);

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

function swatch(colorId) {
  const c = colorById[colorId];
  if (!c) return null;
  return el('span', { class: 'swatch', style: `background:${c.hex}`, title: c.label });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function parseTags(str) {
  return [...new Set(str.split(',').map(t => t.trim().toLowerCase()).filter(Boolean))];
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2500);
}

// Riduce la foto (max 1000px, JPEG) per non riempire la memoria del telefono.
async function compressImage(file, maxSide = 1000, quality = 0.82) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bitmap = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

// ---------- Filtri e render ----------
function filteredItems() {
  const q = state.query.trim().toLowerCase();
  let list = state.items.filter(it => {
    if (state.category && it.category !== state.category) return false;
    if (state.color && it.color !== state.color) return false;
    if (state.season && !(it.seasons || []).includes(state.season)) return false;
    if (state.favOnly && !it.favorite) return false;
    if (q) {
      const hay = [it.name, it.brand, it.notes, ...(it.tags || []),
        catById[it.category]?.label, colorById[it.color]?.label].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const byName = (a, b) => a.name.localeCompare(b.name, 'it');
  const sorters = {
    new: (a, b) => b.createdAt - a.createdAt,
    name: byName,
    worn: (a, b) => (b.wears || 0) - (a.wears || 0) || byName(a, b),
    least: (a, b) => (a.wears || 0) - (b.wears || 0) || byName(a, b),
  };
  return list.sort(sorters[state.sort]);
}

function renderChips() {
  const wrap = $('#categoryChips');
  wrap.replaceChildren();
  const counts = {};
  for (const it of state.items) counts[it.category] = (counts[it.category] || 0) + 1;
  const make = (id, label) => el('button', {
    class: 'chip',
    'aria-pressed': String(state.category === id),
    onclick: () => { state.category = state.category === id && id ? '' : id; render(); },
  }, label);
  wrap.append(make('', `Tutto (${state.items.length})`));
  for (const c of CATEGORIES) {
    if (counts[c.id]) wrap.append(make(c.id, `${c.emoji} ${c.label} (${counts[c.id]})`));
  }
}

function renderGrid() {
  const list = filteredItems();
  const grid = $('#grid');
  grid.replaceChildren(...list.map(it => {
    const url = photoUrl(it);
    return el('button', { class: 'card', onclick: () => openDetail(it.id), 'aria-label': it.name },
      url ? el('img', { src: url, alt: '', loading: 'lazy' })
          : el('div', { class: 'noimg' }, catById[it.category]?.emoji || '👚'),
      it.favorite ? el('span', { class: 'card-fav' }, '♥') : null,
      el('div', { class: 'card-body' },
        el('div', { class: 'card-name' }, it.name),
        el('div', { class: 'card-sub' }, swatch(it.color), catById[it.category]?.label || ''),
      ),
    );
  }));

  const total = state.items.length;
  $('#empty').hidden = total !== 0;
  if (total === 0) $('#stats').textContent = '';
  else if (list.length === total) $('#stats').textContent = `${total} ${total === 1 ? 'capo' : 'capi'} nell'armadio`;
  else $('#stats').textContent = `${list.length} di ${total} capi`;
  if (total > 0 && list.length === 0) {
    grid.append(el('p', { class: 'muted', style: 'grid-column:1/-1;text-align:center' }, 'Nessun capo con questi filtri.'));
  }
}

function render() {
  renderChips();
  renderGrid();
}

// ---------- Form aggiungi/modifica ----------
function fillSelects() {
  const catSel = $('#categorySelect');
  CATEGORIES.forEach(c => catSel.append(el('option', { value: c.id }, `${c.emoji} ${c.label}`)));

  const colorSel = $('#colorSelect');
  colorSel.append(el('option', { value: '' }, '—'));
  COLORS.forEach(c => colorSel.append(el('option', { value: c.id }, c.label)));

  const colorFilter = $('#colorFilter');
  COLORS.forEach(c => colorFilter.append(el('option', { value: c.id }, c.label)));

  const seasonFilter = $('#seasonFilter');
  SEASONS.forEach(s => seasonFilter.append(el('option', { value: s.id }, s.label)));

  const checks = $('#seasonChecks');
  SEASONS.forEach(s => checks.append(
    el('label', {}, el('input', { type: 'checkbox', name: 'seasons', value: s.id }), s.label),
  ));
}

function setPhotoPreview(url) {
  const img = $('#photoPreview');
  if (url) {
    img.src = url;
    img.hidden = false;
    $('#photoPlaceholder').hidden = true;
  } else {
    img.removeAttribute('src');
    img.hidden = true;
    $('#photoPlaceholder').hidden = false;
  }
}

let previewUrl = null;

function openForm(item = null) {
  const form = $('#itemForm');
  form.reset();
  state.editingId = item ? item.id : null;
  state.pendingPhoto = undefined;
  if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
  $('#itemDialogTitle').textContent = item ? 'Modifica capo' : 'Nuovo capo';

  if (item) {
    form.name.value = item.name;
    form.category.value = item.category;
    form.color.value = item.color || '';
    form.brand.value = item.brand || '';
    form.size.value = item.size || '';
    form.tags.value = (item.tags || []).join(', ');
    form.notes.value = item.notes || '';
    form.querySelectorAll('input[name=seasons]').forEach(cb => { cb.checked = (item.seasons || []).includes(cb.value); });
    setPhotoPreview(photoUrl(item));
  } else {
    if (state.category) form.category.value = state.category;
    setPhotoPreview(null);
  }
  $('#itemDialog').showModal();
}

async function onPhotoChosen(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const blob = await compressImage(file);
    state.pendingPhoto = blob;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(blob);
    setPhotoPreview(previewUrl);
  } catch (err) {
    console.error(err);
    toast('Impossibile leggere questa foto');
  }
}

async function onSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const existing = state.items.find(i => i.id === state.editingId);
  const item = {
    ...(existing || { id: uid(), createdAt: Date.now(), wears: 0, favorite: false }),
    name: form.name.value.trim(),
    category: form.category.value,
    color: form.color.value,
    seasons: [...form.querySelectorAll('input[name=seasons]:checked')].map(cb => cb.value),
    brand: form.brand.value.trim(),
    size: form.size.value.trim(),
    tags: parseTags(form.tags.value),
    notes: form.notes.value.trim(),
  };
  if (state.pendingPhoto !== undefined) item.photo = state.pendingPhoto;
  if (!item.name) return;

  try {
    await db.put(item);
  } catch (err) {
    console.error(err);
    toast('Errore nel salvataggio (memoria piena?)');
    return;
  }
  if (existing) Object.assign(existing, item);
  else state.items.push(item);

  $('#itemDialog').close();
  render();
  if (existing && state.detailId === item.id) renderDetail();
  toast(existing ? 'Capo aggiornato' : 'Capo aggiunto all\'armadio');
}

// ---------- Dettaglio ----------
function openDetail(id) {
  state.detailId = id;
  renderDetail();
  $('#detailDialog').showModal();
}

function renderDetail() {
  const it = state.items.find(i => i.id === state.detailId);
  if (!it) return;
  const url = photoUrl(it);
  const img = $('#detailImg');
  img.hidden = !url;
  if (url) img.src = url;

  $('#detailName').textContent = it.name;
  $('#detailFav').textContent = it.favorite ? '♥' : '♡';
  $('#detailFav').setAttribute('aria-pressed', String(!!it.favorite));

  const meta = [
    catById[it.category]?.label,
    colorById[it.color]?.label,
    it.brand,
    it.size && `Taglia ${it.size}`,
    (it.seasons || []).map(s => seasonById[s]?.label).filter(Boolean).join(', '),
  ].filter(Boolean);
  $('#detailMeta').replaceChildren(swatch(it.color) || '', ' ', meta.join(' · '));

  $('#detailTags').replaceChildren(...(it.tags || []).map(t => el('span', { class: 'tag' }, '#' + t)));
  $('#detailNotes').textContent = it.notes || '';

  const w = it.wears || 0;
  let wearText = w === 0 ? 'Mai indossato' : `Indossato ${w} ${w === 1 ? 'volta' : 'volte'}`;
  if (it.lastWorn) wearText += ` · ultima: ${new Date(it.lastWorn).toLocaleDateString('it-IT')}`;
  $('#detailWears').textContent = wearText;
}

async function updateDetailItem(changes, message) {
  const it = state.items.find(i => i.id === state.detailId);
  if (!it) return;
  Object.assign(it, changes);
  await db.put(it);
  renderDetail();
  render();
  if (message) toast(message);
}

async function deleteCurrent() {
  const it = state.items.find(i => i.id === state.detailId);
  if (!it || !confirm(`Eliminare "${it.name}"?`)) return;
  await db.remove(it.id);
  state.items = state.items.filter(i => i.id !== it.id);
  const cached = urlCache.get(it.id);
  if (cached) { URL.revokeObjectURL(cached.url); urlCache.delete(it.id); }
  $('#detailDialog').close();
  render();
  toast('Capo eliminato');
}

// ---------- Backup ----------
async function exportBackup() {
  const items = await Promise.all(state.items.map(async it => {
    const { photo, ...rest } = it;
    return { ...rest, photo: photo ? await blobToDataUrl(photo) : null };
  }));
  const data = { app: 'armadio', version: 1, exportedAt: new Date().toISOString(), items };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const a = el('a', {
    href: URL.createObjectURL(blob),
    download: `armadio-backup-${new Date().toISOString().slice(0, 10)}.json`,
  });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`Backup esportato (${items.length} capi)`);
}

async function importBackup(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'armadio' || !Array.isArray(data.items)) throw new Error('formato non valido');
    let added = 0;
    for (const raw of data.items) {
      if (!raw || typeof raw.id !== 'string' || typeof raw.name !== 'string') continue;
      const item = {
        id: raw.id,
        name: raw.name.slice(0, 60),
        category: catById[raw.category] ? raw.category : 'acc',
        color: colorById[raw.color] ? raw.color : '',
        seasons: Array.isArray(raw.seasons) ? raw.seasons.filter(s => seasonById[s]) : [],
        brand: String(raw.brand || ''),
        size: String(raw.size || ''),
        tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
        notes: String(raw.notes || ''),
        favorite: !!raw.favorite,
        wears: Number(raw.wears) || 0,
        lastWorn: raw.lastWorn || null,
        createdAt: Number(raw.createdAt) || Date.now(),
      };
      if (typeof raw.photo === 'string' && raw.photo.startsWith('data:image/')) {
        item.photo = await dataUrlToBlob(raw.photo);
      }
      await db.put(item);
      added++;
    }
    state.items = await db.all();
    render();
    $('#menuDialog').close();
    toast(`Importati ${added} capi`);
  } catch (err) {
    console.error(err);
    toast('File di backup non valido');
  }
}

// ---------- Avvio ----------
function bindEvents() {
  $('#addBtn').addEventListener('click', () => openForm());
  $('#menuBtn').addEventListener('click', () => $('#menuDialog').showModal());
  $('#photoInput').addEventListener('change', onPhotoChosen);
  $('#itemForm').addEventListener('submit', onSubmit);

  document.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => b.closest('dialog').close()));

  // Chiude i dialog toccando lo sfondo
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => {
    if (e.target === d) d.close();
  }));

  $('#search').addEventListener('input', e => { state.query = e.target.value; renderGrid(); });
  $('#colorFilter').addEventListener('change', e => { state.color = e.target.value; renderGrid(); });
  $('#seasonFilter').addEventListener('change', e => { state.season = e.target.value; renderGrid(); });
  $('#sortBy').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  $('#favFilter').addEventListener('click', e => {
    state.favOnly = !state.favOnly;
    e.currentTarget.setAttribute('aria-pressed', String(state.favOnly));
    e.currentTarget.textContent = state.favOnly ? '♥' : '♡';
    renderGrid();
  });

  $('#detailFav').addEventListener('click', () => {
    const it = state.items.find(i => i.id === state.detailId);
    if (it) updateDetailItem({ favorite: !it.favorite });
  });
  $('#wearBtn').addEventListener('click', () => {
    const it = state.items.find(i => i.id === state.detailId);
    if (it) updateDetailItem({ wears: (it.wears || 0) + 1, lastWorn: Date.now() }, 'Segnato come indossato oggi');
  });
  $('#editBtn').addEventListener('click', () => {
    const it = state.items.find(i => i.id === state.detailId);
    if (it) openForm(it);
  });
  $('#deleteBtn').addEventListener('click', deleteCurrent);

  $('#exportBtn').addEventListener('click', exportBackup);
  $('#importInput').addEventListener('change', importBackup);
}

async function init() {
  fillSelects();
  bindEvents();
  try {
    state.items = await db.all();
    // Chiede al browser di non cancellare i dati quando lo spazio scarseggia
    navigator.storage?.persist?.();
  } catch (err) {
    console.error(err);
    toast('Il browser non permette di salvare i dati');
  }
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
}

init();
