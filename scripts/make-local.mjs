import { readFile, writeFile } from 'node:fs/promises';
const input = await readFile(new URL('../src/index.tsx', import.meta.url),'utf8');
const output = input.replaceAll("from 'hono@4'", "from 'hono'").replaceAll("from 'postgres@3'", "from 'postgres'");
await writeFile(new URL('../src/local.tsx', import.meta.url),output);
console.log('src/local.tsx created (standard Bun imports).');
