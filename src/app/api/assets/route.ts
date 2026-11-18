import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request:NextRequest){
  const params=request.nextUrl.searchParams;
  const category=params.get("category");
  const locale=params.get("locale")??"en";
  const q=params.get("q")?.trim();
  const assets=await prisma.asset.findMany({
    where:{status:"PUBLISHED",...(category?{category:{slug:category}}:{})},
    include:{translations:{where:{locale}},media:{where:{role:"COVER"},take:1},category:true},
    orderBy:[{featured:"desc"},{sortOrder:"asc"}],
    take:Math.min(Number(params.get("limit")??60),100)
  });
  const data=q?assets.filter((asset)=>{const tr=asset.translations[0];return tr?.name.toLowerCase().includes(q.toLowerCase())||JSON.stringify(tr?.searchTerms??[]).toLowerCase().includes(q.toLowerCase());}):assets;
  return NextResponse.json({data});
}
