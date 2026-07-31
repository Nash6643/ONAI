import os
import base64
import google.generativeai as genai

def analyze_image(image_base64: str, prompt: str = "Describe this image"):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment variables.")

    genai.configure(api_key=api_key)

    # Use the supported model identifier
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Strip data URI prefix if present (e.g., 'data:image/jpeg;base64,')
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    image_data = base64.b64decode(image_base64)

    image_part = {
        "mime_type": "image/jpeg",
        "data": image_data
    }

    response = model.generate_content([prompt, image_part])
    return response.text