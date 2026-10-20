import { build } from 'esbuild';
import fs from 'node:fs';
const output = new URL('.verify-bundle.mjs',import.meta.url);
try {
  await build({entryPoints:[new URL('verify-data.tsx',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')].map(decodeURIComponent),outfile:decodeURIComponent(output.pathname).replace(/^\/([A-Za-z]:)/,'$1'),bundle:true,platform:'node',format:'esm',packages:'external'});
  await import(output.href);
} finally {
  if(fs.existsSync(output)) fs.unlinkSync(output);
}
