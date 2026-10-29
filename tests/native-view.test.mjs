import test from 'node:test';import assert from 'node:assert/strict';
import {createNativeView} from '../core/native-view.mjs';
test('stop barrier rejects late active snapshots until acknowledged',()=>{
 const v=createNativeView();assert.ok(v.accept({type:'snapshot',boot:'a',seq:1,request:'start',active:true}));
 v.expect('stop');assert.equal(v.accept({type:'snapshot',boot:'a',seq:2,request:'start',active:true}),false);
 assert.ok(v.accept({type:'snapshot',boot:'a',seq:3,request:'stop',active:false}));
 assert.equal(v.accept({type:'snapshot',boot:'a',seq:2,request:'stop',active:true}),false);
});
test('screen visibility never changes a native session and process restart stays off',()=>{
 const v=createNativeView();assert.ok(v.accept({type:'snapshot',boot:'a',seq:2,request:'start',active:true}));
 v.expect('stop');assert.ok(v.accept({type:'snapshot',boot:'b',seq:1,request:'',active:false}));
 assert.equal(v.accept({type:'snapshot',boot:'a',seq:9,request:'stop',active:true}),false);
});
