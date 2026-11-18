import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
function authorized(request:NextRequest){const token=process.env.ADMIN_API_TOKEN;return Boolean(token&&request.headers.get("authorization")===`Bearer ${token}`);}
export async function GET(request:NextRequest){
  if(!authorized(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const data=await prisma.asset.findMany({include:{category:true,translations:true,media:true,generation:true},orderBy:{updatedAt:"desc"}});
  return NextResponse.json({data});
}
export async function POST(request:NextRequest){
  if(!authorized(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json();
  if(!body.slug||!body.categorySlug)return NextResponse.json({error:"slug and categorySlug are required"},{status:400});
  const category=await prisma.category.findUnique({where:{slug:body.categorySlug}});
  if(!category)return NextResponse.json({error:"Unknown category"},{status:400});
  const data=await prisma.asset.create({data:{slug:body.slug,categoryId:category.id,subcategory:body.subcategory??null,regionCode:body.regionCode??null,status:"DRAFT",translations:{create:(body.translations??[]).map((item:{locale:string;name:string;summary?:string;description?:string;visualDescription?:string;prompt?:string;aliases?:string[];searchTerms?:string[]})=>({locale:item.locale,name:item.name,summary:item.summary,description:item.description,visualDescription:item.visualDescription,prompt:item.prompt,aliases:item.aliases??[],searchTerms:item.searchTerms??[]}))},media:{create:(body.media??[]).map((item:{mediaType:"IMAGE"|"MODEL_3D";role?:"COVER"|"GALLERY"|"THUMBNAIL";storageKey:string;publicUrl:string;mimeType?:string;width?:number;height?:number;previewOnly?:boolean;sortOrder?:number})=>({mediaType:item.mediaType,role:item.role??"GALLERY",storageKey:item.storageKey,publicUrl:item.publicUrl,mimeType:item.mimeType,width:item.width,height:item.height,previewOnly:item.previewOnly??true,sortOrder:item.sortOrder??0}))},generation:body.generation?{create:{provider:body.generation.provider,model:body.generation.model,prompt:body.generation.prompt,parameters:body.generation.parameters,seed:body.generation.seed,generatedAt:body.generation.generatedAt?new Date(body.generation.generatedAt):undefined}}:undefined},include:{translations:true}});
  return NextResponse.json({data},{status:201});
}
