# 🎨 AI Content Generator

A full-stack web application for generating AI-based written content using Large Language Models (LLMs).  
This project consists of a **Next.js frontend** and a **FastAPI backend** integrated with **OpenRouter API** and **Supabase** for data storage.

The application allows users to input prompts and generate AI-written content such as articles, captions, or product descriptions.

---

## 📌 Project Overview

This repository contains two main parts:

- 🧠 **ai-backend** — FastAPI backend for handling AI requests and database storage  
- 💻 **ai-frontend** — Next.js frontend for user interaction  

Main workflow:
1. User enters a prompt in the frontend  
2. Frontend sends request to backend API  
3. Backend calls OpenRouter (LLM)  
4. Generated content is saved to Supabase  
5. Result is returned to frontend  

---

## 🚀 Features

- Generate AI-based text content from user prompts  
- Store generated content history in Supabase  
- REST API using FastAPI  
- Next.js frontend interface  
- Secure API key management using `secrets.toml`  
- CORS enabled for frontend access  

---

## 🗂️ Project Structure
```bash
ai-content-generator/
│
├── ai-backend/
│ ├── app3.py
│ ├── requirements.txt
│ └── secrets.toml
│
├── ai-frontend/
│ ├── package.json
│ └── (Next.js source files)
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Python  
- FastAPI  
- OpenRouter API (LLM)  
- Supabase  
- Requests  
- TOML  

### Frontend
- Next.js  
- React  
- Axios

---

## 📦 Backend Dependencies

Listed in `ai-backend/requirements.txt`:

- `fastapi`  
- `uvicorn`  
- `pydantic`  
- `requests`  
- `toml`  
- `supabase`  

Install backend dependencies:

```bash
cd ai-backend
pip install -r requirements.txt
```

## 📦 Frontend Dependencies

Managed using `package.json` (Next.js):

- `next`
- `react`
- `react-dom`
- `axios`

Install frontend dependencies:

```bash
cd ai-frontend
npm install
```

## 🔑 Configuration
```bash
[openrouter]
api_key = "YOUR_OPENROUTER_API_KEY"
base_url = "https://openrouter.ai/api/v1"
model = "gpt-3.5-turbo"

[supabase]
url = "YOUR_SUPABASE_URL"
anon_key = "YOUR_SUPABASE_ANON_KEY"
```

## ▶️ Running the Application
Run Backend:
```bash
cd ai-backend
uvicorn app3:app --reload
```
Run Frontend:
```bash
cd ai-forntend
npm run dev
```








## 🗂️ Project Structure

