import os
import base64
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load the environment variables from your .env file
load_dotenv()

# 2. Retrieve the key from the environment
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")

# 3. Initialize the Gemini client
client = genai.Client(api_key=api_key)


def analyze_image(image_data: str, prompt: str = "Analyze this image"):
    # Extract mime type and base64 string if it contains data URL prefix
    if "," in image_data:
        header, base64_str = image_data.split(",", 1)
        mime_type = header.split(";")[0].replace("data:", "")
    else:
        base64_str = image_data
        mime_type = "image/jpeg"

    # Decode base64 image data
    image_bytes = base64.b64decode(base64_str)

    # Call the Gemini Vision API
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            prompt,
        ]
    )
    
    return response.text