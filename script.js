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

  // "Scopri poeta": una poetessa a caso, pagina di Wikipedia
  var poetesse = [
    'Alda Merini', 'Antonia Pozzi', 'Amelia Rosselli', 'Sibilla Aleramo',
    'Ada Negri', 'Vittoria Colonna', 'Gaspara Stampa', 'Cristina Campo',
    'Patrizia Cavalli', 'Maria Luisa Spaziani', 'Biancamaria Frabotta',
    'Dacia Maraini', 'Franca Mancinelli', 'Vivian Lamarque',
    'Patrizia Valduga', 'Jolanda Insana', 'Margherita Guidacci',
    'Antonella Anedda', 'Mariangela Gualtieri', 'Elsa Morante',
    'Grazia Deledda', 'Lalla Romano', 'Maria Grazia Calandrone',
    'Chandra Livia Candiani', 'Rosita Copioli', 'Silvia Bre',
    'Elisa Biagini', 'Amalia Guglielminetti',
    'Emily Dickinson', 'Sylvia Plath', 'Anne Sexton', 'Saffo',
    'Wisława Szymborska', 'Anna Achmatova', 'Marina Cvetaeva',
    'Elizabeth Bishop', 'Adrienne Rich', 'Louise Glück', 'Audre Lorde',
    'Maya Angelou', 'Christina Rossetti', 'Elizabeth Barrett Browning',
    'Edith Södergran', 'Ingeborg Bachmann', 'Else Lasker-Schüler',
    'Nelly Sachs', 'Gabriela Mistral', 'Alfonsina Storni',
    'Alejandra Pizarnik', 'Rosario Castellanos', 'Forough Farrokhzad',
    'Louise Labé', 'Marceline Desbordes-Valmore', 'Anna de Noailles',
    'Karin Boye', 'Tove Ditlevsen', 'Amy Lowell', 'Hilda Doolittle',
    'Gwendolyn Brooks', 'Amrita Pritam', 'Kamala Das', 'June Jordan',
    'Denise Levertov', 'Rita Dove',
    'Anne Carson', 'Carol Ann Duffy', 'Natasha Trethewey', 'Tracy K. Smith',
    'Louise Bogan', 'Marianne Moore', 'Edna St. Vincent Millay',
    'Sara Teasdale', 'Anna Świrszczyńska', 'Ana Blandiana', 'Nina Cassian',
    'Warsan Shire', 'Claudia Rankine', 'Jorie Graham', 'Sharon Olds',
    'Carolyn Forché', 'Lucille Clifton', 'Nikki Giovanni', 'Sonia Sanchez',
    'Marilyn Hacker', 'Eavan Boland', 'Stevie Smith', 'Kathleen Jamie',
    'Jackie Kay', 'Bella Achmadulina', 'Vera Pavlova', 'Yosano Akiko',
    'Fadwa Tuqan', 'Nazik al-Mala\'ika', 'Delmira Agustini',
    'Juana de Ibarbourou', 'Julia de Burgos', 'Claribel Alegría',
    'Sor Juana Inés de la Cruz', 'Cecília Meireles', 'Hilda Hilst',
    'Vittoria Aganoor', 'Alba de Céspedes', 'Giulia Niccolai',
    'Nadia Campana', 'Cristina Annino', 'Bianca Tarozzi',
    'Rossana Ombres', 'Fernanda Romagnoli', 'Alba Donati',
    'Anna Maria Ortese', 'Renée Vivien', 'Andrée Chedid', 'Anne Hébert',
    'Marie Noël', 'Louise de Vilmorin', 'Rosalía de Castro',
    'Idea Vilariño', 'Blanca Varela', 'Olga Orozco', 'Gioconda Belli',
    'Elvira Sastre', 'Chantal Maillard', 'Florbela Espanca',
    'Sophia de Mello Breyner Andresen', 'Adélia Prado',
    'Ana Cristina César', 'Cora Coralina', 'Zinaida Gippius',
    'Yunna Morits', 'Halina Poświatowska',
    'Maria Pawlikowska-Jasnorzewska', 'Inger Christensen',
    'Pia Tafdrup', 'Sonja Åkesson', 'Marie Under', 'Simin Behbahani',
    'Suheir Hammad', 'Rupi Kaur', 'Sarojini Naidu', 'Toru Dutt',
    'Meena Kandasamy', 'Ono no Komachi', 'Izumi Shikibu',
    'Machi Tawara', 'Hiromi Itō', 'Li Qingzhao', 'Xi Xi',
    'Zhai Yongming', 'Noémia de Sousa', 'Lorna Goodison',
    'Olive Senior', 'Dionne Brand', 'Margaret Atwood', 'Lorna Crozier',
    'Judith Wright', 'Gwen Harwood', 'Dorothy Hewett', 'Fleur Adcock',
    'Anne Bradstreet', 'Phillis Wheatley', 'Emily Brontë',
    'Charlotte Mew', 'Edith Sitwell', 'Vita Sackville-West',
    'Denise Riley', 'Alice Oswald', 'Jo Shapcott', 'Wendy Cope',
    'Ruth Padel', 'Jean \'Binta\' Breeze', 'Grace Nichols',
    'Patience Agbabi', 'Erica Jong', 'Diane di Prima', 'Anne Waldman',
    'Alice Notley', 'Eileen Myles', 'Ada Limón', 'Joy Harjo',
    'Kay Ryan', 'Mary Oliver', 'Louise Erdrich', 'Naomi Shihab Nye',
    'Marge Piercy', 'Anne Stevenson', 'Alicia Ostriker',
    'Muriel Rukeyser', 'May Sarton', 'Amy Clampitt', 'Jean Valentine',
    'Brenda Hillman', 'Rae Armantrout', 'Lyn Hejinian', 'Susan Howe',
    'Fanny Howe', 'C.D. Wright', 'Alice Fulton', 'Sarah Kirsch',
    'Rose Ausländer', 'Hilde Domin'
  ];
  var scelta = poetesse[Math.floor(Math.random() * poetesse.length)];
  document.querySelectorAll('.js-poeta').forEach(function(a){
    a.href = 'https://it.wikipedia.org/w/index.php?search=' + encodeURIComponent(scelta) + '&go=Vai';
    a.title = scelta;
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

  // ingrandimento delle foto (con frecce se ce n'è più d'una)
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var prev = lb.querySelector('.lb-prev'), next = lb.querySelector('.lb-next');
  var list = [], pos = 0;
  function show(){ lbImg.src = list[pos]; prev.hidden = next.hidden = list.length < 2; }
  function openLightbox(srcs, i){ list = srcs; pos = i || 0; show(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLightbox(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; }
  window.openLightbox = openLightbox;
  document.addEventListener('click', function(e){
    var img = e.target.closest('[data-zoom]');
    if(img){ openLightbox([img.currentSrc || img.src], 0); }
  });
  lb.addEventListener('click', function(e){ if(e.target === lb){ closeLightbox(); } });
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  prev.addEventListener('click', function(){ pos = (pos - 1 + list.length) % list.length; show(); });
  next.addEventListener('click', function(){ pos = (pos + 1) % list.length; show(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight' && list.length > 1) next.click();
    if(e.key === 'ArrowLeft' && list.length > 1) prev.click();
  });
})();
