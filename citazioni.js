/* Indirizzo del foglio Google con le citazioni (colonna A: citazione,
   colonna B: autore). Il sito lo legge a ogni apertura e a mezzanotte.
   Il foglio deve essere visibile a "chiunque abbia il link". */
window.CITAZIONI_FOGLIO = 'https://docs.google.com/spreadsheets/d/1kViKywScsVFCh2xnJExodJEYc0bcORzTtPNnEeP52PU/gviz/tq?tqx=out:csv';

/* Elenco di RISERVA, usato solo se il foglio non risponde.
   Citazioni del giorno (dal documento "Elenco di citazioni (trash) del giorno").
   script.js ne mostra una al giorno, a caso, con il suo autore,
   e cambia a mezzanotte (ora di Roma). */
window.CITAZIONI = [
  { testo:"C’è LA CHIUSURA DEL CLAN - FIGA [SPACCHIAMO TUTTO] SI FA / I TACCHINI SE NON VIENI STASERA [NON SEI NESSUNO], C’è FABRIZZIO MAURIZZIO / FIGA", autore:"autore - se non vieni stasera non sei nessuno" },
  { testo:"CIAO>>UN ATTIMO CHE ATTRAVERSO LA STRADA / SE MI PRENDE UNA MACCHINA - A - aaaaaaa - AIUTO / ODDIO / AaAaAa [ODDIO] ùù", autore:"Rosario Muniz" },
  { testo:"PIJATELO PIJATELO [QUELLO/QUELLO] PIJATELO - quello là. pijatelo pijalo", autore:"Cicciogamer89" },
  { testo:"MI DEVI DARE [DUE MILIONI DI / EURO] DUE MILIONI DI EURO [MI DEVI DARE / CASH]", autore:"Alessandro Orlando" },
  { testo:"L’ABBIAMO CONTROLLATO / CENTIMETRO PER CENTIMETRO - è PERFETTO E NON VOGLIO SENTIRE [ALESSANDRO è GRANDE / ALESSANDRO è TROPPO PICCOLO / ALESSANDRO – METTILO DA PARTE / QUESTA è STORIA E CULTURA.", autore:"Alessandro Orlando" },
  { testo:"QUESTA VOLTA LO DEVO DIRE - DEVO FARE NOMI E COGNOMI [LO STANNO RIPETENDO DALLA SCORSA NOTTE, PER TUTTE QUESTE / ORE] NON è ASSOLUTAMENTE COSì <QUESTO GOVERNO NON LAVORA COL FAVORE DELLE TENEBRE>", autore:"Giuseppe Conte" },
  { testo:"AMICI IN ASCOLTO, UN CORDIALE BUONGIORNO QUELLA DI IERI è SS [COS’è / CHE è CADUTO DALL’ALTRA PARTE, DIO !", autore:"Germano Mosconi" },
  { testo:"HO SCRITTO [HOT VOLEVO] FARE [HOTCHOCOLATE] è USCITO [HOT] è USCITO / DI TUTTO IO NON ASPETTAVO MAI PIù - VIDEO (èè) EFFUSIONI HOT MILF DUEMILA", autore:"Forum" },
  { testo:"VERGOGNA", autore:"Fabrizio Corona" },
  { testo:"BUONGIORNO GIOSUè, SCUSA IL DISTURBO [MA SI è STACCATO COMPLETAMENTE IL PALO DELLA LU] PIANO / SIGNORA SIGNORA NO, NIENTE / VA BE COME NON DETTO", autore:"Sicilia 2023" },
  { testo:"SEMPRE CARO MI FU? QUEST’ERMO COLLE? E QUESTA SIEPE? CHE DA TANTE PARTI DELL’ULTIMO ORIZZONTE IL GUARDO ESCLUDE ? [IO] NEL PENSIER / MI FINGO.", autore:"Carmen Di Pietro legge l’Infinito" },
  { testo:"TRENTASEI [COME FA A FAR DICIOTTO PIù QUINDICI NON FA] TRENTASEI / DIO TI MALEDICA.", autore:"Veneto 2017" },
  { testo:"SONO UN NANO IO / SONO ALTO 1.55 / BASSO QUANTO UN NANO / SONO PRATICAMENTE / UN NANO", autore:"mattfabbri89" }
];
