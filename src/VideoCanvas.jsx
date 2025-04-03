// VideoCanvas.jsx
import React, { useRef, useEffect } from 'react';
import { createCanvas, loadImage } from 'canvas';

const VideoCanvas = ({ width = 1920, height = 1080, agentContent, videoWidth, videoHeight }) => {
  const canvasRef = useRef(null);
  const gridWidth = videoWidth;
  const gridHeight = videoHeight;
  const horizontalPadding = 20; // Padding on the sides of the text/image
  const verticalPadding = 20;   // Padding above and below the text/image
  const textFont = 'Arial';
  const fontSize = 24;

  useEffect(() => {
    if (!canvasRef.current || !agentContent) {
      return;
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);


    if (agentContent) {
      const drawContent = async () => {
        for (const content of agentContent) {
          const x = horizontalPadding; // Left padding
          let y = verticalPadding;      // Top padding, will be updated as content is rendered

          if (content.text) {
            ctx.font = `${fontSize}px ${textFont}`;
            ctx.fillStyle = 'white'; // Set text color

            const maxWidth = gridWidth - 2 * horizontalPadding;
            const lineHeight = fontSize * 1.2; // Adjust line height for spacing
            let currentLine = '';

            const words = content.text.split(' ');

            for (const word of words) {
              const testLine = currentLine + word + ' ';
              const metrics = ctx.measureText(testLine);

              if (metrics.width > maxWidth) {
                ctx.fillText(currentLine, x, y);
                y += lineHeight;
                currentLine = word + ' ';
              } else {
                currentLine = testLine;
              }
            }
            // Draw the last line
            ctx.fillText(currentLine, x, y);
            y += lineHeight; // Update y for subsequent content
          }


          if (content.imageUrl) {
            try {
              const image = await loadImage(content.imageUrl);
              const aspectRatio = image.width / image.height;

              let drawWidth = gridWidth - 2 * horizontalPadding; // Maximum width available
              let drawHeight = drawWidth / aspectRatio;

              // If the calculated height exceeds the remaining space, adjust width
              if (y + drawHeight + verticalPadding > gridHeight) {
                  drawHeight = gridHeight - y - verticalPadding;
                  drawWidth = drawHeight * aspectRatio;
              }

              ctx.drawImage(
                  image,
                  x,
                  y,
                  drawWidth,
                  drawHeight
              );

              y += drawHeight + verticalPadding;  // Update y after image, adding padding
            } catch (error) {
              console.error("Error loading or drawing image:", error);
            }
          }
        }
      };

      drawContent();

    }

    // Update the canvas element to the node-canvas created canvas
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const canvasDataURL = canvas.toDataURL();
    const img = new Image();
    img.src = canvasDataURL;
    img.onload = () => {
      const canvasElement = canvasRef.current;
      const ctx = canvasElement.getContext('2d');
      ctx.clearRect(0, 0, width, height); // Clear the canvas before redrawing
      ctx.drawImage(img, 0, 0);
    }

  }, [width, height, agentContent, gridWidth, gridHeight]);


  return (
    <canvas ref={canvasRef} style={{ width: videoWidth, height: videoHeight }}/>
  );
};

export default VideoCanvas;