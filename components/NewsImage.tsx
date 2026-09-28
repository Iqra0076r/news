'use client';
import {useState} from 'react';
export function NewsImage({src,alt,category,priority=false}:{src:string;alt:string;category:string;priority?:boolean}){const[failed,setFailed]=useState(false);return src&&!failed?<img src={src} alt={alt||category+' news'} width={1200} height={675} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} onError={()=>setFailed(true)}/>:<div className="editorialVisual" role="img" aria-label={category+' editorial graphic'}><span>BingNews</span><strong>{category}</strong><small>THE NEWS IN FOCUS</small></div>;}
