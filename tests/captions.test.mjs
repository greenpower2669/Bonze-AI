import test from 'node:test';
import assert from 'node:assert/strict';
import {captionPair} from '../core/captions.mjs';
test('a new human turn never presents the previous answer as its response',()=>{
 const rows=[{role:'human',text:'Bonjour'},{role:'bot',text:'Bonjour Fab'},{role:'human',text:'Compte jusqu’à trois'}];
 const c=captionPair(rows);assert.equal(c.heard,'Compte jusqu’à trois');assert.equal(c.answer,'');assert.equal(c.pending,true);
 assert.equal(rows[1].text,'Bonjour Fab');
});
test('a completed turn displays its own answer and a sync keeps it',()=>{
 const rows=[{role:'human',text:'Compte'},{role:'bot',text:'Un, deux, trois.'}];
 assert.deepEqual(captionPair(rows),{heard:'Compte',answer:'Un, deux, trois.',pending:false});
});
