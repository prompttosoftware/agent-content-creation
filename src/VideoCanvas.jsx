import React, { useEffect, useRef } from 'react';

// Constants for text positioning
const TEXT_X = 10;
const TEXT_Y = 25;
const DEFAULT_FONT = '16px Arial';
const DEFAULT_TEXT_COLOR = 'white';

/**
 * Renders a video canvas with optional text and image overlays.
 *
 * @param {object} props - Component props.
 * @param {number} props.videoWidth - The width of the video canvas.
 * @param {number} props.videoHeight - The height of the video canvas.
 * @param {object[]} props.agentContent - An array of content objects to overlay on the video.
 * @returns {JSX.Element} The video canvas element.
 */
function VideoCanvas({
  videoWidth,
  videoHeight,
  agentContent,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas exists
    const ctx = canvas.getContext('2d');
    if (!ctx) return;  // Ensure context exists
    const width = videoWidth;
    const height = videoHeight;

    // Clear the canvas at the beginning of each render
    ctx.clearRect(0, 0, width, height);

    if (agentContent && Array.isArray(agentContent)) {
      agentContent.forEach(content => {
        if (!content) return; // Skip null or undefined content
        if (content.type === 'text') {
          // Render text
          ctx.font = content.font || DEFAULT_FONT; // Use a custom font or the default
          ctx.fillStyle = content.color || DEFAULT_TEXT_COLOR; // Use a custom color, or the default.
          ctx.fillText(content.value, content.x || TEXT_X, content.y || TEXT_Y); // Use custom coordinates or the default.
        } else if (content.type === 'image' && content.imageUrl) {
          // Render Image
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
          };
          img.onerror = () => {
            console.error('Error loading image:', content.imageUrl);
            // Display an error message on the canvas
            ctx.font = '12px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText('Error loading image', 10, 25); // Or use a more user-friendly display.
          };
          img.src = content.imageUrl;
        }
      });
    }
  }, [videoWidth, videoHeight, agentContent]); // Dependencies of the useEffect hook

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
