from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from typing import Optional
import requests
import toml
from fastapi import Request
from datetime import datetime

# === Load dari secrets.toml ===
secrets = toml.load("secrets.toml")

# OpenRouter Config
OPENROUTER_API_KEY = secrets["openrouter"]["api_key"]
OPENROUTER_BASE_URL = secrets["openrouter"].get("base_url", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = secrets["openrouter"].get("model", "gpt-3.5-turbo")

# Supabase Config
SUPABASE_URL = secrets["supabase"]["url"]
SUPABASE_KEY = secrets["supabase"]["anon_key"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# === Aktifkan CORS supaya React bisa akses ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Schema data request dari frontend ===
class PromptRequest(BaseModel):
    prompt: str
    topic: str = ""
    keywords: str = ""
    tone: str = ""
    category: str = ""
    content_type: str = ""
    length: str = ""
    max_tokens: int = 3000

# === Endpoint untuk generate konten + simpan ke database ===
@app.post("/generate")
def openrouter_generate(request: PromptRequest):
    url = f"{OPENROUTER_BASE_URL}/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Content Generator",
        "Content-Type": "application/json",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful content writing assistant."},
            {"role": "user", "content": request.prompt},
        ],
        "max_tokens": request.max_tokens,
        "temperature": 0.7,
    }

    response = requests.post(url, headers=headers, json=payload)
    result = response.json()

    try:
        content_text = result["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        content_text = "Terjadi kesalahan dalam mengambil hasil konten."

    # === Simpan ke Supabase ===
    data = {
        "topic": request.topic,
        "keywords": request.keywords,
        "tone": request.tone,
        "category": request.category,
        "content_type": request.content_type,
        "length": request.length,
        "content": content_text,
    }

    response_insert = supabase.table("content_history").insert(data).execute()

    print("\n=== DATA YANG DISIMPAN KE SUPABASE ===")
    print(response_insert)
    print("========================================\n")

    print("\n=== RESULT YANG DIKIRIM KE FRONTEND ===")
    print(result)
    print("========================================\n")

    return {"result": content_text}

@app.post("/history")
async def save_history(request: Request):
    data = await request.json()
    data["created_at"] = datetime.now().isoformat()

    response = supabase.table("content_history").insert(data).execute()
    print("\n=== HISTORY DISIMPAN MANUAL KE SUPABASE ===")
    print(response)
    print("============================================\n")

    return {"message": "History saved successfully", "data": response.data}


@app.get("/history")
def get_history():
    response = supabase.table("content_history").select("*").order("created_at", desc=True).execute()
    print("\n=== DATA YANG DIAMBIL DARI SUPABASE ===")
    print(response)
    print("========================================\n")
    return response.data