import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/db';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const a=await getArticleBySlug(slug); if(!a)return {};
  return { title:a.seoTitle, description:a.seoDescription, alternates:{canonical:`/news/${a.slug}`}, openGraph:{type:'article',title:a.headline,description:a.standfirst,images:[{url:a.imageUrl,alt:a.imageAlt}],publishedTime:a.publishedAt,modifiedTime:a.modifiedAt}, robots:{index:a.status==='published'||a.status==='updated',follow:true,googleBot:{'max-image-preview':'large'}} };
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const a=await getArticleBySlug(slug); if(!a)notFound(); const site=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';
  const schema={ '@context':'https://schema.org','@type':'NewsArticle',headline:a.headline,description:a.seoDescription,image:[new URL(a.imageUrl,site).toString()],datePublished:a.publishedAt,dateModified:a.modifiedAt,author:[{'@type':'Organization',name:a.author}],publisher:{'@type':'Organization',name:process.env.NEXT_PUBLIC_SITE_NAME||'Atlas Newsroom'},mainEntityOfPage:`${site}/news/${a.slug}`,articleSection:a.category,keywords:a.tags.join(', ') };
  return <main><article className="article"><div className="category">{a.category}</div><h1>{a.headline}</h1><p className="standfirst">{a.standfirst}</p><div className="byline"><b>{a.author}</b><span>Published {new Date(a.publishedAt).toLocaleString('en',{dateStyle:'medium',timeStyle:'short'})}</span>{a.modifiedAt!==a.publishedAt&&<span>Updated</span>}</div></article><figure className="articleHero"><img src={a.imageUrl} alt={a.imageAlt}/>{a.imageCredit&&<figcaption>{a.imageCredit}</figcaption>}</figure><article className="article"><div className="articleBody">{a.body.split(/\n\n+/).map((p,i)=><p key={i}>{p}</p>)}</div><div className="tags">{a.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div></article><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></main>
}
