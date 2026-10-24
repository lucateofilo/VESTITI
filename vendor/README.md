# vendor

`bg-removal.js` è il pacchetto [@imgly/background-removal](https://github.com/imgly/background-removal-js) 1.4.5
(con onnxruntime-web 1.17.3), raggruppato con esbuild in un solo file. Licenza AGPL-3.0.
I modelli (~100 MB) vengono scaricati da staticimgly.com solo quando si usa "Rimuovi sfondo".

Per rigenerarlo:
```
npm i @imgly/background-removal@1.4.5 onnxruntime-web@1.17.3 esbuild
echo "export { removeBackground } from '@imgly/background-removal';" > entry.mjs
npx esbuild entry.mjs --bundle --format=esm --minify --platform=browser --target=es2020 --outfile=bg-removal.js --legal-comments=eof
```
