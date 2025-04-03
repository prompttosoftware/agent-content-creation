// src/scripts/create_test_video.js

const fs = require('fs');
const cp = require('child_process');
const path = require('path'); // Import the path module

// **Modified:** Use absolute path for FFmpeg.  Assume it's in the typical location.  **Important:**  This *must* be the correct path on the system.  If it's not, the script will fail.
const ffmpegPath = '/usr/bin/ffmpeg';

// Function to create a test video
async function createTestVideo(outputFile, options = {}) {
  const { width = 640, height = 480, duration = 5, framerate = 30, backgroundColor = 'red' } = options;

  return new Promise((resolve, reject) => {
    // Define the FFmpeg command arguments
    const args = [
      '-y', // Overwrite output file if it exists
      '-f', 'lavfi', // Use libavfilter for input
      '-i', `color=c=${backgroundColor}:s=${width}x${height}:r=${framerate}`, // Use color source as input
      '-t', duration.toString(), // Set duration in seconds
      '-pix_fmt', 'yuv420p', // Pixel format (important for compatibility)
      outputFile, // Output file path
    ];

    // Execute the FFmpeg command
    const ffmpegProcess = cp.spawn(ffmpegPath, args);

    // Handle process output
    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully created test video: ${outputFile}`);
        resolve(outputFile); // Resolve with the output file path
      } else {
        console.error(`FFmpeg process exited with code ${code}`);
        reject(new Error(`FFmpeg failed with code ${code}`));
      }
    });

    ffmpegProcess.on('error', (err) => {
      console.error(`Failed to start FFmpeg process: ${err}`);
      reject(err);
    });
  });
}

// Example Usage (uncomment to test)
async function runExample() {
  const outputFile = path.join(__dirname, 'test_video.mp4'); // Use path.join for cross-platform compatibility
  try {
    const createdVideoPath = await createTestVideo(outputFile, { duration: 5, backgroundColor: 'blue' }); // Example: 5 seconds, blue background
    console.log(`Test video created successfully: ${createdVideoPath}`);
  } catch (error) {
    console.error(`Error creating test video: ${error}`);
  }
}

runExample(); // Call the example function to run the script


module.exports = createTestVideo;