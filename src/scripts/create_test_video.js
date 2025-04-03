const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const { PNG } = require('pngjs'); // Import the PNG constructor directly

// **Modified:** Define the input frames.  Now uses pngjs to create a valid PNG.
async function createDummyFrame(frameWidth, frameHeight) {
    return new Promise((resolve, reject) => {
        const png = new PNG({
            width: frameWidth,
            height: frameHeight,
            bitDepth: 8, // Standard 8-bit depth
            colorType: 6, // RGBA
        });

        // Fill with a white background (RGBA)
        for (let y = 0; y < png.height; y++) {
            for (let x = 0; x < png.width; x++) {
                const idx = ((png.width * y + x) << 2);
                png.data[idx] = 255;   // Red
                png.data[idx + 1] = 255; // Green
                png.data[idx + 2] = 255; // Blue
                png.data[idx + 3] = 255; // Alpha
            }
        }

        png.pack((err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}



async function createTestVideo() {
    const frameWidth = 1280;
    const frameHeight = 720;
    const framePath = path.join(__dirname, 'frame.png');
    const outputPath = path.join(__dirname, 'test.mp4');

    try {
        // Generate a valid PNG frame using pngjs.
        const frameData = await createDummyFrame(frameWidth, frameHeight);

        fs.writeFile(framePath, frameData, (err) => {
            if (err) {
                console.error('Error writing PNG:', err);
                return;
            }
            // **Modified:** Use the frame file as input, and specify the format as 'image2' and the framerate.

            ffmpeg.setFfmpegPath(ffmpegStatic);

            const command = ffmpeg(framePath)
                .inputFormat('image2') // Important:  Specify the input format.
                .inputOptions([
                    '-framerate', '1'  // Set the frame rate.  Important for single image input.
                ])
                .videoCodec('libx264')
                .size(`${frameWidth}x${frameHeight}`)
                .format('mp4')
                .output(outputPath);

            command.on('start', (commandLine) => {
                console.log('Spawned FFMPEG with command: ' + commandLine);
            });

            command.on('end', () => {
                console.log(`Video created successfully at ${outputPath}`);
                fs.unlinkSync(framePath);
            });

            command.on('error', (err) => {
                console.error('Error creating video:', err);
            });

            command.run();
        });
    } catch (error) {
        console.error('Error creating frame:', error);
    }
}

createTestVideo();