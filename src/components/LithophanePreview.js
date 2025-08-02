import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';

const LithophanePreview = ({ stlString }) => {
  const mountRef = useRef();

  useEffect(() => {
    if (!stlString) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 10).normalize();
    scene.add(directionalLight);

    // Convert STL string to Blob URL
    const blob = new Blob([stlString], { type: 'application/sla' });
    const url = URL.createObjectURL(blob);

    const loader = new STLLoader();
    loader.load(url, geometry => {
      const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      const animate = function () {
        requestAnimationFrame(animate);
        mesh.rotation.z += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [stlString]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default LithophanePreview;
