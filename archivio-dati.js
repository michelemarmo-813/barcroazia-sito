/* ==========================================================
   ARCHIVIO — le foto della sezione "Archivio" della home
   ----------------------------------------------------------
   Qui c'è l'elenco degli eventi mostrati nei tre riquadri.
   Ogni evento è un blocco tra { } con:
     titolo     il nome dell'evento (sopra la foto)
     data       la data (sopra la foto, dopo il titolo)
     fotografo  chi ha scattato le foto (sotto, dopo 📷)
     foto       l'elenco delle foto, che scorrono da sole

   Per AGGIUNGERE UNA FOTO a un evento: metti il file nella
   cartella assets/img/archivio/ e aggiungi il suo percorso
   nell'elenco "foto", tra virgolette e separato da una virgola.

   Per AGGIUNGERE UN EVENTO: copia un blocco { ... } intero,
   incollalo dopo l'ultimo (con una virgola tra i due blocchi)
   e cambia i testi. La home mostra i primi tre eventi
   dell'elenco: per cambiare quali, cambia l'ordine dei blocchi.

   Le voci qui sotto sono SEGNAPOSTO, da sostituire.
   ========================================================== */

window.ARCHIVIO = [
  {
    titolo: "Raw Poetry",
    data: "2 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: [
      "assets/img/archivio/3maggio-1.jpg",
      "assets/img/archivio/3maggio-2.jpg"
    ]
  },
  {
    titolo: "Poetry Slam",
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
    data: "2 marzo 2026",
    fotografo: "Cecilia Romano",
    foto: [
      "assets/img/archivio/3maggio-3.jpg",
      "assets/img/archivio/3maggio-1.jpg"
    ]
  }
];
