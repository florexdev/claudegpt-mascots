// Pip v2 — low-poly chibi robot. Saf SVG üretir; DOM'a bağımlı değil.
function pipRng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

function pipFacets(x0, y0, x1, y1, step, seed, base) {
  var R = pipRng(seed), cols = Math.ceil((x1 - x0) / step) + 1, rows = Math.ceil((y1 - y0) / step) + 1, P = [], out = [];
  for (var j = 0; j < rows; j++) {
    P[j] = [];
    for (var i = 0; i < cols; i++) {
      var edge = i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
      P[j][i] = [x0 + i * step + (edge ? 0 : (R() - 0.5) * step * 0.8), y0 + j * step + (edge ? 0 : (R() - 0.5) * step * 0.8)];
    }
  }
  var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = x1 - x0, h = y1 - y0;
  function tri(a, b, c) {
    var mx = (a[0] + b[0] + c[0]) / 3, my = (a[1] + b[1] + c[1]) / 3;
    var light = -(((mx - cx) / w) * 0.55 + ((my - cy) / h) * 0.9);
    var l = base.l + light * 22 + (R() - 0.5) * 13;
    var col = 'hsl(' + base.h + ' ' + base.s + '% ' + l.toFixed(1) + '%)';
    out.push('<polygon points="' + a + ' ' + b + ' ' + c + '" fill="' + col + '" stroke="' + col + '" stroke-width=".5"/>');
  }
  for (var j2 = 0; j2 < rows - 1; j2++) for (var i2 = 0; i2 < cols - 1; i2++) {
    if ((i2 + j2) % 2) { tri(P[j2][i2], P[j2][i2 + 1], P[j2 + 1][i2]); tri(P[j2][i2 + 1], P[j2 + 1][i2 + 1], P[j2 + 1][i2]); }
    else { tri(P[j2][i2], P[j2][i2 + 1], P[j2 + 1][i2 + 1]); tri(P[j2][i2], P[j2 + 1][i2 + 1], P[j2 + 1][i2]); }
  }
  return out.join('');
}

function pipPart(id, shape, bb, step, seed) {
  var base = { h: 229, s: 44, l: 46 };
  return {
    def: '<clipPath id="' + id + '">' + shape + '</clipPath>',
    body: '<g clip-path="url(#' + id + ')"><g fill="hsl(229 44% 40%)">' + shape + '</g>' + pipFacets(bb[0], bb[1], bb[2], bb[3], step, seed, base) + '</g>'
  };
}

