import Link from 'next/link';

const cats = ['World','Pakistan','Business','Technology','Sports','Science','Entertainment'];
export function Header() {
  return <>
    <div className="utility"><div className="shell utilityInner"><span>Independent digital newsroom</span><span>Updated throughout the day</span></div></div>
    <header className="siteHeader">
      <div className="shell masthead"><Link className="brand" href="/"><span className="brandMark">A</span><span>ATLAS</span><small>NEWSROOM</small></Link><div className="mastRight"><Link href="/search" className="iconButton" aria-label="Search">⌕</Link><span className="liveDot"/> LIVE</div></div>
      <nav className="nav shell" aria-label="Primary navigation"><Link href="/">Latest</Link>{cats.map(c=><Link key={c} href={`/category/${c.toLowerCase()}`}>{c}</Link>)}</nav>
    </header>
  </>;
}
