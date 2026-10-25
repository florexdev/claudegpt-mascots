const KEY = 'pip_cfg';
const def = { size: 150, lang: 'en', sound: false, visible: true, char: 'auto' };
const $ = (id) => document.getElementById(id);
chrome.storage.local.get(KEY, (r) => {
  const c = Object.assign({}, def, r[KEY]);
  $('visible').checked = c.visible; $('size').value = c.size; $('lang').value = c.lang; $('char').value = c.char; $('sound').checked = c.sound;
});
function save() {
  chrome.storage.local.set({ [KEY]: { visible: $('visible').checked, size: +$('size').value, lang: $('lang').value, char: $('char').value, sound: $('sound').checked } });
}
['visible', 'size', 'lang', 'char', 'sound'].forEach((id) => $(id).addEventListener('input', save));
$('reset').addEventListener('click', () => chrome.storage.local.remove('pip_pos'));
