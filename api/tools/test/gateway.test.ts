import test from 'node:test';
import assert from 'node:assert/strict';
import {handle} from '../src/index.ts';
test('Tools forwards only explicit identity routes and strips forged scope',async()=>{
 let seen:Request|undefined;
 const env={ALLOWED_ORIGIN:'https://tools.jenlow.net',SECURITY:{async fetch(req:Request){seen=req;return Response.json({user:{id:'verified',product:'tools'}});}}};
 const r=await handle(new Request('https://api-tools.jenlow.net/core/identity?target=evil',{headers:{authorization:'Bearer fixture','X-Product':'network','X-User-Id':'forged',origin:'https://tools.jenlow.net'}}),env);
 assert.equal(r.status,200);assert.equal(seen?.url,'https://middleware.internal/v1/auth/me');assert.equal(seen?.headers.get('authorization'),'Bearer fixture');assert.equal(seen?.headers.get('X-Product'),null);assert.equal(seen?.headers.get('X-User-Id'),null);
 for(const path of ['/network/profile','/production/projects','/live/events','/tools/market','/v1/auth/email/login'])assert.equal((await handle(new Request('https://api-tools.jenlow.net'+path),env)).status,404);
 assert.equal((await handle(new Request('https://api-tools.jenlow.net/core/identity',{headers:{origin:'https://evil.example'}}),env)).status,403);
 assert.equal((await handle(new Request('https://api-tools.jenlow.net/core/identity'),{})).status,503);
 assert.equal((await handle(new Request('https://api-tools.jenlow.net/core/identity'),{SECURITY:{async fetch(){return Response.json({error:'not_authenticated'},{status:401});}}})).status,401);
});