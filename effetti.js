/* ==========================================================
   Piccoli effetti (usato da tutte le pagine)
   - titoli delle sezioni battuti a macchina quando entrano nello schermo
   - linea rossa da lettore di cassa sul codice a barre (il "bip" è in script.js)
   - tasti arancioni che ondeggiano, con le lettere che saltano
   - eventi: il testo esce a scatti da una fessura, come uno scontrino
   - stelline che schizzano dai tasti "importanti" e dal codice a barre
   Con "riduci movimento" non si muove niente.
   ========================================================== */
(function(){
  var ferme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- titoli battuti a macchina (una volta sola per sezione) ----
  // il testo vero resta nella barra (invisibile durante la battitura):
  // sopra si scrive la copia lettera per lettera
  var barre = document.querySelectorAll('.section > .bar');
  if(!ferme && barre.length && 'IntersectionObserver' in window){
    // il testo della barra (senza la copia battuta): si rilegge a ogni lettera,
    // così se nel frattempo cambia lingua (lingue.js) si batte quella giusta
    var testoBarra = function(bar){
      return [].filter.call(bar.childNodes, function(n){ return !(n.nodeType === 1 && n.classList.contains('bar-tw')); })
        .map(function(n){ return n.textContent; }).join('').replace(/\s+/g, ' ').trim();
    };
    var esc = function(x){ return x.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var batti = function(bar){
      var vis = document.createElement('span');
      vis.className = 'bar-tw';
      vis.setAttribute('aria-hidden', 'true');
      bar.appendChild(vis);
      bar.classList.add('typing');
      var i = 0;
      (function passo(){
        var testo = Array.from('*** ' + testoBarra(bar).toUpperCase() + ' ***');
        if(i > testo.length){ i = testo.length; }
        // la parte ancora da battere c'è ma è invisibile: così le lettere
        // compaiono da sinistra a destra, già al loro posto definitivo
        // (e un titolo lungo va a capo come quello vero, senza tagli)
        vis.innerHTML = esc(testo.slice(0, i).join('')) + '<span class="bar-cur"></span><span class="bar-rest">' + esc(testo.slice(i).join('')) + '</span>';
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

  // ---- codice a barre: linea del lettore ----
  var codice = document.querySelector('.barcode');
  if(codice){
    if(!ferme){
      var laser = document.createElement('span');
      laser.className = 'barcode-laser';
      laser.setAttribute('aria-hidden', 'true');
      codice.appendChild(laser);
    }
  }

  // ---- tasti: le lettere diventano singoli pezzi che possono saltare ----
  // (window.bcLettere serve anche a lingue.js quando cambia il testo di un tasto)
  var lettere = function(b){
    if(ferme) return;
    var t = b.textContent;
    if(!t.trim()) return;
    if(!b.hasAttribute('aria-label')){ b.setAttribute('aria-label', t.trim()); }
    // ogni parola resta unita (su telefono un tasto lungo va a capo tra
    // le parole, mai in mezzo a una parola); gli spazi sono spazi veri
    var i = 0;
    b.innerHTML = t.trim().split(/[ \u00a0]+/).map(function(parola){
      var html = '<span class="parola" aria-hidden="true">' + Array.from(parola).map(function(c){
        return '<span class="ch" style="--i:' + (i++) + '">' + c.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
      }).join('') + '</span>';
      i++;
      return html;
    }).join(' ');
  };
  window.bcLettere = lettere;
  if(!ferme){
    document.querySelectorAll('.btn').forEach(function(b){
      if(b.closest('.mail-pop')) return;              // il suo testo cambia
      if(b.children.length) return;                    // solo tasti con testo semplice
      lettere(b);
    });
  }

  // ---- eventi: lo scontrino esce a scatti dalla fessura (markup in index.html) ----
  var eventi = document.querySelectorAll('.ev-item');
  if(!ferme && eventi.length){
    var stampa = function(ev){
      var t = ev.querySelector('.scontrino');
      if(!t) return;
      t.classList.remove('stampa'); void t.offsetWidth;
      t.classList.add('stampa');
      clearTimeout(t._fine);
      t._fine = setTimeout(function(){ t.classList.remove('stampa'); }, 2300);
    };
    var visto = false, sez = document.getElementById('eventi');
    if(sez && 'IntersectionObserver' in window){
      var ioEv = new IntersectionObserver(function(en){
        if(en[0].isIntersecting && !visto){
          visto = true; ioEv.disconnect();
          var v = [].filter.call(eventi, function(x){ return !x.hidden; })[0];
          if(v){ stampa(v); }
        }
      }, { threshold:0.35 });
      ioEv.observe(sez);
    }
    // quando si passa a un altro evento (tasto o pallini)
    var mo = new MutationObserver(function(list){
      list.forEach(function(m){ if(m.target.classList.contains('ev-item') && !m.target.hidden){ visto = true; stampa(m.target); } });
    });
    eventi.forEach(function(ev){ mo.observe(ev, { attributes:true, attributeFilter:['hidden'] }); });
  }

  // ---- stelline che schizzano dal punto del clic ----
  var STELLA = 'assets/img/stella-pazza.png';
  var esplodi = function(x, y){
    for(var i = 0; i < 9; i++){
      var s = document.createElement('span');
      s.className = 'stellina-burst';
      s.style.left = (x - 12) + 'px';
      s.style.top = (y - 12) + 'px';
      s.style.backgroundImage = 'url(' + STELLA + ')';
      document.body.appendChild(s);
      var ang = Math.random() * Math.PI * 2, v = 55 + Math.random() * 85;
      var dx = Math.cos(ang) * v, dy = Math.sin(ang) * v - 35, rot = (Math.random() - .5) * 540, sc = .55 + Math.random() * .6;
      var anim = s.animate([
        { transform:'translate(0,0) rotate(0deg) scale(' + sc + ')', opacity:1 },
        { transform:'translate(' + dx + 'px,' + (dy + 85) + 'px) rotate(' + rot + 'deg) scale(' + (sc * .5) + ')', opacity:0 }
      ], { duration:850 + Math.random() * 300, easing:'cubic-bezier(.2,.6,.4,1)' });
      anim.onfinish = (function(el){ return function(){ el.remove(); }; })(s);
    }
  };
  if(!ferme){
    var festa = /^(ottieni una copia|acquista|invia la candidatura|invia un articolo)$/i;
    document.addEventListener('click', function(e){
      var el = e.target.closest('a, button, .barcode');
      if(!el) return;
      var nome = (el.getAttribute('aria-label') || el.textContent || '').trim();
      if(!el.classList.contains('barcode') && !festa.test(nome)) return;
      esplodi(e.clientX, e.clientY);
      // un link che cambia pagina aspetta un attimo, così le stelline si vedono
      var href = el.tagName === 'A' ? el.getAttribute('href') : null;
      if(href && !/^mailto:/i.test(href) && el.target !== '_blank' && !e.defaultPrevented && !e.metaKey && !e.ctrlKey){
        e.preventDefault();
        setTimeout(function(){ window.location.href = href; }, 420);
      }
    });
  }
})();
