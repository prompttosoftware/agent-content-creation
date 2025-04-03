import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

// Configure fluent-ffmpeg to find FFmpeg and FFprobe (adjust paths if needed)
// Ensure FFmpeg and FFprobe are installed and accessible in your system's PATH
//  or specify the paths here.  For example:
// ffmpeg.setFfmpegPath('/usr/bin/ffmpeg'); // Example on Linux/macOS
// ffmpeg.setFfprobePath('/usr/bin/ffprobe'); // Example on Linux/macOS

// Set FFmpeg path based on environment variable or default
let ffmpegPath = process.env.FFMPEG_PATH;

if (!ffmpegPath) {
    ffmpegPath = '/usr/bin/ffmpeg';
}

if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    console.log(`Using FFmpeg path: ${ffmpegPath}`);
} else {
    console.error('Error: Could not determine FFmpeg path. Please set FFMPEG_PATH environment variable or ensure /usr/bin/ffmpeg exists.');
    // Exit the script or handle the error as needed, e.g., by throwing an error.
    process.exit(1); // or throw new Error('FFmpeg path not found');
}

const createTestVideo = async () => {
    const uploadsDir = 'uploads';
    const filePath = path.join(uploadsDir, 'test_video.mp4');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Check if the file already exists (optional, but good practice)
    if (fs.existsSync(filePath)) {
        console.log('Test video already exists.  Skipping creation.');
        return;
    }

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input('color=c=blue:s=320x240:r=10') // Input: blue background, 320x240 resolution, 10fps
            .inputFormat('lavfi') // Specify input format as 'lavfi' (libavfilter virtual input)
            .duration(10) // Duration: 10 seconds
            .output(filePath)
            .videoCodec('libx264') // Video codec: H.264
            .outputOptions([
                '-pix_fmt yuv420p',  // Pixel format, necessary for broader compatibility.
                '-movflags +faststart' // Optimizes the video for streaming (optional but recommended)
            ])
            .complexFilter([
                // Overlay the title text
                {
                    filter: 'drawtext',
                    options: {
                        text: 'My Test Video',
                        x: '(w-text_w)/2', // Center horizontally
                        y: 'H/4', // Position at 1/4 of the video height
                        fontsize: 24,
                        fontcolor: 'white',
                        box: 1, // Enable a background box
                        boxcolor: 'black@0.5', // Semi-transparent black box
                        shadowcolor: 'black',
                        shadowx: 2,
                        shadowy: 2
                    },
                    inputs: '0:v', // Apply filter to the video stream (input 0, video stream)
                    outputs: 'title_overlay' // Name the output of this filter to apply subsequent filters
                },
                // Overlay additional text
                {
                    filter: 'drawtext',
                    options: {
                        text: 'Hello, fluent-ffmpeg!',
                        x: '(w-text_w)/2', // Center horizontally
                        y: '3*H/4', // Position at 3/4 of the video height
                        fontsize: 20,
                        fontcolor: 'yellow',
                        box: 1,
                        boxcolor: 'black@0.5',
                        shadowcolor: 'black',
                        shadowx: 2,
                        shadowy: 2
                    },
                    inputs: 'title_overlay', // Apply filter to the output of the previous filter
                    outputs: 'output_video'  //Rename output, but this is the final output so the name isn't strictly necessary
                }
            ])
            .on('start', (commandLine) => {
                console.log('Spawned FFmpeg with command: ' + commandLine);
            })
            .on('progress', (progress) => {
                console.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', () => {
                console.log(`Successfully created test video at ${filePath}`);
                resolve(); // Resolve the promise on success
            })
            .on('error', (err) => {
                console.error(`Error creating test video: ${err.message}`);
                reject(err); // Reject the promise on error
            })
            .run();
    });
};

createTestVideo().catch(console.error); // Handle the promise rejection at the top level