import React, { useState } from 'react';
import { generateLithophaneSTL } from './utils/LithophaneGenerator';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [stlUrl, setStlUrl] = useState(null);
  const [scale, setScale] = useState(0.75);
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [numLevels, setNumLevels] = useState(10);
  const [reductionFactor, setReductionFactor] = useState(0.15);
  const [status, setStatus] = useState("No image uploaded.");

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      alert('Please upload an image first.');
      return;
    }

    const stlString = await generateLithophaneSTL(
      imageFile,
      { scale, layerHeight, numLevels, reductionFactor },
      setStatus
    );

    const blob = new Blob([stlString], { type: 'application/sla' });
    const url = URL.createObjectURL(blob);
    setStlUrl(url);
  };

  const getSliderBackground = (value, min, max) => {
    const percent = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #9f2a24 0%, #9f2a24 ${percent}%, #eed9d8 ${percent}%, #eed9d8 100%)`,
    };
  };

  return (
    <div className="container">
      <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <h1 style={{ color: "#9f2a24" }}>Lithophane Generator⠀⠀⠀⠀⠀</h1>
        <p>Created by <a href="https://uijincho.github.io/" target="_blank" rel="noopener noreferrer">Uijin Cho</a></p>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br /><br />

        <div style={sliderStyle}><label>Scale: {scale.toFixed(2)}</label>
          <input className="slider" type="range" min="0.1" max="2" step="0.01"
            value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}
            style={getSliderBackground(scale, 0.1, 2)} />
        </div>

        <div style={sliderStyle}><label>Layer Height: {layerHeight.toFixed(2)}</label>
          <input className="slider" type="range" min="0.05" max="1" step="0.01"
            value={layerHeight} onChange={(e) => setLayerHeight(parseFloat(e.target.value))}
            style={getSliderBackground(layerHeight, 0.05, 1)} />
        </div>

        <div style={sliderStyle}><label>Number of Levels: {numLevels}</label>
          <input className="slider" type="range" min="2" max="50" step="1"
            value={numLevels} onChange={(e) => setNumLevels(parseInt(e.target.value))}
            style={getSliderBackground(numLevels, 2, 50)} />
        </div>

        <div style={sliderStyle}><label>Reduction Factor: {reductionFactor.toFixed(2)}</label>
          <input className="slider" type="range" min="0.01" max="0.5" step="0.01"
            value={reductionFactor} onChange={(e) => setReductionFactor(parseFloat(e.target.value))}
            style={getSliderBackground(reductionFactor, 0.01, 0.5)} />
        </div>

        <button onClick={handleGenerate} style={{ marginTop: '20px' }}>
          Generate Lithophane STL
        </button>

        <p style={{ marginTop: "1rem" }}><b>Status:</b> {status}</p>
        <p>
          Like the project? Check it out on <a href="https://github.com/uijincho/lithophane-js" target="_blank" rel="noopener noreferrer">Github</a>
        </p>
      </div>
    </div>
  );
}

const sliderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifyContent: "space-between",
};

export default App;
