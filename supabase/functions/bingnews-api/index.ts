import { createRemoteJWKSet, jwtVerify } from 'https://esm.sh/jose@6.1.0';
const url=Deno.env.get('SUPABASE_URL')!;
const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwks=createRemoteJWKSet(new URL('https://token.actions.githubusercontent.com/.well-known/jwks'));
const cors={'Access-Control-Allow-Origin':'https://iqra0076r.github.io','Access-Control-Allow-Headers':'authorization,content-type,apikey','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
async function rpc(action:string,payload:unknown={}){const r=await fetch(url+'/rest/v1/rpc/'+(['contact','inbox'].includes(action)?'bn_contact':'bn_service'),{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({action,payload})});if(!r.ok)throw new Error('Database operation failed: '+await r.text());return r.json();}
async function authUser(req:Request){const h=req.headers.get('authorization');if(!h)throw new Error('Unauthorized');const r=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:h}});if(!r.ok)throw new Error('Unauthorized');const user=await r.json();if(!user.email_confirmed_at||!(await rpc('admin_check',{email:user.email})).admin)throw new Error('Forbidden');return user.email;}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 const action=new URL(req.url).searchParams.get('action')||'health';
 try{
  if(action==='health')return reply({ok:true,service:'BingNews',time:new Date().toISOString()});
  if(action==='trending')return reply(await rpc('trending'));
  if(req.method!=='POST')return reply({error:'Method not allowed'},405);
  if(Number(req.headers.get('content-length')||0)>180000)return reply({error:'Request too large'},413);
  const raw=await req.text();if(raw.length>180000)return reply({error:'Request too large'},413);const body=JSON.parse(raw||'{}');
  if(action==='runner'){
   const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
   const {payload}=await jwtVerify(token,jwks,{issuer:'https://token.actions.githubusercontent.com',audience:'bingnews'});
   if(payload.repository_id!=='1207371609'||payload.ref!=='refs/heads/main'||payload.workflow_ref!=='Iqra0076r/news/.github/workflows/news.yml@refs/heads/main')return reply({error:'Forbidden workflow'},403);
   if(!['begin','finish','item','publish','source_health'].includes(body.action))return reply({error:'Invalid runner action'},400);
   if(body.action==='publish'){
    const a=body.payload?.article;if(!a||typeof a.body!=='string'||a.body.length<280||a.body.length>40000||!a.headline||a.headline.length>200||!/^[-a-z0-9]+$/.test(a.slug)||!a.cluster_id)return reply({error:'Invalid article'},400);
    if(a.status==='published'&&body.payload.verification?.supported!==true)return reply({error:'Verification is required'},400);
   }
   return reply(await rpc(body.action,body.payload));
  }
  if(action==='contact'){
   if(!body.name||body.name.length>150||typeof body.email!=='string'||!/^.+@.+\..+$/.test(body.email)||typeof body.body!=='string'||body.body.length<20||body.body.length>5000||String(body.subject||'').length>200)return reply({error:'Please enter valid contact details and a message of 20–5,000 characters.'},400);
   const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key+ip)))).map(x=>x.toString(16).padStart(2,'0')).join('');
   return reply(await rpc('contact',{name:body.name,email:body.email,subject:body.subject,body:body.body,hash}));
  }
  if(action==='metric'){
   if(!/^[0-9a-f-]{36}$/.test(body.id))return reply({error:'Invalid article'},400);
   const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key+ip+new Date().toISOString().slice(0,10))))).map(x=>x.toString(16).padStart(2,'0')).join('');
   return reply(await rpc('metric',{id:body.id,hash,depth:Number(body.depth)||0}));
  }
  const actor=await authUser(req);
  if(!['dashboard','save','versions','source','inbox'].includes(action))return reply({error:'Not found'},404);
  if(action==='save'){
   const a=body.article;
   if(!a||!a.headline?.trim()||!a.body?.trim()||a.body.length>40000||!['draft','review','scheduled','published','unpublished','rejected'].includes(a.status))return reply({error:'Invalid article'},400);
   if(a.image_url&&!/^https:\/\//.test(a.image_url))return reply({error:'Image must use HTTPS'},400);
  }
  return reply(await rpc(action,{...body,actor}));
 }catch(e){console.error('BingNews',action,e instanceof Error?e.message:'Request failed');const m=e instanceof Error?e.message:'';return reply({error:m==='Unauthorized'||m==='Forbidden'?m:'The request could not be completed.'},m==='Unauthorized'?401:m==='Forbidden'?403:500);}
});
