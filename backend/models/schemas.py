from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ChatMessage(BaseModel):
    role: str
    content: str
    
class Report(BaseModel):
    id: str
    context: str
    scene_data: Dict[str, Any]
    violations: List[str]
    risk_score: int
    risk_level: str
    inspection_status: str
    status: str = "Open"
    created_at: str
    chat_history: List[ChatMessage] = []

class ChatRequest(BaseModel):
    report_id: str
    question: str
    api_key: Optional[str] = None
    image: Optional[str] = None
