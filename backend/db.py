import os
from datetime import datetime
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client.get_database() # Uses default db from URI
    inspections_collection = db["reports"]
    
    # Simple check to confirm connection
    client.server_info()
    print("Connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    # Fallback to empty collection definition if running locally without DB (though queries will fail)
    db = None
    inspections_collection = None

def get_report_by_id(report_id):
    if inspections_collection is None:
        return None
    # We will search by string id
    return inspections_collection.find_one({"id": report_id}, {"_id": 0})

def save_chat_message(report_id, role, content):
    if inspections_collection is None:
        return
    inspections_collection.update_one(
        {"id": report_id},
        {"$push": {"chat_history": {"role": role, "content": content}}}
    )

def save_inspection(context, file_type, result):
    if inspections_collection is None:
        return {}
        
    report = {
        "id": f"REP-{int(datetime.now().timestamp())}",
        "context": context,
        "type": file_type,
        "scene_data": result.get("scene_data", {}),
        "violations": result.get("violations", []),
        "risk_score": result.get("risk_score", 0),
        "risk_level": result.get("risk_level", "Low"),
        "inspection_status": result.get("inspection_status", "Compliant"),
        "status": "Open",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "chat_history": []
    }
    
    inspections_collection.insert_one(report)
    
    # Return without the MongoDB specific _id
    report.pop("_id", None)
    return report

def resolve_inspection(report_id):
    if inspections_collection is None:
        return False
    result = inspections_collection.update_one(
        {"id": report_id},
        {"$set": {"status": "Resolved"}}
    )
    return result.modified_count > 0

def get_dashboard_stats():
    if inspections_collection is None:
        return {
            "total_inspections": 0,
            "active_violations": 0,
            "resolved_reports": 0,
            "recent_activity": []
        }
        
    total_inspections = inspections_collection.count_documents({})
    active_violations = inspections_collection.count_documents({"status": "Open", "inspection_status": "Non-Compliant"})
    resolved_reports = inspections_collection.count_documents({"status": "Resolved"})
    
    recent_activity = list(inspections_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(10))
    
    return {
        "total_inspections": total_inspections,
        "active_violations": active_violations,
        "resolved_reports": resolved_reports,
        "recent_activity": recent_activity
    }

def get_all_reports():
    if inspections_collection is None:
        return []
    return list(inspections_collection.find({}, {"_id": 0}).sort("created_at", -1))
