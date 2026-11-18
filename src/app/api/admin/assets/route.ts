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
  const data=await prisma.asset.create({data:{slug:body.slug,categoryId:category.id,subcategory:body.subcategory??null,regionCode:body.regionCode??null,status:"DRAFT",translations:{create:(body.translations??[]).map((item:{locale:string;name:string;description?:string;visualDescription?:string;prompt?:string;aliases?:string[];searchTerms?:string[]})=>({locale:item.locale,name:item.name,description:item.description,visualDescription:item.visualDescription,prompt:item.prompt,aliases:item.aliases??[],searchTerms:item.searchTerms??[]}))}},include:{translations:true}});
  return NextResponse.json({data},{status:201});
}
