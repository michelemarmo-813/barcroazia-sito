/* Bar Croazia — comportamenti della pagina */
(function(){
  var mesi = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var d = new Date();

  // data del giorno in alto a sinistra ("giorno mese anno")
  var today = document.getElementById('today');
  if(today){ today.textContent = d.getDate() + ' ' + mesi[d.getMonth()] + ' ' + d.getFullYear(); }

  // scritte verticali ai lati: "BOLOGNA–giorno.mese.anno * " ripetuto.
  // Partono sotto la barra a scorrimento e finiscono all'altezza dei numeri
  // del codice a barre; contengono solo ripetizioni intere e la loro
  // altezza è esattamente quella del testo, così le due scritte iniziano
  // e finiscono alla pari, senza date tagliate né spazi vuoti
  var data = 'BOLOGNA–' + d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
  var stamp = data + ' * ';
  // lingue.js: con Carmen Di Pietro anche le scritte laterali chiedono ("…2026? * "),
  // si rifanno da capo perché il "?" allunga ogni ripetizione
  window.bcTape = function(modo){
    var nuovo = data + (modo === 'cdp' ? '?' : '') + ' * ';
    if(nuovo === stamp) return;
    stamp = nuovo;
    sistemaTape();
  };
  var tapes = document.querySelectorAll('.side-tape');
  var reduceTape = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sistemaTape(){
    if(!tapes.length) return;
    var su = document.querySelector('.ticker') || document.querySelector('.main-nav');
    // con il verso del codice a barre in vista, le scritte finiscono sotto il verso
    var verso = document.querySelector('.barcode-verse');
    var giu = (verso && verso.textContent.trim() && verso.offsetHeight) ? verso : (document.querySelector('.barcode-num') || document.querySelector('.barcode'));
    if(!su || !giu) return;
    // su telefono le scritte partono dalla cima della pagina (ai lati c'è posto)
    var top = window.matchMedia('(max-width: 760px)').matches ? 6 : su.getBoundingClientRect().bottom + window.scrollY + 30;
    var fine = giu.getBoundingClientRect().bottom + window.scrollY;
    tapes.forEach(function(t){
      t.style.top = top + 'px';
      if(getComputedStyle(t).display === 'none') return;
      t.style.height = Math.max(fine - top, 0) + 'px';
      t.innerHTML = '<span></span>';
      var testo = t.firstChild;
      // altezza di una ripetizione (misurata su dieci, per contare anche gli spazi)
      testo.textContent = new Array(11).join(stamp) + 'X';
      var dieci = testo.getBoundingClientRect().height;
      testo.textContent = 'X';
      var una = (dieci - testo.getBoundingClientRect().height) / 10;
      var n = una > 0 ? Math.floor((fine - top) / una) : 0;
      testo.textContent = new Array(Math.max(n, 0) + 1).join(stamp);
      while(n > 0 && testo.getBoundingClientRect().height > fine - top + 1){
        n--; testo.textContent = new Array(n + 1).join(stamp);
      }
      // il pezzo che avanza (meno di una ripetizione) si distribuisce
      // allargando di pochissimo la spaziatura delle lettere, così la
      // scritta arriva proprio all'altezza dei numeri del codice a barre
      var avanza = (fine - top) - testo.getBoundingClientRect().height;
      if(n > 0 && avanza > 0){
        var base = parseFloat(getComputedStyle(testo).letterSpacing) || 0;
        testo.style.letterSpacing = (base + avanza / testo.textContent.length) + 'px';
      }
      var h = testo.getBoundingClientRect().height;
      if(h > fine - top + 1){ testo.style.letterSpacing = ''; h = testo.getBoundingClientRect().height; }
      // la scritta è alta esattamente quanto il suo testo
      t.style.height = Math.ceil(h) + 'px';
      // scorre lentissima: si aggiunge una ripetizione in più e si sposta
      // il testo di una ripetizione alla volta, così il giro non si vede
      if(n > 0 && !reduceTape){
        testo.style.setProperty('--passo', (h / n) + 'px');
        testo.textContent += stamp;
        testo.classList.add('scorre');
      }
    });
  }
  sistemaTape();
  window.addEventListener('load', sistemaTape);
  window.addEventListener('resize', sistemaTape);
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(sistemaTape); }
  // se la pagina cambia altezza (foto caricate, pannelli aperti) si ricalcola
  if('ResizeObserver' in window){
    var tapeTimer, ultimaAltezza = 0;
    new ResizeObserver(function(){
      var h = document.documentElement.scrollHeight;
      if(Math.abs(h - ultimaAltezza) < 8) return;
      ultimaAltezza = h;
      clearTimeout(tapeTimer); tapeTimer = setTimeout(sistemaTape, 150);
    }).observe(document.body);   // anche la citazione del giorno, fuori da main, cambia altezza
  }

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

  // ---- citazione del giorno, battuta a macchina ----
  // Le citazioni si leggono dal foglio Google condiviso (indirizzo in
  // citazioni.js): colonna A la citazione, colonna B chi l'ha detta.
  // Le righe vuote non contano. Se il foglio non risponde, si usa
  // l'elenco di riserva in citazioni.js.
  // Una citazione a caso al giorno, uguale per tutti: le citazioni sono
  // rimescolate sempre nello stesso modo e ogni giorno si passa alla
  // successiva. Cambia a mezzanotte, ora di Bologna.
  // Il testo completo resta nell'HTML (e per i lettori di schermo);
  // l'animazione è una copia visiva sopra. Alla fine resta ferma.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var citazioni = (window.CITAZIONI || []).slice();
  function giornoRoma(){
    var p = romeParts(new Date());
    return Math.floor(Date.UTC(+p.year, +p.month - 1, +p.day) / 864e5);
  }
  function citazioneDelGiorno(g){
    var n = citazioni.length, ordine = [], seme = 20251006, k;
    for(k = 0; k < n; k++){ ordine.push(k); }
    for(k = n - 1; k > 0; k--){
      seme = (seme * 16807) % 2147483647;
      var r = seme % (k + 1), t = ordine[k]; ordine[k] = ordine[r]; ordine[r] = t;
    }
    var c = citazioni[ordine[((g % n) + n) % n]];
    return typeof c === 'string' ? { testo:c, autore:'' } : c;
  }
  // CSV del foglio -> [{testo, autore}], senza intestazione né righe vuote
  function leggiCSV(t){
    var righe = [], riga = [], campo = '', dentro = false;
    for(var k = 0; k < t.length; k++){
      var ch = t[k];
      if(dentro){
        if(ch === '"'){ if(t[k + 1] === '"'){ campo += '"'; k++; } else { dentro = false; } }
        else { campo += ch; }
      } else if(ch === '"'){ dentro = true; }
      else if(ch === ','){ riga.push(campo); campo = ''; }
      else if(ch === '\n' || ch === '\r'){
        if(ch === '\r' && t[k + 1] === '\n'){ k++; }
        riga.push(campo); righe.push(riga); riga = []; campo = '';
      } else { campo += ch; }
    }
    if(campo !== '' || riga.length){ riga.push(campo); righe.push(riga); }
    var pulisci = function(x){ return String(x || '').replace(/\s+/g, ' ').trim(); };
    return righe.map(function(r){ return { testo:pulisci(r[0]), autore:pulisci(r[1]) }; })
      .filter(function(c, k){ return c.testo && !(k === 0 && /^citazion/i.test(c.testo)); });
  }
  function caricaFoglio(fatto){
    var url = window.CITAZIONI_FOGLIO, finito = false;
    var fine = function(lista){ if(finito) return; finito = true; if(lista && lista.length){ citazioni = lista; } fatto(); };
    if(!url || !window.fetch){ fine(null); return; }
    setTimeout(function(){ fine(null); }, 4000);           // il foglio tarda: si usa la riserva
    fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now(), { cache:'no-store' })
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ fine(leggiCSV(t)); })
      .catch(function(){ fine(null); });
  }
  // la citazione di oggi resta la stessa per tutto il giorno anche se il
  // foglio cambia nel frattempo (le modifiche valgono dal giorno dopo),
  // a meno che quella citazione sia stata cancellata dal foglio
  function scegli(g){
    var mem = null;
    try{ mem = JSON.parse(localStorage.getItem('bc-citazione') || 'null'); }catch(e){}
    if(mem && mem.g === g && citazioni.some(function(c){ return c.testo === mem.testo; })){ return mem; }
    var c = citazioneDelGiorno(g);
    try{ localStorage.setItem('bc-citazione', JSON.stringify({ g:g, testo:c.testo, autore:c.autore })); }catch(e){}
    return c;
  }
  var tw = document.querySelector('.tw');
  if(tw){
    var twText = tw.querySelector('.tw-text');
    var oggi = giornoRoma();
    var note = document.querySelector('.quote-note');
    // l'autore compare in fondo, centrato, quando la citazione è finita
    function mettiCitazione(c){
      twText.textContent = c.testo;
      if(note){ note.classList.remove('on'); note.innerHTML = ''; var b = document.createElement('b'); b.textContent = c.autore; note.appendChild(b); note.hidden = !c.autore; }
    }
    var full = '';
    var vis = document.createElement('span');
    vis.className = 'tw-vis';
    vis.setAttribute('aria-hidden', 'true');
    vis.innerHTML = '<span class="tw-typed"></span><span class="tw-cur"></span><span class="tw-rest"></span>';
    tw.appendChild(vis);
    tw.classList.add('tw-on');
    var typed = vis.querySelector('.tw-typed'), rest = vis.querySelector('.tw-rest');
    var cur = 0, battitura = null;
    function render(i){ cur = i; typed.textContent = full.slice(0, i); rest.textContent = full.slice(i); }
    // quando cambia la lingua (lingue.js) la copia visiva riprende il testo nuovo
    window.bcTwAggiorna = function(){
      var nuovo = twText.textContent.trim();
      var fin = cur >= full.length;
      full = nuovo;
      render(fin ? full.length : Math.min(cur, full.length));
    };
    var startType = function(){
      clearTimeout(battitura);
      var i = 0;
      (function step(){
        render(i);
        if(i++ < full.length){ battitura = setTimeout(step, 70); }
        else if(note){ note.classList.add('on'); }
      })();
    };
    // mette la citazione e, un attimo dopo (quando lingue.js l'ha già
    // adattata alla lingua scelta), la batte a macchina
    var pronta = false, inVista = !('IntersectionObserver' in window);
    function mostra(){
      if(citazioni.length){ mettiCitazione(scegli(oggi)); }
      setTimeout(function(){
        full = twText.textContent.trim();
        pronta = true;
        if(reduce){ render(full.length); if(note) note.classList.add('on'); }
        else if(inVista){ startType(); }
        else { render(0); }
      }, 0);
    }
    render(0);
    if(!reduce && !inVista){
      var io = new IntersectionObserver(function(es){
        if(es[0].isIntersecting){ io.disconnect(); inVista = true; if(pronta){ startType(); } }
      }, { threshold:0.6 });
      io.observe(tw);
    }
    caricaFoglio(mostra);
    // a mezzanotte (anche con la pagina rimasta aperta) arriva la citazione nuova,
    // dal foglio riletto in quel momento
    var cambiaGiorno = function(){
      var g = giornoRoma();
      if(g === oggi) return;
      oggi = g;
      caricaFoglio(function(){ inVista = true; mostra(); });
    };
    setInterval(cambiaGiorno, 20000);
    document.addEventListener('visibilitychange', function(){ if(!document.hidden){ cambiaGiorno(); } });
  }

  // ---- il codice a barre nasconde un verso (versi.js) ----
  var bc = document.querySelector('.barcode');
  var verseEl = document.querySelector('.barcode-verse');
  var versi = window.VERSI || [];
  if(bc && verseEl && versi.length){
    var vIdx = -1, decoding = null;
    var CH = '0123456789*#';
    // il "bip" registrato: finché suona, i caratteri si rimescolano;
    // quando finisce, si fissano da sinistra a destra sul verso
    // se il verso cambia altezza (compare, va a capo diversamente) le
    // scritte laterali si rifanno per finire alla sua altezza
    var hVerso = 0;
    var altezzaVerso = function(){
      var h = verseEl.offsetHeight;
      if(h !== hVerso){ hVerso = h; sistemaTape(); }
    };
    var bip = new Audio('assets/audio/bip.mp3');
    bip.preload = 'auto';
    var rivela = function(target){
      var k0 = 0;
      decoding = setInterval(function(){
        k0++;
        var out = '';
        for(var k = 0; k < target.length; k++){
          var c = target[k];
          out += (k < k0 || c === ' ') ? c : CH[Math.floor(Math.random() * CH.length)];
        }
        verseEl.textContent = out;
        if(k0 >= target.length){ clearInterval(decoding); decoding = null; verseEl.textContent = target; }
        altezzaVerso();
      }, 35);
    };
    var decode = function(){
      vIdx = (vIdx + 1) % versi.length;
      // il codice a barre dice sempre la stessa parola
      var target = 'Garibalbip';
      if(decoding) clearInterval(decoding);
      bip.onended = null;
      try{ bip.pause(); bip.currentTime = 0; }catch(e){}
      var fatto = false;
      var fine = function(){
        if(fatto) return; fatto = true;
        if(decoding) clearInterval(decoding);
        if(reduce){ decoding = null; verseEl.textContent = target; altezzaVerso(); return; }
        rivela(target);
      };
      // rimescolamento continuo finché l'audio va
      if(!reduce){
        decoding = setInterval(function(){
          var out = '';
          for(var k = 0; k < target.length; k++){
            out += target[k] === ' ' ? ' ' : CH[Math.floor(Math.random() * CH.length)];
          }
          verseEl.textContent = out;
          altezzaVerso();
        }, 35);
      } else {
        verseEl.textContent = '';
      }
      bip.onended = fine;
      var p = bip.play();
      // se l'audio non parte (bloccato o non trovato), il verso esce lo stesso
      if(p && p.catch){ p.catch(function(){ setTimeout(fine, 300); }); }
      bip.onerror = function(){ setTimeout(fine, 300); };
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
  // pallini sotto i titoli: quanti elementi ci sono e quale si vede
  function syncDots(sel){
    var c = current(sel);
    document.querySelectorAll('.call-dots[data-items="' + sel + '"] .call-dot').forEach(function(d, i){
      d.classList.toggle('on', i === c.i);
      if(i === c.i){ d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
    });
  }
  // mostra l'elemento n dell'elenco e aggiorna tasti e pallini collegati
  function mostra(sel, n){
    var c = current(sel);
    if(!c.items[n] || n === c.i) return;
    c.items[c.i].hidden = true;
    c.items[n].hidden = false;
    syncDots(sel);
    if(sel === '.call-item'){ syncCall(); }
    if(sel === '.ev-item'){ syncEvento(); }
  }
  document.querySelectorAll('.js-next').forEach(function(btn){
    btn.addEventListener('click', function(){
      var c = current(btn.dataset.items);
      if(c.items.length < 2) return;
      mostra(btn.dataset.items, (c.i + 1) % c.items.length);
    });
  });
  document.querySelectorAll('.call-dots').forEach(function(box){
    box.querySelectorAll('.call-dot').forEach(function(d, i){
      d.addEventListener('click', function(){ mostra(box.dataset.items, i); });
    });
  });

  // scorrere col dito (a destra o a sinistra) su un elemento: chiama vai(+1) o vai(-1).
  // Lo scorrimento in su e in giù resta quello della pagina; dopo uno
  // scorrimento il tocco non apre la foto ingrandita.
  function scorrimento(el, vai){
    var x0 = null, y0 = 0, appena = 0;
    el.addEventListener('touchstart', function(e){
      if(e.touches.length !== 1){ x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive:true });
    el.addEventListener('touchend', function(e){
      if(x0 === null) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5){
        appena = Date.now();
        vai(dx < 0 ? 1 : -1);
      }
    }, { passive:true });
    el.addEventListener('click', function(e){
      if(Date.now() - appena < 500){ e.preventDefault(); e.stopPropagation(); }
    }, true);
  }
  // eventi, fanzine, open call: col dito si passa all'elemento dopo o prima
  // (come il tasto "Prossimo…"); il nuovo entra scivolando da quel lato
  ['.ev-item', '.fz-item', '.call-item'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(item){
      scorrimento(item, function(dir){
        var c = current(sel), n = c.items.length;
        if(n < 2) return;
        var dopo = (c.i + dir + n) % n;
        mostra(sel, dopo);
        if(!reduce){
          var nuovo = c.items[dopo];
          nuovo.classList.remove('entra-dx', 'entra-sx'); void nuovo.offsetWidth;
          nuovo.classList.add(dir > 0 ? 'entra-dx' : 'entra-sx');
        }
      });
    });
  });

  // chi siamo: le foto si alternano da sole, e col dito si sfogliano
  (function(){
    var foto = document.querySelectorAll('.cs-frame .cs-crop img');
    if(foto.length < 2) return;
    var cur = 0, timer = null;
    function vai(n){
      foto[cur].classList.remove('on');
      cur = (n + foto.length) % foto.length;
      foto[cur].classList.add('on');
    }
    function parti(){
      if(reduce) return;
      clearInterval(timer);
      timer = setInterval(function(){ if(!document.hidden){ vai(cur + 1); } }, 5000);
    }
    parti();
    scorrimento(document.querySelector('.cs-frame .cs-crop'), function(dir){ vai(cur + dir); parti(); });
  })();

  // eventi: "scopri di più su Instagram" porta al post dell'evento mostrato
  // (due tasti: quello lungo per il computer, "Instagram" per il telefono)
  var ig = document.querySelectorAll('.js-ig');
  function syncEvento(){
    var c = current('.ev-item');
    if(c.items[c.i] && c.items[c.i].dataset.ig){ ig.forEach(function(a){ a.href = c.items[c.i].dataset.ig; }); }
  }

  // open call: "invia la candidatura" e "scopri di più" seguono la call mostrata
  var apply = document.querySelector('.js-apply');
  var more = document.querySelector('.js-more');
  function syncCall(){
    var c = current('.call-item');
    var it = c.items[c.i];
    if(!it) return;
    if(more){ more.href = it.dataset.page; }
    if(apply){
      apply.href = it.dataset.apply;
      // il form si apre in una nuova scheda, la mail no
      if(it.dataset.newtab){ apply.target = '_blank'; apply.rel = 'noopener'; }
      else { apply.removeAttribute('target'); apply.removeAttribute('rel'); }
    }
  }
  syncCall(); syncEvento();
  syncDots('.call-item'); syncDots('.ev-item');

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
