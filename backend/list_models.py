import google.generativeai as genai

genai.configure(api_key='AIzaSyDpJia5xJ7gK3Y29AlvMIgCr2uuGPj0h7w')
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
