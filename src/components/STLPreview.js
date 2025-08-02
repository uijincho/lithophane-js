// STLPreview.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useSTLLoader } from '@react-three/drei';

function Model({ url }) {
  const ref = useRef();
  const geometry = useSTLLoader(url);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#cccccc" metalness={0.2} roughness={0.5} />
    </mesh>
  );
}

export default function STLPreview({ url }) {
  if (!url) return null;

  return (
    <div style={{ height: '400px', border: '1px solid #ddd', marginTop: '20px' }}>
      <Canvas camera={{ position: [0, 0, 100] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model url={url} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
