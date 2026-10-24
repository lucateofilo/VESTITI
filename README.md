# Il mio Armadio 👗

Armadio digitale ispirato ad Atricent: fotografa i tuoi vestiti e tienili organizzati.
È un sito statico, gratis su GitHub Pages: nessun server, nessun costo.

## Cosa fa
- Aggiungi capi con foto (fotocamera o galleria), nome, categoria, colore, stagioni, marca, taglia, tag e note
- **Rimuovi sfondo** dalle foto, direttamente sul telefono (nessun server): il risultato va sempre approvato a mano, e la foto originale si può ripristinare
- Filtri per categoria, colore, stagione, preferiti e ricerca testuale
- Conta quante volte indossi ogni capo ("Indossato oggi")
- Backup: esporta/importa tutto in un file JSON
- Installabile sul telefono come un'app e funziona anche offline

I dati restano **solo sul tuo dispositivo** (nel browser). Esporta un backup ogni tanto.

## Pubblicarlo su GitHub Pages (gratis)
1. Il repository deve essere **pubblico** (Pages su repo privati richiede un piano a pagamento):
   *Settings → General → Danger Zone → Change visibility → Public*.
2. Porta questi file sul branch `main`.
3. *Settings → Pages → Build and deployment*: Source **Deploy from a branch**, Branch **main**, cartella **/ (root)** → Save.
4. Dopo un paio di minuti l'app è su `https://<tuo-utente>.github.io/<nome-repo>/`.

Sul telefono: apri il link e scegli **Aggiungi a schermata Home** per averla come app.

## Provarlo in locale
```
python3 -m http.server 8000
```
poi apri http://localhost:8000

## Rimozione sfondo
Usa [@imgly/background-removal](https://github.com/imgly/background-removal-js) (licenza AGPL-3.0), incluso in `vendor/`.
La prima volta scarica il modello (~100 MB) da staticimgly.com, poi resta in cache. Le foto non lasciano mai il dispositivo.
- Icone SVG in stile [Lucide](https://lucide.dev) (licenza ISC), in `icons.js`.
