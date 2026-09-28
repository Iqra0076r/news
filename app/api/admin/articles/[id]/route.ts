import { NextRequest, NextResponse } from 'next/server';import { isAdmin } from '@/lib/auth';import { updateArticleFields, updateArticleStatus } from '@/lib/db';
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const {id}=await params;const {status}=await req.json();if(!['published','unpublished','review','rejected'].includes(status))return NextResponse.json({error:'Invalid status'},{status:400});await updateArticleStatus(id,status);return NextResponse.json({ok:true})}

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin()) return NextResponse.redirect(new URL('/admin/login',req.url),303);
  const {id}=await params; const form=await req.formData();
  const status=String(form.get('status')||'review') as any;
  await updateArticleFields(id,{
    headline:String(form.get('headline')||''), standfirst:String(form.get('standfirst')||''), body:String(form.get('body')||''),
    category:String(form.get('category')||'Latest'), author:String(form.get('author')||'News Desk'),
    imageUrl:String(form.get('imageUrl')||''), imageAlt:String(form.get('imageAlt')||''), seoTitle:String(form.get('seoTitle')||''),
    seoDescription:String(form.get('seoDescription')||''), status, breaking:form.get('breaking')==='on', featured:form.get('featured')==='on'
  });
  return NextResponse.redirect(new URL('/admin',req.url),303);
}
