import {NewsImage} from '@/components/NewsImage';
import Link from 'next/link';
import { getArticles } from '@/lib/db';
import { StoryCard } from '@/components/StoryCard';
import { formatTime } from '@/lib/utils';

export default async function Home(){
  const articles=await getArticles({limit:12}); articles.sort((a,b)=>Number(!!b.featured)-Number(!!a.featured)); const [lead,...rest]=articles;
  if(!lead) return <main className="shell pageHead"><div className="kicker">Latest edition</div><h1>The next edition is on its way.</h1><p>New reports appear here after factual checks are complete. Please check back shortly.</p></main>;
  return <main>
    {lead.breaking&&<div className="breaking"><div className="shell"><b>BREAKING</b><span>{lead.headline}</span></div></div>}
    <section className="hero"><div className="shell heroGrid"><div><Link target="_blank" rel="noopener noreferrer" href={`/news/${lead.slug}`} className="heroImage"><NewsImage src={lead.imageUrl} alt={lead.imageAlt} category={lead.category} priority/></Link><div className="heroMeta"><span>{lead.category}</span><span>•</span><span>{formatTime(lead.publishedAt)}</span></div><h1><Link target="_blank" rel="noopener noreferrer" href={`/news/${lead.slug}`}>{lead.headline}</Link></h1><p>{lead.standfirst}</p></div><aside className="sideRail"><div className="railTitle"><h2>Top stories</h2><span>↗</span></div>{rest.slice(0,4).map(a=><article className="railStory" key={a.id}><div className="eyebrow">{a.category}<span>•</span>{formatTime(a.publishedAt)}</div><h3><Link target="_blank" rel="noopener noreferrer" href={`/news/${a.slug}`}>{a.headline}</Link></h3></article>)}</aside></div></section>
    <section className="mainSection shell"><div className="sectionTitle"><h2>Latest reporting</h2><Link href="/search">Search all →</Link></div><div className="grid3">{rest.slice(0,6).map(a=><StoryCard key={a.id} article={a}/>)}</div></section>
    <section className="categoryBand"><div className="shell"><div className="sectionTitle"><h2>Technology & ideas</h2><Link href="/category/technology">View section →</Link></div><div className="grid3">{articles.filter(a=>['Technology','Science','Business'].includes(a.category)).slice(0,3).map(a=><StoryCard key={a.id} article={a}/>)}</div></div></section>
  </main>
}

