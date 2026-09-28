'use client';
import {useState,useEffect} from 'react';
import {DB,PUBLIC_KEY,CATEGORIES} from '@/lib/config';
import {fromRow} from '@/lib/mapper';
import {StoryCard} from './StoryCard';
import type {Article} from '@/lib/types';
export function Search(){const[q,setQ]=useState(''),[category,setCategory]=useState(''),[rows,setRows]=useState<Article[]>([]),[status,setStatus]=useState('Loading latest reports…');
async function search(e?:React.FormEvent){e?.preventDefault();setStatus('Searching…');try{const p=new URLSearchParams({select:'*',order:'published_at.desc',limit:'60'});if(q.trim())p.set('search_vector','wfts(english).'+q.trim());if(category)p.set('category','eq.'+category);const r=await fetch(DB+'/rest/v1/bn_articles?'+p,{headers:{apikey:PUBLIC_KEY}});if(!r.ok)throw Error();const a=await r.json();setRows(a.map(fromRow));setStatus(a.length?'':'No matching reports. Try another search.');}catch{setStatus('Search is temporarily unavailable. Please try again.');}}
useEffect(()=>{void search();},[]);
return <main className="shell"><div className="pageHead"><div className="kicker">Explore BingNews</div><h1>Search the news.</h1><form className="searchForm" onSubmit={search}><input aria-label="Search news" placeholder="Stories, people, ideas…" value={q} onChange={e=>setQ(e.target.value)}/><select aria-label="Category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All sections</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select><button>Search</button></form></div><p role="status">{status}</p><div className="grid3 mainSection">{rows.map(a=><StoryCard key={a.id} article={a}/>)}</div></main>;}
