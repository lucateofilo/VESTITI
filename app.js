'use strict';

// ---------- Dati fissi ----------
// size: quale taglia del profilo usare; labelM: nome per l'armadio da uomo; women: solo per donna
const CATEGORIES = [
  { id: 'top', label: 'Magliette & Top', labelM: 'Magliette & Polo', ic: 'top', size: 'top' },
  { id: 'shirt', label: 'Camicie', ic: 'shirt', size: 'top' },
  { id: 'knit', label: 'Maglioni & Felpe', ic: 'knit', size: 'top' },
  { id: 'outer', label: 'Giacche & Cappotti', ic: 'outer', size: 'top' },
  { id: 'suit', label: 'Completi & Blazer', ic: 'suit', size: 'top' },
  { id: 'pants', label: 'Pantaloni & Jeans', ic: 'pants', size: 'bottom' },
  { id: 'skirt', label: 'Gonne & Shorts', labelM: 'Shorts & Bermuda', ic: 'skirt', size: 'bottom' },
  { id: 'dress', label: 'Vestiti', ic: 'dress', size: 'top', women: true },
  { id: 'shoes', label: 'Scarpe', ic: 'shoes', size: 'shoes' },
  { id: 'bag', label: 'Borse', labelM: 'Borse & Zaini', ic: 'bag' },
  { id: 'acc', label: 'Accessori', ic: 'acc' },
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

const GENDERS = [
  { id: 'w', label: 'Donna', icon: 'icon-w.svg' },
  { id: 'm', label: 'Uomo', icon: 'icon-m.svg' },
  { id: 'x', label: 'Entrambi / Unisex', icon: 'icon-x.svg' },
];

const STYLES = [
  { id: 'casual', label: 'Casual', ic: 'shoes' },
  { id: 'elegante', label: 'Elegante', ic: 'sparkles' },
  { id: 'classico', label: 'Classico', ic: 'hat' },
  { id: 'minimal', label: 'Minimal', ic: 'square' },
  { id: 'sportivo', label: 'Sportivo', ic: 'activity' },
  { id: 'streetwear', label: 'Streetwear', ic: 'cap' },
  { id: 'business', label: 'Business', ic: 'briefcase' },
  { id: 'boho', label: 'Boho', ic: 'flower' },
  { id: 'vintage', label: 'Vintage', ic: 'radio' },
  { id: 'romantico', label: 'Romantico', ic: 'heart' },
  { id: 'rock', label: 'Rock', ic: 'zap' },
  { id: 'preppy', label: 'Preppy', ic: 'grad' },
];

const OCCASIONS = [
  { id: 'lavoro', label: 'Lavoro', ic: 'briefcase' },
  { id: 'università', label: 'Scuola / Università', ic: 'book' },
  { id: 'tempo libero', label: 'Tempo libero', ic: 'coffee' },
  { id: 'sport', label: 'Sport', ic: 'dumbbell' },
  { id: 'serata', label: 'Serate', ic: 'glass' },
  { id: 'cerimonia', label: 'Cerimonie & Eventi', ic: 'gem' },
  { id: 'viaggio', label: 'Viaggi', ic: 'plane' },
  { id: 'appuntamento', label: 'Appuntamenti', ic: 'heart' },
];

const SIZES_TOP = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SIZES_BOTTOM = {
  w: ['36', '38', '40', '42', '44', '46', '48', '50', '52'],
  m: ['42', '44', '46', '48', '50', '52', '54', '56', '58'],
};
const SIZES_SHOES = Array.from({ length: 15 }, (_, i) => String(34 + i)); // 34–48

const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const colorById = Object.fromEntries(COLORS.map(c => [c.id, c]));
const seasonById = Object.fromEntries(SEASONS.map(s => [s.id, s]));
const styleById = Object.fromEntries(STYLES.map(s => [s.id, s]));
const occasionById = Object.fromEntries(OCCASIONS.map(o => [o.id, o]));
const genderById = Object.fromEntries(GENDERS.map(g => [g.id, g]));

// ---------- Profilo (salvato nel browser) ----------
const PROFILE_KEY = 'armadio-profile';

function emptyProfile() {
  return { name: '', gender: '', styles: [], colors: [], occasions: [], sizes: { top: '', bottom: '', shoes: '' } };
}

function cleanProfile(raw) {
  const p = emptyProfile();
  if (!raw || typeof raw !== 'object') return p;
  p.name = String(raw.name || '').slice(0, 30);
  p.gender = genderById[raw.gender] ? raw.gender : '';
  p.styles = Array.isArray(raw.styles) ? raw.styles.filter(s => styleById[s]) : [];
  p.colors = Array.isArray(raw.colors) ? raw.colors.filter(c => colorById[c]) : [];
  p.occasions = Array.isArray(raw.occasions) ? raw.occasions.filter(o => occasionById[o]) : [];
  const sz = raw.sizes || {};
  p.sizes = { top: String(sz.top || ''), bottom: String(sz.bottom || ''), shoes: String(sz.shoes || '') };
  p.done = !!raw.done;
  return p;
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? cleanProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function saveProfile(p) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* storage non disponibile */ }
}

let profile = loadProfile() || emptyProfile();

