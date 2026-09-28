import {writeFile,mkdir} from 'node:fs/promises';
const url='https://soxnczzompioufrgtxqp.supabase.co/rest/v1/bn_articles';
const headers={apikey:'sb_publishable_mhP4RXkHXDPrRzgXsmFGlw_3E_xfQUt'};
let rows=[],offset=0;while(true){const r=await fetch(url+'?select=*&status=eq.published&order=published_at.desc&limit=1000&offset='+offset,{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Article snapshot failed: '+r.status);const page=await r.json();rows.push(...page);if(page.length<1000)break;offset+=1000;}
await mkdir('data',{recursive:true});await writeFile('data/articles.json',JSON.stringify(rows));console.log('Snapshot contains '+rows.length+' real published articles');
