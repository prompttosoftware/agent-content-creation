import subprocess
import os
import sys
from PIL import Image  # Import PIL for image creation

def create_single_frame_video(image1_path, image2_path, output_path, title="Agent Content Creation", resolution="1280x720"):
    """
    Generates a single-frame video from two input images with overlay and title.

    Args:
        image1_path (str): Path to the first image.
        image2_path (str): Path to the second image (overlay).
        output_path (str): Path to the output video file (e.g., output.mp4).
        title (str): Title to add at the top of the video.
        resolution (str): Resolution of the video (e.g., "1280x720").
    """

    try:
        # 1. Input Validation and Preparation
        if not os.path.exists(image1_path):
            raise FileNotFoundError(f"Error: Image 1 not found: {image1_path}")
        if not os.path.exists(image2_path):
            raise FileNotFoundError(f"Error: Image 2 not found: {image2_path}")

        # 2. FFmpeg Command Construction
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"  #  Replace with the actual path
        if not os.path.exists(font_path):
            print(f"Error: Font file not found at: {font_path}")
            raise FileNotFoundError(f"Font file not found: {font_path}")
        
        # Split the resolution into width and height
        width, height = resolution.split("x")

        ffmpeg_cmd = [
            "ffmpeg",
            "-y",  # Overwrite output file if it exists
            "-hide_banner",  # Suppress FFmpeg banner
            "-loglevel", "error", # Reduce console output
            "-loop", "1",  # Loop the images indefinitely (for a single frame)
            "-i", image1_path,
            "-loop", "1",
            "-i", image2_path,
            "-filter_complex",
            f"[0:v]scale={resolution}[scaled1];"  # Scale the first image
            f"[1:v]scale={resolution}[scaled2];"  # Scale the second image
            f"[scaled1][scaled2]overlay=0:0[merged];" # Overlay scaled2 on scaled1
            f"[merged]drawtext=text='{title}':fontfile='{font_path}':fontsize=30:fontcolor=white:x=(w-text_w)/2:y=10[titled]",
            "-map", "[titled]",  # Map the video stream with the title
            "-t", "1",  # Duration of 1 second (single frame)
            output_path
        ]

        # 3. FFmpeg Execution
        print("Running FFmpeg...")
        process = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        return_code = process.returncode

        # 4. Error Handling
        if return_code != 0:
            print(f"FFmpeg failed with error code: {return_code}")
            print("Standard Output:")
            print(stdout.decode())
            print("Standard Error:")
            print(stderr.decode())
            raise OSError(f"FFmpeg execution failed")
        else:
            print("FFmpeg completed successfully.")

        print(f"Video created successfully at: {output_path}")

    except FileNotFoundError as e:
        print(e)
        return False
    except OSError as e:
        print(e)
        return False
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return False

    return True


if __name__ == "__main__":
    # Example Usage:
    # Replace with your image paths and desired output path
    image1 = "image1.png"  # Replace with your image file
    image2 = "image2.jpg"   # Replace with your image file
    output_video = "output.mp4"

    # Create dummy images for testing if they don't exist
    if not os.path.exists(image1):
        print(f"Creating dummy image for testing: {image1}")
        img = Image.new('RGB', (640, 480), color='red') # Create a smaller image for fast testing.
        img.save(image1)
    if not os.path.exists(image2):
        print(f"Creating dummy image for testing: {image2}")
        img = Image.new('RGB', (640, 480), color='blue')  # Create a smaller image for fast testing.
        img.save(image2)

    success = create_single_frame_video(image1, image2, output_video)

    if success:
        print("Script completed successfully.")
    else:
        print("Script encountered an error.")