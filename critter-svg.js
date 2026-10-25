// Pixel karakter (Claude için): 14x9 birimlik ızgara, düz terracotta, siyah kare gözler.
function critterBuild() {
  var C = '#DE7A5E';
  var legs = [3, 5, 8, 10].map(function (x, i) {
    return '<rect class="leg ' + (i % 2 ? 'legB' : 'legA') + '" x="' + x + '" y="5" width="1" height="3" fill="' + C + '"/>';
  }).join('');
  return '<div class="cap"></div>' +
    '<svg viewBox="0 0 14 9" shape-rendering="crispEdges" aria-hidden="true">' +
    '<rect class="shadow" x="2" y="8.3" width="10" height="0.6" fill="#000" opacity=".12"/>' +
    '<g class="rig"><g class="headLook">' +
      '<g class="legs">' + legs + '</g>' +
      '<g class="top">' +
        '<g class="armL"><rect x="0" y="2" width="2" height="2" fill="' + C + '"/></g>' +
        '<g class="armR"><rect x="12" y="2" width="2" height="2" fill="' + C + '"/></g>' +
        '<rect class="body" x="2" y="0" width="10" height="5" fill="' + C + '"/>' +
        '<g class="faceLook"><g class="eyes"><rect class="eye" x="4" y="1" width="1" height="1" fill="#111"/><rect class="eye" x="9" y="1" width="1" height="1" fill="#111"/></g></g>' +
      '</g>' +
    '</g></g></svg>';
}

function critterCSS() {
  return ':host{all:initial}' +
  '.wrap{position:relative;width:100%;height:100%;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}.wrap:active{cursor:grabbing}' +
  'svg{width:100%;height:100%;overflow:visible;display:block}' +
  '.cap{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin-bottom:14px;white-space:nowrap;pointer-events:none;' +
    'font:700 11px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;color:#B4553A;background:#FAF9F5;border:2px solid #DE7A5E;padding:4px 8px;box-shadow:3px 3px 0 #DE7A5E}' +
  '.cap:empty{display:none}' +
  '.eye,.leg{transform-box:fill-box}.eye{transform-origin:50% 100%}.leg{transform-origin:50% 0}' +
  '.blink .eye{transform:scaleY(0)}' +
  /* IDLE: bekliyor, ara sıra yana bakıp göz kırpıyor */
  '[data-state=idle] .eyes{animation:glance 8s steps(1) infinite}' +
  '@keyframes glance{0%,60%{transform:translateX(0)}64%,72%{transform:translateX(-1px)}76%,86%{transform:translateX(1px)}90%,100%{transform:translateX(0)}}' +
  /* BOUNCE: bitti, sevinç */
  '[data-state=happy] .rig{animation:bounce .6s steps(1) 3}[data-state=happy] .armL,[data-state=happy] .armR{animation:armsUp .6s steps(1) 3}[data-state=happy] .leg{animation:squash .6s steps(1) 3}' +
  '@keyframes bounce{0%{transform:translateY(0)}25%{transform:translateY(-2px)}50%{transform:translateY(-3px)}75%{transform:translateY(-2px)}}' +
  '@keyframes armsUp{0%{transform:translateY(0)}25%,75%{transform:translateY(-1px)}50%{transform:translateY(-2px)}}' +
  '@keyframes squash{0%{transform:scaleY(1)}25%,75%{transform:scaleY(.67)}50%{transform:scaleY(.34)}}' +
  /* WAVE: merhaba */
  '[data-state=hello] .armR{animation:wave .45s steps(1) infinite}@keyframes wave{0%{transform:translateY(0)}50%{transform:translateY(-2px)}}' +
  /* LOOK: yazarken gözler girdi alanını izler (JS) */
  /* WALK: düşünüyor */
  '[data-state=thinking] .legA{animation:stepA .6s steps(1) infinite}[data-state=thinking] .legB{animation:stepB .6s steps(1) infinite}' +
  '[data-state=thinking] .rig{animation:pace 4.8s steps(1) infinite}' +
  /* RUN: cevap akıyor */
  '[data-state=talking] .legA{animation:stepA .3s steps(1) infinite}[data-state=talking] .legB{animation:stepB .3s steps(1) infinite}' +
  '[data-state=talking] .rig{animation:pace 1.2s steps(1) infinite}' +
  '[data-state=talking] .armL{animation:swingA .3s steps(1) infinite}[data-state=talking] .armR{animation:swingB .3s steps(1) infinite}[data-state=talking] .eyes{transform:translateX(1px)}' +
  '@keyframes stepA{0%{transform:scaleY(1)}50%{transform:scaleY(.67)}}@keyframes stepB{0%{transform:scaleY(.67)}50%{transform:scaleY(1)}}' +
  '@keyframes swingA{0%{transform:translateY(0)}50%{transform:translateY(-1px)}}@keyframes swingB{0%{transform:translateY(-1px)}50%{transform:translateY(0)}}' +
  '@keyframes pace{0%{transform:translateX(0)}12.5%{transform:translateX(1px)}25%{transform:translateX(2px)}37.5%{transform:translateX(1px)}50%{transform:translateX(0)}62.5%{transform:translateX(-1px)}75%{transform:translateX(-2px)}87.5%{transform:translateX(-1px)}}' +
  /* Ek durumlar */
  '[data-state=sleep] .top{transform:translateY(1px)}[data-state=sleep] .eye{transform:scaleY(.25)}' +
  '[data-state=concerned] .armL,[data-state=concerned] .armR{transform:translateY(1px)}[data-state=concerned] .eyes{transform:translateY(1px)}' +
  '[data-state=poke] .top{transform:translateY(1px)}[data-state=poke] .armL,[data-state=poke] .armR{transform:translateY(-2px)}' +
  '@media (prefers-reduced-motion:reduce){.rig,.armL,.armR,.leg,.eyes{animation:none!important}}';
}
if (typeof module !== 'undefined') module.exports = { critterBuild, critterCSS };
