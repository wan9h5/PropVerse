"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

function Model({src}:{src:string}){
  const {scene}=useGLTF(src);
  const clone=scene.clone();
  const bounds=new Box3().setFromObject(clone);
  const center=bounds.getCenter(new Vector3());
  const size=bounds.getSize(new Vector3());
  const scale=2.5/Math.max(size.x,size.y,size.z,1);
  clone.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
  clone.scale.setScalar(scale);
  return <primitive object={clone}/>;
}
export function ModelViewer({src}:{src:string}){
  return <div style={{width:"100%",height:"100%",minHeight:420}}>
    <Canvas camera={{position:[3,2.2,3],fov:42}} dpr={[1,1.5]}>
      <ambientLight intensity={1.1}/><directionalLight position={[4,6,4]} intensity={2}/>
      <Suspense fallback={null}><Model src={src}/><Environment preset="studio"/></Suspense>
      <OrbitControls enablePan={false} minDistance={2} maxDistance={7}/>
    </Canvas>
  </div>;
}
