import React, { useState } from 'react';
import { generateLithophaneSTL } from './utils/LithophaneGenerator';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // Slider states
  const [scale, setScale] = useState(0.75);
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [numLevels, setNumLevels] = useState(10);
  const [reductionFactor, setReductionFactor] = useState(0.15);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleGenerate = () => {
    if (imageFile) {
      generateLithophaneSTL(imageFile, {
        scale,
        layerHeight,
        numLevels,
        reductionFactor,
      });
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Lithophane Generator</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />

      {/* Preview Section */}
      {previewURL && (
        <div>
          <h3>Preview:</h3>
          <img
            src={previewURL}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '20px' }}
          />
        </div>
      )}

      {/* Sliders */}
      <div>
        <label>Scale: {scale.toFixed(2)}</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Layer Height: {layerHeight.toFixed(2)}</label>
        <input
          type="range"
          min="0.05"
          max="1"
          step="0.01"
          value={layerHeight}
          onChange={(e) => setLayerHeight(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Number of Levels: {numLevels}</label>
        <input
          type="range"
          min="2"
          max="50"
          step="1"
          value={numLevels}
          onChange={(e) => setNumLevels(parseInt(e.target.value))}
        />
      </div>

      <div>
        <label>Reduction Factor: {reductionFactor.toFixed(2)}</label>
        <input
          type="range"
          min="0.01"
          max=".5"
          step="0.01"
          value={reductionFactor}
          onChange={(e) => setReductionFactor(parseFloat(e.target.value))}
        />
      </div>

      <button onClick={handleGenerate} style={{ marginTop: '20px' }}>
        Generate Lithophane STL
      </button>
    </div>
  );
}

export default App;
