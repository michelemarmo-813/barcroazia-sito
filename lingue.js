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
  var SALTA = 'script, style, svg, noscript, iframe, textarea, select, option, .lingua, .side-tape, .bar-tw, .tw-vis, .mail-pop-addr';
  var ferme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var modo = 'it';
  var testiOrig = new Map();     // nodo di testo -> testo italiano
  var blocchiOrig = new Map();   // elemento -> HTML italiano (esperanto)
  var mo = null;

  function norm(t){ return t.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }
  // figli da non toccare (es. la copia battuta a macchina .bar-tw di effetti.js):
  // si staccano prima di cambiare l'HTML di un blocco e si rimettono dopo
  function stacca(el){ var k = [].filter.call(el.children, function(c){ return c.matches(SALTA); }); k.forEach(function(c){ el.removeChild(c); }); return k; }
  function rimetti(el, k){ k.forEach(function(c){ el.appendChild(c); }); }
  function testoProprio(el){ var c = el.cloneNode(true); [].forEach.call(c.querySelectorAll(SALTA), function(x){ x.remove(); }); return c.textContent; }
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
  // un testo che cambia da solo (il conto alla rovescia) tiene i segni
  // delle lettere e cifre rimaste uguali: cambiano solo quelle nuove,
  // così si vede scorrere l'ultima cifra come in un vero conto alla rovescia
  var segniEtr = new WeakMap();   // elemento -> { orig, out } dell'ultima volta
  function etruscoCome(n, t){
    var el = n.parentElement, prima = el && segniEtr.get(el), out;
    if(prima){
      var a = Array.from(t), pa = Array.from(prima.orig), po = Array.from(prima.out);
      if(a.length === pa.length && po.length === pa.length){
        out = a.map(function(c, k){ return c === pa[k] ? po[k] : etrusco(c); }).join('');
      }
    }
    if(out === undefined){ out = etrusco(t); }
    if(el){ segniEtr.set(el, { orig:t, out:out }); }
    return out;
  }
  function etrusco(t){
    return t.replace(/[A-Za-zÀ-ÿ0-9ŭŬ]/g, function(){ return String.fromCodePoint(0x10300 + Math.floor(Math.random() * 31)); });
  }
  // ---- Carmen Di Pietro: ogni frase finisce con "?" ----
  // Una "riga" finisce dove finisce un blocco (paragrafo, titolo, tasto,
  // voce di elenco, riquadro...) o dove c'è un <br>. Questi pezzi in linea
  // non spezzano la riga: lettere dei tasti, nomi della stessa riga di poeti.
  var IN_LINEA = '.ch, .parola, .names .line > span, .fill';
  // numeri che non sono frasi: cifre del codice a barre, contatore delle foto
  var NO_DOMANDA = '.barcode-num, .lb-count';
  var LETTERA = /[\p{L}\p{N}]/u;
  function confine(el){
    if(el.tagName === 'BR') return true;
    if(el.matches(IN_LINEA)) return false;
    var d = getComputedStyle(el).display;
    return d !== 'inline' && d !== 'contents' && d !== 'none';
  }
  // il nodo di testo è l'ultimo con lettere o numeri della sua riga?
  function fineRiga(n){
    var unita = n.parentElement;
    while(unita && unita !== document.body && !confine(unita)){ unita = unita.parentElement; }
    if(!unita) return true;
    var w = document.createTreeWalker(unita, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode:function(x){ return (x.nodeType === 1 && x.matches(SALTA)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    w.currentNode = n;
    var x;
    while((x = w.nextNode())){
      if(x.nodeType === 1){ if(confine(x)) return true; }
      else if(LETTERA.test(x.nodeValue)) return false;
    }
    return true;
  }
  var CHIUDE = '»”"’\'';
  // email e link non si toccano (un @nome di Instagram sì)
  function indirizzo(parola){ return /^[^@\s]*[^@\s(]@[^@\s]+\.[^@\s]+$|:\/\/|^www\./i.test(parola); }
  function carmen(t, finale){
    // dentro il testo: ". ! …" che chiudono una frase seguita da un'altra
    // (non le sigle come L.I.P.S. o n.0, né orari e date come 20.30)
    t = t.replace(/([^\s ]*?)(\.\.\.|…|[.!]+)(?=[\s ]+[\p{Lu}«"“\d])/gu, function(tutto, prima, segno){
      if(segno.charAt(0) === '!' || segno === '...' || segno === '…'){ return prima + '?'; }
      // sigla puntata in fondo alla frase ("…circuito L.I.P.S. Puoi…"): "L.I.P.S? Puoi"
      if(/^(\p{Lu}\.)+\p{Lu}$/u.test(prima)){ return prima + '?'; }
      // niente sigle e numeri con il punto (n.0, 20.30), niente iniziali (J. Rossi)
      if(prima.indexOf('.') >= 0 || indirizzo(prima) || !/[\p{L}\p{N}][)’”"»]?$/u.test(prima) || prima.replace(/[)’”"»]+$/, '').length < 2){ return tutto; }
      return prima + '?';
    });
    if(!finale) return t;
    // fine riga: il "?" va dopo l'ultima parola, prima di frecce, ">", "***"
    var m = t.match(/^([\s\S]*?)([\s >↓↑→←*]*)$/);
    var corpo = m[1], coda = m[2];
    if(!LETTERA.test(corpo)) return t;
    var ultima = corpo.split(/[\s ]+/).pop();
    if(indirizzo(ultima)) return t;
    if(/\?[)»”"’']*$/.test(corpo)) return t;                       // c'è già
    // via il segno finale (anche dopo le virgolette: “…CROAZIA”. → “…CROAZIA?”)
    var nudo = corpo.replace(/(\.\.\.|…|[.!:;,])+$/, '');
    if(CHIUDE.indexOf(nudo.slice(-1)) >= 0){
      // «…parola?» : il "?" dentro le virgolette
      var k = nudo.length - 1;
      while(k > 0 && CHIUDE.indexOf(nudo.charAt(k - 1)) >= 0){ k--; }
      corpo = nudo.slice(0, k).replace(/(\.\.\.|…|[.!:;,])+$/, '') + '?' + nudo.slice(k);
    }
    else if(/[\p{L}\p{N})\]]$/u.test(nudo)){ corpo = nudo + '?'; }
    else return t;
    return corpo + coda;
  }

  function applica(radice, anim){
    if(modo === 'it') return;
    if(modo === 'eo'){
      var els = [].slice.call(radice.querySelectorAll ? radice.querySelectorAll(BLOCCHI) : []);
      if(radice.nodeType === 1 && radice.matches && radice.matches(BLOCCHI)){ els.unshift(radice); }
      els.forEach(function(el){
        if(saltato(el) || blocchiOrig.has(el) || !el.isConnected) return;
        var chiave = norm(testoProprio(el));
        var t = EO[chiave];
        if(!t) return;
        var k = stacca(el);
        blocchiOrig.set(el, el.innerHTML);
        el.innerHTML = t;
        rimetti(el, k);
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
      testi(radice).forEach(function(n){ cambiaTesto(n, etruscoCome(n, testiOrig.has(n) && testiOrig.get(n) !== null ? testiOrig.get(n) : n.nodeValue), anim); });
    }
    if(modo === 'cdp'){
      // si parte sempre dal testo italiano: niente "??" anche rifacendo
      testi(radice).forEach(function(n){
        var orig = testiOrig.has(n) && testiOrig.get(n) !== null ? testiOrig.get(n) : n.nodeValue;
        var fine = fineRiga(n) && !n.parentElement.closest(NO_DOMANDA), nv;
        if(LETTERA.test(orig)){ nv = carmen(orig, fine); }
        // pezzo senza lettere in fondo alla riga (il "." dopo un link):
        // il "?" l'ha già preso l'ultima parola, il punto se ne va
        else { nv = fine ? orig.replace(/^([\s\u00a0]*)(\.\.\.|…|[.!:;,])+/, '$1') : orig; }
        if(nv !== n.nodeValue){ cambiaTesto(n, nv, anim); }
      });
    }
  }

  function ripristina(){
    testiOrig.forEach(function(v, n){ if(v !== null && n.isConnected){ n.nodeValue = v; } });
    testiOrig.clear();
    blocchiOrig.forEach(function(html, el){
      if(!el.isConnected) return;
      var k = stacca(el);
      el.innerHTML = html;
      rimetti(el, k);
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
    segniEtr = new WeakMap();     // a ogni scelta dell'etrusco, segni nuovi
    modo = nuovo;
    document.documentElement.lang = LANG[modo];
    document.documentElement.setAttribute('data-lingua', modo);
    var anim = animato ? [] : null;
    applica(document.body, anim);
    if(anim){ decodifica(anim); }
    // scritte laterali (script.js): "BOLOGNA–g.m.aaaa? * " solo con Carmen Di Pietro
    if(window.bcTape){ window.bcTape(modo); }
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
