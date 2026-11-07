# Bar Croazia — sito

Sito one-page per Bar Croazia, movimento di poesia di Bologna.

Sito statico, senza framework: solo HTML, CSS e JavaScript. Nessuna build richiesta — basta aprire `index.html` in un browser, oppure servirlo con un semplice server statico.

## Lingue

`lingue.js` traduce il sito in croato ed esperanto con i dizionari di `lingue-dati.js` (la chiave è il testo italiano). Ogni testo nuovo va aggiunto in tutti e due i dizionari. Negli eventi, l'elenco dei nomi (`.names`) non si traduce: nomi e nomi d'arte restano come sono; se accanto al nome c'è il paese, lo `<span>` del paese ha la classe `paese` e quello sì si traduce.

## Struttura della cartella

```
index.html              Home page (una sola pagina, tutte le sezioni)
style.css               Grafica di tutto il sito (home e sottopagine)
script.js               Comportamenti della home (data, ticker, pulsanti, foto)
fanzine-elenco.html     Elenco completo delle fanzine
archivio-eventi.html    Archivio completo degli eventi passati
blog-articoli.html      Elenco completo degli articoli
articolo-*.html         Singoli articoli
robots.txt              Dice ai motori di ricerca che possono leggere tutto e dov'è la sitemap
sitemap.xml             Elenco di tutte le pagine del sito, per Google

assets/
  fonts/                Font del sito (Fake Receipt) in .woff2
  img/                  Logo, stella, foto delle varie sezioni
```

## Pubblicazione

Il sito è pensato per essere pubblicato così com'è, ad esempio con GitHub Pages: basta abilitare Pages sul branch principale, cartella radice (`/`).

## Google e anteprime dei link: titolo, descrizione, indirizzo ufficiale, sitemap

Ogni pagina ha nel suo `<head>`, subito dopo `<title>`:

- `<meta name="description">`: le due righe che Google mostra sotto il titolo. In italiano (Google legge il sito in italiano), circa 140–155 caratteri, senza date che invecchiano (vanno bene solo le date fisse, come quella di un articolo).
- `<link rel="canonical">`: l'indirizzo ufficiale della pagina (`https://barcroazia.it/` per la home, `https://barcroazia.it/nome-pagina.html` per le altre), così Google non la conta due volte.

Il titolo della home è "Bar Croazia - Movimento di poesia con poeti vivi"; le sottopagine hanno "Nome pagina — Bar Croazia". `robots.txt` lascia leggere tutto e indica `sitemap.xml`, che elenca tutte le pagine.

Subito dopo ci sono le righe per l'anteprima quando si condivide un link (WhatsApp, Telegram, Facebook…): `og:site_name`, `og:type` (`article` per gli articoli, `website` per le altre), `og:locale`, `og:title` e `og:description` (uguali a `<title>` e `description`), `og:url` (uguale al `canonical`) e `twitter:card` = `summary`. Volutamente **senza immagine**: l'anteprima è solo testo.

**Aggiungendo una pagina nuova:** darle titolo, `description`, `canonical` e le righe `og:` come le altre (copiandole e cambiando i testi), e aggiungere il suo indirizzo in `sitemap.xml`. Togliendo una pagina, toglierla anche da lì.

## Citazione del giorno: due regole di impaginazione

