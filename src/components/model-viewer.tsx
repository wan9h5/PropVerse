"use client";
import dynamic from "next/dynamic";
const ModelCanvas=dynamic(()=>import("./model-canvas"),{ssr:false,loading:()=> <div className="eyebrow">LOADING 3D PREVIEW…</div>});
export function ModelViewer({src}:{src:string}){
  return <div style={{width:"100%",height:"100%",minHeight:420}}><ModelCanvas src={src}/></div>;
}
