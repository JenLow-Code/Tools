import React,{useEffect,useRef,useState,useCallback} from "react";
import {createClient} from "@supabase/supabase-js";
import {identityRequest,verifyToolsSession} from "./identity-api.js";
const supabase=createClient("https://ldliraxelqftisjofwgv.supabase.co","sb_publishable_cpxxQyXcEYEy3mwWAaTG9w_QNFg9tC9",{auth:{flowType:"pkce",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storageKey:"jenlow-tools-auth-v1"}});
export function useToolsIdentity(){
  const [account,setAccount]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(true);
  const token=useRef(null),generation=useRef(0),lastActivity=useRef(0),pending=useRef(null),loggingOut=useRef(false);
  const clear=useCallback(()=>{generation.current++;token.current=null;setAccount(null);},[]);
  const verify=useCallback(async(session)=>{
    if(loggingOut.current)return;
    const seq=++generation.current;
    if(!session){clear();setBusy(false);return;}
    try{
      const data=await verifyToolsSession(session);
      if(seq!==generation.current)return;
      token.current=data.token;setAccount(data.account);setError("");
    }catch(e){
      if(seq!==generation.current)return;
      token.current=null;setAccount(null);setError(e.message||"identity_unavailable");
      if(e.message==="session_revoked_or_inactive")await supabase.auth.signOut({scope:"local"});
    }finally{if(seq===generation.current)setBusy(false);}
  },[clear]);
  const refresh=useCallback(async()=>{
    if(loggingOut.current||pending.current)return pending.current;
    const work=(async()=>{const {data,error}=await supabase.auth.getSession();if(error){clear();setError("identity_unavailable");setBusy(false);return;}await verify(data.session);})();
    pending.current=work;try{await work;}finally{pending.current=null;}
  },[clear,verify]);
  useEffect(()=>{
    let mounted=true;
    const {data}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!mounted)return;
      if(event==="SIGNED_OUT"){clear();setBusy(false);return;}
      if(event!=="INITIAL_SESSION")setTimeout(()=>{if(mounted&&!loggingOut.current)void verify(session);},0);
    });
    void refresh();
    const timer=setInterval(()=>{if(document.visibilityState==="visible")void refresh();},10*60*1000);
    const visible=()=>{if(document.visibilityState==="visible")void refresh();};
    const activity=()=>{if(!token.current||Date.now()-lastActivity.current<30000)return;lastActivity.current=Date.now();void identityRequest("/core/session/activity",token.current,"POST").catch(()=>void refresh());};
    document.addEventListener("visibilitychange",visible);window.addEventListener("pointerdown",activity);window.addEventListener("keydown",activity);
    return()=>{mounted=false;generation.current++;data.subscription.unsubscribe();clearInterval(timer);document.removeEventListener("visibilitychange",visible);window.removeEventListener("pointerdown",activity);window.removeEventListener("keydown",activity);};
  },[clear,refresh,verify]);
  async function signIn(email,password){setBusy(true);setError("");try{const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw Error("sign_in_failed");await verify(data.session);}catch(e){setError(e.message||"sign_in_failed");setBusy(false);}}
  async function google(){setBusy(true);setError("");try{const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/"}});if(error)throw Error("google_sign_in_failed");}catch(e){setError(e.message||"google_sign_in_failed");setBusy(false);}}
  async function signOut(){loggingOut.current=true;setBusy(true);const current=token.current;clear();let ok=!current;
    try{if(current)ok=(await identityRequest("/core/session/revoke",current,"POST")).ok===true;}catch{ok=false;}
    try{const r=await supabase.auth.signOut({scope:"local"});if(r.error)ok=false;}catch{ok=false;}
    loggingOut.current=false;setBusy(false);setError(ok?"":"remote_revocation_unconfirmed");
  }
  return {account,error,busy,signIn,google,signOut};
}
const copy={
 fr:{email:"Adresse e-mail",password:"Mot de passe",login:"Se connecter",google:"Continuer avec Google",logout:"Se déconnecter",local:"Votre inventaire et vos brouillons restent sur cet appareil. La synchronisation métier n’est pas encore activée.",failure:"Connexion non confirmée. Réessayez.",revocation:"Session locale fermée ; révocation serveur non confirmée.",pending:"Vérification en cours…"},
 en:{email:"Email address",password:"Password",login:"Sign in",google:"Continue with Google",logout:"Sign out",local:"Your inventory and drafts remain on this device. Business data synchronization is not enabled yet.",failure:"Sign-in not confirmed. Please try again.",revocation:"Local session closed; server revocation was not confirmed.",pending:"Verifying…"},
 de:{email:"E-Mail-Adresse",password:"Passwort",login:"Anmelden",google:"Mit Google fortfahren",logout:"Abmelden",local:"Inventar und Entwürfe bleiben auf diesem Gerät. Die Synchronisierung ist noch nicht aktiv.",failure:"Anmeldung nicht bestätigt. Bitte erneut versuchen.",revocation:"Lokale Sitzung beendet; Server-Widerruf nicht bestätigt.",pending:"Überprüfung läuft…"},
 pt:{email:"Endereço de e-mail",password:"Palavra-passe",login:"Iniciar sessão",google:"Continuar com Google",logout:"Terminar sessão",local:"O inventário e os rascunhos permanecem neste dispositivo. A sincronização ainda não está ativa.",failure:"Sessão não confirmada. Tente novamente.",revocation:"Sessão local encerrada; revogação no servidor não confirmada.",pending:"A verificar…"}
};
export function AccountForm({identity,locale}){
 const c=copy[locale]||copy.en,[email,setEmail]=useState(""),[password,setPassword]=useState("");
 const error=identity.error?(identity.error==="remote_revocation_unconfirmed"?c.revocation:c.failure):"";
 return <div className="form-grid">
   <p className="form-note full">{c.local}</p>
   {identity.busy&&<p role="status" className="full">{c.pending}</p>}
   {error&&<p role="alert" className="full">{error}</p>}
   {identity.account?<><p className="full">{identity.account.email}</p><button className="secondary-button full" disabled={identity.busy} onClick={()=>void identity.signOut()}>{c.logout}</button></>:<>
     <button className="secondary-button full" disabled={identity.busy} onClick={()=>void identity.google()}>{c.google}</button>
     <form className="form-grid full" onSubmit={e=>{e.preventDefault();const p=password;setPassword("");void identity.signIn(email,p);}}>
       <label className="full">{c.email}<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
       <label className="full">{c.password}<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
       <button className="primary-button full" disabled={identity.busy} type="submit">{c.login}</button>
     </form></>}
 </div>;
}
