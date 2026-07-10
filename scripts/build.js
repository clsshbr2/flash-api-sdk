// scripts/build.js
// Empacota o SDK (ESM) em dist/index.cjs para consumidores CommonJS,
// conforme declarado no campo "exports" do package.json.

import { build } from 'esbuild';
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function run() {
    if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
    }

    await build({
        entryPoints: [path.join(rootDir, 'src', 'index.js')],
        outfile: path.join(distDir, 'index.cjs'),
        bundle: true,
        platform: 'node',
        target: 'node18',
        format: 'cjs',
        sourcemap: true,
        // axios, uuid e events são dependências normais e podem ir empacotadas,
        // mas mantemos como external para reduzir o tamanho do bundle final
        external: ['axios', 'uuid', 'events', 'ws'],
    });

    // Copia as definições de tipos para o dist também
    const typesSrc = path.join(rootDir, 'src', 'index.d.ts');
    const typesDest = path.join(distDir, 'index.d.ts');
    if (existsSync(typesSrc)) {
        copyFileSync(typesSrc, typesDest);
    }

    console.log('✅ Build concluído: dist/index.cjs');
}

run().catch((error) => {
    console.error('❌ Erro no build:', error);
    process.exit(1);
});