/* ==========================================================
   Foto ingrandite (usato da tutte le pagine del sito)
   - clic su un'immagine con l'attributo data-zoom: si apre ingrandita
   - due dita sulla foto (cellulare, tablet): zoom libero e continuo,
     centrato tra le dita, da 1x fino a ZOOM_MAX; spostando le due dita
     insieme la foto si sposta; riportata a ~1x torna com'era
   - computer: pinch del trackpad o rotella del mouse sulla foto = zoom
   - clic/tocco sulla foto: se è com'era, zoom fisso (ZOOM) dal punto
     toccato; se è ingrandita (anche dopo un pinch), torna com'era
   - con la foto ingrandita la si sposta trascinandola (mouse o dito),
     senza mai farla uscire del tutto dallo schermo
   - senza zoom, un trascinamento in orizzontale cambia foto
   - clic sulle bande nere ai lati, sulla X o tasto Esc: si chiude
   - frecce (e tasti ← →) quando le foto sono più d'una
   - cambiando foto o chiudendo, zoom e posizione si azzerano
   ========================================================== */
(function(){
  var ZOOM = 2.4;       // zoom fisso del clic/tocco
  var ZOOM_MAX = 8;     // zoom massimo con le dita, il trackpad o la rotella
  var SOGLIA = 1.05;    // sotto questa scala, alla fine del gesto, la foto torna com'era

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
    '<button type="button" class="lb-next" aria-label="Foto successiva" hidden>&rsaquo;</button>' +
    '<div class="lb-count" aria-live="polite" hidden></div>';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-hidden', 'true');

  var img = lb.querySelector('.lb-img');
  var prev = lb.querySelector('.lb-prev');
  var next = lb.querySelector('.lb-next');
  var count = lb.querySelector('.lb-count');
  var pre = new Image();
  var list = [], pos = 0;
  var scala = 1, tx = 0, ty = 0;
  var lastFocus = null;

  function apply(){
    img.style.transform = scala > 1
      ? 'translate(' + tx + 'px,' + ty + 'px) scale(' + scala + ')'
      : '';
    lb.classList.toggle('zoomed', scala > 1);
  }
  function azzera(){ scala = 1; tx = ty = 0; }

  // lo spostamento non deve portare la foto fuori dallo schermo
  function clamp(){
    if(scala <= 1){ tx = ty = 0; return; }
    var w = img.offsetWidth * scala, h = img.offsetHeight * scala;
    var mx = Math.max(0, (w - window.innerWidth) / 2 + 40);
    var my = Math.max(0, (h - window.innerHeight) / 2 + 40);
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  }

  // centro della foto non ingrandita, sullo schermo (il transform parte dal centro)
  // (misure senza transform, così non conta un'animazione in corso)
  function centro(){
    var r = img.offsetParent ? img.offsetParent.getBoundingClientRect() : { left:0, top:0 };
    return { x:r.left + img.offsetLeft + img.offsetWidth / 2, y:r.top + img.offsetTop + img.offsetHeight / 2 };
  }

  // nuova scala tenendo fermo sullo schermo il punto (px, py) della foto
  function zoomVerso(nuova, px, py){
    nuova = Math.max(1, Math.min(ZOOM_MAX, nuova));
    var c = centro();
    var ux = (px - c.x - tx) / scala, uy = (py - c.y - ty) / scala;
    scala = nuova;
    tx = px - c.x - ux * scala;
    ty = py - c.y - uy * scala;
    clamp();
  }

  function show(){
    azzera(); apply();
    img.src = list[pos];
    prev.hidden = next.hidden = count.hidden = list.length < 2;
    count.textContent = (pos + 1) + ' / ' + list.length;
    // carica in anticipo la foto successiva
    if(list.length > 1){ pre.src = list[(pos + 1) % list.length]; }
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
    lb.classList.remove('open', 'zoomed', 'dragging');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    img.src = '';
    dita.clear(); down = null; pinch = null;
    azzera(); apply();
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

  // cellulare (soprattutto Safari su iPhone): due tocchi veloci su frecce,
  // chiusura o contatore non devono ingrandire la pagina. Il secondo tocco
  // veloce non lascia fare lo zoom al browser, ma conta lo stesso come clic.
  var ultimoTocco = 0;
  [prev, next, lb.querySelector('.lb-close'), count].forEach(function(b){
    b.addEventListener('touchend', function(e){
      var ora = Date.now();
      if(ora - ultimoTocco < 350){
        e.preventDefault();
        if(b.tagName === 'BUTTON'){ b.click(); }
      }
      ultimoTocco = ora;
    });
  });

  // con la foto aperta la pagina sotto non deve né scorrere né ingrandirsi
  // (Safari su iPhone: oltre a touch-action, si fermano i suoi gesti)
  lb.addEventListener('touchmove', function(e){ if(lb.classList.contains('open')){ e.preventDefault(); } }, { passive:false });
  ['gesturestart', 'gesturechange'].forEach(function(t){
    lb.addEventListener(t, function(e){ e.preventDefault(); });
  });

  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight' && list.length > 1) next.click();
    if(e.key === 'ArrowLeft' && list.length > 1) prev.click();
  });

  // ---- gesti sulla foto: un dito (o il mouse) e due dita ----
  var dita = new Map();          // pointerId -> { x, y }
  var down = null;               // gesto a un dito: punto e posizione di partenza
  var pinch = null;              // gesto a due dita: distanza, punto medio, scala e posizione di partenza
  var moved = false, multi = false;

  function dueDita(){
    var p = Array.from(dita.values());
    return {
      d:Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y) || 1,
      x:(p[0].x + p[1].x) / 2, y:(p[0].y + p[1].y) / 2
    };
  }
  function iniziaPinch(){
    var g = dueDita(), c = centro();
    pinch = { d:g.d, s:scala, ux:(g.x - c.x - tx) / scala, uy:(g.y - c.y - ty) / scala, c:c };
    lb.classList.add('dragging');
  }
  function iniziaUnDito(p){
    down = { x:p.x, y:p.y, tx:tx, ty:ty };
  }

  img.addEventListener('pointerdown', function(e){
    e.preventDefault();
    try{ img.setPointerCapture(e.pointerId); }catch(err){}
    dita.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if(dita.size === 1){
      moved = false; multi = false;
      iniziaUnDito(dita.get(e.pointerId));
    } else if(dita.size === 2){
      multi = true; moved = true; down = null;
      iniziaPinch();
    }
  });

  img.addEventListener('pointermove', function(e){
    if(!dita.has(e.pointerId)) return;
    dita.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if(pinch && dita.size >= 2){
      // la scala segue la distanza tra le dita, il punto sotto le dita resta sotto le dita
      var g = dueDita();
      scala = Math.max(1, Math.min(ZOOM_MAX, pinch.s * g.d / pinch.d));
      tx = g.x - pinch.c.x - pinch.ux * scala;
      ty = g.y - pinch.c.y - pinch.uy * scala;
      clamp(); apply();
      return;
    }
    if(!down) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if(Math.abs(dx) + Math.abs(dy) > 6){ moved = true; }
    if(scala > 1 && moved){
      lb.classList.add('dragging');
      tx = down.tx + dx; ty = down.ty + dy;
      clamp(); apply();
    }
  });

  function fine(e){
    if(!dita.has(e.pointerId)) return;
    dita.delete(e.pointerId);
    if(pinch){
      if(dita.size >= 2){ iniziaPinch(); return; }
      pinch = null;
      if(dita.size === 1){
        // da due dita a una: si continua a spostare da dove si è, senza salti
        iniziaUnDito(dita.values().next().value);
        return;
      }
    }
    if(dita.size > 0) return;
    if(down && e.type === 'pointerup' && !multi){
      // senza zoom, un trascinamento in orizzontale cambia foto
      if(moved && scala <= 1 && list.length > 1 && Math.abs(e.clientX - down.x) > 50 && Math.abs(e.clientX - down.x) > Math.abs(e.clientY - down.y)){
        (e.clientX < down.x ? next : prev).click();
      }
      if(!moved){
        if(scala > 1){ azzera(); }
        else { zoomVerso(ZOOM, e.clientX, e.clientY); }   // lo zoom parte dal punto toccato
      }
    }
    down = null;
    lb.classList.remove('dragging');
    if(scala < SOGLIA){ azzera(); }
    clamp(); apply();
  }
  img.addEventListener('pointerup', fine);
  img.addEventListener('pointercancel', fine);
  img.addEventListener('click', function(e){ e.stopPropagation(); });
  img.addEventListener('dragstart', function(e){ e.preventDefault(); });

  // computer: pinch del trackpad (arriva come rotella con ctrl) o rotella del mouse
  var finitoZoomRotella = null;
  lb.addEventListener('wheel', function(e){
    if(!lb.classList.contains('open')) return;
    e.preventDefault();
    if(!img.contains(e.target) && scala <= 1) return;
    var passo = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    var k = Math.exp(-passo * (e.ctrlKey ? 0.01 : 0.0015));
    lb.classList.add('dragging');
    zoomVerso(scala * k, e.clientX, e.clientY);
    apply();
    clearTimeout(finitoZoomRotella);
    finitoZoomRotella = setTimeout(function(){
      lb.classList.remove('dragging');
      if(scala < SOGLIA){ azzera(); apply(); }
    }, 180);
  }, { passive:false });
})();
