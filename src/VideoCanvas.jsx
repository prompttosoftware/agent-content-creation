// VideoCanvas.jsx
import React, { useRef, useEffect } from 'react';
import { createCanvas } from 'canvas';

const VideoCanvas = ({ width = 1920, height = 1080 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Create a canvas using node-canvas
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Optional:  Example drawing (fill with red) to demonstrate functionality
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, width, height);

      // Set the canvas element to the node-canvas created canvas
      //  Important: You'll need to set the canvasRef.current as an attribute
      //  of the canvas element, and also set the canvasRef.current equal
      //  to the canvas object that we created using createCanvas
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const canvasElement = canvasRef.current;
      const canvasDataURL = canvas.toDataURL();
      const img = new Image();
      img.src = canvasDataURL;
      img.onload = () => {
         ctx.drawImage(img, 0, 0);
      }
      // The canvas is now rendered.  You can now use the canvas and ctx
      // to draw your video frames, images, and other content.

    }
  }, [width, height]);


  return (
    <canvas ref={canvasRef} />
  );
};

export default VideoCanvas;