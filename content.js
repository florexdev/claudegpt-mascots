(() => {
  if (window.__pipLoaded) return;
  window.__pipLoaded = true;

  // ---------- Siteye göre seçiciler (arayüz değişirse burayı güncelle) ----------
  const SITE = /(^|\.)claude\.ai$/.test(location.hostname) ? 'claude' : 'chatgpt';
  const SELS = {
    chatgpt: {
      stop: '[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="Durdur"]',
      editor: '#prompt-textarea, textarea',
      assistant: '[data-message-author-role="assistant"]'
    },
    claude: {
      stop: 'button[aria-label="Stop response"], button[aria-label*="Stop"], [data-testid="stop-button"]',
      editor: 'div.ProseMirror[contenteditable="true"], [data-testid="chat-input"], textarea',
      assistant: '[data-is-streaming], .font-claude-message, [data-testid="assistant-message"]'
    }
  }[SITE];

  // ---------- Karakterler ----------
  const CHARS = {
    pip: {
      ratio: 176 / 160, css: pipCSS, build: pipBuildSVG, hello: 'idle',
      look: { fx: 5, fy: 3.5, hx: 2, hy: 1.2, snap: false }, thinkLook: 'translate(0px,-1px)',
      texts: {
        en: { listening: 'Listening…', thinking: 'On it.', happy: 'Done!', phew: 'Phew. Long one.', concerned: 'Hmm.', sleep: 'zzz', poke: 'Hehe', wake: 'Oh!' },
        tr: { listening: 'Dinliyorum…', thinking: 'Hallediyorum.', happy: 'Bitti!', phew: 'Oof, uzunmuş.', concerned: 'Hmm.', sleep: 'zzz', poke: 'Hihi', wake: 'Ah!' }
      }
    },
    pixel: {
      ratio: 9 / 14, css: critterCSS, build: critterBuild, hello: 'hello',
      look: { fx: 1, fy: 1, hx: 0, hy: 0, snap: true }, thinkLook: 'translate(0px,0px)',
      texts: {
        en: { listening: '…', thinking: 'working', happy: 'done', phew: 'long one', concerned: 'hmm', sleep: 'zzz', poke: 'ow', wake: 'hello' },
        tr: { listening: '…', thinking: 'çalışıyor', happy: 'bitti', phew: 'uzunmuş', concerned: 'hmm', sleep: 'zzz', poke: 'ay', wake: 'merhaba' }
      }
    }
  };
  const SOUNDS = {
    thinking: [[660, 0.07], [880, 0.09]],
    happy: [[784, 0.08], [988, 0.08], [1318, 0.14]],
    concerned: [[330, 0.12], [262, 0.18]],
    poke: [[1200, 0.05], [900, 0.07]],
    wake: [[520, 0.06], [780, 0.08]]
  };
  const CFG_KEY = 'pip_cfg', POS_KEY = 'pip_pos';
  let cfg = { size: 150, lang: 'en', sound: false, visible: true, char: 'auto' };

  // ---------- DOM (Shadow DOM: sayfa stilleriyle çakışmaz) ----------
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;right:24px;bottom:110px;z-index:2147483000;';
  const root = host.attachShadow({ mode: 'open' });
  document.documentElement.appendChild(host);

  let CH = CHARS.pip, mounted = null, wrap, faceLook, headLook, cap;
  let state = 'idle';

  const charKey = () => (cfg.char === 'pip' || cfg.char === 'pixel') ? cfg.char : (SITE === 'claude' ? 'pixel' : 'pip');

  function mount() {
    const key = charKey();
    if (key === mounted) return;
    mounted = key; CH = CHARS[key];
    root.innerHTML = '<style>' + CH.css() + '</style><div class="wrap" data-state="' + state + '" title="Alt+M: gizle / göster">' + CH.build() + '</div>';
    wrap = root.querySelector('.wrap');
    faceLook = root.querySelector('.faceLook');
    headLook = root.querySelector('.headLook');
    cap = root.querySelector('.cap');
  }

  function applyCfg() {
    mount();
    host.style.width = cfg.size + 'px';
    host.style.height = Math.round(cfg.size * CH.ratio) + 'px';
    host.style.display = cfg.visible ? '' : 'none';
    if (host.style.left) { const r = host.getBoundingClientRect(); place(r.left, r.top); }
  }

  // ---------- Ses (varsayılan kapalı) ----------
  let actx = null;
  function sfx(name) {
    if (!cfg.sound || !SOUNDS[name]) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      actx.resume();
      let t = actx.currentTime;
      SOUNDS[name].forEach(([f, d]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'square'; o.frequency.value = f;
        g.gain.setValueAtTime(0.025, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(actx.destination);
        o.start(t); o.stop(t + d);
        t += d * 0.9;
      });
    } catch (_) {}
  }

  // ---------- Yazı (daktilo efekti) ----------
  let capTimer = null;
  function caption(text) {
    clearInterval(capTimer);
    cap.textContent = '';
    if (!text) return;
    let i = 0;
    capTimer = setInterval(() => {
      cap.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(capTimer);
    }, 32);
  }
  const T = (k) => ((CH.texts[cfg.lang] || CH.texts.en)[k]) || '';

  // ---------- Bakış ----------
  function lookAt(cx, cy) {
    const r = wrap.getBoundingClientRect();
    const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260), ux = dx / d, uy = dy / d, L = CH.look;
    if (L.snap) {
      faceLook.style.transform = `translate(${Math.round(ux * k * 1.15) * L.fx}px, ${Math.round(uy * k * 0.7) * L.fy}px)`;
    } else {
      faceLook.style.transform = `translate(${(ux * k * L.fx).toFixed(1)}px, ${(uy * k * L.fy).toFixed(1)}px)`;
      headLook.style.transform = `translate(${(ux * k * L.hx).toFixed(1)}px, ${(uy * k * L.hy).toFixed(1)}px)`;
    }
  }
  function lookAtEditor() {
    const ed = document.querySelector(SELS.editor);
    if (!ed) return;
    const b = ed.getBoundingClientRect();
    lookAt(b.left + b.width / 2, b.top + b.height / 2);
  }

  // ---------- Durum makinesi ----------
  const CAPTION_FOR = { listening: 'listening', thinking: 'thinking', happy: 'happy', concerned: 'concerned', sleep: 'sleep', poke: 'poke', hello: 'wake' };
  let revertTimer = null, typingTimer = null, lastActive = Date.now();

  function setState(next, captionKey, sound) {
    clearTimeout(revertTimer);
    state = next;
    wrap.dataset.state = next;
    caption(T(captionKey || CAPTION_FOR[next]));
    if (sound !== false) sfx(sound || next);
    if (next === 'thinking') faceLook.style.transform = CH.thinkLook;
    if (next === 'listening') lookAtEditor();
  }
  function revertAfter(ms) {
    clearTimeout(revertTimer);
    revertTimer = setTimeout(() => setState('idle', null, false), ms);
  }
  function wake() {
    lastActive = Date.now();
    if (state === 'sleep') { setState(CH.hello, 'wake', 'wake'); revertAfter(1300); }
  }

  // ---------- Sayfayı izle ----------
  let generating = false, lastLen = 0, lastGrowth = 0;
  const lastAssistantText = () => {
    const all = document.querySelectorAll(SELS.assistant);
    return all.length ? all[all.length - 1].textContent || '' : '';
  };

  function finish(text) {
    if (/üzgünüm|maalesef|yapamam|sorry|unfortunately|can't help|cannot/i.test(text.slice(0, 400))) {
      setState('concerned'); revertAfter(3200);
    } else if (text.length > 3000) {
      setState('happy', 'phew'); revertAfter(3600);
    } else {
      setState('happy'); revertAfter(2600);
    }
  }

  setInterval(() => {
    const g = !!document.querySelector(SELS.stop);
    const len = lastAssistantText().length;
    if (g) {
      lastActive = Date.now();
      clearTimeout(typingTimer);
      if (!generating) {
        generating = true; lastLen = len; lastGrowth = 0;
        setState('thinking');
      } else if (len !== lastLen) {
        lastLen = len; lastGrowth = Date.now();
        if (state !== 'talking') setState('talking', null, false);
      } else if (state === 'talking' && Date.now() - lastGrowth > 1200) {
        setState('thinking', null, false);
      }
    } else if (generating) {
      generating = false;
      finish(lastAssistantText());
    }
  }, 250);

  // 90 sn hareketsizlik → uyku
  setInterval(() => {
    if (state === 'idle' && !generating && Date.now() - lastActive > 90000) setState('sleep');
  }, 5000);

  // Yazarken dinle
  document.addEventListener('input', (e) => {
    wake();
    if (generating) return;
    const t = e.target;
    if (!t || !t.matches || !t.matches(SELS.editor)) return;
    const text = (t.value !== undefined ? t.value : t.textContent) || '';
    clearTimeout(typingTimer);
    if (!text.trim()) { if (state === 'listening') setState('idle', null, false); return; }
    if (state !== 'listening') setState('listening', null, false);
    typingTimer = setTimeout(() => { if (state === 'listening') setState('idle', null, false); }, 2000);
  }, true);

  // İmleci takip et
  document.addEventListener('mousemove', (e) => {
    wake();
    if (state === 'sleep' || state === 'thinking' || state === 'listening') return;
    lookAt(e.clientX, e.clientY);
  }, { passive: true });

  (function blinkLoop() {
    setTimeout(() => {
      wrap.classList.add('blink');
      setTimeout(() => wrap.classList.remove('blink'), 110);
      blinkLoop();
    }, 2200 + Math.random() * 3500);
  })();

  // ---------- Sürükle, dürt, çift tıkla ----------
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function place(x, y) {
    x = clamp(x, 0, Math.max(0, window.innerWidth - host.offsetWidth));
    y = clamp(y, 0, Math.max(0, window.innerHeight - host.offsetHeight));
    host.style.left = x + 'px'; host.style.top = y + 'px';
    host.style.right = 'auto'; host.style.bottom = 'auto';
  }
  function resetPlace() {
    host.style.left = host.style.top = '';
    host.style.right = '24px'; host.style.bottom = '110px';
  }

  let drag = null, moved = false, lastClick = 0;
  host.addEventListener('pointerdown', (e) => {
    const r = host.getBoundingClientRect();
    drag = { ox: e.clientX - r.left, oy: e.clientY - r.top };
    moved = false;
    host.setPointerCapture(e.pointerId);
  });
  host.addEventListener('pointermove', (e) => {
    if (!drag) return;
    moved = true;
    place(e.clientX - drag.ox, e.clientY - drag.oy);
  });
  host.addEventListener('pointerup', (e) => {
    if (!drag) return;
    host.releasePointerCapture(e.pointerId);
    drag = null;
    if (moved) {
      const r = host.getBoundingClientRect();
      try { chrome.storage.local.set({ [POS_KEY]: { x: r.left, y: r.top } }); } catch (_) {}
      return;
    }
    wake();
    const now = Date.now();
    const second = now - lastClick < 400;
    lastClick = second ? 0 : now;
    if (generating) return;
    if (second) {
      // Çift tıklama: selam ver (poke durumu dahil her durumdan)
      setState(CH.hello === 'hello' ? 'hello' : 'happy', 'wake');
      revertAfter(1800);
    } else if (state === 'idle' || state === 'listening' || state === 'concerned' || state === 'hello') {
      setState('poke');
      revertAfter(900);
    }
  });
  window.addEventListener('resize', () => { if (host.style.left) { const r = host.getBoundingClientRect(); place(r.left, r.top); } });

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyM') {
      cfg.visible = !cfg.visible;
      host.style.display = cfg.visible ? '' : 'none';
      try { chrome.storage.local.set({ [CFG_KEY]: cfg }); } catch (_) {}
    }
  });

  // ---------- Ayarlar (popup ile senkron) ----------
  mount();
  applyCfg();
  try {
    chrome.storage.local.get([CFG_KEY, POS_KEY], (res) => {
      if (res && res[CFG_KEY]) cfg = Object.assign(cfg, res[CFG_KEY]);
      applyCfg();
      const p = res && res[POS_KEY];
      if (p) place(p.x, p.y);
    });
    chrome.storage.onChanged.addListener((ch) => {
      if (ch[CFG_KEY]) { cfg = Object.assign(cfg, ch[CFG_KEY].newValue || {}); applyCfg(); }
      if (ch[POS_KEY] && !ch[POS_KEY].newValue) resetPlace();
    });
  } catch (_) {}
})();
