/* ==========================================================
   Foto ingrandite (usato da tutte le pagine del sito)
   - clic su un'immagine con l'attributo data-zoom: si apre ingrandita
   - clic sulla foto ingrandita: zoom; un altro clic la riporta com'era
   - con lo zoom attivo la foto si sposta trascinandola (mouse o dito)
   - clic sulle bande nere ai lati, sulla X o tasto Esc: si chiude
   - frecce (e tasti ← →) quando le foto sono più d'una
   ========================================================== */
(function(){
  var ZOOM = 2.4;

  var lb = document.getElementById('lightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    document.body.appendChild(lb);
  }
  lb.innerHTML =
    '<button type="button" class="lb-close" aria-label="Chiudi">&times;</button>' +
    '<button type="button" class="lb-prev" aria-label="Foto precedente" hidden>&lsaquo;</button>' +
    '<div class="lb-stage"><img class="lb-img" src="" alt=""></div>' +
    '<button type="button" class="lb-next" aria-label="Foto successiva" hidden>&rsaquo;</button>';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-hidden', 'true');

  var img = lb.querySelector('.lb-img');
  var prev = lb.querySelector('.lb-prev');
  var next = lb.querySelector('.lb-next');
  var list = [], pos = 0;
  var zoomed = false, tx = 0, ty = 0;
  var lastFocus = null;

  function apply(){
    img.style.transform = zoomed
      ? 'translate(' + tx + 'px,' + ty + 'px) scale(' + ZOOM + ')'
      : '';
    lb.classList.toggle('zoomed', zoomed);
  }

  // lo spostamento non deve portare la foto fuori dallo schermo
  function clamp(){
    var w = img.offsetWidth * ZOOM, h = img.offsetHeight * ZOOM;
    var mx = Math.max(0, (w - window.innerWidth) / 2 + 40);
    var my = Math.max(0, (h - window.innerHeight) / 2 + 40);
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  }

  function show(){
    zoomed = false; tx = ty = 0; apply();
    img.src = list[pos];
    prev.hidden = next.hidden = list.length < 2;
  }

  function open(srcs, i){
    list = srcs; pos = i || 0;
    lastFocus = document.activeElement;
    show();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus({ preventScroll:true });
  }

  function close(){
    lb.classList.remove('open', 'zoomed');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    img.src = '';
    zoomed = false; tx = ty = 0; apply();
    if(lastFocus && lastFocus.focus){ lastFocus.focus({ preventScroll:true }); }
  }

  window.openLightbox = open;

  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-zoom]');
    if(!t || lb.contains(t)) return;
    var group = t.closest('[data-gallery]');
    if(group){
      var imgs = Array.prototype.slice.call(group.querySelectorAll('[data-zoom]'));
      open(imgs.map(function(x){ return x.currentSrc || x.src; }), Math.max(0, imgs.indexOf(t)));
    } else {
      open([t.currentSrc || t.src], 0);
    }
  });

  // clic fuori dalla foto (bande nere) = chiudi
  lb.addEventListener('click', function(e){
    if(e.target === lb || e.target.classList.contains('lb-stage')){ close(); }
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  prev.addEventListener('click', function(){ pos = (pos - 1 + list.length) % list.length; show(); });
  next.addEventListener('click', function(){ pos = (pos + 1) % list.length; show(); });

  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight' && list.length > 1) next.click();
    if(e.key === 'ArrowLeft' && list.length > 1) prev.click();
  });

  // clic sulla foto = zoom sì/no; trascinamento = spostamento
  var down = null, moved = false;
  img.addEventListener('pointerdown', function(e){
    e.preventDefault();
    down = { x:e.clientX, y:e.clientY, tx:tx, ty:ty };
    moved = false;
    img.setPointerCapture(e.pointerId);
  });
  img.addEventListener('pointermove', function(e){
    if(!down) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if(Math.abs(dx) + Math.abs(dy) > 6){ moved = true; }
    if(zoomed && moved){
      lb.classList.add('dragging');
      tx = down.tx + dx; ty = down.ty + dy;
      clamp(); apply();
    }
  });
  function up(e){
    if(!down) return;
    if(!moved){
      if(zoomed){
        zoomed = false; tx = ty = 0;
      } else {
        // lo zoom parte dal punto cliccato
        var r = img.getBoundingClientRect();   // non ancora ingrandita
        zoomed = true;
        tx = (r.left + r.width / 2 - e.clientX) * (ZOOM - 1);
        ty = (r.top + r.height / 2 - e.clientY) * (ZOOM - 1);
        clamp();
      }
      apply();
    }
    down = null;
    lb.classList.remove('dragging');
  }
  img.addEventListener('pointerup', up);
  img.addEventListener('pointercancel', function(){ down = null; });
  img.addEventListener('click', function(e){ e.stopPropagation(); });
  img.addEventListener('dragstart', function(e){ e.preventDefault(); });
})();
