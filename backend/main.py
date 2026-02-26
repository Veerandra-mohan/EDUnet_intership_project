from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
from datetime import datetime

from services.detection_service import extract_scene_data
from services.rule_service import evaluate_rules
from services.reasoning_service import generate_reasoning
from db import save_inspection, get_dashboard_stats, get_report_by_id, save_chat_message, resolve_inspection, get_all_reports

from models.schemas import ChatRequest
# If we need the old video processor, we keep it but mock the output structure
# from video_processor import process_video

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), context: str = Form(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    scene_data = extract_scene_data(file_path)
    result = evaluate_rules(scene_data, context)
    
    # Bundle scene_data into result for saving
    result["scene_data"] = scene_data
    
    saved_report = save_inspection(context, "image", result)

    # Return the clean structured response as requested
    return {
        "context": context,
        "scene_data": scene_data,
        "violations": result["violations"],
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "inspection_status": result["inspection_status"],
        "report_id": saved_report.get("id")
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    report_id = request.report_id
    question = request.question
    api_key = request.api_key
    
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    chat_history = report.get("chat_history", [])
    
    # Save the user's question
    save_chat_message(report_id, "user", question)
    
    # generate reasoning
    response_text = generate_reasoning(
        report_data=report,
        chat_history=chat_history,
        question=question,
        user_api_key=api_key
    )
    
    # Save the assistant's response
    save_chat_message(report_id, "assistant", response_text)
    
    return {"response": response_text}

@app.post("/resolve-report/{report_id}")
async def resolve_report(report_id: str):
    success = resolve_inspection(report_id)
    if success:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Report not found or could not be resolved")

@app.get("/report/{report_id}")
async def get_report(report_id: str):
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.get("/dashboard-stats")
async def dashboard_stats():
    return get_dashboard_stats()

@app.get("/reports")
async def get_reports():
    return get_all_reports()
