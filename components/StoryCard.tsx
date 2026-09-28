import {NewsImage} from '@/components/NewsImage';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { formatTime } from '@/lib/utils';
export function StoryCard({article, large=false}:{article:Article;large?:boolean}){
  return <article className={large?'storyCard storyCardLarge':'storyCard'}><Link target="_blank" rel="noopener noreferrer" href={`/news/${article.slug}`} className="imageWrap"><NewsImage src={article.imageUrl} alt={article.imageAlt} category={article.category}/></Link><div className="storyCopy"><div className="eyebrow">{article.category}<span>•</span>{formatTime(article.publishedAt)}</div><h3><Link target="_blank" rel="noopener noreferrer" href={`/news/${article.slug}`}>{article.headline}</Link></h3>{large&&<p>{article.standfirst}</p>}</div></article>
}

