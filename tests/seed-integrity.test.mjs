import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');
const source=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
test('seed array is exactly thirteen independent seven-column tuples',()=>{
 const file=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let declaration;
 function walk(n){if(ts.isVariableDeclaration(n)&&n.name.getText(file)==='seeds')declaration=n;ts.forEachChild(n,walk);}
 walk(file);
 assert.ok(declaration,'seeds declaration missing');
 assert.ok(ts.isArrayLiteralExpression(declaration.initializer),'seeds initializer must be an array');
 assert.equal(declaration.initializer.elements.length,13);
 for(const [i,row] of declaration.initializer.elements.entries()){
  assert.ok(ts.isArrayLiteralExpression(row),'mission '+(i+1)+' must be an independent array, not property access');
  assert.equal(row.elements.length,7,'mission '+(i+1)+' must have 7 fields');
 }
 assert.deepEqual(declaration.initializer.elements.map(x=>x.elements[0].text),Array.from({length:13},(_,i)=>'q'+String(i+1).padStart(2,'0')));
});
