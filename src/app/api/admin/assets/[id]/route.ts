import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
function authorized(request:NextRequest){const token=process.env.ADMIN_API_TOKEN;return Boolean(token&&request.headers.get("authorization")===`Bearer ${token}`);}
export async function PATCH(request:NextRequest,context:{params:Promise<{id:string}>}){
  if(!authorized(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await context.params;
  const body=await request.json();
  const data:Record<string,unknown>={};
  for(const key of ["slug","subcategory","regionCode","featured","sortOrder"] as const)if(body[key]!==undefined)data[key]=body[key];
  if(body.status!==undefined){if(!["DRAFT","REVIEW","PUBLISHED","ARCHIVED"].includes(body.status))return NextResponse.json({error:"Invalid status"},{status:400});data.status=body.status;if(body.status==="PUBLISHED")data.publishedAt=new Date();}
  return NextResponse.json({data:await prisma.asset.update({where:{id},data})});
}
export async function DELETE(request:NextRequest,context:{params:Promise<{id:string}>}){
  if(!authorized(request))return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await context.params;
  await prisma.asset.delete({where:{id}});
  return NextResponse.json({success:true});
}
