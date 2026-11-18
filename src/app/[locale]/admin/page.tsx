"use client";
import { useState } from "react";
import Link from "next/link";

type AssetRow={id:string;slug:string;status:string;category:{slug:string};translations:{locale:string;name:string}[]};
export default function AdminPage(){
  const [token,setToken]=useState("");
  const [assets,setAssets]=useState<AssetRow[]>([]);
  const [message,setMessage]=useState("");
  const [slug,setSlug]=useState("");
  const [name,setName]=useState("");
  const [category,setCategory]=useState("objects");
  async function load(){
    const response=await fetch("/api/admin/assets",{headers:{Authorization:"Bearer "+token}});
    const body=await response.json();
    if(!response.ok){setMessage(body.error??"Request failed");return;}
    setAssets(body.data);setMessage("Loaded "+body.data.length+" assets");
  }
  async function create(){
    const response=await fetch("/api/admin/assets",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({slug,categorySlug:category,translations:[{locale:"zh-CN",name}]})});
    const body=await response.json();
    if(!response.ok){setMessage(body.error??"Create failed");return;}
    setMessage("Draft created: "+body.data.slug);setSlug("");setName("");await load();
  }
  async function publish(id:string){
    const response=await fetch("/api/admin/assets/"+id,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({status:"PUBLISHED"})});
    setMessage(response.ok?"Asset published":"Publish failed");
    await load();
  }
  return <main className="library-shell">
    <header className="site-header"><Link href="/zh-CN" className="wordmark"><span className="wordmark-mark">p.</span><span>propverse<span className="wordmark-dot">.</span></span></Link><span className="eyebrow">CONTENT ADMINISTRATION</span></header>
    <div style={{maxWidth:900,margin:"55px auto",padding:"0 20px"}}>
      <span className="eyebrow">PHASE 1 / CONTENT OPERATIONS</span><h1 style={{font:"500 42px 'Playfair Display'",margin:"12px 0"}}>Asset Registry</h1>
      <p style={{color:"var(--muted)",lineHeight:1.8,fontSize:13}}>管理物料草稿、分类和发布状态。请使用 Vercel 环境变量 ADMIN_API_TOKEN。Token 仅保留在当前页面内存中。</p>
      <div className="prompt-box"><label className="eyebrow">ADMIN API TOKEN</label><input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Enter ADMIN_API_TOKEN" style={{display:"block",width:"100%",padding:12,margin:"8px 0",border:"1px solid var(--line)",background:"white"}}/><button className="copy-button" onClick={load}>LOAD ASSETS</button><span style={{marginLeft:12,fontSize:11,color:"var(--muted)"}}>{message}</span></div>
      <h2 style={{font:"500 25px 'Playfair Display'",marginTop:35}}>Create draft asset</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8}}>
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="asset-slug" style={{padding:11,border:"1px solid var(--line)",minWidth:0}}/>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="简体中文名称" style={{padding:11,border:"1px solid var(--line)",minWidth:0}}/>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:11,border:"1px solid var(--line)"}}><option value="objects">物品</option><option value="architecture">建筑</option><option value="culture">文化</option><option value="landscapes">地貌</option><option value="special">特殊</option></select>
        <button className="copy-button" onClick={create}>CREATE</button>
      </div>
      <h2 style={{font:"500 25px 'Playfair Display'",marginTop:38}}>Assets ({assets.length})</h2>
      <div style={{borderTop:"1px solid var(--line)"}}>{assets.map(asset=><div key={asset.id} style={{display:"flex",justifyContent:"space-between",gap:12,padding:"14px 4px",borderBottom:"1px solid var(--line)",fontSize:12}}><span><strong>{asset.translations[0]?.name??asset.slug}</strong><span style={{color:"var(--muted)",marginLeft:10}}>{asset.category.slug} · {asset.status}</span></span>{asset.status!=="PUBLISHED"&&<button className="copy-button" onClick={()=>publish(asset.id)}>PUBLISH</button>}</div>)}</div>
    </div>
  </main>;
}
