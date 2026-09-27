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

  function resetLayoutState(){
    if(callSection){ callSection.classList.remove('l2-open'); }
    if(collaboraBtn){ collaboraBtn.classList.remove('open'); collaboraBtn.setAttribute('aria-expanded', 'false'); }
    if(eventiSection){ eventiSection.classList.remove('l2-expanded'); }
    if(scopriBtn){ scopriBtn.classList.remove('open'); scopriBtn.setAttribute('aria-expanded', 'false'); }
  }

  function onLayoutApplied(){
    if(current() === '2'){ updateFanzineNames(); }
  }

  // stato iniziale (i caroselli vengono avviati dallo script principale
  // subito dopo questo file)
  if(collaboraBtn){ collaboraBtn.setAttribute('aria-expanded', 'false'); }
  if(scopriBtn){ scopriBtn.setAttribute('aria-expanded', 'false'); }
  window.addEventListener('load', function(){
    updateFanzineNames();
    if(current() !== '1'){ remeasureWhenFontsReady(); }
  });
})();
