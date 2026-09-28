import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getArticleById } from '@/lib/db';
export default async function EditArticle({params}:{params:Promise<{id:string}>}){
  if(!await isAdmin()) redirect('/admin/login');
  const {id}=await params; const a=await getArticleById(id); if(!a) notFound();
  return <main className="adminWrap"><div className="adminPanel"><div className="adminTop"><div><div className="eyebrow">Editorial control room</div><h1>Edit story</h1></div><a className="btn" style={{padding:'12px 18px'}} href="/admin">Back</a></div>
    {process.env.DEMO_MODE!=='false'&&<p style={{padding:'12px',background:'#2b2410',border:'1px solid #665318'}}>Demo mode is read-only. Connect Supabase and set DEMO_MODE=false to persist changes.</p>}
    <form className="editorForm" method="post" action={`/api/admin/articles/${a.id}`}>
      <label>Headline<input name="headline" defaultValue={a.headline} required/></label>
      <label>Standfirst<textarea name="standfirst" defaultValue={a.standfirst} rows={3} required/></label>
      <label>Body<textarea name="body" defaultValue={a.body} rows={16} required/></label>
      <div className="editorGrid"><label>Category<input name="category" defaultValue={a.category}/></label><label>Author<input name="author" defaultValue={a.author}/></label></div>
      <label>Hero image URL<input name="imageUrl" defaultValue={a.imageUrl}/></label><label>Image alt text<input name="imageAlt" defaultValue={a.imageAlt}/></label>
      <div className="editorGrid"><label>SEO title<input name="seoTitle" defaultValue={a.seoTitle}/></label><label>Status<select name="status" defaultValue={a.status}><option>review</option><option>published</option><option>unpublished</option><option>rejected</option></select></label></div>
      <label>SEO description<textarea name="seoDescription" defaultValue={a.seoDescription} rows={3}/></label>
      <div className="checkRow"><label><input type="checkbox" name="breaking" defaultChecked={a.breaking}/> Breaking</label><label><input type="checkbox" name="featured" defaultChecked={a.featured}/> Featured</label></div>
      <button className="btn" type="submit" style={{padding:'14px 22px'}}>Save article</button>
    </form>
  </div></main>
}
