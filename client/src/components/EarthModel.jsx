import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

function Earth() {
  const { scene } = useGLTF('/earth/scene.gltf');
  return <primitive object={scene} scale={0.015} />;
}

export default function EarthModel() {
  return (
    <div className="w-full flex justify-center items-center bg-white rounded-2xl shadow-lg" style={{ minHeight: 300, height: '40vh', maxHeight: 400 }}>
      <Canvas camera={{ position: [2, 2, 4], fov: 45 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Stage environment={null} intensity={0.6} contactShadow={{ opacity: 0.3, blur: 2 }}>
            <Earth />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
} 