import { getArticles } from '@/lib/db';
import { StoryCard } from '@/components/StoryCard';
export default async function Category({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const name=slug.charAt(0).toUpperCase()+slug.slice(1);const articles=await getArticles({category:name,limit:30});return <main><div className="pageHead"><div className="shell"><div className="kicker">Section</div><h1>{name}</h1></div></div><section className="mainSection shell"><div className="grid3">{articles.map(a=><StoryCard key={a.id} article={a}/>)}</div>{!articles.length&&<p>No published stories in this section yet.</p>}</section></main>}


export async function generateStaticParams(){return ['world','pakistan','politics','business','technology','sports','science','health','entertainment','lifestyle'].map(slug=>({slug}));}