La citazione in home (`script.js`, blocco "citazione del giorno, battuta a macchina"; `style.css`, sezione "citazione battuta a macchina") è fatta da due copie dello stesso testo: `.tw-text` (il testo vero, invisibile, che tiene l'altezza) e `.tw-vis` (la copia che si scrive lettera per lettera, sopra). Le due copie devono andare a capo negli stessi punti.

1. **Il cursore finale resta attaccato all'ultima parola, mai sull'autore.** In fondo a entrambe le copie c'è il posto del cursore (`.tw-fine`): uno spazio che non va mai a capo (U+00A0), largo una lettera, incollato all'ultima parola: l'ultima parola e il cursore vanno a capo sempre insieme e l'altezza della citazione comprende il cursore, così `.quote-note` (l'autore) non viene mai coperto. Il cursore (`.tw-cur`) non occupa spazio: è disegnato sopra il testo con `::after`; se la lettera successiva è già sulla riga sotto, lo script lo sposta all'inizio di quella riga invece di farlo sporgere oltre la colonna.
2. **Su telefono (max-width: 760px) le parole vanno a capo intere; il trattino solo per le parole più larghe di una riga.** Una parola che non entra nella riga passa intera alla riga dopo. Solo se una parola, da sola, è più larga dell'intera riga (misurata davvero, con lo stesso carattere e la stessa misura del testo; per l'ultima parola si conta anche il cursore), lo script mette tra le sue sillabe dei trattini invisibili (U+00AD), e il browser la spezza lì con un "-". La misura si rifà quando cambia la larghezza della pagina e quando il carattere è caricato. `overflow-wrap: break-word` resta solo come rete di sicurezza. Su computer il testo non viene toccato.

## Tasto "← Indietro" delle sottopagine

Ogni sottopagina (articoli, tutti gli articoli, archivio eventi, elenco fanzine, open call) ha il tasto `a.back-btn`, un link vero con una meta fissa: un articolo → `blog-articoli.html`; `blog-articoli.html` → `index.html#blog`; archivio → `index.html#archivio`; fanzine → `index.html#fanzine`; open call → `index.html#call`. Senza JavaScript, col clic centrale, aprendo in una nuova scheda o arrivando da fuori (o aprendo la pagina direttamente) vale sempre quel link.

Con un clic normale, `effetti.js` (blocco "← Indietro") lo fa funzionare come il tasto indietro del browser (`history.back()`, nessuna voce nuova nella cronologia, la pagina torna nella stessa posizione) **solo se** si è arrivati, in questa stessa scheda, dalla pagina dove il link porterebbe; per un articolo vale anche la home. Esempi: home → articolo → Indietro = home, al punto di prima; home → "Vedi tutto" → articolo → Indietro = tutti gli articoli → Indietro = home. Per saperlo con sicurezza, a ogni clic normale su un link interno si lascia un appunto in `sessionStorage` (`bc-arrivo`); la pagina d'arrivo, solo se ci si è arrivati andando avanti (non con avanti/indietro né ricaricando), lo copia nella propria voce di cronologia (`history.state.bcDa`). Una sottopagina nuova con lo stesso tasto funziona così da sola, senza aggiungere codice.

## Immagini: regole (da rispettare anche negli aggiornamenti)

Per tenere il sito leggero, soprattutto da telefono:

- **Formato:** JPEG per foto, locandine e copertine (qualità circa 82, progressivo). PNG solo per immagini con trasparenza (logo, stella).
- **Misura massima (lato lungo):** 1200 px per locandine, copertine delle fanzine, foto di "Chi siamo" e anteprime degli articoli; 1600 px per le pagine di giornale da leggere ingrandite (`assets/img/blog/`); 1280 px per le foto d'archivio, più la miniatura da 360 px nella sottocartella `mini/` (vedi `archivio-dati.js`).
- **Caricamento pigro:** ogni `<img>` che non si vede appena si apre la pagina (sotto la prima schermata, o nascosta in un carosello) ha `loading="lazy" decoding="async"`. Restano senza solo il logo e la locandina dell'evento in cima.
- Le foto dei caroselli dell'archivio in home e le anteprime della pagina "Tutte le foto dal 2025" si scaricano e cambiano solo quando sono sullo schermo.
- **Originali e file non più usati:** vanno in `backup/` (esclusa da Git con `.gitignore`, quindi non pubblicata), mai cancellati senza copia.
- **Misure dichiarate:** le immagini che non stanno in una cornice di altezza fissa hanno `width` e `height` nell'HTML (le misure vere del file), con `height:auto` nel CSS: così il loro posto è tenuto libero prima che arrivino e il testo sotto non salta. Oggi: il logo (in alto e in fondo alla home), le foto degli articoli, le locandine delle open call. Cambiando una di queste immagini, aggiornare anche le due misure.

## Telefono: niente salti né lavoro inutile (regole da rispettare anche negli aggiornamenti)

Su telefono la pagina non deve saltare mentre la si legge, e il telefono non deve rifare calcoli che non servono.

- **La barra del browser che compare e sparisce** (scorrendo, su iPhone e Android) cambia solo l'altezza della finestra: niente si deve ricalcolare per questo. Le scritte laterali (`sistemaTape()` in `script.js`) si rifanno solo se cambiano davvero il loro inizio, la loro fine, la larghezza della finestra, il testo o il carattere; quando si rifanno, la scritta esistente si aggiorna (non si ricrea), così continua a scorrere da dov'era. Ogni nuovo ricalcolo legato a `resize` deve guardare la larghezza, non l'altezza. Le scritte laterali hanno `overflow-anchor:none`: il browser non deve mai usarle come punto di riferimento per tenere ferma la pagina (mentre si ricalcolano la sposterebbe: per esempio un clic sul codice a barre portava a "Chi siamo").
- **Niente contenuto che arriva dopo e spinge giù la pagina.** Ciò che arriva in un secondo momento ha il suo posto tenuto libero fin dall'inizio:
  - il carattere Fake Receipt è chiesto subito, insieme al foglio di stile (`<link rel="preload">` nell'intestazione di ogni pagina), così il testo non va a capo in modo diverso quando arriva;
  - il selettore della lingua: la riga in alto ha già la sua altezza finale (`.topline`, 44 px su telefono e tablet), e nelle sottopagine su telefono c'è un segnaposto alto 44 px finché `lingue.js` non mette il selettore (classe `lingua-pronta` su `<html>`);
  - la citazione del giorno: quella già vista oggi (memoria del telefono, `bc-citazione-2`) si mette subito, senza aspettare il foglio Google; se cambia altezza mentre chi legge è già più giù, lo script controlla il testo a metà schermo e, solo se si è davvero spostato, sposta la pagina della stessa misura (Chrome e Android lo tengono già fermo da soli, Safari su iPhone no; così non si corregge mai due volte);
  - le immagini fuori dalle cornici fisse hanno le misure dichiarate (vedi sopra).
- **Effetti al passaggio del mouse solo con un mouse vero** (`@media(hover:hover)`): su telefono e tablet un tocco lasciava il tasto "acceso" (più scuro, che ondeggia) finché non si toccava altrove. Il tocco ha il suo effetto proprio (`:active`, il tasto che si abbassa).
- **Timer e animazioni:** i caroselli e le anteprime cambiano foto solo se sono sullo schermo e con la scheda in primo piano; la scia di stelline (`stelle.js`) esiste solo con un mouse; il conto alla rovescia nel ticker cambia il testo solo quando cambia davvero. Con "riduci movimento" non si muove niente.
- **Prove da rifare dopo ogni modifica importante:** telefoni piccoli (320 px) e normali, tablet in verticale e orizzontale, rete lenta; scorrere tutta la pagina facendo comparire e sparire la barra del browser, ruotare lo schermo, cambiare lingua, aprire e chiudere le foto ingrandite.
