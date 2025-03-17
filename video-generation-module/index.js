// video-generation-module/index.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const backendApiUrl = 'http://localhost:3000'; // Assuming backend runs on port 3000

// Function to fetch agent data from the backend
const getAgentData = async () => {
  try {
    console.log(`[${new Date().toISOString()}] [INFO] Fetching agent data from ${backendApiUrl}/agent`);
    const response = await axios.get(`${backendApiUrl}/agent`);
    console.log(`[${new Date().toISOString()}] [INFO] Received agent data`);
    return response.data;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [ERROR] Failed to fetch agent data:`, error);
    throw new Error(`Failed to fetch agent data: ${error.message}`); // Re-throw to be caught by the caller
  }
};

// Simulate video generation (replace with actual video generation logic)
const generateVideo = async (agentData) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate video creation by writing a dummy file
      const videoFilePath = path.join(__dirname, '../output.mp4'); // Output to root
      const videoContent = `Agent Name: ${agentData.name}\nScript: ${agentData.script}`;

      fs.writeFile(videoFilePath, videoContent, (err) => {
        if (err) {
          console.error(`[${new Date().toISOString()}] [ERROR] Failed to write video file:`, err);
          reject(new Error(`Failed to write video file: ${err.message}`));
          return;
        }
        console.log(`[${new Date().toISOString()}] [INFO] Dummy video generated at ${videoFilePath}`);
        resolve(videoFilePath);
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [ERROR] An error occurred during video generation:`, error);
      reject(new Error(`An error occurred during video generation: ${error.message}`));
    }
  });
};

// Function to trigger YouTube upload (placeholder)
const uploadToYouTube = async (videoFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`[${new Date().toISOString()}] [INFO] Triggering YouTube upload for ${videoFilePath}`);
      // Simulate upload process
      setTimeout(() => {
        console.log(`[${new Date().toISOString()}] [INFO] YouTube upload complete.`);
        resolve();
      }, 2000); // Simulate upload time
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [ERROR] An error occurred during YouTube upload:`, error);
      reject(new Error(`An error occurred during YouTube upload: ${error.message}`));
    }
  });
};

async function main() {
  try {
    console.log(`[${new Date().toISOString()}] [INFO] Starting video generation process...`);
    const agentData = await getAgentData();
    console.log(`[${new Date().toISOString()}] [INFO] Agent data:`, agentData);

    console.log(`[${new Date().toISOString()}] [INFO] Generating video...`);
    const videoFilePath = await generateVideo(agentData);

    console.log(`[${new Date().toISOString()}] [INFO] Uploading to YouTube...`);
    await uploadToYouTube(videoFilePath);
    console.log(`[${new Date().toISOString()}] [INFO] Video generation and upload complete.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [ERROR] Video generation or upload failed:`, error);
  }
}

main();
