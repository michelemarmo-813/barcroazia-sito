/* Bar Croazia — comportamenti della pagina */
(function(){
  var mesi = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var d = new Date();

  // data del giorno in alto a sinistra ("giorno mese anno")
  var today = document.getElementById('today');
  if(today){ today.textContent = d.getDate() + ' ' + mesi[d.getMonth()] + ' ' + d.getFullYear(); }

  // scritte verticali ai lati: "BOLOGNA–giorno.mese.anno *** "
  var stamp = 'BOLOGNA–' + d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' *** ';
  var tape = new Array(40).join(stamp);
  document.querySelectorAll('.side-tape').forEach(function(t){ t.textContent = tape; });

  // le scritte ai lati partono sotto l'intestazione e arrivano in fondo
  function tapeTop(){
    var nav = document.querySelector('.main-nav');
    if(nav){ document.body.style.setProperty('--tape-top', (nav.getBoundingClientRect().bottom + window.scrollY + 24) + 'px'); }
  }
  tapeTop();
  window.addEventListener('load', tapeTop);
  window.addEventListener('resize', tapeTop);

  // ticker: il contenuto viene duplicato per scorrere senza interruzioni
  var track = document.querySelector('.ticker-track');
  if(track){
    Array.prototype.slice.call(track.children).forEach(function(el){
      var c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('tabindex', '-1');
      track.appendChild(c);
    });
  }

  // "Sasso": sasso / carta / forbici a ogni clic
  var rps = ['Sasso', 'Carta', 'Forbici'];
  document.querySelectorAll('.js-rps').forEach(function(b){
    var i = 0;
    b.addEventListener('click', function(){
      i = (i + 1) % rps.length;
      document.querySelectorAll('.js-rps').forEach(function(x){ x.textContent = rps[i]; });
    });
  });

  // "Scopri poeta": un nome a caso da poeti.js. L'etichetta mostra il
  // nome e porta alla pagina di Wikipedia in italiano; se quella pagina
  // non esiste (o la verifica tarda), porta alla pagina inglese.
  var poeti = window.POETI || [];
  var poetaEls = document.querySelectorAll('.js-poeta');
  if(poeti.length && poetaEls.length){
    var scelta = poeti[Math.floor(Math.random() * poeti.length)];
    var slug = encodeURIComponent(scelta.replace(/ /g, '_'));
    var setPoeta = function(nome, href){
      poetaEls.forEach(function(a){
        a.textContent = 'Scopri poeta: ' + nome;
        a.href = href;
      });
    };
    setPoeta(scelta, 'https://en.wikipedia.org/wiki/' + slug);
    var timeout = new Promise(function(_, rej){ setTimeout(function(){ rej(new Error('timeout')); }, 2500); });
    Promise.race([
      fetch('https://it.wikipedia.org/api/rest_v1/page/summary/' + slug).then(function(r){
        if(!r.ok) throw new Error('no-it-page');
        return r.json();
      }),
      timeout
    ]).then(function(data){
      if(data && data.content_urls && data.content_urls.desktop){
        setPoeta(data.title || scelta, data.content_urls.desktop.page);
      }
    }).catch(function(){ /* resta la pagina inglese */ });
  }

  // ---- conto alla rovescia al prossimo Raw Poetry ----
  // Lunedì alle 20:30, ora di Bologna, per chiunque visiti il sito.
  // Il lunedì dalle 20:30 alle 23:30: "siamo in piazza adesso".
  var cdEls = document.querySelectorAll('.js-countdown');
  var TZ = 'Europe/Rome';
  function romeParts(date){
    var o = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone:TZ, hourCycle:'h23', weekday:'short',
      year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    }).formatToParts(date).forEach(function(p){ o[p.type] = p.value; });
    return o;
  }
  function romeOffset(date){
    var p = romeParts(date);
    var asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return asUtc - Math.floor(date.getTime() / 1000) * 1000;
  }
  // istante reale corrispondente a un'ora "di Bologna"
  function romeToDate(y, m, d, hh, mm){
    var guess = Date.UTC(y, m, d, hh, mm);
    var t = guess - romeOffset(new Date(guess));
    return new Date(guess - romeOffset(new Date(t)));
  }
  var DAYS = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function tickCountdown(){
    if(!cdEls.length) return;
    var now = new Date();
    var p = romeParts(now);
    var dow = DAYS[p.weekday];            // lunedì = 0
    var mins = +p.hour * 60 + +p.minute;
    var text;
    if(dow === 0 && mins >= 20 * 60 + 30 && mins < 23 * 60 + 30){
      text = 'Siamo in piazza adesso';
    } else {
      var add = (7 - dow) % 7;
      if(dow === 0 && mins >= 20 * 60 + 30){ add = 7; }
      var base = new Date(Date.UTC(+p.year, +p.month - 1, +p.day + add));
      var target = romeToDate(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 20, 30);
      var s = Math.max(0, Math.floor((target - now) / 1000));
      var dd = Math.floor(s / 86400); s -= dd * 86400;
      var hh = Math.floor(s / 3600); s -= hh * 3600;
      var mi = Math.floor(s / 60); s -= mi * 60;
      text = 'Prossimo Raw Poetry: ' + pad(dd) + ' : ' + pad(hh) + ' : ' + pad(mi) + ' : ' + pad(s);
    }
    cdEls.forEach(function(el){ if(el.textContent !== text){ el.textContent = text; } });
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  // ---- citazione battuta a macchina ----
  // Il testo completo resta nell'HTML (e per i lettori di schermo);
  // l'animazione è una copia visiva sopra. Alla fine resta ferma.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tw = document.querySelector('.tw');
  if(tw){
    var full = tw.querySelector('.tw-text').textContent.trim();
    var vis = document.createElement('span');
    vis.className = 'tw-vis';
    vis.setAttribute('aria-hidden', 'true');
    vis.innerHTML = '<span class="tw-typed"></span><span class="tw-cur"></span><span class="tw-rest"></span>';
    tw.appendChild(vis);
    tw.classList.add('tw-on');
    var typed = vis.querySelector('.tw-typed'), rest = vis.querySelector('.tw-rest');
    var note = document.querySelector('.quote-note');
    function render(i){ typed.textContent = full.slice(0, i); rest.textContent = full.slice(i); }
    if(reduce){
      render(full.length);
      if(note) note.classList.add('on');
    } else {
      render(0);
      var startType = function(){
        var i = 0;
        (function step(){
          render(i);
          if(i++ < full.length){ setTimeout(step, 70); }
          else if(note){ note.classList.add('on'); }
        })();
      };
      if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(es){
          if(es[0].isIntersecting){ io.disconnect(); startType(); }
        }, { threshold:0.6 });
        io.observe(tw);
      } else { startType(); }
    }
  }

  // ---- il codice a barre nasconde un verso (versi.js) ----
  var bc = document.querySelector('.barcode');
  var verseEl = document.querySelector('.barcode-verse');
  var versi = window.VERSI || [];
  if(bc && verseEl && versi.length){
    var vIdx = -1, decoding = null;
    var CH = '0123456789*#';
    var decode = function(){
      vIdx = (vIdx + 1) % versi.length;
      var target = versi[vIdx];
      if(decoding) clearInterval(decoding);
      if(reduce){ verseEl.textContent = target; return; }
      var frame = 0, total = 8 + target.length;
      decoding = setInterval(function(){
        frame++;
        var fixed = frame - 8;   // prima un istante di solo rimescolamento
        var out = '';
        for(var k = 0; k < target.length; k++){
          var c = target[k];
          out += (k < fixed || c === ' ') ? c : CH[Math.floor(Math.random() * CH.length)];
        }
        verseEl.textContent = out;
        if(frame >= total){ clearInterval(decoding); decoding = null; verseEl.textContent = target; }
      }, 35);
    };
    bc.addEventListener('click', decode);
    bc.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); decode(); }
    });
  }

  // ---- scia di stelline dietro al cursore (solo computer) ----
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(fine && !reduce){
    var cv = document.createElement('canvas');
    cv.className = 'sparkle-layer';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function(){
      cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener('resize', size);
    var parts = [], running = false, lastX = -99, lastY = -99;
    var star4 = function(x, y, r, a){
      ctx.save();
      ctx.translate(x, y); ctx.rotate(a);
      ctx.beginPath();
      for(var i = 0; i < 8; i++){
        var rr = i % 2 ? r * 0.28 : r;
        var ang = i * Math.PI / 4;
        ctx[i ? 'lineTo' : 'moveTo'](Math.cos(ang) * rr, Math.sin(ang) * rr);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    };
    var loop = function(t){
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts = parts.filter(function(p){ return t - p.t0 < 800; });
      parts.forEach(function(p){
        var k = (t - p.t0) / 800;
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = '#e83d0f';
        star4(p.x, p.y, p.r * (0.7 + k * 0.6), p.a);
      });
      ctx.globalAlpha = 1;
      if(parts.length){ requestAnimationFrame(loop); } else { running = false; }
    };
    window.addEventListener('pointermove', function(e){
      if(e.pointerType !== 'mouse') return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      if(dx * dx + dy * dy < 400) return;     // una stellina ogni ~20px
      lastX = e.clientX; lastY = e.clientY;
      if(parts.length > 24) parts.shift();
      parts.push({ x:e.clientX, y:e.clientY, r:3 + Math.random() * 3, a:Math.random() * Math.PI, t0:performance.now() });
      if(!running){ running = true; requestAnimationFrame(loop); }
    }, { passive:true });
  }

  // "Prossimo evento / numero / call": passa all'elemento successivo
  function current(sel){
    var items = Array.prototype.slice.call(document.querySelectorAll(sel));
    var i = items.findIndex(function(x){ return !x.hidden; });
    return { items: items, i: i < 0 ? 0 : i };
  }
  document.querySelectorAll('.js-next').forEach(function(btn){
    btn.addEventListener('click', function(){
      var c = current(btn.dataset.items);
      if(c.items.length < 2) return;
      c.items[c.i].hidden = true;
      var n = (c.i + 1) % c.items.length;
      c.items[n].hidden = false;
      if(btn.dataset.items === '.call-item'){ syncCall(); }
    });
  });

  // open call: "invia la candidatura" e "scopri di più" seguono la call mostrata
  var apply = document.querySelector('.js-apply');
  function syncCall(){
    var c = current('.call-item');
    if(apply && c.items[c.i]){ apply.href = c.items[c.i].dataset.mail; }
  }
  var postersBtn = document.querySelector('.js-posters');
  if(postersBtn){
    postersBtn.addEventListener('click', function(){
      var c = current('.call-item');
      var list = (c.items[c.i].dataset.posters || '').split(',');
      openLightbox(list, 0);
    });
  }

  // ultime cose: ogni pulsante apre il suo pannello
  document.querySelectorAll('.stack .btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      if(open){
        var map = panel.querySelector('iframe[data-src]');
        if(map){ map.src = map.dataset.src; map.removeAttribute('data-src'); }
        panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
    });
  });

  // ---- archivio: un carosello per evento (dati in archivio-dati.js) ----
  var gallery = document.getElementById('archivio-gallery');
  var eventi = (window.ARCHIVIO || []).slice(0, 3);
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  if(gallery){
    eventi.forEach(function(ev, k){
      var fig = document.createElement('figure');
      fig.className = 'shot';
      var imgs = (ev.foto || []).map(function(src, i){
        return '<img class="bw' + (i === 0 ? ' on' : '') + '" src="' + esc(src) + '" alt="' + esc(ev.titolo + ' ' + ev.data + ', foto ' + (i + 1) + ' di ' + ev.foto.length + ', di ' + ev.fotografo) + '" data-zoom' + (i ? ' loading="lazy"' : '') + '>';
      }).join('');
      fig.innerHTML =
        '<div class="cap">' + esc(ev.titolo + ' ' + ev.data) + '</div>' +
        '<div class="frame"><div class="shot-crop" data-gallery>' + imgs + '</div></div>' +
        '<figcaption>\uD83D\uDCF7 ' + esc(ev.fotografo) + '</figcaption>';
      gallery.appendChild(fig);
      var slides = fig.querySelectorAll('.shot-crop img');
      if(slides.length > 1 && !reduce){
        var n = 0;
        // ritmi un po' diversi, così i tre caroselli non cambiano insieme
        setInterval(function(){
          if(document.hidden) return;
          slides[n].classList.remove('on');
          n = (n + 1) % slides.length;
          slides[n].classList.add('on');
        }, 5200 + k * 900);
      }
    });
  }
})();
