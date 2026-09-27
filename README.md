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

## Confronto layout (branch `layout-confronto`)

In basso a destra c'è un piccolo selettore `layout 1 2 3 4`. I contenuti sono sempre gli stessi (un solo `index.html`), cambia solo la disposizione:

- `1` il layout attuale, invariato
- `2` "scontrino" — `layout-2.css`
- `3` ispirato al PDF "layout 3" — `layout-3.css`
- `4` "il libro", proposta libera — `layout-4.css`

Il layout attivo è l'attributo `data-layout` sul `<body>`; ogni file CSS ha regole valide solo per il suo layout. La scelta resta salvata nel browser e si può passare via link: `index.html?layout=3`. Selettore e piccoli comportamenti dei layout 2–4 sono in `layouts.js` e `layouts.css`.

## Font

I font usati sul sito sono già convertiti in `.woff2` dentro `assets/fonts/`. Il file `assets/fonts/pixelcastle-OFL.txt` contiene la licenza open-source (OFL) del font Pixelcastle.

## Pubblicazione

Il sito è pensato per essere pubblicato così com'è, ad esempio con GitHub Pages: basta abilitare Pages sul branch principale, cartella radice (`/`).
