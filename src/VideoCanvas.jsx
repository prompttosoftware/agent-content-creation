import React, { useEffect, useRef } from 'react';

function VideoCanvas({ videoWidth, videoHeight, agentContent }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = videoWidth;
    const height = videoHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    if (agentContent) {
      agentContent.forEach(content => {
        if (content.type === 'text') {
          ctx.font = '16px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(content.value, 10, 25);
        } else if (content.type === 'image' && content.imageUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
          };
          img.onerror = () => {
            console.error('Error loading image:', content.imageUrl);
          };
          img.src = content.imageUrl;
        }
      });
    }
  }, [videoWidth, videoHeight, agentContent]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      style={{ width: `${videoWidth}px`, height: `${videoHeight}px` }}
      role="canvas"
    />
  );
}

export default VideoCanvas;
