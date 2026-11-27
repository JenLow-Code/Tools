import test from "node:test";
import assert from "node:assert/strict";
import {verifyToolsSession} from "../src/identity-api.js";
const session={access_token:"provider",user:{email:"fixture@example.test"}};
test("verifies Tools scope, canonical account and profile; fails closed on mismatch",async()=>{
 const stub=(product)=>async(url,init)=>url.endsWith("/exchange")?Response.json({accessToken:"tools-token",user:{id:"u",profileId:"p"}}):Response.json({user:{product,id:"u",profile_id:"p",email:session.user.email,account_status:"active"}});
 assert.deepEqual(await verifyToolsSession(session,stub("tools")),{token:"tools-token",account:{id:"u",email:session.user.email,profileId:"p"}});
 await assert.rejects(verifyToolsSession(session,stub("network")),/identity_mismatch/);
 await assert.rejects(verifyToolsSession(session,async()=>Response.json({error:"not_authenticated"},{status:401})),/not_authenticated/);
});
