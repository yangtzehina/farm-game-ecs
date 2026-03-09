import json
import requests
import base64
import os

# SD WebUI API地址
SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"

# 读取Prompt配置
with open("cards_prompts.json", "r", encoding="utf-8") as f:
    cards = json.load(f)

# 负向Prompt
NEGATIVE_PROMPT = "text, watermark, border, frame, ugly, blurry, low resolution, normal, non-horror, happy, cute, bright, colorful, human, cartoon, anime"

for card_id, card_info in cards.items():
    print(f"Generating {card_id}: {card_info['name']}...")
    
    payload = {
        "prompt": card_info["prompt"],
        "negative_prompt": NEGATIVE_PROMPT,
        "width": 100,
        "height": 140,
        "steps": 28,
        "cfg_scale": 7,
        "sampler_name": "DPM++ 2M Karras",
        "override_settings": {
            "transparent_background": True
        },
        "override_settings_restore_afterwards": True
    }
    
    try:
        response = requests.post(SD_API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            image_data = base64.b64decode(result["images"][0])
            with open(card_info["filename"], "wb") as f:
                f.write(image_data)
            print(f"Successfully saved {card_info['filename']}")
        else:
            print(f"Failed to generate {card_id}: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Error generating {card_id}: {e}")

print("All images generated!")
