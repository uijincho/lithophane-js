import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

export async function generateLithophaneSTL(image, params = {}) {
  const {
    scale = 0.5,
    layerHeight = 0.2,
    numLevels = 10,
    reductionFactor = 0.2
  } = params;

  const img = await loadImage(image);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width * reductionFactor;
  canvas.height = img.height * reductionFactor;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const baseThickness = layerHeight;
  const discreteHeights = Array.from({ length: numLevels }, (_, i) => baseThickness + i * layerHeight);
  const heightMap = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      gray = 1.0 - (gray / 255.0);
      const level = Math.min(numLevels - 1, Math.floor(gray * numLevels));
      row.push(discreteHeights[level]);
    }
    heightMap.push(row);
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const z00 = heightMap[y][x];
      const z01 = heightMap[y][x + 1];
      const z11 = heightMap[y + 1][x + 1];
      const z10 = heightMap[y + 1][x];

      const v00 = new THREE.Vector3(x * scale, y * scale, z00);
      const v01 = new THREE.Vector3((x + 1) * scale, y * scale, z01);
      const v11 = new THREE.Vector3((x + 1) * scale, (y + 1) * scale, z11);
      const v10 = new THREE.Vector3(x * scale, (y + 1) * scale, z10);

      const baseZ = baseThickness;
      const b00 = new THREE.Vector3(v00.x, v00.y, baseZ);
      const b01 = new THREE.Vector3(v01.x, v01.y, baseZ);
      const b11 = new THREE.Vector3(v11.x, v11.y, baseZ);
      const b10 = new THREE.Vector3(v10.x, v10.y, baseZ);

      pushQuad(vertices, indices, [v00, v01, v11, v10]);       // Top
      pushQuad(vertices, indices, [b00, b01, b11, b10], true); // Bottom
      pushQuad(vertices, indices, [v00, v01, b01, b00]);
      pushQuad(vertices, indices, [v01, v11, b11, b01]);
      pushQuad(vertices, indices, [v11, v10, b10, b11]);
      pushQuad(vertices, indices, [v10, v00, b00, b10]);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flatMap(v => [v.x, v.y, v.z]), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  const exporter = new STLExporter();
  const stlString = exporter.parse(mesh);

  const inputName = image.name ? image.name.replace(/\.[^/.]+$/, '') : 'lithophane';
  const fileName = (params.outputName || `${inputName}-lithophane.stl`);
  downloadSTL(stlString, fileName);
}

function pushQuad(vertices, indices, quad, flip = false) {
  const startIdx = vertices.length;
  vertices.push(...quad);
  if (flip) {
    indices.push(startIdx + 2, startIdx + 1, startIdx + 0);
    indices.push(startIdx + 3, startIdx + 2, startIdx + 0);
  } else {
    indices.push(startIdx + 0, startIdx + 1, startIdx + 2);
    indices.push(startIdx + 0, startIdx + 2, startIdx + 3);
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function downloadSTL(stlString, fileName) {
  const blob = new Blob([stlString], { type: 'application/sla' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  return stlString;
}
