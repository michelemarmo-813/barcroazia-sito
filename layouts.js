/* ==========================================================
   CONFRONTO LAYOUT — selettore e piccoli comportamenti dei layout 2 e 3
   Il layout attivo è l'attributo data-layout sul <body> ("1", "2", "3", "4"),
   impostato già all'apertura della pagina da uno script in cima al body.
   Questo file:
   - disegna il selettore 1 / 2 / 3 / 4 (fisso in basso a destra);
   - al cambio salva la scelta (localStorage) e aggiorna ?layout=N nell'URL;
   - fa rimisurare testi e navbar dello script principale;
   - gestisce i tasti che esistono solo nei layout 2 e 3.
   Il layout 1 non viene toccato: nessuna delle funzioni qui sotto agisce
   finché data-layout vale "1".
   ========================================================== */
(function(){
  var KEY = 'barcroazia-layout';
  var body = document.body;

  function current(){ return body.getAttribute('data-layout') || '1'; }

  // Copia del testo originale di ogni colonna di testo "vero": lo script
  // principale lo accorcia (con "…") in base all'altezza della foto
  // accanto, che cambia da un layout all'altro. Al cambio di layout lo si
  // rimette intero prima di farlo rimisurare.
  var flowSnapshots = [];
  Array.prototype.forEach.call(document.querySelectorAll('.text-flow[data-static="1"]'), function(el){
    flowSnapshots.push({ el: el, html: el.innerHTML });
  });

  function remeasure(){
    flowSnapshots.forEach(function(s){
      s.el.innerHTML = s.html;
      s.el.style.maxHeight = '';
    });
    // navbar: soglia e altezza compatta (listener "resize" dello script principale)
    window.dispatchEvent(new Event('resize'));
    // caroselli: ricalcola testi e troncamenti per la slide corrente
    if(window.photoColRefreshers && window.photoColRefreshers.forEach){
      window.photoColRefreshers.forEach(function(fn){ try{ fn(); }catch(e){} });
    }
  }

  function remeasureWhenFontsReady(){
    requestAnimationFrame(function(){
      remeasure();
      if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(function(){ requestAnimationFrame(remeasure); });
      }
    });
  }

  // Spazio per il testo nei riquadri: lo script principale lo chiede qui
  // prima di usare il proprio calcolo (quello del layout 1).
  // Layout 3 (da tablet in su): il testo riempie tutto il riquadro fino al
  // fondo della cornice arancione della foto, e "Continua a leggere" resta
  // in fondo. Negli altri layout non restituisce nulla.
  window.layoutFlowBudget = function(o){
    var layout = current();
    if(layout === '3'){
      if(window.matchMedia && window.matchMedia('(max-width: 640px)').matches) return;
      var boxBottom = o.col.getBoundingClientRect().bottom;
      var flowTop = o.flowEl.getBoundingClientRect().top;
      var reserve = 0;
      [o.placeholderEl, o.ctaEl].forEach(function(el){
        if(!el) return;
        var cs = window.getComputedStyle(el);
        reserve += el.getBoundingClientRect().height + (parseFloat(cs.marginTop) || 0);
      });
      if(o.moreBtnEl && o.flowEl.dataset.static === '1'){
        var mb = window.getComputedStyle(o.moreBtnEl);
        reserve += (parseFloat(mb.fontSize) || 12) * 1.5 + (parseFloat(mb.marginTop) || 0);
      }
      return Math.max(0, boxBottom - flowTop - reserve - 2);
    }
    if(layout === '4' && o.flowEl.dataset.static === '1'){
      // layout 4: i testi veri restano sempre interi (nessun troncamento)
      return 100000;
    }
  };

  // ---------- selettore ----------
  var sw = document.createElement('div');
  sw.className = 'layout-switch';
  sw.setAttribute('role', 'group');
  sw.setAttribute('aria-label', 'Scegli il layout');
  sw.innerHTML = '<span class="layout-switch-label">layout</span>';
  var buttons = {};
  ['1', '2', '3', '4'].forEach(function(n){
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = n;
    b.setAttribute('aria-label', 'Layout ' + n);
    b.addEventListener('click', function(){ setLayout(n); });
    buttons[n] = b;
    sw.appendChild(b);
  });
  body.appendChild(sw);

  function syncSwitcher(){
    var c = current();
    Object.keys(buttons).forEach(function(n){
      buttons[n].setAttribute('aria-pressed', n === c ? 'true' : 'false');
    });
  }

  function setLayout(n){
    if(!/^[1-4]$/.test(n) || n === current()) return;
    resetLayoutState();
    body.setAttribute('data-layout', n);
    try{ localStorage.setItem(KEY, n); }catch(e){}
    try{
      var u = new URL(location.href);
      u.searchParams.set('layout', n);
      history.replaceState(history.state, '', u.toString());
    }catch(e){}
    syncSwitcher();
    onLayoutApplied();
    remeasureWhenFontsReady();
  }

  syncSwitcher();

  // ---------- layout 2: pannelli aperti dai tasti ----------
  // "Collabora con noi" (sotto Chi siamo) apre la sezione Open call, che
  // nel layout 2 non compare come sezione ma come pannello.
  var callSection = document.getElementById('call');
  var collaboraBtn = document.querySelector('.l2-collabora');
  if(collaboraBtn && callSection){
    collaboraBtn.addEventListener('click', function(){
      if(current() !== '2') return;
      var open = !callSection.classList.contains('l2-open');
      callSection.classList.toggle('l2-open', open);
      collaboraBtn.classList.toggle('open', open);
      collaboraBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        // ricalcola il testo del carosello ora che è visibile
        remeasureWhenFontsReady();
        setTimeout(function(){
          callSection.scrollIntoView({ behavior:'smooth', block:'nearest' });
        }, 480);
      }
    });
  }

  // "Scopri" sotto l'evento: mostra/nasconde il testo completo.
  var eventiSection = document.getElementById('eventi');
  var scopriBtn = document.querySelector('.l2-scopri');
  if(scopriBtn && eventiSection){
    scopriBtn.addEventListener('click', function(){
      if(current() !== '2') return;
      var open = !eventiSection.classList.contains('l2-expanded');
      eventiSection.classList.toggle('l2-expanded', open);
      scopriBtn.classList.toggle('open', open);
      scopriBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      remeasureWhenFontsReady();
    });
  }

  // Fanzine: "con interventi di:" e i nomi uno per riga, presi dal testo
  // del numero mostrato in quel momento (così seguono il carosello).
  var fanzineSection = document.getElementById('fanzine');
  var namesEl = document.querySelector('.l2-names');
  function updateFanzineNames(){
    if(!fanzineSection || !namesEl) return;
    var active = fanzineSection.querySelector('.thumb.active') || fanzineSection.querySelector('.thumb');
    var tpl = active && active.dataset.template ? document.getElementById(active.dataset.template) : null;
    var names = [];
    if(tpl){
      var firstP = tpl.content ? tpl.content.querySelector('p') : null;
      if(firstP){
        var stop = false;
        Array.prototype.forEach.call(firstP.childNodes, function(n){
          if(stop) return;
          if(n.nodeType === 3 && /foto|illustraz/i.test(n.textContent)){ stop = true; return; }
          if(n.nodeType === 1 && n.tagName === 'STRONG'){ names.push(n.textContent.trim()); }
        });
      }
    }
    namesEl.innerHTML = '';
    if(!names.length) return;
    var label = document.createElement('span');
    label.className = 'l2-names-label';
    label.textContent = 'con interventi di:';
    namesEl.appendChild(label);
    names.forEach(function(name){
      var s = document.createElement('span');
      s.textContent = name;
      namesEl.appendChild(s);
    });
  }
  if(fanzineSection && namesEl && 'MutationObserver' in window){
    var fzTitle = fanzineSection.querySelector('.content-title');
    if(fzTitle){
      new MutationObserver(updateFanzineNames).observe(fzTitle, { childList:true, characterData:true, subtree:true });
    }
  }

  // ---------- layout 3 ----------
  // "Prossimo evento >>" / "Prossimo numero >": avanzano il carosello
  // della sezione, come la freccia sulla foto.
  Array.prototype.forEach.call(document.querySelectorAll('[data-next-slide]'), function(btn){
    btn.addEventListener('click', function(){
      var sec = document.getElementById(btn.getAttribute('data-next-slide'));
      var arrow = sec ? sec.querySelector('.photo-nav-arrow.next') : null;
      if(arrow) arrow.click();
    });
  });

  // Scritte verticali ai lati: "bologna – data ***" con la data di oggi.
  (function(){
    var d = new Date();
    var stamp = 'BOLOGNA–' + d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' *** ';
    var txt = new Array(31).join(stamp);
    Array.prototype.forEach.call(document.querySelectorAll('.side-tape'), function(t){
      t.setAttribute('data-tape-l3', txt);
    });
  })();

  // ---------- layout 4 ----------

  // Le miniature dei caroselli hanno la foto come stile in linea, che il
  // CSS del layout 1 nasconde (diventano pallini). Il layout 4 le mostra
  // come copertine: qui la foto viene copiata in una variabile CSS.
  Array.prototype.forEach.call(document.querySelectorAll('.photo-menu .thumb'), function(t){
    if(t.style.backgroundImage){ t.style.setProperty('--thumb-img', t.style.backgroundImage); }
  });

  // Tasti che aprono "Dove trovarci" ("Vieni", la mappa): usano il tasto
  // vero della sezione Chi siamo, poi portano al pannello.
  Array.prototype.forEach.call(document.querySelectorAll('[data-open-panel]'), function(btn){
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('data-open-panel');
      var opener = document.querySelector('.reveal-btn[data-target="' + target + '"]');
      var panel = document.getElementById('panel-' + target);
      if(opener && panel && !panel.classList.contains('open')){ opener.click(); }
      if(panel){
        setTimeout(function(){ panel.scrollIntoView({ behavior:'smooth', block:'start' }); }, 120);
      }
    });
  });

  // Eventi: dati della locandina e del dettaglio, presi dalla slide attiva
  var l4Meta = document.querySelector('.l4-ev-meta');
  var l4Date = document.querySelector('.l4-ev-date');
  var l4Time = document.querySelector('.l4-ev-time');
  var l4Place = document.querySelector('.l4-ev-place');
  function updateEventDetails(){
    if(!eventiSection) return;
    var active = eventiSection.querySelector('.thumb.active') || eventiSection.querySelector('.thumb');
    if(!active) return;
    if(l4Meta){ l4Meta.textContent = (active.dataset.l4Meta || '').split(' \u00B7 ').join('\n'); }
    if(l4Date){ l4Date.textContent = active.dataset.date || ''; }
    if(l4Time){ l4Time.textContent = active.dataset.l4Time || ''; }
    if(l4Place){ l4Place.textContent = active.dataset.l4Place || ''; }
  }

  var l4ScopriBtn = document.querySelector('.l4-scopri');
  if(l4ScopriBtn && eventiSection){
    l4ScopriBtn.addEventListener('click', function(){
      var open = !eventiSection.classList.contains('l4-open');
      eventiSection.classList.toggle('l4-open', open);
      l4ScopriBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      l4ScopriBtn.textContent = open ? 'Chiudi' : 'Scopri';
    });
  }

  var shareBtn = document.querySelector('.l4-share');
  if(shareBtn){
    shareBtn.addEventListener('click', function(){
      var title = (eventiSection && eventiSection.querySelector('.content-title') || {}).textContent || 'Bar Croazia';
      var url = location.href.split('#')[0] + '#eventi';
      if(navigator.share){
        navigator.share({ title: title, url: url }).catch(function(){});
      } else if(navigator.clipboard){
        navigator.clipboard.writeText(url).then(function(){
          shareBtn.textContent = 'Link copiato';
          setTimeout(function(){ shareBtn.textContent = 'Condividi'; }, 2200);
        }).catch(function(){});
      }
    });
  }

  // Fanzine: contatore "numero / totale" accanto alla copertina (layout 2
  // e 4) e, nel layout 2, il solo numero del fascicolo ("n.2") al posto
  // del titolo "Fanzine n.2", per non ripetere la parola "Fanzine"
  var l4Counter = document.querySelector('.l4-counter');
  var l2FzNum = document.querySelector('.l2-fz-num');
  function updateFanzineCounter(){
    if(!fanzineSection) return;
    var thumbs = Array.prototype.slice.call(fanzineSection.querySelectorAll('.thumb'));
    var active = fanzineSection.querySelector('.thumb.active');
    var i = thumbs.indexOf(active);
    if(l4Counter){ l4Counter.textContent = (i < 0 ? 1 : i + 1) + ' / ' + thumbs.length; }
    if(l2FzNum){
      var t = (active || thumbs[0] || {}).dataset;
      var m = t && t.title ? t.title.match(/n\.\s*\d+/i) : null;
      l2FzNum.textContent = m ? m[0].toLowerCase().replace(/\s+/g, '') : '';
    }
  }

  // Layout 2: le scritte verticali ai lati partono subito sotto la barra
  // nera in alto e, quando la barra esce dallo schermo, salgono fino al
  // bordo superiore.
  var tickerEl = document.querySelector('.masthead-marquee');
  var tapeRaf = null;
  function updateTapeTop(){
    tapeRaf = null;
    if(current() !== '2' || !tickerEl) return;
    var bottom = Math.max(0, Math.round(tickerEl.getBoundingClientRect().bottom));
    body.style.setProperty('--l2-tape-top', bottom + 'px');
  }
  function queueTapeTop(){ if(!tapeRaf){ tapeRaf = requestAnimationFrame(updateTapeTop); } }
  window.addEventListener('scroll', queueTapeTop, { passive:true });
  window.addEventListener('resize', queueTapeTop);

  if('MutationObserver' in window){
    var evTitle = eventiSection ? eventiSection.querySelector('.content-title') : null;
    if(evTitle){
      new MutationObserver(updateEventDetails).observe(evTitle, { childList:true, characterData:true, subtree:true });
    }
    var fzTitle4 = fanzineSection ? fanzineSection.querySelector('.content-title') : null;
    if(fzTitle4){
      new MutationObserver(updateFanzineCounter).observe(fzTitle4, { childList:true, characterData:true, subtree:true });
    }
  }

  // Menu da telefono: pannello nero a tutto schermo
  var menuBtn = document.querySelector('.l4-menu-btn');
  function setMenu(open){
    body.classList.toggle('l4-menu-open', open);
    if(menuBtn){
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    }
  }
  if(menuBtn){
    menuBtn.addEventListener('click', function(){ setMenu(!body.classList.contains('l4-menu-open')); });
    Array.prototype.forEach.call(document.querySelectorAll('nav.mainnav a'), function(a){
      a.addEventListener('click', function(){ setMenu(false); });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && body.classList.contains('l4-menu-open')){ setMenu(false); menuBtn.focus(); }
    });
  }

  function resetLayoutState(){
    if(callSection){ callSection.classList.remove('l2-open'); }
    if(collaboraBtn){ collaboraBtn.classList.remove('open'); collaboraBtn.setAttribute('aria-expanded', 'false'); }
    if(eventiSection){ eventiSection.classList.remove('l2-expanded'); eventiSection.classList.remove('l4-open'); }
    if(scopriBtn){ scopriBtn.classList.remove('open'); scopriBtn.setAttribute('aria-expanded', 'false'); }
    if(l4ScopriBtn){ l4ScopriBtn.setAttribute('aria-expanded', 'false'); l4ScopriBtn.textContent = 'Scopri'; }
    setMenu(false);
  }

  function onLayoutApplied(){
    updateTapeTop();
    if(current() === '2' || current() === '4'){ updateFanzineNames(); }
    updateEventDetails();
    updateFanzineCounter();
  }

  // stato iniziale (i caroselli vengono avviati dallo script principale
  // subito dopo questo file)
  if(collaboraBtn){ collaboraBtn.setAttribute('aria-expanded', 'false'); }
  if(scopriBtn){ scopriBtn.setAttribute('aria-expanded', 'false'); }
  updateTapeTop();
  window.addEventListener('load', function(){
    updateTapeTop();
    updateFanzineNames();
    updateEventDetails();
    updateFanzineCounter();
    if(current() !== '1'){ remeasureWhenFontsReady(); }
  });
})();
