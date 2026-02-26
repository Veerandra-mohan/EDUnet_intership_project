import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    client = OpenAI(api_key=api_key)
else:
    client = None

def generate_reasoning(report_data, chat_history, question, user_api_key=None):
    # Determine which key to use
    active_key = user_api_key if user_api_key else api_key
    
    if not active_key:
        return "Warning: OPENAI_API_KEY is not provided. This is a mock response. The person is missing a hardhat (-30 pts) and safety vest (-20 pts)."
        
    try:
        current_client = OpenAI(api_key=active_key)
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
    
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    for msg in chat_history[-5:]: # Keep last 5 for context limit
        # Ensure role is 'user' or 'assistant'
        role = msg.get('role', 'user')
        if role not in ['user', 'assistant', 'system']:
            role = 'user'
        messages.append({"role": role, "content": msg.get('content', '')})
        
    messages.append({"role": "user", "content": question})
    
    try:
        response = current_client.chat.completions.create(
            model="gpt-4o-mini", # or "gpt-3.5-turbo" if gpt-4o-mini is not available
            messages=messages,
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to AI Reasoning Engine: {str(e)}"
