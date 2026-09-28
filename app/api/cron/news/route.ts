import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/pipeline';
export const maxDuration=60;
export async function GET(req:NextRequest){const secret=req.headers.get('authorization')?.replace(/^Bearer\s+/,'')||req.nextUrl.searchParams.get('secret');if(!process.env.CRON_SECRET||secret!==process.env.CRON_SECRET)return NextResponse.json({error:'Unauthorized'},{status:401});try{return NextResponse.json(await runNewsPipeline())}catch(e:any){return NextResponse.json({ok:false,error:e?.message||String(e)},{status:500})}}
