export const CORE_API="https://api-tools.jenlow.net";
export async function identityRequest(path, token, method="GET", request=fetch){
  const r=await request(CORE_API+path,{method,headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(10000),cache:"no-store"});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(typeof data.error==="string"?data.error:data.error?.code||"identity_http_"+r.status);
  return data;
}
export async function verifyToolsSession(session, request=fetch){
  if(!session?.access_token||!session?.user?.email||session.user.is_anonymous)throw Error("not_authenticated");
  const x=await identityRequest("/core/auth/supabase/exchange",session.access_token,"POST",request);
  if(!x.accessToken||!x.user?.id||!x.user?.profileId)throw Error("identity_exchange_invalid");
  const m=await identityRequest("/core/identity",x.accessToken,"GET",request);
  if(m.user?.product!=="tools"||m.user?.account_status!=="active"||m.user?.id!==x.user.id||m.user?.profile_id!==x.user.profileId||m.user?.email?.toLowerCase()!==session.user.email.toLowerCase())throw Error("identity_mismatch");
  return {token:x.accessToken,account:{id:m.user.id,email:m.user.email,profileId:m.user.profile_id}};
}
