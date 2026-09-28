import data from '@/data/articles.json';
import type {Article} from './types';
import {fromRow} from './mapper';
export async function getArticles(opts:{category?:string;query?:string;limit?:number}={}):Promise<Article[]>{let rows=(data as any[]).map(fromRow);if(opts.category)rows=rows.filter(a=>a.category.toLowerCase()===opts.category!.toLowerCase());if(opts.query){let q=opts.query.toLowerCase();rows=rows.filter(a=>(a.headline+' '+a.standfirst+' '+a.body).toLowerCase().includes(q));}return rows.slice(0,opts.limit||10000);}
export async function getArticleBySlug(slug:string){return (await getArticles()).find(a=>a.slug===slug)||null;}
