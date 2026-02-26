import cv2
import os
from detector import detect_image

MAX_FRAMES_TO_PROCESS = 60 # e.g. 30 seconds at 30fps sampling every 15 frames = 60 frames max

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)

    total_detections = {"persons": 0, "phones": 0}
    frame_count = 0
    processed_count = 0

    temp_frame_path = "temp_frame.jpg"

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Check if we reached our maximum allowed processing limit (e.g. 30s of video)
        if processed_count >= MAX_FRAMES_TO_PROCESS:
            break

        # Sample every 15 frames
        if frame_count % 15 == 0:
            cv2.imwrite(temp_frame_path, frame)
            result = detect_image(temp_frame_path)

            total_detections["persons"] += result["persons"]
            total_detections["phones"] += result["phones"]
            processed_count += 1

        frame_count += 1

    cap.release()
    
    # Cleanup temporary frame
    if os.path.exists(temp_frame_path):
        os.remove(temp_frame_path)
        
    return total_detections

