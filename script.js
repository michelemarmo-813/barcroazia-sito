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
        a.textContent = 'Scopri: ' + nome;
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

  // "Meteo città": una città italiana a caso con una temperatura a caso
  // (come nella versione precedente del sito); porta alle previsioni
  // di quella città
  var meteoTemp = ['4°C', '39°C', '2°C', '31°C', '-9°C', '42°C', '-14°C', '17°C', '33°C', '-3°C', '44°C', '-6°C', '21°C', '12°C'];
  var meteoLuoghi = [
    'Torino', 'Milano', 'Bologna', 'Venezia', 'Genova', 'Trieste', 'Verona',
    'Bergamo', 'Bolzano', 'Trento', 'Aosta', 'Cuneo', 'Ferrara', 'Parma',
    'Modena', 'Reggio Emilia', 'Ravenna', 'Rimini', 'Cesenatico', 'Mantova',
    'Sondrio', 'Como', 'Vicenza', 'Padova', 'Treviso', 'Udine', 'Gorizia',
    'Piacenza', 'La Spezia', 'Portofino', 'Vernazza', 'Firenze', 'Siena',
    'Pisa', 'Lucca', 'Arezzo', 'Perugia', 'Assisi', 'Gubbio', 'Orvieto',
    'Urbino', 'Ancona', 'Ascoli Piceno', 'Roma', 'Viterbo', 'Rieti', 'Latina',
    'Frosinone', 'L’Aquila', 'Pescara', 'Chieti', 'Teramo', 'Napoli',
    'Salerno', 'Amalfi', 'Positano', 'Bari', 'Lecce', 'Taranto', 'Brindisi',
    'Matera', 'Potenza', 'Reggio Calabria', 'Cosenza', 'Catanzaro', 'Crotone',
    'Trapani', 'Palermo', 'Catania', 'Siracusa', 'Messina', 'Agrigento',
    'Ragusa', 'Cagliari', 'Sassari', 'Nuoro', 'Oristano', 'Olbia', 'Alghero',
    'Otranto', 'Gallipoli', 'Tropea', 'Alberobello', 'Polignano a Mare',
    'Civita di Bagnoregio', 'San Gimignano'
  ];
  var citta = meteoLuoghi[Math.floor(Math.random() * meteoLuoghi.length)];
  var gradi = meteoTemp[Math.floor(Math.random() * meteoTemp.length)];
  document.querySelectorAll('.js-meteo').forEach(function(a){
    a.textContent = citta + ' ' + gradi;
    a.href = 'https://www.ilmeteo.it/meteo/' + encodeURIComponent(citta.replace(/’/g, "'"));
  });

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

  // ---- stelle: ritardo e durata diversi per ognuna ----
  document.querySelectorAll('.stella').forEach(function(st){
    st.style.setProperty('--d', (-Math.random() * 3).toFixed(2) + 's');
    st.style.setProperty('--t', (2.2 + Math.random() * 0.9).toFixed(2) + 's');
  });


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
  var more = document.querySelector('.js-more');
  function syncCall(){
    var c = current('.call-item');
    var it = c.items[c.i];
    if(!it) return;
    syncDots();
    if(more){ more.href = it.dataset.page; }
    if(apply){
      apply.href = it.dataset.apply;
      // il form si apre in una nuova scheda, la mail no
      if(it.dataset.newtab){ apply.target = '_blank'; apply.rel = 'noopener'; }
      else { apply.removeAttribute('target'); apply.removeAttribute('rel'); }
    }
  }
  // pallini sotto "Open call": quante call ci sono e quale si vede
  function syncDots(){
    var dots = document.querySelectorAll('.call-dot');
    var c = current('.call-item');
    dots.forEach(function(d, i){
      d.classList.toggle('on', i === c.i);
      if(i === c.i){ d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
    });
  }
  document.querySelectorAll('.call-dot').forEach(function(d, i){
    d.addEventListener('click', function(){
      var c = current('.call-item');
      if(!c.items[i] || i === c.i) return;
      c.items[c.i].hidden = true;
      c.items[i].hidden = false;
      syncCall();
    });
  });
  syncCall();

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
  // i tre eventi più recenti che hanno almeno una foto
  var eventi = (window.ARCHIVIO || []).filter(function(ev){ return ev.foto && ev.foto.length; }).slice(0, 3);
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  if(gallery){
    eventi.forEach(function(ev, k){
      var fig = document.createElement('figure');
      fig.className = 'shot';
      // le foto passano in ordine casuale e sempre diverso:
      // si mescolano tutte quelle dell'evento e si pescano una alla volta
      // (un nuovo giro rimescola, senza ripetere subito l'ultima uscita)
      var mazzo = [];
      function pesca(ultima){
        if(!mazzo.length){
          mazzo = ev.foto.map(function(_, i){ return i; });
          for(var j = mazzo.length - 1; j > 0; j--){
            var r = Math.floor(Math.random() * (j + 1)), t = mazzo[j]; mazzo[j] = mazzo[r]; mazzo[r] = t;
          }
          if(mazzo.length > 1 && mazzo[mazzo.length - 1] === ultima){ mazzo.unshift(mazzo.pop()); }
        }
        return mazzo.pop();
      }
      function alt(i){ return ev.titolo + ' ' + ev.data + ', foto ' + (i + 1) + ' di ' + ev.foto.length + ', di ' + ev.fotografo; }
      var cur = pesca(-1);
      fig.innerHTML =
        '<div class="cap">' + esc(ev.titolo + ' ' + ev.data) + '</div>' +
        '<div class="frame"><div class="shot-crop" role="button" tabindex="0" aria-label="' + esc('Sfoglia le ' + ev.foto.length + ' foto di ' + ev.titolo + ' ' + ev.data) + '">' +
          '<img class="bw on" src="' + esc(ev.foto[cur]) + '" alt="' + esc(alt(cur)) + '"><img class="bw" alt="">' +
        '</div></div>' +
        '<figcaption>📷 ' + esc(ev.fotografo) + '</figcaption>';
      gallery.appendChild(fig);
      var crop = fig.querySelector('.shot-crop');
      var lastre = crop.querySelectorAll('img');
      // al clic si sfogliano tutte le foto, partendo da quella che si vede
      function apri(){ if(window.openLightbox) window.openLightbox(ev.foto, cur); }
      crop.addEventListener('click', apri);
      crop.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); apri(); } });
      if(ev.foto.length > 1 && !reduce){
        var vis = 0, attesa = false;
        // ritmi un po' diversi, così i tre caroselli non cambiano insieme
        setInterval(function(){
          if(document.hidden || attesa) return;
          var i = pesca(cur), dopo = lastre[1 - vis];
          attesa = true;
          // la nuova foto entra solo quando è già caricata
          dopo.onload = function(){
            dopo.alt = alt(i);
            dopo.classList.add('on');
            lastre[vis].classList.remove('on');
            lastre[vis].alt = '';
            vis = 1 - vis; cur = i; attesa = false;
          };
          dopo.onerror = function(){ attesa = false; };
          dopo.src = ev.foto[i];
        }, 5200 + k * 900);
      }
    });
  }
})();
