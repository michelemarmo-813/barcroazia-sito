/* ==========================================================
   Tasti che mandano una mail (Invia un articolo, Invia la
   candidatura...): invece di aprire subito il programma di posta,
   mostrano in un riquadro l'indirizzo a cui scrivere, da copiare,
   con l'oggetto da usare e il link per aprire la mail.
   ========================================================== */
(function(){
  var pop = document.createElement('div');
  pop.className = 'mail-pop';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'true');
  pop.setAttribute('aria-labelledby', 'mail-pop-title');
  pop.innerHTML =
    '<div class="mail-pop-box">' +
      '<button type="button" class="mail-pop-close" aria-label="Chiudi">&times;</button>' +
      '<p class="mail-pop-title" id="mail-pop-title">Scrivici una mail</p>' +
      '<p class="mail-pop-addr"></p>' +
      '<p class="mail-pop-subj"></p>' +
      '<div class="mail-pop-btns">' +
        '<button type="button" class="btn mail-pop-copy">Copia l&rsquo;indirizzo</button>' +
        '<a class="btn mail-pop-open" href="#">Apri la mail</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(pop);

  var addr = pop.querySelector('.mail-pop-addr');
  var subj = pop.querySelector('.mail-pop-subj');
  var copy = pop.querySelector('.mail-pop-copy');
  var openLink = pop.querySelector('.mail-pop-open');
  var last = null;

  function show(href, from){
    var m = href.replace(/^mailto:/i, '').split('?');
    var email = decodeURIComponent(m[0]);
    var oggetto = '';
    (m[1] || '').split('&').forEach(function(kv){
      var p = kv.split('=');
      if(p[0].toLowerCase() === 'subject'){ oggetto = decodeURIComponent(p[1] || ''); }
    });
    addr.textContent = email;
    subj.innerHTML = oggetto ? 'con oggetto &ldquo;<span></span>&rdquo;' : '';
    if(oggetto){ subj.querySelector('span').textContent = oggetto; }
    openLink.href = href;
    copy.textContent = 'Copia l’indirizzo';
    last = from;
    pop.hidden = false;
    document.documentElement.classList.add('mail-pop-open-page');
    copy.focus({ preventScroll:true });
  }
  function hide(){
    pop.hidden = true;
    document.documentElement.classList.remove('mail-pop-open-page');
    if(last && last.focus){ last.focus({ preventScroll:true }); }
  }

  // tutti i tasti (con stile .btn) che puntano a una mail
  document.addEventListener('click', function(e){
    var a = e.target.closest('a.btn[href^="mailto:"]');
    if(!a || pop.contains(a)) return;
    e.preventDefault();
    show(a.getAttribute('href'), a);
  });

  copy.addEventListener('click', function(){
    var t = addr.textContent;
    function ok(){ copy.textContent = 'Copiato!'; }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(ok, function(){ seleziona(); });
    } else { seleziona(); }
    function seleziona(){
      var r = document.createRange(); r.selectNodeContents(addr);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      copy.textContent = 'Premi Cmd/Ctrl + C';
    }
  });
  pop.querySelector('.mail-pop-close').addEventListener('click', hide);
  pop.addEventListener('click', function(e){ if(e.target === pop) hide(); });
  document.addEventListener('keydown', function(e){ if(!pop.hidden && e.key === 'Escape') hide(); });
})();
