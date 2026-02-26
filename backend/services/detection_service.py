import os
import torch
from ultralytics import YOLO

USE_GPU = os.environ.get("USE_GPU", "false").lower() == "true"
device = "cuda" if USE_GPU and torch.cuda.is_available() else "cpu"

# Load lightweight model for faster cloud inference
model = YOLO("yolov8n.pt").to(device)

def calculate_iou(box1, box2):
    """Calculate Intersection over Union (IoU) of two bounding boxes."""
    x1, y1, x2, y2 = box1
    x3, y3, x4, y4 = box2
    
    x_left = max(x1, x3)
    y_top = max(y1, y3)
    x_right = min(x2, x4)
    y_bottom = min(y2, y4)
    
    if x_right < x_left or y_bottom < y_top:
        return 0.0
        
    intersection_area = (x_right - x_left) * (y_bottom - y_top)
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x4 - x3) * (y4 - y3)
    
    iou = intersection_area / float(box1_area + box2_area - intersection_area)
    return iou

def check_overlap(item_box, person_box):
    """Check if item_box is inside or heavily overlaps with person_box."""
    # A simple overlap check: if the item center is inside the person box
    x1, y1, x2, y2 = item_box
    px1, py1, px2, py2 = person_box
    
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2
    
    if px1 <= cx <= px2 and py1 <= cy <= py2:
        return True
    return False

def extract_scene_data(image_path):
    # Run inference
    results = model(image_path)
    
    # We will structure people and global detections
    people = []
    items_detected = {"phones_detected": 0, "helmets_detected": 0, "safety_vests_detected": 0, "masks_detected": 0}
    
    person_boxes = []
    item_boxes = [] # (label, box)
    
    for box in results[0].boxes:
        cls = int(box.cls[0])
        label = results[0].names[cls]
        coords = box.xyxy[0].tolist() # [x1, y1, x2, y2]
        
        if label == "person":
            person_boxes.append(coords)
        elif label == "cell phone":
            items_detected["phones_detected"] += 1
            item_boxes.append((label, coords))
            
    # Mocking detection of PPE for demonstration purposes if context needs it 
    # (Since yolov8n doesn't natively detect hardhats/vests well without custom training)
    # For now, we only map real yolov8n detections (cell phones)
    
    for i, p_box in enumerate(person_boxes):
        person_data = {
            "id": i + 1,
            "has_phone": False,
            "has_mask": False,       # Mock or add custom model later
            "has_hardhat": False,    # Mock or add custom model later
            "has_safety_vest": False # Mock or add custom model later
        }
        
        # Check association
        for item_label, i_box in item_boxes:
            if check_overlap(i_box, p_box):
                if item_label == "cell phone":
                    person_data["has_phone"] = True
                    
        people.append(person_data)
        
    return {
        "people": people,
        "phones_detected": items_detected["phones_detected"]
    }
