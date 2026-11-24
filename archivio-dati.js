/* ==========================================================
   ARCHIVIO — gli eventi e le loro foto
   ----------------------------------------------------------
   Questo elenco riempie due posti:
   - la sezione "Archivio" della home, che mostra i TRE eventi
     più in alto nell'elenco che hanno almeno una foto;
   - la pagina "Eventi passati" (archivio-eventi.html), che
     mostra TUTTI gli eventi, nello stesso ordine: cliccando
     sulla foto di un evento si sfogliano tutte le sue foto.

   Ogni evento è un blocco tra { } con:
     titolo     il nome dell'evento
     luogo      dove si è svolto (lascia "" se non serve)
     data       la data, per esempio "2 marzo 2026"
     fotografo  chi ha scattato le foto (dopo 📷)
     foto       le foto dell'evento; [] vuol dire "foto in arrivo"
     piuSpesso  (facoltativo) i numeri delle foto che nelle
                anteprime a scorrimento devono uscire un po' più
                spesso delle altre, per esempio [58]: escono due
                volte per ogni giro invece di una, mai vicine

   LE FOTO di ogni evento stanno in una cartella con la data,
   dentro assets/img/archivio/ (per esempio 2026-03-02), e si
   chiamano 001.jpg, 002.jpg, 003.jpg ... in ordine.
   serie("2026-03-02", 50) vuol dire: le foto da 001.jpg a
   050.jpg di quella cartella.

   Nella sottocartella "mini" ci sono le stesse foto in piccolo
   (360 px), usate nell'elenco da cui si sceglie la foto nella
   pagina "Eventi passati". Se mancano, si usano quelle grandi.

   Per AGGIUNGERE LE FOTO a un evento: crea la cartella con la
   data, mettici le foto numerate (larghe al massimo 1280 px,
   così il sito resta leggero), se puoi anche le miniature in
   "mini", e al posto di [] scrivi serie("aaaa-mm-gg", quante sono).

   Per AGGIUNGERE UN EVENTO: copia un blocco { ... } intero,
   incollalo in cima all'elenco (gli eventi vanno dal più
   recente al più vecchio), con una virgola tra i blocchi,
   e cambia i testi.
   ========================================================== */

// le foto 001.jpg ... di una cartella dell'archivio
function serie(cartella, quante){
  var out = [];
  for(var i = 1; i <= quante; i++){
    out.push('assets/img/archivio/' + cartella + '/' + ('00' + i).slice(-3) + '.jpg');
  }
  return out;
}

// l'ordine casuale delle anteprime: tutte le foto mescolate
// (n = quante sono), e quelle in "piuSpesso" due volte, lontane
// fra loro almeno un terzo del giro e mai all'inizio o alla fine
// del giro (così non escono vicine neanche tra un giro e l'altro)
function mazzoArchivio(n, piuSpesso){
  var m = [];
  for(var i = 0; i < n; i++){ m.push(i); }
  for(var j = m.length - 1; j > 0; j--){
    var r = Math.floor(Math.random() * (j + 1)), t = m[j]; m[j] = m[r]; m[r] = t;
  }
  (piuSpesso || []).forEach(function(num){
    var f = num - 1, pos = m.indexOf(f);
    if(pos < 0) return;
    var len = m.length + 1, bordo = Math.floor(len / 10), d = Math.floor(len / 3);
    var ultimo = len - 1 - bordo;
    if(ultimo - d < bordo) return;
    m.splice(pos, 1);
    var a = bordo + Math.floor(Math.random() * (ultimo - d - bordo + 1));
    var b = a + d + Math.floor(Math.random() * (ultimo - a - d + 1));
    m.splice(a, 0, f);
    m.splice(b, 0, f);
  });
  return m;
}

window.ARCHIVIO = [
  {
    titolo: "Poetry Slam Internazionale",
    luogo: "Ostello Bello",
    data: "17 novembre 2026",
    fotografo: "Ilaria Budetta",
    foto: serie("2026-11-17", 222)
  },
  {
    titolo: "Avventura a Milano",
    luogo: "",
    data: "14 novembre 2026",
    fotografo: "Ilaria Budetta",
    foto: serie("2026-11-14", 64)
  },
  {
    titolo: "Poetry Slam II round",
    luogo: "FARM",
    data: "3 novembre 2026",
    fotografo: "Ilaria Budetta",
    foto: serie("2026-11-03", 79),
    piuSpesso: [58]
  },
  {
    titolo: "Poetry Slam I round",
    luogo: "FARM",
    data: "6 ottobre 2026",
    fotografo: "Ilaria Budetta",
    foto: serie("2026-10-06", 52)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "5 ottobre 2026",
    fotografo: "Cecilia Romano",
    foto: serie("2026-10-05", 56)
  },
  {
    titolo: "Finale regionale Poetry Slam",
    luogo: "Casalone Ritmolento",
    data: "15 luglio 2026",
    fotografo: "Cecilia Romano",
    foto: serie("2026-07-15", 87)
  },
  {
    titolo: "Marc Kelly Smith + Raw Poetry",
    luogo: "Circolo Sardegna",
    data: "11 maggio 2026",
    fotografo: "Cecilia Romano",
    foto: serie("2026-05-11", 93)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "20 aprile 2026",
    fotografo: "Valentina Pocaterra",
    foto: serie("2026-04-20", 170)
  },
  {
    titolo: "Segreti e Ritratti",
    luogo: "",
    data: "13 aprile 2026",
    fotografo: "Chiara Pinesi",
    foto: serie("2026-04-13", 21)
  },
  {
    titolo: "Poetry Slam I round",
    luogo: "ElektroBau Bar",
    data: "7 aprile 2026",
    fotografo: "Valentina Pocaterra",
    foto: serie("2026-04-07", 126)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "30 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: serie("2026-03-30", 118)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "16 marzo 2026",
    fotografo: "Valentina Pocaterra",
    foto: serie("2026-03-16", 126)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "9 marzo 2026",
    fotografo: "Valentina Pocaterra",
    foto: serie("2026-03-09", 116)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "2 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: serie("2026-03-02", 50)
  },
  {
    titolo: "Poetry Slam III round",
    luogo: "ElektroBau Bar",
    data: "20 gennaio 2026",
    fotografo: "Valentina Pocaterra",
    foto: serie("2026-01-20", 120)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "17 novembre 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-11-17", 87)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "3 novembre 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-11-03", 133)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "27 ottobre 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-10-27", 114)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "13 ottobre 2025",
    fotografo: "Andrea Bellaroto",
    foto: serie("2025-10-13", 80)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "29 settembre 2025",
    fotografo: "Andrea Bellaroto",
    foto: serie("2025-09-29", 68)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "7 luglio 2025",
    fotografo: "Andrea Bellaroto",
    foto: serie("2025-07-07", 52)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "30 giugno 2025",
    fotografo: "Andrea Bellaroto",
    foto: serie("2025-06-30", 28)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "26 maggio 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-05-26", 65)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "19 maggio 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-05-19", 41)
  },
  {
    titolo: "Open mic",
    luogo: "",
    data: "31 marzo 2025",
    fotografo: "Cecilia Romano",
    foto: serie("2025-03-31", 68)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "24 marzo 2025",
    fotografo: "Cecilia Romano e Dante Farricella",
    foto: serie("2025-03-24", 81)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "10 marzo 2025",
    fotografo: "Cecilia Romano e Dante Farricella",
    foto: serie("2025-03-10", 71)
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "17 febbraio 2025",
    fotografo: "Dante Farricella",
    foto: serie("2025-02-17", 29)
  }
];
