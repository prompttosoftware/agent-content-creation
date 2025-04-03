import fs from 'fs';
import path from 'path';

const createTestVideo = async () => {
    const filePath = path.join('uploads', 'test_video.mp4');
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        console.log('Test video already exists.');
        return;
    }

    const buffer = Buffer.from(
        '\x00\x00\x00\x20ftypmp42\x00\x00\x00\x00mp42isomiso2avc1mp41\x00\x00\x00\x00\x00\x00\x00\x00wide' // Minimal MP4 header
    );

    fs.writeFileSync(filePath, buffer);
    console.log(`Test video created at ${filePath}`);
};

createTestVideo().catch(console.error);
