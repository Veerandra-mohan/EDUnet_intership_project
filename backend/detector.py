from ultralytics import YOLO
import torch
import os

# Always use CPU in production for free-tier hosting (Render) compatibility
# If needed, you can override this flag using an environment variable
USE_GPU = os.environ.get("USE_GPU", "false").lower() == "true"
device = "cuda" if USE_GPU and torch.cuda.is_available() else "cpu"

# Load lightweight model for faster cloud inference
model = YOLO("yolov8n.pt").to(device)

def detect_image(image_path):
    # Run inference
    results = model(image_path)

    persons = 0
    phones = 0

    for box in results[0].boxes:
        cls = int(box.cls[0])
        label = results[0].names[cls]

        if label == "person":
            persons += 1
        if label == "cell phone":
            phones += 1

    return {
        "persons": persons,
        "phones": phones
    }

