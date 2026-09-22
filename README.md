# Bar Croazia — sito

Sito one-page per Bar Croazia, collettivo di poesia e fanzine di Bologna.

Sito statico, senza framework: solo HTML, CSS e JavaScript. Nessuna build richiesta — basta aprire `index.html` in un browser, oppure servirlo con un semplice server statico.

## Struttura della cartella

```
index.html              Home page (una sola pagina, tutte le sezioni)
fanzine-elenco.html      Elenco completo delle fanzine
archivio-eventi.html     Archivio completo degli eventi passati
blog-articoli.html       Elenco completo degli articoli del blog

assets/
  fonts/                 Font del sito in formato .woff2, pronti per il web
  img/                   Foto delle varie sezioni (chi siamo, eventi, fanzine, ecc.)
  textures/              Texture di sfondo (carta)
```

## Font

I font usati sul sito sono già convertiti in `.woff2` dentro `assets/fonts/`. Il file `assets/fonts/pixelcastle-OFL.txt` contiene la licenza open-source (OFL) del font Pixelcastle.

## Pubblicazione

Il sito è pensato per essere pubblicato così com'è, ad esempio con GitHub Pages: basta abilitare Pages sul branch principale, cartella radice (`/`).