function catLabel(c) {
  return profile.gender === 'm' && c.labelM ? c.labelM : c.label;
}

function visibleCategories() {
  return CATEGORIES.filter(c => !(c.women && profile.gender === 'm'));
}

// ---------- Database (IndexedDB, tutto resta sul dispositivo) ----------
const DB_NAME = 'armadio';
const STORE = 'items';
const OUTFITS = 'outfits';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
      if (!d.objectStoreNames.contains(OUTFITS)) d.createObjectStore(OUTFITS, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const dbPromise = openDb();

async function tx(storeName, mode, fn) {
  const database = await dbPromise;
  return new Promise((resolve, reject) => {
    const t = database.transaction(storeName, mode);
    const result = fn(t.objectStore(storeName));
    t.oncomplete = () => resolve(result && 'result' in result ? result.result : undefined);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const db = {
  all: () => tx(STORE, 'readonly', s => s.getAll()),
  put: item => tx(STORE, 'readwrite', s => s.put(item)),
  remove: id => tx(STORE, 'readwrite', s => s.delete(id)),
  allOutfits: () => tx(OUTFITS, 'readonly', s => s.getAll()),
  putOutfit: o => tx(OUTFITS, 'readwrite', s => s.put(o)),
  removeOutfit: id => tx(OUTFITS, 'readwrite', s => s.delete(id)),
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
  view: 'wardrobe',
  outfits: [],      // outfit salvati
  current: null,    // outfit generato: { pieces: [{slot, id}], occasion, season }
  locked: new Set(),
  lastSig: '',
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
        catById[it.category] && catLabel(catById[it.category]), colorById[it.color]?.label].join(' ').toLowerCase();
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
  const make = (id, ...label) => el('button', {
    class: 'chip',
    'aria-pressed': String(state.category === id),
    onclick: () => { state.category = state.category === id && id ? '' : id; render(); },
  }, ...label);
  wrap.append(make('', `Tutto (${state.items.length})`));
  for (const c of CATEGORIES) {
    if (counts[c.id]) wrap.append(make(c.id, icon(c.ic), ` ${catLabel(c)} (${counts[c.id]})`));
  }
}

function renderGrid() {
  const list = filteredItems();
  const grid = $('#grid');
  grid.replaceChildren(...list.map(it => {
    const url = photoUrl(it);
    return el('button', { class: 'card', onclick: () => openDetail(it.id), 'aria-label': it.name },
      url ? el('img', { src: url, alt: '', loading: 'lazy', class: it.cutout ? 'cutout' : '' })
          : el('div', { class: 'noimg' }, icon(catById[it.category]?.ic || 'top')),
      it.favorite ? el('span', { class: 'card-fav' }, icon('heart', 'filled')) : null,
      el('div', { class: 'card-body' },
        el('div', { class: 'card-name' }, it.name),
        el('div', { class: 'card-sub' }, swatch(it.color), catById[it.category] ? catLabel(catById[it.category]) : ''),
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

function profileIcon() {
  return genderById[profile.gender]?.icon || 'icon.svg';
}

function renderIcons() {
  const icon = profileIcon();
  $('#logo').src = icon;
  $('#favicon').href = icon;
  $('#touchIcon').href = icon;
  document.querySelectorAll('.empty-icon').forEach(i => { i.src = icon; });
}

function renderGreeting() {
  const g = $('#greeting');
  g.hidden = !profile.name;
  g.textContent = profile.name ? `Ciao, ${profile.name}!` : '';
}

function render() {
  renderIcons();
  renderGreeting();
  renderChips();
  renderGrid();
}

// ---------- Form aggiungi/modifica ----------
function fillSelects() {

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
let autoSize = ''; // ultima taglia inserita in automatico dal profilo

function fillCategorySelect(current) {
  const catSel = $('#categorySelect');
  const cats = visibleCategories();
  // Se un capo esistente ha una categoria nascosta, la mostriamo comunque
  if (current && !cats.some(c => c.id === current) && catById[current]) cats.push(catById[current]);
  catSel.replaceChildren(...cats.map(c => el('option', { value: c.id }, catLabel(c))));
}

function applyProfileSize() {
  const form = $('#itemForm');
  const key = catById[form.category.value]?.size;
  const size = key ? profile.sizes[key] : '';
  // Cambia la taglia solo se l'utente non l'ha scritta a mano
  if (form.size.value === '' || form.size.value === autoSize) {
    form.size.value = size || '';
    autoSize = size || '';
  }
}

function renderTagSuggestions() {
  const form = $('#itemForm');
  const current = parseTags(form.tags.value);
  const wanted = [...profile.styles, ...profile.occasions].filter(t => !current.includes(t));
  $('#tagSuggestions').replaceChildren(...wanted.map(t => el('button', {
    type: 'button',
    onclick: () => {
      const tags = parseTags(form.tags.value);
      tags.push(t);
      form.tags.value = tags.join(', ');
      renderTagSuggestions();
    },
  }, '+ ' + t)));
}

function openForm(item = null) {
  const form = $('#itemForm');
  form.reset();
  state.editingId = item ? item.id : null;
  state.pendingPhoto = undefined;
  state.pendingOriginal = undefined;
  bgJob++; // annulla eventuali rimozioni sfondo in corso
  setBgStatus('');
  if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
  autoSize = '';
  fillCategorySelect(item?.category);
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
    if (state.category && visibleCategories().some(c => c.id === state.category)) form.category.value = state.category;
    applyProfileSize();
    setPhotoPreview(null);
  }
  renderTagSuggestions();
  renderBgTools();
  $('#itemDialog').showModal();
}

async function onPhotoChosen(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const blob = await compressImage(file);
    bgJob++;
    setBgStatus('');
    state.pendingPhoto = blob;
    state.pendingOriginal = null; // foto nuova: nessun originale da ripristinare
    showFormPhoto(blob);
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
  if (state.pendingOriginal !== undefined) {
    if (state.pendingOriginal) item.photoOriginal = state.pendingOriginal;
    else delete item.photoOriginal;
  }
  item.cutout = !!item.photoOriginal;
  if (!item.name) return;

  try {
    await db.put(item);
  } catch (err) {
    console.error(err);
    toast('Errore nel salvataggio (memoria piena?)');
    return;
  }
  if (existing) {
    if (!item.photoOriginal) delete existing.photoOriginal;
    Object.assign(existing, item);
  } else state.items.push(item);

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
  img.classList.toggle('cutout', !!it.cutout);
  if (url) img.src = url;

  $('#detailName').textContent = it.name;
  $('#detailFav').replaceChildren(icon('heart', it.favorite ? 'filled' : ''));
  $('#detailFav').setAttribute('aria-pressed', String(!!it.favorite));

  const meta = [
    catById[it.category] && catLabel(catById[it.category]),
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
  state.locked.delete(it.id);
  $('#detailDialog').close();
  render();
  renderOutfitView();
  toast('Capo eliminato');
}

// ---------- Backup ----------
async function exportBackup() {
  const items = await Promise.all(state.items.map(async it => {
    const { photo, photoOriginal, ...rest } = it;
    return {
      ...rest,
      photo: photo ? await blobToDataUrl(photo) : null,
      photoOriginal: photoOriginal ? await blobToDataUrl(photoOriginal) : null,
    };
  }));
  const data = { app: 'armadio', version: 1, exportedAt: new Date().toISOString(), profile, items, outfits: state.outfits };
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
        if (typeof raw.photoOriginal === 'string' && raw.photoOriginal.startsWith('data:image/')) {
          item.photoOriginal = await dataUrlToBlob(raw.photoOriginal);
        }
      }
      item.cutout = !!item.photoOriginal;
      await db.put(item);
      added++;
    }
    if (data.profile) {
      profile = cleanProfile(data.profile);
      saveProfile(profile);
    }
    if (Array.isArray(data.outfits)) {
      for (const o of data.outfits) {
        if (!o || typeof o.id !== 'string' || !Array.isArray(o.pieces)) continue;
        await db.putOutfit(cleanOutfit(o));
      }
      state.outfits = await db.allOutfits();
    }
    state.items = await db.all();
    render();
    renderOutfitView();
    $('#menuDialog').close();
    toast(`Importati ${added} capi`);
  } catch (err) {
    console.error(err);
    toast('File di backup non valido');
  }
}

// ---------- Configurazione profilo ----------
const STEPS = 6;
let step = 0;
let draft = null;

function optionList(container, type, name, list, selected) {
  container.replaceChildren(...list.map(o => el('label', {},
    el('input', { type, name, value: o.id, checked: selected.includes(o.id) }),
    o.icon ? el('img', { class: 'opt-icon', src: o.icon, alt: '' })
      : o.hex ? swatch(o.id) : icon(o.ic, 'opt-ic'),
    o.label,
  )));
}

function fillSizeSelect(sel, values, current) {
  const opts = [el('option', { value: '' }, '—')];
  if (current && !values.includes(current)) values = [current, ...values];
  values.forEach(v => opts.push(el('option', { value: v }, v)));
  sel.replaceChildren(...opts);
  sel.value = current || '';
}

function buildProfileForm() {
  const f = $('#profileForm');
  f.name.value = draft.name;
  optionList($('#genderOptions'), 'radio', 'gender', GENDERS, [draft.gender]);
  optionList($('#styleOptions'), 'checkbox', 'styles', STYLES, draft.styles);
  optionList($('#favColorOptions'), 'checkbox', 'colors', COLORS, draft.colors);
  optionList($('#occasionOptions'), 'checkbox', 'occasions', OCCASIONS, draft.occasions);
  fillSizeSelect($('#sizeTop'), SIZES_TOP, draft.sizes.top);
  fillSizeSelect($('#sizeShoes'), SIZES_SHOES, draft.sizes.shoes);
  fillBottomSizes();
}

function fillBottomSizes() {
  const g = $('#profileForm').querySelector('input[name=gender]:checked')?.value || draft.gender;
  const values = g === 'w' ? SIZES_BOTTOM.w
    : g === 'm' ? SIZES_BOTTOM.m
    : [...new Set([...SIZES_BOTTOM.w, ...SIZES_BOTTOM.m])].sort((a, b) => a - b);
  fillSizeSelect($('#sizeBottom'), [...values], $('#sizeBottom').value || draft.sizes.bottom);
}

function readProfileForm() {
  const f = $('#profileForm');
  const checked = n => [...f.querySelectorAll(`input[name=${n}]:checked`)].map(i => i.value);
  return cleanProfile({
    name: f.name.value.trim(),
    gender: checked('gender')[0] || '',
    styles: checked('styles'),
    colors: checked('colors'),
    occasions: checked('occasions'),
    sizes: { top: f.sizeTop.value, bottom: f.sizeBottom.value, shoes: f.sizeShoes.value },
    done: true,
  });
}

function showStep(n) {
  step = n;
  document.querySelectorAll('#profileForm .step').forEach(s => { s.hidden = Number(s.dataset.step) !== n; });
  $('#wizProgress').replaceChildren(...Array.from({ length: STEPS }, (_, i) => el('span', { class: i <= n ? 'on' : '' })));
  $('#wizBack').hidden = n === 0;
  $('#wizSkip').hidden = n === 0 || n === STEPS - 1;
  $('#wizNext').textContent = n === 0 ? 'Inizia' : n === STEPS - 1 ? 'Fatto' : 'Avanti';
  $('#profileDialog').scrollTop = 0;
}

function openProfile() {
  draft = cleanProfile(profile);
  buildProfileForm();
  showStep(0);
  if ($('#menuDialog').open) $('#menuDialog').close();
  $('#profileDialog').showModal();
}

function finishProfile() {
  const wasMale = profile.gender === 'm';
  profile = readProfileForm();
  saveProfile(profile);
  $('#profileDialog').close();
  // Se la categoria selezionata non esiste più per questo profilo, torna a "Tutto"
  if (!wasMale && profile.gender === 'm' && state.category === 'dress' && !state.items.some(i => i.category === 'dress')) state.category = '';
  render();
  renderOutfitView();
  toast(profile.name ? `Profilo salvato, ${profile.name}!` : 'Profilo salvato');
}

function renderProfileSummary() {
  const p = profile;
  const parts = [];
  if (p.name) parts.push(p.name);
  if (p.gender) parts.push(genderById[p.gender].label);
  if (p.styles.length) parts.push('Stile: ' + p.styles.map(s => styleById[s].label).join(', '));
  if (p.colors.length) parts.push('Colori: ' + p.colors.map(c => colorById[c].label).join(', '));
  if (p.occasions.length) parts.push('Occasioni: ' + p.occasions.map(o => occasionById[o].label).join(', '));
  const sz = [p.sizes.top && `sopra ${p.sizes.top}`, p.sizes.bottom && `pantaloni ${p.sizes.bottom}`, p.sizes.shoes && `scarpe ${p.sizes.shoes}`].filter(Boolean);
  if (sz.length) parts.push('Taglie: ' + sz.join(', '));
  $('#profileSummary').textContent = parts.length ? parts.join(' · ') : 'Profilo non ancora impostato.';
}

function bindProfileEvents() {
  $('#profileForm').addEventListener('submit', e => {
    e.preventDefault();
    if (step < STEPS - 1) showStep(step + 1);
    else finishProfile();
  });
  $('#wizBack').addEventListener('click', () => showStep(Math.max(0, step - 1)));
  $('#wizSkip').addEventListener('click', () => showStep(step + 1));
  $('#genderOptions').addEventListener('change', () => {
    fillBottomSizes();
    setTimeout(() => showStep(step + 1), 200); // scelta singola: avanza da solo
  });
  $('#profileDialog').addEventListener('cancel', e => {
    // Al primo avvio, Esc salva comunque quello che c'è, per non riproporre il percorso
    if (!profile.done) { e.preventDefault(); finishProfile(); }
  });
  $('#editProfileBtn').addEventListener('click', openProfile);
  $('#menuBtn').addEventListener('click', renderProfileSummary);
  $('#itemForm').category.addEventListener('change', applyProfileSize);
  $('#itemForm').tags.addEventListener('input', renderTagSuggestions);
}

// ---------- Rimozione sfondo (sul dispositivo, con approvazione) ----------
// La libreria e il modello si scaricano solo al primo uso (~100 MB, poi restano in cache).
const BG_MODEL_URL = 'https://staticimgly.com/@imgly/background-removal-data/1.4.5/dist/';
let bgLib = null;
let bgJob = 0;          // incrementato per annullare un lavoro in corso
let bgResult = null;    // { source, cut, original } in attesa di approvazione

function editingItem() {
  return state.items.find(i => i.id === state.editingId) || null;
}

// Foto attualmente mostrata nel form e relativo originale
function formPhoto() {
  return state.pendingPhoto !== undefined ? state.pendingPhoto : editingItem()?.photo || null;
}
function formOriginal() {
  return state.pendingOriginal !== undefined ? state.pendingOriginal : editingItem()?.photoOriginal || null;
}

function showFormPhoto(blob) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = blob ? URL.createObjectURL(blob) : null;
  setPhotoPreview(previewUrl);
  renderBgTools();
}

function renderBgTools() {
  const hasPhoto = !!formPhoto();
  $('#bgTools').hidden = !hasPhoto;
  $('#bgRestoreBtn').hidden = !formOriginal();
  $('#photoPreview').classList.toggle('cutout', !!formOriginal());
}

function setBgStatus(text) {
  const s = $('#bgStatus');
  s.hidden = !text;
  s.textContent = text;
  $('#bgRemoveBtn').disabled = !!text;
}

// Ritaglia lo spazio vuoto attorno al capo e salva in WebP (o PNG) mantenendo la trasparenza
async function trimTransparent(blob, maxSide = 1000) {
  const bmp = await createImageBitmap(blob);
  const c = document.createElement('canvas');
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(bmp, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null; // non è rimasto niente: risultato inutilizzabile
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad); maxY = Math.min(height - 1, maxY + pad);
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const out = document.createElement('canvas');
  out.width = Math.round(w * scale);
  out.height = Math.round(h * scale);
  out.getContext('2d').drawImage(c, minX, minY, w, h, 0, 0, out.width, out.height);
  const webp = await new Promise(r => out.toBlob(r, 'image/webp', 0.9));
  if (webp && webp.type === 'image/webp') return webp;
  return new Promise(r => out.toBlob(r, 'image/png'));
}

async function onRemoveBackground() {
  const source = formPhoto();
  if (!source) return;
  const original = formOriginal() || source; // se è già scontornata, si riparte dall'originale
  const job = ++bgJob;
  setBgStatus('Preparo la rimozione dello sfondo…');
  try {
    if (!bgLib) bgLib = await import(window.BG_LIB_URL || './vendor/bg-removal.js');
    let lastPct = -1;
    const cut = await bgLib.removeBackground(original, {
      publicPath: window.BG_PUBLIC_PATH || BG_MODEL_URL,
      model: 'medium',
      output: { format: 'image/png' },
      progress: (key, current, total) => {
        if (job !== bgJob || !key.startsWith('fetch')) return;
        const pct = total ? Math.floor((current / total) * 100) : 0;
        if (pct !== lastPct) {
          lastPct = pct;
          setBgStatus(`Scarico il modello (solo la prima volta, meglio con Wi‑Fi)… ${pct}%`);
        }
      },
    });
    if (job !== bgJob) return; // l'utente ha cambiato foto o chiuso il form
    setBgStatus('Rifinisco…');
    const trimmed = await trimTransparent(cut);
    if (job !== bgJob) return;
    setBgStatus('');
    if (!trimmed) {
      toast('Non ho trovato il capo nella foto: tengo l\'originale');
      return;
    }
    bgResult = { cut: trimmed, original };
    openBgReview();
  } catch (err) {
    console.error(err);
    if (job !== bgJob) return;
    setBgStatus('');
    toast(navigator.onLine === false
      ? 'Serve la connessione per scaricare il modello la prima volta'
      : 'Non è stato possibile rimuovere lo sfondo');
  }
}

let reviewUrls = [];
function openBgReview() {
  reviewUrls.forEach(u => URL.revokeObjectURL(u));
  reviewUrls = [URL.createObjectURL(bgResult.original), URL.createObjectURL(bgResult.cut)];
  $('#bgBefore').src = reviewUrls[0];
  $('#bgAfter').src = reviewUrls[1];
  $('#bgReviewDialog').showModal();
}

function closeBgReview(accept) {
  if (accept && bgResult) {
    state.pendingPhoto = bgResult.cut;
    state.pendingOriginal = bgResult.original;
    showFormPhoto(bgResult.cut);
    toast('Sfondo rimosso. Tocca Salva per confermare.');
  }
  bgResult = null;
  $('#bgReviewDialog').close();
}

function onRestoreOriginal() {
  const original = formOriginal();
  if (!original) return;
  bgJob++;
  setBgStatus('');
  state.pendingPhoto = original;
  state.pendingOriginal = null;
  showFormPhoto(original);
}

function bindBgEvents() {
  $('#bgRemoveBtn').addEventListener('click', onRemoveBackground);
  $('#bgRestoreBtn').addEventListener('click', onRestoreOriginal);
  $('#bgAccept').addEventListener('click', () => closeBgReview(true));
  $('#bgReject').addEventListener('click', () => closeBgReview(false));
  // Chiudere il controllo in qualsiasi altro modo equivale a "Tieni originale"
  $('#bgReviewDialog').addEventListener('close', () => { bgResult = null; });
  $('#itemDialog').addEventListener('close', () => { bgJob++; setBgStatus(''); });
}

// ---------- Generatore di outfit ----------
const NEUTRALS = new Set(['black', 'white', 'grey', 'beige', 'navy', 'brown']);

// Stili che si addicono a ogni occasione
const OCCASION_STYLES = {
  'lavoro': ['business', 'classico', 'elegante', 'minimal', 'preppy'],
  'università': ['casual', 'streetwear', 'preppy', 'minimal', 'sportivo'],
  'tempo libero': ['casual', 'streetwear', 'boho', 'sportivo', 'vintage', 'minimal'],
  'sport': ['sportivo'],
  'serata': ['elegante', 'rock', 'streetwear', 'romantico', 'minimal'],
  'cerimonia': ['elegante', 'classico', 'romantico'],
  'viaggio': ['casual', 'sportivo', 'minimal'],
  'appuntamento': ['elegante', 'romantico', 'casual', 'minimal'],
};

// Categorie poco adatte a un'occasione
const OCCASION_AVOID = {
  'sport': ['suit', 'shirt', 'dress'],
  'cerimonia': [],
  'lavoro': [],
};

const SLOT_LABELS = { base: 'Sopra', bottom: 'Sotto', dress: 'Vestito', layer: 'Strato', shoes: 'Scarpe', bag: 'Borsa', acc: 'Accessorio' };

function currentSeason() {
  const m = new Date().getMonth(); // 0 = gennaio
  return m <= 1 || m === 11 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn';
}

function cleanOutfit(o) {
  return {
    id: String(o.id),
    pieces: o.pieces.filter(p => p && typeof p.id === 'string').map(p => ({ slot: String(p.slot || ''), id: p.id })),
    occasion: occasionById[o.occasion] ? o.occasion : '',
    season: seasonById[o.season] ? o.season : '',
    createdAt: Number(o.createdAt) || Date.now(),
  };
}

function itemFits(it, season, occasion) {
  let score = 1;
  const seasons = it.seasons || [];
  if (!seasons.length || seasons.includes(season)) score += 2;
  else score -= 2;
  const tags = it.tags || [];
  const goodStyles = OCCASION_STYLES[occasion] || [];
  if (occasion && tags.includes(occasion)) score += 3;
  if (tags.some(t => goodStyles.includes(t))) score += 2;
  if (tags.some(t => profile.styles.includes(t))) score += 1;
  if ((OCCASION_AVOID[occasion] || []).includes(it.category)) score -= 3;
  if (it.category === 'suit' && (occasion === 'lavoro' || occasion === 'cerimonia')) score += 2;
  if (profile.colors.includes(it.color)) score += 1;
  if (it.favorite) score += 1;
  score += 1 / (1 + (it.wears || 0)); // dà spazio ai capi poco usati
  return score;
}

function weightedPick(list, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1];
}

function colorScore(items) {
  const colors = items.map(i => i.color).filter(Boolean);
  const bright = [...new Set(colors.filter(c => !NEUTRALS.has(c)))];
  let score = 0;
  if (bright.length <= 1) score += 3;          // un solo colore acceso: sempre ok
  else if (bright.length === 2) score += 0;
  else score -= 3 * (bright.length - 2);       // troppi colori accesi
  if (bright.filter(c => c === 'multi').length && bright.length > 1) score -= 2; // fantasia + altri colori
  if (colors.includes('black') && colors.includes('navy')) score -= 1;
  if (colors.includes('black') && colors.includes('brown')) score -= 1;
  score += colors.filter(c => profile.colors.includes(c)).length * 0.5;
  return score;
}

function generateOutfit() {
  const occasion = $('#occasionSel').value;
  const season = $('#seasonSel').value || currentSeason();
  const byCat = cats => state.items.filter(i => cats.includes(i.category));
  const pools = {
    base: byCat(['top', 'shirt', 'knit']),
    bottom: byCat(['pants', 'skirt']),
    dress: profile.gender === 'm' ? [] : byCat(['dress']),
    layer: byCat(['outer', 'suit', 'knit']),
    shoes: byCat(['shoes']),
    bag: byCat(['bag']),
    acc: byCat(['acc']),
  };
  const canSeparates = pools.base.length && pools.bottom.length;
  if (!canSeparates && !pools.dress.length) return null;

  const locked = state.current
    ? state.current.pieces.filter(p => state.locked.has(p.id))
    : [];
  const lockedSlots = new Map(locked.map(p => [p.slot, p.id]));
  const itemOf = id => state.items.find(i => i.id === id);
  const cold = season === 'winter' || season === 'autumn';

  const pick = (slot, exclude = []) => {
    if (lockedSlots.has(slot)) return itemOf(lockedSlots.get(slot));
    const pool = pools[slot].filter(i => !exclude.includes(i.id));
    if (!pool.length) return null;
    return weightedPick(pool, pool.map(i => Math.max(0.2, itemFits(i, season, occasion))));
  };

  let best = null;
  for (let n = 0; n < 80; n++) {
    let useDress;
    if (lockedSlots.has('dress')) useDress = true;
    else if (lockedSlots.has('base') || lockedSlots.has('bottom')) useDress = false;
    else useDress = pools.dress.length && (!canSeparates || Math.random() < pools.dress.length / (pools.dress.length + pools.base.length));

    const pieces = [];
    const used = [];
    const add = (slot, it) => { if (it) { pieces.push({ slot, it }); used.push(it.id); } };

    if (useDress) add('dress', pick('dress'));
    else { add('base', pick('base')); add('bottom', pick('bottom')); }

    const wantLayer = lockedSlots.has('layer') || (pools.layer.length && (cold || occasion === 'lavoro' || occasion === 'cerimonia' ? Math.random() < 0.85 : Math.random() < 0.25));
    if (wantLayer) add('layer', pick('layer', used));
    add('shoes', pick('shoes'));
    if (lockedSlots.has('bag') || Math.random() < 0.6) add('bag', pick('bag'));
    if (lockedSlots.has('acc') || Math.random() < 0.5) add('acc', pick('acc'));

    const items = pieces.map(p => p.it);
    let score = items.reduce((a, it) => a + itemFits(it, season, occasion), 0) / items.length * 2 + colorScore(items);
    if (pools.shoes.length && !pieces.some(p => p.slot === 'shoes')) score -= 5;
    if (cold && !pieces.some(p => p.slot === 'layer') && pools.layer.length) score -= 1;
    const sig = pieces.map(p => p.it.id).sort().join('|');
    if (sig === state.lastSig) score -= 10; // non ripetere l'outfit appena visto
    score += Math.random() * 1.5;           // un po' di varietà
    if (!best || score > best.score) best = { pieces, score, sig };
  }

  state.lastSig = best.sig;
  return {
    pieces: best.pieces.map(p => ({ slot: p.slot, id: p.it.id })),
    occasion,
    season,
  };
}

function outfitReason(o) {
  const items = o.pieces.map(p => state.items.find(i => i.id === p.id)).filter(Boolean);
  const parts = [];
  if (o.occasion) parts.push(`per ${occasionById[o.occasion].label.toLowerCase()}`);
  if (o.season) parts.push(seasonById[o.season].label.toLowerCase());
  const bright = [...new Set(items.map(i => i.color).filter(c => c && !NEUTRALS.has(c)))];
  if (bright.length === 0 && items.some(i => i.color)) parts.push('tutto su colori neutri');
  else if (bright.length === 1) parts.push(`${colorById[bright[0]].label.toLowerCase()} come colore protagonista`);
  const favs = items.filter(i => profile.colors.includes(i.color));
  if (favs.length) parts.push('con i tuoi colori preferiti');
  return parts.length ? 'Pensato ' + parts.join(', ') + '.' : '';
}

function pieceEl(p, { lockable }) {
  const it = state.items.find(i => i.id === p.id);
  if (!it) return null;
  const url = photoUrl(it);
  const locked = lockable && state.locked.has(it.id);
  return el('button', {
    class: 'piece' + (locked ? ' locked' : ''),
    'aria-pressed': lockable ? String(locked) : null,
    onclick: () => {
      if (!lockable) return openDetail(it.id);
      if (state.locked.has(it.id)) state.locked.delete(it.id); else state.locked.add(it.id);
      renderCurrentOutfit();
    },
  },
    url ? el('img', { src: url, alt: '', class: it.cutout ? 'cutout' : '' }) : el('div', { class: 'noimg' }, icon(catById[it.category]?.ic || 'top')),
    locked ? el('span', { class: 'piece-lock' }, icon('lock')) : null,
    el('div', { class: 'piece-body' },
      el('div', { class: 'piece-cat' }, SLOT_LABELS[p.slot] || ''),
      el('div', { class: 'piece-name' }, it.name),
    ),
  );
}

function renderCurrentOutfit() {
  const box = $('#outfitResult');
  const o = state.current;
  if (!o) { box.replaceChildren(); return; }
  const saved = state.outfits.some(s => outfitSig(s) === outfitSig(o));
  box.replaceChildren(el('div', { class: 'outfit' },
    el('div', { class: 'outfit-pieces' }, o.pieces.map(p => pieceEl(p, { lockable: true }))),
    el('p', { class: 'outfit-why' }, outfitReason(o)),
    el('p', { class: 'outfit-hint' }, 'Tocca un capo per bloccarlo: resterà nel prossimo outfit.'),
    el('div', { class: 'actions' },
      el('button', { class: 'btn', onclick: onGenerate }, icon('refresh'), 'Un altro'),
      el('button', { class: 'btn', onclick: saveCurrentOutfit, disabled: saved }, icon('heart', saved ? 'filled' : ''), saved ? 'Salvato' : 'Salva'),
      el('button', { class: 'btn primary', onclick: () => wearOutfit(o) }, icon('check'), 'Indosso'),
    ),
  ));
}

function outfitSig(o) {
  return o.pieces.map(p => p.id).sort().join('|');
}

function onGenerate() {
  const o = generateOutfit();
  if (!o) {
    state.current = null;
    $('#outfitResult').replaceChildren(el('div', { class: 'outfit' },
      el('p', {}, 'Servono più capi per creare un outfit.'),
      el('p', { class: 'muted' }, profile.gender === 'm'
        ? 'Aggiungi almeno una maglia o camicia e un paio di pantaloni.'
        : 'Aggiungi almeno una maglia e un pantalone o una gonna, oppure un vestito.'),
    ));
    return;
  }
  // Tieni bloccati solo i capi che sono ancora nell'outfit
  state.locked = new Set([...state.locked].filter(id => o.pieces.some(p => p.id === id)));
  state.current = o;
  renderCurrentOutfit();
}

async function saveCurrentOutfit() {
  const o = state.current;
  if (!o) return;
  const outfit = { id: uid(), pieces: o.pieces, occasion: o.occasion, season: o.season, createdAt: Date.now() };
  await db.putOutfit(outfit);
  state.outfits.push(outfit);
  renderCurrentOutfit();
  renderSavedOutfits();
  toast('Outfit salvato');
}

async function wearOutfit(o) {
  const now = Date.now();
  for (const p of o.pieces) {
    const it = state.items.find(i => i.id === p.id);
    if (!it) continue;
    it.wears = (it.wears || 0) + 1;
    it.lastWorn = now;
    await db.put(it);
  }
  render();
  toast('Buona giornata! Outfit segnato come indossato');
}

function renderSavedOutfits() {
  const wrap = $('#savedOutfits');
  const list = state.outfits
    .map(o => ({ ...o, pieces: o.pieces.filter(p => state.items.some(i => i.id === p.id)) }))
    .filter(o => o.pieces.length)
    .sort((a, b) => b.createdAt - a.createdAt);
  if (!list.length) {
    wrap.replaceChildren(el('p', { class: 'muted' }, 'Nessun outfit salvato. Genera un outfit e tocca Salva.'));
    return;
  }
  wrap.replaceChildren(el('div', { class: 'saved' }, list.map(o => el('div', { class: 'saved-row' },
    el('button', {
      class: 'saved-thumbs',
      'aria-label': 'Apri outfit',
      onclick: () => {
        state.current = { pieces: o.pieces, occasion: o.occasion, season: o.season };
        state.locked = new Set();
        renderCurrentOutfit();
        $('#outfitResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }, o.pieces.map(p => {
      const it = state.items.find(i => i.id === p.id);
      const url = photoUrl(it);
      return url ? el('img', { src: url, alt: it.name, class: it.cutout ? 'cutout' : '' }) : el('div', { class: 'noimg' }, icon(catById[it.category]?.ic || 'top'));
    })),
    el('div', { class: 'saved-meta' },
      el('div', {}, o.occasion ? occasionById[o.occasion].label : ''),
      el('div', {}, new Date(o.createdAt).toLocaleDateString('it-IT')),
      el('button', {
        class: 'btn small ghost',
        'aria-label': 'Elimina outfit',
        onclick: async () => {
          if (!confirm('Eliminare questo outfit?')) return;
          await db.removeOutfit(o.id);
          state.outfits = state.outfits.filter(x => x.id !== o.id);
          renderSavedOutfits();
          renderCurrentOutfit();
        },
      }, icon('trash')),
    ),
  ))));
}

function fillOutfitControls() {
  const occ = $('#occasionSel');
  const prev = occ.value;
  const mine = OCCASIONS.filter(o => profile.occasions.includes(o.id));
  const others = OCCASIONS.filter(o => !profile.occasions.includes(o.id));
  occ.replaceChildren(
    el('option', { value: '' }, 'Qualsiasi'),
    ...[...mine, ...others].map(o => el('option', { value: o.id }, o.label)),
  );
  occ.value = prev || mine[0]?.id || '';

  const sea = $('#seasonSel');
  if (!sea.options.length) {
    sea.append(el('option', { value: '' }, `Adesso (${seasonById[currentSeason()].label})`));
    SEASONS.forEach(s => sea.append(el('option', { value: s.id }, s.label)));
  }
}

function renderOutfitView() {
  fillOutfitControls();
  if (state.current) {
    state.current.pieces = state.current.pieces.filter(p => state.items.some(i => i.id === p.id));
    if (!state.current.pieces.length) state.current = null;
  }
  renderCurrentOutfit();
  renderSavedOutfits();
}

function showView(view) {
  state.view = view;
  $('#wardrobeView').hidden = view !== 'wardrobe';
  $('#wardrobeTools').hidden = view !== 'wardrobe';
  $('#outfitView').hidden = view !== 'outfit';
  $('#addBtn').hidden = view !== 'wardrobe';
  $('#pageTitle').textContent = view === 'outfit' ? 'Outfit' : 'Il mio Armadio';
  document.querySelectorAll('.tab').forEach(t => {
    if (t.dataset.view === view) t.setAttribute('aria-current', 'page');
    else t.removeAttribute('aria-current');
  });
  if (view === 'outfit') {
    renderOutfitView();
    if (!state.current && state.items.length) onGenerate();
  }
  window.scrollTo(0, 0);
}

function bindOutfitEvents() {
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  $('#generateBtn').addEventListener('click', onGenerate);
  $('#occasionSel').addEventListener('change', onGenerate);
  $('#seasonSel').addEventListener('change', onGenerate);
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
  document.querySelectorAll('dialog:not(.wizard)').forEach(d => d.addEventListener('click', e => {
    if (e.target === d) d.close();
  }));

  $('#search').addEventListener('input', e => { state.query = e.target.value; renderGrid(); });
  $('#colorFilter').addEventListener('change', e => { state.color = e.target.value; renderGrid(); });
  $('#seasonFilter').addEventListener('change', e => { state.season = e.target.value; renderGrid(); });
  $('#sortBy').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  $('#favFilter').addEventListener('click', e => {
    state.favOnly = !state.favOnly;
    e.currentTarget.setAttribute('aria-pressed', String(state.favOnly));
    e.currentTarget.replaceChildren(icon('heart', state.favOnly ? 'filled' : ''));
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
  hydrateIcons();
  fillSelects();
  bindEvents();
  bindProfileEvents();
  bindOutfitEvents();
  bindBgEvents();
  try {
    state.items = await db.all();
    state.outfits = await db.allOutfits();
    // Chiede al browser di non cancellare i dati quando lo spazio scarseggia
    navigator.storage?.persist?.();
  } catch (err) {
    console.error(err);
    toast('Il browser non permette di salvare i dati');
  }
  render();
  if (!profile.done) openProfile();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
}

init();
