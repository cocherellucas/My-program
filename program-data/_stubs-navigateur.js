var __store = {};
var __ls = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(__store, k) ? __store[k] : null; },
  setItem: function (k, v) { __store[k] = String(v); },
  removeItem: function (k) { delete __store[k]; },
  clear: function () { __store = {}; },
};
var __el = {
  style: {}, classList: { add: function () {}, remove: function () {}, contains: function () { return false; } },
  setAttribute: function () {}, appendChild: function () {}, removeChild: function () {},
  addEventListener: function () {}, removeEventListener: function () {}, contains: function () { return false; },
  offsetHeight: 0, offsetWidth: 0, scrollTop: 0,
};
var __doc = {
  documentElement: __el, body: __el, head: __el,
  createElement: function () { return Object.assign({}, __el); },
  // Certains paquets injectent leur CSS au chargement (__insertCSS) : sans ces
  // deux-là, importer un composant qui les tire faisait planter le montage.
  createTextNode: function (t) { return { nodeValue: t }; },
  createDocumentFragment: function () { return Object.assign({}, __el); },
  querySelector: function () { return null; }, querySelectorAll: function () { return []; },
  getElementById: function () { return null; },
  addEventListener: function () {}, removeEventListener: function () {},
  cookie: '',
};
var __win = {
  localStorage: __ls, sessionStorage: __ls, document: __doc,
  innerWidth: 390, innerHeight: 844, devicePixelRatio: 2,
  addEventListener: function () {}, removeEventListener: function () {},
  matchMedia: function () { return { matches: false, addEventListener: function () {}, removeEventListener: function () {} }; },
  location: { href: 'http://localhost/', origin: 'http://localhost', pathname: '/', search: '', hash: '' },
  navigator: { userAgent: 'node', onLine: true, language: 'fr-FR' },
  requestAnimationFrame: function (f) { return setTimeout(f, 0); },
  cancelAnimationFrame: function (id) { clearTimeout(id); },
  getComputedStyle: function () { return { getPropertyValue: function () { return ''; } }; },
  visualViewport: null,
};
__win.self = __win; __win.top = __win; __win.window = __win; __win.parent = __win;
// Certains globals sont en LECTURE SEULE selon la version de Node (navigator
// depuis Node 21). Une affectation directe passe inaperçue dans un bundle CJS
// (non strict) mais lève en module ESM — on pose donc chaque global au cas par
// cas, sans jamais faire échouer le chargement.
function poser(nom, valeur) {
  try {
    if (Object.getOwnPropertyDescriptor(globalThis, nom)?.get) {
      Object.defineProperty(globalThis, nom, { value: valeur, configurable: true, writable: true });
    } else {
      globalThis[nom] = valeur;
    }
  } catch { /* global verrouillé : on fait sans */ }
}

poser('window', __win);
poser('document', __doc);
poser('localStorage', __ls);
poser('sessionStorage', __ls);
poser('navigator', __win.navigator);
poser('location', __win.location);
poser('requestAnimationFrame', __win.requestAnimationFrame);
poser('cancelAnimationFrame', __win.cancelAnimationFrame);
poser('matchMedia', __win.matchMedia);
poser('getComputedStyle', __win.getComputedStyle);
