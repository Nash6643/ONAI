import base64
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_image(image_data: str, prompt: str):

    # Remove Base64 prefix
    if "," in image_data:
        image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            prompt,
            {
                "mime_type": "image/jpeg",
                "data": image_bytes,
            },
        ],
    )

    return response.text