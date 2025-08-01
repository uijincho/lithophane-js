import React, { useState } from 'react';
import { generateLithophaneSTL } from './utils/LithophaneGenerator';

function App() {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleGenerate = () => {
    if (imageFile) {
      generateLithophaneSTL(imageFile, {
        scale: 0.5,
        layerHeight: 0.2,
        numLevels: 10,
        reductionFactor: 0.2,
      });
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Lithophane Generator</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleGenerate} style={{ marginTop: '10px' }}>
        Generate Lithophane STL
      </button>
    </div>
  );
}

export default App;
