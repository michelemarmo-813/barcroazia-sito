/* ==========================================================
   Piccoli effetti (usato da tutte le pagine)
   - titoli delle sezioni battuti a macchina quando entrano nello schermo
   - linea rossa da lettore di cassa sul codice a barre, con un "bip" al clic
   - tasti arancioni che ondeggiano, con le lettere che saltano
   Con "riduci movimento" non si muove niente.
   ========================================================== */
(function(){
  var ferme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- titoli battuti a macchina (una volta sola per sezione) ----
  // il testo vero resta nella barra (invisibile durante la battitura):
  // sopra si scrive la copia lettera per lettera
  var barre = document.querySelectorAll('.section > .bar');
  if(!ferme && barre.length && 'IntersectionObserver' in window){
    var batti = function(bar){
      var testo = '*** ' + bar.textContent.trim().toUpperCase() + ' ***';
      var vis = document.createElement('span');
      vis.className = 'bar-tw';
      vis.setAttribute('aria-hidden', 'true');
      bar.appendChild(vis);
      bar.classList.add('typing');
      var i = 0;
      (function passo(){
        // la parte ancora da battere c'è ma è invisibile: così le lettere
        // compaiono da sinistra a destra, già al loro posto definitivo
        var nb = function(x){ return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ /g, '&nbsp;'); };
        vis.innerHTML = nb(testo.slice(0, i)) + '<span class="bar-cur"></span><span class="bar-rest">' + nb(testo.slice(i)) + '</span>';
        if(i++ < testo.length){ setTimeout(passo, 55); }
        else {
          setTimeout(function(){ bar.classList.remove('typing'); vis.remove(); }, 900);
        }
      })();
    };
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ io.unobserve(en.target); batti(en.target); }
      });
    }, { threshold:0.6 });
    barre.forEach(function(b){
      // le barre già sullo schermo all'apertura restano come sono
      var r = b.getBoundingClientRect();
      if(r.top < window.innerHeight && r.bottom > 0) return;
      io.observe(b);
    });
  }

  // ---- codice a barre: linea del lettore e "bip" al clic ----
  var codice = document.querySelector('.barcode');
  if(codice){
    if(!ferme){
      var laser = document.createElement('span');
      laser.className = 'barcode-laser';
      laser.setAttribute('aria-hidden', 'true');
      codice.appendChild(laser);
    }
    var bip = function(){
      try{
        var A = window.AudioContext || window.webkitAudioContext;
        if(!A) return;
        var a = bip.ctx || (bip.ctx = new A());
        var o = a.createOscillator(), g = a.createGain();
        o.type = 'square'; o.frequency.value = 1750;
        g.gain.setValueAtTime(0.035, a.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.09);
        o.connect(g); g.connect(a.destination);
        o.start(); o.stop(a.currentTime + 0.1);
      }catch(e){}
    };
    codice.addEventListener('click', bip);
    codice.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ bip(); } });
  }

  // ---- tasti: le lettere diventano singoli pezzi che possono saltare ----
  if(!ferme){
    document.querySelectorAll('.btn').forEach(function(b){
      if(b.closest('.mail-pop')) return;              // il suo testo cambia
      if(b.children.length) return;                    // solo tasti con testo semplice
      var t = b.textContent;
      if(!t.trim()) return;
      if(!b.hasAttribute('aria-label')){ b.setAttribute('aria-label', t.trim()); }
      b.innerHTML = t.split('').map(function(c, i){
        return '<span class="ch" aria-hidden="true" style="--i:' + i + '">' + (c === ' ' ? '&nbsp;' : c.replace(/&/g, '&amp;').replace(/</g, '&lt;')) + '</span>';
      }).join('');
    });
  }
})();
