# DeepInspection AI - Backend

This is the FastAPI backend engine for DeepInspection AI. It is responsible for handling media uploads, running object detection using YOLOv8, and calculating compliance based on our custom rule engine.

## File Structure
- `main.py`: The FastAPI application, routing, and simple in-memory database.
- `detector.py`: Wrapper for Ultralytics YOLO model inference on images.
- `video_processor.py`: OpenCV implementation for frame-sampled video analysis.
- `rules.py`: The Context Rule Engine that evaluates detections against domain logic.

## Setup Requirements

Requires Python 3.9+

```bash
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn main:app --reload
```
The server will start on `http://localhost:8000`. 
API Documentation available at `http://localhost:8000/docs`.

## Model Information
We use `yolov8n.pt` (Nano) by default to ensure fast CPU inference, making it safe and stable for deployment on free-tier cloud services like Render.
