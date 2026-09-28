import Link from 'next/link';
import type { Article } from '@/lib/types';
import { formatTime } from '@/lib/utils';
export function StoryCard({article, large=false}:{article:Article;large?:boolean}){
  return <article className={large?'storyCard storyCardLarge':'storyCard'}><Link href={`/news/${article.slug}`} className="imageWrap"><img src={article.imageUrl} alt={article.imageAlt}/></Link><div className="storyCopy"><div className="eyebrow">{article.category}<span>•</span>{formatTime(article.publishedAt)}</div><h3><Link href={`/news/${article.slug}`}>{article.headline}</Link></h3>{large&&<p>{article.standfirst}</p>}</div></article>
}
