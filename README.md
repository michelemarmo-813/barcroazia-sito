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
