# Bar Croazia — sito

Sito one-page per Bar Croazia, movimento di poesia di Bologna.

Sito statico, senza framework: solo HTML, CSS e JavaScript. Nessuna build richiesta — basta aprire `index.html` in un browser, oppure servirlo con un semplice server statico.

## Struttura della cartella

```
index.html              Home page (una sola pagina, tutte le sezioni)
style.css               Grafica di tutto il sito (home e sottopagine)
script.js               Comportamenti della home (data, ticker, pulsanti, foto)
fanzine-elenco.html     Elenco completo delle fanzine
archivio-eventi.html    Archivio completo degli eventi passati
blog-articoli.html      Elenco completo degli articoli
articolo-*.html         Singoli articoli

assets/
  fonts/                Font del sito (Fake Receipt) in .woff2
  img/                  Logo, stella, foto delle varie sezioni
```

## Pubblicazione

Il sito è pensato per essere pubblicato così com'è, ad esempio con GitHub Pages: basta abilitare Pages sul branch principale, cartella radice (`/`).

## Citazione del giorno: due regole di impaginazione

La citazione in home (`script.js`, blocco "citazione del giorno, battuta a macchina"; `style.css`, sezione "citazione battuta a macchina") è fatta da due copie dello stesso testo: `.tw-text` (il testo vero, invisibile, che tiene l'altezza) e `.tw-vis` (la copia che si scrive lettera per lettera, sopra). Le due copie devono andare a capo negli stessi punti.

1. **Il cursore finale resta attaccato all'ultima parola, mai sull'autore.** In fondo a entrambe le copie c'è il posto del cursore (`.tw-fine`): uno spazio che non va mai a capo (U+00A0), largo una lettera, incollato all'ultima parola: l'ultima parola e il cursore vanno a capo sempre insieme e l'altezza della citazione comprende il cursore, così `.quote-note` (l'autore) non viene mai coperto. Il cursore (`.tw-cur`) non occupa spazio: è disegnato sopra il testo con `::after`; se la lettera successiva è già sulla riga sotto, lo script lo sposta all'inizio di quella riga invece di farlo sporgere oltre la colonna.
2. **Su telefono (max-width: 760px) le parole vanno a capo intere; il trattino solo per le parole più larghe di una riga.** Una parola che non entra nella riga passa intera alla riga dopo. Solo se una parola, da sola, è più larga dell'intera riga (misurata davvero, con lo stesso carattere e la stessa misura del testo; per l'ultima parola si conta anche il cursore), lo script mette tra le sue sillabe dei trattini invisibili (U+00AD), e il browser la spezza lì con un "-". La misura si rifà quando cambia la larghezza della pagina e quando il carattere è caricato. `overflow-wrap: break-word` resta solo come rete di sicurezza. Su computer il testo non viene toccato.

## Immagini: regole (da rispettare anche negli aggiornamenti)

Per tenere il sito leggero, soprattutto da telefono:

- **Formato:** JPEG per foto, locandine e copertine (qualità circa 82, progressivo). PNG solo per immagini con trasparenza (logo, stella).
- **Misura massima (lato lungo):** 1200 px per locandine, copertine delle fanzine, foto di "Chi siamo" e anteprime degli articoli; 1600 px per le pagine di giornale da leggere ingrandite (`assets/img/blog/`); 1280 px per le foto d'archivio, più la miniatura da 360 px nella sottocartella `mini/` (vedi `archivio-dati.js`).
- **Caricamento pigro:** ogni `<img>` che non si vede appena si apre la pagina (sotto la prima schermata, o nascosta in un carosello) ha `loading="lazy" decoding="async"`. Restano senza solo il logo e la locandina dell'evento in cima.
- Le foto dei caroselli dell'archivio in home e le anteprime della pagina "Tutte le foto dal 2025" si scaricano e cambiano solo quando sono sullo schermo.
- **Originali e file non più usati:** vanno in `backup/` (esclusa da Git con `.gitignore`, quindi non pubblicata), mai cancellati senza copia.