function pipBuildSVG() {
  var circ = [[46, 26, 19], [80, 19, 21], [114, 26, 19], [22, 52, 17], [138, 52, 17], [24, 88, 16], [136, 88, 16], [52, 104, 15], [108, 104, 15], [80, 106, 17]];
  var headShape = '<rect x="22" y="20" width="116" height="84" rx="34"/>' + circ.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; }).join('');
  var head = pipPart('hc', headShape, [2, -4, 158, 124], 13, 7);
  var body = pipPart('bc', '<ellipse cx="80" cy="131" rx="23" ry="22"/>', [56, 108, 104, 154], 10, 21);
  var armL = pipPart('alc', '<ellipse cx="55" cy="133" rx="7" ry="11"/>', [47, 120, 63, 146], 8, 33);
  var armR = pipPart('arc', '<ellipse cx="105" cy="133" rx="7" ry="11"/>', [97, 120, 113, 146], 8, 44);
  var footL = pipPart('flc', '<ellipse cx="66" cy="154" rx="11" ry="7"/>', [54, 146, 78, 162], 8, 55);
  var footR = pipPart('frc', '<ellipse cx="94" cy="154" rx="11" ry="7"/>', [82, 146, 106, 162], 8, 66);

  var eyeL = '<g transform="translate(58 56)"><g class="v v-pill pill"><rect x="-4" y="-8" width="8" height="16" rx="4" fill="#EAF1FF"/></g>' +
    '<path class="v v-caret s" d="M-8 4 L0 -6 L8 4"/><path class="v v-worry s" d="M-6 6 L6 -3"/><path class="v v-flat s" d="M-7 0 L7 0"/><path class="v v-ang s" d="M-5 -8 L5 0 L-5 8"/></g>';
  var eyeR = '<g transform="translate(102 56)"><g class="v v-pill pill"><rect x="-4" y="-8" width="8" height="16" rx="4" fill="#EAF1FF"/></g>' +
    '<path class="v v-caret s" d="M-8 4 L0 -6 L8 4"/><path class="v v-worry s" d="M6 6 L-6 -3"/><path class="v v-flat s" d="M-7 0 L7 0"/><path class="v v-ang s" d="M5 -8 L-5 0 L5 8"/></g>';
  var bars = [68, 74, 80, 86, 92].map(function (x, i) { return '<rect class="bar" style="animation-delay:' + (i * 0.09) + 's" x="' + (x - 1.3) + '" y="68" width="2.6" height="12" rx="1.3" fill="#EAF1FF"/>'; }).join('');
  var mouth =
    '<path class="v m-smile s" d="M73 73 Q80 79 87 73"/>' +
    '<ellipse class="v m-o s" cx="80" cy="75" rx="3" ry="3.6"/>' +
    '<path class="v m-dash s" d="M64 75 L96 75" stroke-dasharray="5 4"/>' +
    '<g class="v m-bars">' + bars + '</g>' +
    '<path class="v m-big" d="M71 71 Q80 85 89 71 Z" fill="#EAF1FF"/>' +
    '<path class="v m-worry s" d="M73 77 Q80 72 87 77"/>' +
    '<path class="v m-flat s" d="M74 75 L86 75"/>';

  var chest =
    '<rect x="68" y="125" width="24" height="17" rx="5" fill="#0A0E2B" stroke="#27358f" stroke-width="1.4"/>' +
    '<g class="chest" filter="url(#glow)">' +
    '<g class="c c-prompt"><path class="s" d="M73 130 L77 134 L73 138" stroke-width="2"/><path class="s cur" d="M79 139 L86 139" stroke-width="2"/></g>' +
    '<g class="c c-dots"><circle class="dot" cx="73" cy="134" r="2" fill="#EAF1FF"/><circle class="dot" style="animation-delay:.2s" cx="80" cy="134" r="2" fill="#EAF1FF"/><circle class="dot" style="animation-delay:.4s" cx="87" cy="134" r="2" fill="#EAF1FF"/></g>' +
    '<g class="c c-lines"><rect class="ln" x="72" y="129" width="16" height="2" rx="1" fill="#EAF1FF"/><rect class="ln" style="animation-delay:.15s" x="72" y="134" width="11" height="2" rx="1" fill="#EAF1FF"/><rect class="ln" style="animation-delay:.3s" x="72" y="139" width="14" height="2" rx="1" fill="#EAF1FF"/></g>' +
    '</g>';

  return '<svg viewBox="0 0 160 176" aria-hidden="true">' +
    '<defs>' + head.def + body.def + armL.def + armR.def + footL.def + footR.def +
    '<linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151b4a"/><stop offset="1" stop-color="#070a22"/></linearGradient>' +
    '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="80" cy="166" rx="38" ry="5" fill="#0b0f2e" opacity=".35"/>' +
    '<g class="rig">' +
      footL.body + footR.body + body.body + chest +
      '<g class="armL">' + armL.body + '</g><g class="armR">' + armR.body + '</g>' +
      '<ellipse cx="80" cy="121" rx="27" ry="6" fill="#141b5c" opacity=".45"/>' +
      '<g class="headLook"><g class="head">' + head.body +
        '<rect x="34" y="38" width="92" height="56" rx="13" fill="url(#scr)" stroke="#27358f" stroke-width="2"/>' +
        '<path d="M42 44 Q60 40 90 41" stroke="#fff" stroke-opacity=".12" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<g class="faceLook" filter="url(#glow)">' + eyeL + eyeR + mouth + '</g>' +
        '<text class="cap" x="42" y="89" filter="url(#glow)"></text>' +
      '</g></g>' +
    '</g></svg>';
}

