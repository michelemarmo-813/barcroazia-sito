/* ==========================================================
   Scia di stelline dietro il cursore (usata da tutte le pagine)
   Solo con il mouse; ferma con "riduci movimento".
   ========================================================== */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!matchMedia('(pointer: fine)').matches) return;

  var cv = document.createElement('canvas');
  cv.className = 'scia-stelle';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  var ROSSO = getComputedStyle(document.documentElement).getPropertyValue('--orange').trim() || '#e83d0f';
  var parts = [];
  var running = false;

  function size(){
    var dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size);

  addEventListener('pointermove', function(e){
    if(e.pointerType && e.pointerType !== 'mouse') return;
    for(var i = 0; i < 2; i++){
      parts.push({ x:e.clientX, y:e.clientY,
                   vx:(Math.random() - .5) * 1.6,
                   vy:(Math.random() - .5) * 1.6,
                   l:1 });
    }
    if(!running){ running = true; requestAnimationFrame(loop); }
  }, { passive:true });

  function stella(x, y, r){
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * .25, y - r * .25);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x + r * .25, y + r * .25);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r * .25, y + r * .25);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x - r * .25, y - r * .25);
    ctx.closePath();
    ctx.fill();
  }

  // il ciclo gira solo finché ci sono stelline da disegnare
  function loop(){
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function(p){ return p.l > 0; });
    ctx.fillStyle = ROSSO;
    for(var i = 0; i < parts.length; i++){
      var p = parts[i];
      p.x += p.vx; p.y += p.vy; p.l -= .025;
      ctx.globalAlpha = Math.max(p.l, 0);
      stella(p.x, p.y, 5 * p.l + 1);
    }
    ctx.globalAlpha = 1;
    if(parts.length){ requestAnimationFrame(loop); }
    else { ctx.clearRect(0, 0, innerWidth, innerHeight); running = false; }
  }
})();
