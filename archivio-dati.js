/* ==========================================================
   ARCHIVIO — gli eventi e le loro foto
   ----------------------------------------------------------
   Questo elenco riempie due posti:
   - la sezione "Archivio" della home, che mostra i TRE eventi
     più in alto nell'elenco che hanno almeno una foto;
   - la pagina "Eventi passati" (archivio-eventi.html), che
     mostra TUTTI gli eventi, nello stesso ordine.

   Ogni evento è un blocco tra { } con:
     titolo     il nome dell'evento
     luogo      dove si è svolto (lascia "" se non serve)
     data       la data, per esempio "2 marzo 2026"
     fotografo  chi ha scattato le foto (dopo 📷)
     foto       l'elenco delle foto, che scorrono da sole;
                [] vuol dire "foto in arrivo"

   Per AGGIUNGERE UNA FOTO a un evento: metti il file nella
   cartella assets/img/archivio/ e aggiungi il suo percorso
   nell'elenco "foto", tra virgolette e separato da una virgola.

   Per AGGIUNGERE UN EVENTO: copia un blocco { ... } intero,
   incollalo in cima all'elenco (gli eventi vanno dal più
   recente al più vecchio), con una virgola tra i blocchi,
   e cambia i testi.

   Le foto già presenti sono ancora SEGNAPOSTO: verranno
   sostituite con quelle vere delle cartelle Drive.
   ========================================================== */

window.ARCHIVIO = [
  {
    titolo: "Poetry Slam I round",
    luogo: "FARM",
    data: "6 ottobre 2026",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "5 ottobre 2026",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Segreti e Ritratti",
    luogo: "",
    data: "",
    fotografo: "Chiara Pinesi",
    foto: []
  },
  {
    titolo: "Finale regionale Poetry Slam",
    luogo: "Casalone Ritmolento",
    data: "15 luglio 2026",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Marc Kelly Smith + Raw Poetry",
    luogo: "Circolo Sardegna",
    data: "11 maggio 2026",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "20 aprile 2026",
    fotografo: "Valentina Pocaterra",
    foto: []
  },
  {
    titolo: "Poetry Slam I round",
    luogo: "ElektroBau Bar",
    data: "7 aprile 2026",
    fotografo: "Valentina Pocaterra",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "30 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: [
      "assets/img/archivio/3maggio-3.jpg",
      "assets/img/archivio/3maggio-1.jpg"
    ]
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "16 marzo 2026",
    fotografo: "Valentina Pocaterra",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "9 marzo 2026",
    fotografo: "Valentina Pocaterra",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "2 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: [
      "assets/img/archivio/3maggio-1.jpg",
      "assets/img/archivio/3maggio-2.jpg"
    ]
  },
  {
    titolo: "Poetry Slam III round",
    luogo: "ElektroBau Bar",
    data: "20 gennaio 2026",
    fotografo: "Valentina Pocaterra",
    foto: [
      "assets/img/archivio/2luglio-2.jpg",
      "assets/img/archivio/2luglio-1.jpg",
      "assets/img/archivio/2luglio-3.jpg"
    ]
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "17 novembre 2025",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "3 novembre 2025",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "27 ottobre 2025",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "13 ottobre 2025",
    fotografo: "Andrea Bellaroto",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "29 settembre 2025",
    fotografo: "Andrea Bellaroto",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "7 luglio 2025",
    fotografo: "Andrea Bellaroto",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "30 giugno 2025",
    fotografo: "Andrea Bellaroto",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "26 maggio 2025",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "19 maggio 2025",
    fotografo: "Cecilia Romano",
    foto: []
  },
  {
    titolo: "Open mic",
    luogo: "",
    data: "31 marzo 2025",
    fotografo: "",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "24 marzo 2025",
    fotografo: "Cecilia Romano e Dante Farricella",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "10 marzo 2025",
    fotografo: "Cecilia Romano e Dante Farricella",
    foto: []
  },
  {
    titolo: "Raw Poetry",
    luogo: "",
    data: "17 febbraio 2025",
    fotografo: "Dante Farricella",
    foto: []
  }
];
