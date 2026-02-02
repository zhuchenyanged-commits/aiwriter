"""
AI Writer FastAPI Backend
智能写作系统后端服务
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from api import generate, status, articles
from core.storage import initialize_storage

# 加载环境变量
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """启动和关闭事件"""
    print("🚀 AI Writer Backend Starting...")

    # 初始化数据库
    await initialize_storage()

    yield
    print("👋 AI Writer Backend Shutting down...")

# 创建 FastAPI 应用
app = FastAPI(
    title="AI Writer API",
    description="基于 AI 的智能写作系统",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "https://aiwriter.tech")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(status.router, prefix="/api", tags=["status"])
app.include_router(articles.router, prefix="/api", tags=["articles"])

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "AI Writer API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "service": "ai-writer-backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
