'use strict';
// Icone SVG a linea sottile (stile ispirato a Lucide, licenza ISC). Colore = currentColor.
const ICONS = {
  // Categorie
  top: '<path d="M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.1a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.3-2.2z"/>',
  shirt: '<path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3"/><path d="M8 3l1.5 4.5L12 6l2.5 1.5L16 3"/><path d="M12 6v15"/><path d="M13.6 11h.01M13.6 15h.01"/>',
  knit: '<path d="M8 3c1 1.4 2.4 2 4 2s3-.6 4-2l4 2.2 1 12.8h-3l-1-7.5V21H7V10.5L6 18H3L4 5.2z"/><path d="M7 18.5h10"/>',
  outer: '<path d="M8 3 4 5.5V21h5v-9"/><path d="M16 3l4 2.5V21h-5v-9"/><path d="M8 3l4 5 4-5"/><path d="M12 8v13"/><path d="M9 21h6"/>',
  suit: '<path d="M8 3 4 5.5V21h16V5.5L16 3"/><path d="M8 3l4 6 4-6"/><path d="M12 9l-1.2 2.5L12 17l1.2-5.5z"/>',
  pants: '<path d="M6 3h12l1.2 18h-5L12 10l-2.2 11h-5z"/><path d="M6.2 6.5h11.6"/>',
  skirt: '<path d="M7 3h10l4 18H3z"/><path d="M6.6 6.5h10.8"/><path d="M10 6.5 8.5 21M14 6.5l1.5 14.5"/>',
  dress: '<path d="M9 2v4l-2 5 1 1.5L4 22h16l-4-9.5L17 11l-2-5V2"/><path d="M9 6h6"/><path d="M8 12.5h8"/>',
  shoes: '<path d="M3 16V8.5l4 1 2.5-2.5L13 11l6 2c1.6.5 2 1.6 2 3v2H3z"/><path d="M3 16h18"/><path d="M10 10.5l1-1M12 12l1-1"/>',
  bag: '<path d="M5 8h14l-1.2 13H6.2z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  acc: '<circle cx="6" cy="13" r="3.5"/><circle cx="18" cy="13" r="3.5"/><path d="M9.5 12.5c1.6-1 3.4-1 5 0"/><path d="M2.5 12 4 7.5M21.5 12 20 7.5"/>',
  // Stili
  sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  hat: '<path d="M7 4h10v11H7z"/><path d="M7 12h10"/><path d="M3 18c2 1.3 5 2 9 2s7-.7 9-2c0-1-2-2-4-2.5H7C5 16 3 17 3 18z"/>',
  square: '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  cap: '<path d="M3 16a8 8 0 0 1 16 0z"/><path d="M14 16h7.5c0 1.2-1 2-2.5 2H14"/><path d="M11 8V6.5"/><path d="M8 9.5c.5 2 .8 4 .8 6.5"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5a3 3 0 1 1 0-6 3 3 0 1 1 0 6M14.5 12a3 3 0 1 1 6 0 3 3 0 1 1-6 0M12 14.5a3 3 0 1 1 0 6 3 3 0 1 1 0-6M9.5 12a3 3 0 1 1-6 0 3 3 0 1 1 6 0"/>',
  radio: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M6 4l11 4"/><circle cx="8.5" cy="14.5" r="2.5"/><path d="M14 13h4M14 16h4"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v5"/>',
  // Occasioni
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  dumbbell: '<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>',
  glass: '<path d="M4 3h16l-8 9z"/><path d="M12 12v9M8 21h8"/>',
  gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M12 22 8 9l3-6M12 22l4-13-3-6"/>',
  plane: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  // Interfaccia
  more: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.7-6L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.7 6L3 16"/><path d="M8 16H3v5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
};

function icon(name, cls = '') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', ('i ' + cls).trim());
  svg.innerHTML = ICONS[name] || ICONS.top;
  return svg;
}

// Sostituisce <i data-icon="nome"></i> nell'HTML con l'icona vera
function hydrateIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach(n => {
    n.replaceWith(icon(n.dataset.icon, n.className));
  });
}
