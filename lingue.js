/* ==========================================================
   Lingue del sito (usato da tutte le pagine)
   Un piccolo selettore in alto cambia i testi in quattro modi:
   - Italiano: il sito com'è;
   - Esperanto: tradotto davvero (testi in lingue-dati.js);
   - Etrusco: non traduce niente, ogni lettera diventa un segno a caso
     dell'alfabeto etrusco (cambia a ogni scelta), spazi e punteggiatura
     restano;
   - Carmen Di Pietro: italiano, ma ogni frase e ogni tasto finisce con
     un punto interrogativo.
   Al cambio le lettere visibili si "decodificano" come nel codice a barre.
   La scelta resta anche passando da una pagina all'altra.
   ========================================================== */
(function(){
  var MODI = [['it', 'Italiano'], ['eo', 'Esperanto'], ['etr', 'Etrusco'], ['cdp', 'Carmen Di Pietro']];
  var LANG = { it:'it', eo:'eo', etr:'ett', cdp:'it' };
  var EO = window.LINGUE_EO || {};
  var FRASI = (window.LINGUE_EO_FRASI || []).concat([
    ['gennaio','januaro'],['febbraio','februaro'],['marzo','marto'],['aprile','aprilo'],['maggio','majo'],['giugno','junio'],
    ['luglio','julio'],['agosto','aŭgusto'],['settembre','septembro'],['ottobre','oktobro'],['novembre','novembro'],['dicembre','decembro'],
    ['lunedì','lundo'],['martedì','mardo'],['mercoledì','merkredo'],['giovedì','ĵaŭdo'],['venerdì','vendredo'],['sabato','sabato'],['domenica','dimanĉo'],
    ['Bologna','Bolonjo']
  ]).map(function(f){
    var parola = /^[A-Za-zÀ-ÿ]+$/.test(f[0]);
    return [new RegExp((parola ? '(^|[^A-Za-zÀ-ÿ])(' : '()(') + f[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-zÀ-ÿ])', 'gi'), f[1]];
  });
  // dove si cercano i testi interi da tradurre in esperanto
  var BLOCCHI = 'p, h1, h2, h3, li, dt, dd, a, button, figcaption, .leader > span, .meta > span, .cap, .issue-title, .issue-date, .post-title, .post-author, .post-date, .claim, .bar, .subtitle, .article-outlet, .article-author, .article-date, .oc-meta > span, .event-tile-title, .event-tile-date, .sub-topline > span, .topline > span, .fz-num';
  // dove si aggiunge il punto interrogativo finale (Carmen Di Pietro)
  var FRASE = 'p, li, dd, .btn, .buy-btn, button, .ticker .t, .event-tile-more, .names-label, .after-names, .event-tile-date, .issue-date, .post-author, .cap, figcaption';
  var SALTA = 'script, style, svg, noscript, iframe, textarea, select, option, .lingua, .side-tape, .bar-tw, .tw-vis, .mail-pop-addr';
  var ferme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var modo = 'it';
  var testiOrig = new Map();     // nodo di testo -> testo italiano
  var blocchiOrig = new Map();   // elemento -> HTML italiano (esperanto)
  var mo = null;

  function norm(t){ return t.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }
  function saltato(n){ var e = n.nodeType === 1 ? n : n.parentElement; return !e || !!e.closest(SALTA); }
  function testi(radice){
    var out = [], w = document.createTreeWalker(radice, NodeFilter.SHOW_TEXT, {
      acceptNode:function(n){ return (!n.nodeValue.trim() || saltato(n)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    while(w.nextNode()){ out.push(w.currentNode); }
    return out;
  }
  function cambiaTesto(n, nuovo, anim){
    if(!testiOrig.has(n)){ testiOrig.set(n, n.nodeValue); }
    if(n.nodeValue !== nuovo){ if(anim){ anim.push([n, nuovo]); } else { n.nodeValue = nuovo; } }
  }

  // ---- le trasformazioni ----
  function etrusco(t){
    return t.replace(/[A-Za-zÀ-ÿ0-9ŭŬ]/g, function(){ return String.fromCodePoint(0x10300 + Math.floor(Math.random() * 31)); });
  }
  function carmen(t){
    // il punto o il punto esclamativo che chiude una frase diventa "?"
    return t.replace(/([A-Za-zÀ-ÿ0-9)’”"])[.!](?=\s|$)/g, '$1?');
  }
  function fineDomanda(el, anim){
    var ns = testi(el);
    // salta i pezzi finali fatti solo di frecce (es. <span>↓</span>)
    var i = ns.length - 1;
    while(i > 0 && /^[\s\u00a0>↓↑→←]*$/.test(ns[i].nodeValue)){ i--; }
    var ultimo = ns[i];
    if(!ultimo) return;
    var v = anim ? ((anim.filter(function(x){ return x[0] === ultimo; })[0] || [])[1] || ultimo.nodeValue) : ultimo.nodeValue;
    var m = v.match(/^([\s\S]*?)([\s ]*(?:>+|&gt;|[↓↑→←])*[\s ]*)$/);
    var corpo = m[1], coda = m[2];
    if(/[?]$/.test(corpo)) return;
    if(/[.!:;,]$/.test(corpo)){ corpo = corpo.slice(0, -1) + '?'; }
    else if(/[A-Za-zÀ-ÿ0-9)’”"»]$/.test(corpo)){ corpo += '?'; }
    else return;
    // il "?" va prima delle eventuali frecce ">" finali
    cambiaTesto(ultimo, corpo + coda, null);
    if(anim){ anim.forEach(function(x){ if(x[0] === ultimo){ x[1] = corpo + coda; } }); }
  }

  function applica(radice, anim){
    if(modo === 'it') return;
    if(modo === 'eo'){
      var els = [].slice.call(radice.querySelectorAll ? radice.querySelectorAll(BLOCCHI) : []);
      if(radice.nodeType === 1 && radice.matches && radice.matches(BLOCCHI)){ els.unshift(radice); }
      els.forEach(function(el){
        if(saltato(el) || blocchiOrig.has(el) || !el.isConnected) return;
        var chiave = norm(el.textContent);
        var t = EO[chiave];
        if(!t) return;
        blocchiOrig.set(el, el.innerHTML);
        el.innerHTML = t;
        if(el.classList.contains('btn')){
          el.setAttribute('aria-label', norm(el.textContent));
          if(window.bcLettere){ window.bcLettere(el); }
        }
        if(anim){ testi(el).forEach(function(n){ var v = n.nodeValue; testiOrig.set(n, null); n.nodeValue = ''; anim.push([n, v]); }); }
      });
      testi(radice).forEach(function(n){
        var v = n.nodeValue, nv = v;
        FRASI.forEach(function(f){ nv = nv.replace(f[0], function(_, a){ return a + f[1]; }); });
        if(nv !== v){ cambiaTesto(n, nv, anim); }
      });
    }
    if(modo === 'etr'){
      testi(radice).forEach(function(n){ cambiaTesto(n, etrusco(testiOrig.has(n) && testiOrig.get(n) !== null ? testiOrig.get(n) : n.nodeValue), anim); });
    }
    if(modo === 'cdp'){
      testi(radice).forEach(function(n){ var v = n.nodeValue, nv = carmen(v); if(nv !== v){ cambiaTesto(n, nv, anim); } });
      var bl = [].slice.call(radice.querySelectorAll ? radice.querySelectorAll(FRASE) : []);
      if(radice.nodeType === 1 && radice.matches && radice.matches(FRASE)){ bl.push(radice); }
      bl.forEach(function(el){ if(!saltato(el)){ fineDomanda(el, anim); } });
    }
  }

  function ripristina(){
    testiOrig.forEach(function(v, n){ if(v !== null && n.isConnected){ n.nodeValue = v; } });
    testiOrig.clear();
    blocchiOrig.forEach(function(html, el){
      if(!el.isConnected) return;
      el.innerHTML = html;
      if(el.classList.contains('btn')){ el.setAttribute('aria-label', norm(el.textContent)); }
    });
    blocchiOrig.clear();
  }

  // ---- la decodifica visiva al cambio ----
  var timer = null;
  function decodifica(lista){
    if(timer){ clearInterval(timer); timer = null; }
    var vis = [], CH = '0123456789*#';
    lista.forEach(function(x){
      var el = x[0].parentElement, r = el && el.getBoundingClientRect();
      if(!ferme && r && r.bottom > 0 && r.top < window.innerHeight && vis.length < 600){ vis.push(x); }
      else { x[0].nodeValue = x[1]; }
    });
    if(!vis.length){ pulisci(); return; }
    var passo = 0, PASSI = 16;
    timer = setInterval(function(){
      passo++;
      vis.forEach(function(x){
        var a = Array.from(x[1]), k = Math.floor(a.length * passo / PASSI), o = '';
        for(var j = 0; j < a.length; j++){ o += (j < k || /\s/.test(a[j])) ? a[j] : CH[Math.floor(Math.random() * CH.length)]; }
        x[0].nodeValue = o;
      });
      pulisci();
      if(passo >= PASSI){ clearInterval(timer); timer = null; }
    }, 30);
  }
  function pulisci(){ if(mo){ mo.takeRecords(); } }

  function imposta(nuovo, animato){
    if(!MODI.some(function(m){ return m[0] === nuovo; })){ nuovo = 'it'; }
    ripristina();
    modo = nuovo;
    document.documentElement.lang = LANG[modo];
    document.documentElement.setAttribute('data-lingua', modo);
    var anim = animato ? [] : null;
    applica(document.body, anim);
    if(anim){ decodifica(anim); }
    if(window.bcTwAggiorna){ window.bcTwAggiorna(); setTimeout(window.bcTwAggiorna, 600); }
    pulisci();
    try{ localStorage.setItem('bc-lingua', modo); }catch(e){}
    document.querySelectorAll('.lingua select').forEach(function(s){ s.value = modo; });
  }

  // ---- il selettore ----
  function selettore(){
    var posto = document.querySelector('.topline > span:last-child') || document.querySelector('.sub-topline > span:last-child');
    if(!posto) return;
    var box = document.createElement('label');
    box.className = 'lingua';
    box.innerHTML = '<span class="lingua-nome">Lingua</span><select aria-label="Lingua del sito"></select>';
    var sel = box.querySelector('select');
    MODI.forEach(function(m){ var o = document.createElement('option'); o.value = m[0]; o.textContent = m[1]; sel.appendChild(o); });
    sel.addEventListener('change', function(){ imposta(sel.value, true); });
    posto.appendChild(box);
  }

  function avvia(){
    selettore();
    var salvata = 'it';
    try{ salvata = localStorage.getItem('bc-lingua') || 'it'; }catch(e){}
    if(salvata !== 'it'){ imposta(salvata, false); }
    else { document.querySelectorAll('.lingua select').forEach(function(s){ s.value = 'it'; }); }
    // testi che cambiano da soli (conto alla rovescia, archivio, riquadri...)
    mo = new MutationObserver(function(list){
      if(modo === 'it') return;
      var radici = [];
      list.forEach(function(m){
        if(m.type === 'characterData'){ if(!saltato(m.target)){ testiOrig.delete(m.target); radici.push(m.target.parentElement); } }
        else { [].forEach.call(m.addedNodes, function(n){ if(n.nodeType === 1 && !saltato(n)){ radici.push(n); } else if(n.nodeType === 3 && !saltato(n)){ radici.push(n.parentElement); } }); }
      });
      radici.forEach(function(r){ if(r && r.isConnected){ applica(r, null); } });
      pulisci();
    });
    mo.observe(document.body, { childList:true, subtree:true, characterData:true });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', avvia); }
  else { avvia(); }
})();
