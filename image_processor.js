// Import necessary modules
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs'); // Import fs for file operations (error handling)

// Input image file name
const inputImage = 'agent1_image.png';

// Output image file name
const outputImage = 'output.png';

// Log the input and output file names before processing
console.log(`Processing image: ${inputImage} -> ${outputImage}`);

// Check if the input image exists
if (!fs.existsSync(inputImage)) {
    console.error(`Error: Input image file \"${inputImage}\" not found.`);
    process.exit(1); // Exit the script with an error code
}


// Create a fluent-ffmpeg command
const command = ffmpeg(inputImage)
  .on('start', function(commandLine) {
      console.log('Spawned FFMPEG with command: ' + commandLine);
  })
  .on('error', function(err) {
    console.error('An error occurred while processing the image:');
    console.error('Error message: ' + err.message);
    console.error('Error details:', err); // Log the entire error object for detailed debugging
    // Consider removing the output file if an error occurred during processing to prevent incomplete or corrupted files.
    fs.unlink(outputImage, (unlinkErr) => {
      if (unlinkErr) {
          console.error('Error deleting incomplete output file:', unlinkErr);
      } else {
          console.log('Incomplete output file deleted.');
      }
      process.exit(1); // Exit the script with an error code after error handling
  });
  })
  .on('end', function() {
    console.log('Processing finished successfully!');
  })
  // Scale the image to half its original size and add text overlay
  .outputOptions([
    '-vf', "scale=iw*0.5:ih*0.5[agent1_img]; [agent1_img]drawtext=text='Agent 1: Hello':x=10:y=10:fontsize=24:fontcolor=white"
  ])


  // Output the processed image
  .save(outputImage);