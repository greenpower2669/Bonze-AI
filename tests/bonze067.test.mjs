import test from 'node:test';
import assert from 'node:assert/strict';
import {contradictionCases} from './fixtures/bonze067-contradictions.mjs';
test('BONZE-067: frozen cases',()=>{
 assert.equal(contradictionCases.length,32);
 assert.equal(contradictionCases.filter(x=>x.conflict).length,14);
});
