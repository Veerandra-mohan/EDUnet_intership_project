import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

def generate_reasoning(report_data, chat_history, question, user_api_key=None):
    # Determine which key to use
    active_key = user_api_key if user_api_key else api_key
    
    if not active_key:
        return "Warning: GEMINI_API_KEY is not provided. This is a mock response. The person is missing a hardhat (-30 pts) and safety vest (-20 pts)."
        
    try:
        genai.configure(api_key=active_key)
        model = genai.GenerativeModel('gemini-pro')
    except Exception as e:
        return f"Error setting up AI Reasoning Engine: {str(e)}"
        
    system_prompt = f"""
    You are an AI Safety Inspector Assistant (DeepInspection AI). 
    Your job is to answer questions about the following inspection report based strictly on the provided data.
    Do not invent information. Answer directly and professionally.
    
    Inspection Context: {report_data.get('context')}
    Risk Level: {report_data.get('risk_level')}
    Score: {report_data.get('risk_score')}
    Status: {report_data.get('inspection_status')}
    
    Violations Detected:
    {report_data.get('violations', [])}
    
    Background Scene Data:
    {report_data.get('scene_data', {})}
    """
    
    prompt = system_prompt + "\n\nChat History:\n"
    for msg in chat_history[-5:]: # Keep last 5 for context limit
        role = msg.get('role', 'user')
        if role not in ['user', 'assistant']:
            role = 'user'
        prompt += f"{role.capitalize()}: {msg.get('content', '')}\n"
        
    prompt += f"\nUser: {question}\nAssistant:"
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error connecting to AI Reasoning Engine: {str(e)}"