function pipCSS() {
  return ':host{all:initial}' +
  '.wrap{position:relative;width:100%;height:100%;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}.wrap:active{cursor:grabbing}' +
  'svg{width:100%;height:100%;overflow:visible;display:block}' +
  '.s{fill:none;stroke:#EAF1FF;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}' +
  '.m-o,.m-smile,.m-worry,.m-flat,.m-dash{stroke-width:2.6}' +
  '.cap{font:600 7.4px/1 system-ui,-apple-system,"Segoe UI",sans-serif;fill:#BCD0FF;letter-spacing:.2px}' +
  '.v,.c{display:none}' +
  '[data-state=idle] .v-pill,[data-state=listening] .v-pill,[data-state=talking] .v-pill,[data-state=thinking] .v-caret,[data-state=happy] .v-caret,[data-state=concerned] .v-worry,[data-state=sleep] .v-flat,[data-state=poke] .v-ang{display:inline}' +
  '[data-state=idle] .m-smile,[data-state=listening] .m-o,[data-state=thinking] .m-dash,[data-state=talking] .m-bars,[data-state=happy] .m-big,[data-state=poke] .m-big,[data-state=concerned] .m-worry,[data-state=sleep] .m-flat{display:inline}' +
  '.c-prompt{display:inline}[data-state=thinking] .c-prompt,[data-state=talking] .c-prompt{display:none}[data-state=thinking] .c-dots,[data-state=talking] .c-lines{display:inline}' +
  '.pill,.bar,.ln,.dot{transform-box:fill-box;transform-origin:center}.ln{transform-origin:0 50%}' +
  '.blink .pill{transform:scaleY(.1)}.pill{transition:transform .08s}[data-state=listening] .pill{transform:scale(1.2)}' +
  '.faceLook,.headLook{transition:transform .14s ease-out}' +
  '.bar{animation:bar .5s ease-in-out infinite alternate}@keyframes bar{from{transform:scaleY(.2)}to{transform:scaleY(1)}}' +
  '.m-dash{animation:dash .7s linear infinite}@keyframes dash{to{stroke-dashoffset:-18}}' +
  '.dot{animation:dot 1s ease-in-out infinite}@keyframes dot{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}' +
  '.ln{animation:ln .5s ease-in-out infinite alternate}@keyframes ln{from{transform:scaleX(.35)}to{transform:scaleX(1)}}' +
  '.cur{animation:cur 1s steps(1) infinite}[data-state=listening] .cur{animation-duration:.45s}@keyframes cur{50%{opacity:0}}' +
  '.rig{transform-origin:80px 160px}.head{transform-origin:80px 104px}.armL{transform-origin:56px 124px}.armR{transform-origin:104px 124px}' +
  '[data-state=idle] .rig{animation:bob 3.4s ease-in-out infinite}[data-state=idle] .head{animation:sway 5s ease-in-out infinite}' +
  '[data-state=listening] .head{transform:rotate(-5deg) translateY(1px);transition:transform .4s}' +
  '[data-state=thinking] .head{animation:wobble 1.3s ease-in-out infinite}' +
  '[data-state=talking] .rig{animation:talk .42s ease-in-out infinite}' +
  '[data-state=happy] .rig{animation:hop .75s ease-out 1}[data-state=happy] .armR{animation:wave .5s ease-in-out 3}' +
  '[data-state=concerned] .head{transform:rotate(4deg);transition:transform .4s}' +
  '[data-state=sleep] .head{transform:translateY(5px) rotate(7deg);transition:transform 1s}[data-state=sleep] .rig{animation:breathe 4s ease-in-out infinite}' +
  '[data-state=poke] .rig{animation:squish .35s ease-out 1}' +
  '@keyframes bob{50%{transform:translateY(-3px)}}@keyframes sway{50%{transform:rotate(2.5deg)}}' +
  '@keyframes wobble{25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}' +
  '@keyframes talk{50%{transform:translateY(-3px) scale(1.02,.98)}}' +
  '@keyframes hop{30%{transform:translateY(-18px) scale(.96,1.06)}60%{transform:translateY(0) scale(1.06,.92)}100%{transform:none}}' +
  '@keyframes wave{50%{transform:rotate(-70deg)}}@keyframes squish{40%{transform:scale(1.1,.84)}100%{transform:none}}' +
  '@keyframes breathe{50%{transform:scale(1.015,.985)}}' +
  '@media (prefers-reduced-motion:reduce){.rig,.head,.armR,.bar,.dot,.ln,.m-dash{animation:none!important}}';
}
if (typeof module !== 'undefined') module.exports = { pipBuildSVG, pipCSS };
