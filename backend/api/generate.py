"""
文章生成 API
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

from core.aiwriter import AIWriter
from core.storage import Storage

router = APIRouter()

# 全局存储实例
storage = Storage()


class GenerateRequest(BaseModel):
    """生成请求模型"""
    topic: str
    tier: str = "B"
    formats: List[str] = ["markdown", "pdf"]


class GenerateResponse(BaseModel):
    """生成响应模型"""
    article_id: str
    message: str


@router.post("/generate", response_model=GenerateResponse)
async def generate_article(
    request: GenerateRequest,
    background_tasks: BackgroundTasks
):
    """
    创建文章生成任务

    - **topic**: 文章主题
    - **tier**: 字数档位 (A/B/C/D)
    - **formats**: 输出格式列表
    """
    try:
        # 生成文章 ID
        article_id = str(uuid.uuid4())

        # 验证输入
        if request.tier not in ["A", "B", "C", "D"]:
            raise HTTPException(status_code=400, detail="Invalid tier")

        valid_formats = ["markdown", "pdf", "html", "xiaohongshu"]
        if not all(f in valid_formats for f in request.formats):
            raise HTTPException(status_code=400, detail="Invalid format")

        # 创建文章记录
        article_data = {
            "id": article_id,
            "topic": request.topic,
            "tier": request.tier,
            "formats": request.formats,
            "status": "pending",
            "progress": 0,
            "created_at": datetime.now().isoformat(),
            "completed_at": None,
            "error": None
        }

        await storage.create_article(article_id, article_data)

        # 添加后台任务
        background_tasks.add_task(
            process_article_generation,
            article_id,
            request.topic,
            request.tier,
            request.formats
        )

        return GenerateResponse(
            article_id=article_id,
            message="文章生成任务已创建"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def process_article_generation(
    article_id: str,
    topic: str,
    tier: str,
    formats: list
):
    """
    后台处理文章生成
    """
    try:
        # 更新状态：开始调研
        await storage.update_status(
            article_id,
            status="researching",
            progress=10
        )

        # 初始化 AI Writer
        ai_writer = AIWriter()

        # 执行调研
        research_result = await ai_writer.research(topic)

        # 更新状态：调研完成，开始写作
        await storage.update_status(
            article_id,
            status="writing",
            progress=40
        )

        # 生成文章内容
        content_result = await ai_writer.write(
            topic=topic,
            tier=tier,
            research_data=research_result
        )

        # 更新状态：写作完成，生成配图
        await storage.update_status(
            article_id,
            status="generating_images",
            progress=70
        )

        # 生成配图
        images_result = await ai_writer.generate_images(
            topic=topic,
            content=content_result
        )

        # 更新状态：整合内容
        await storage.update_status(
            article_id,
            status="integrating",
            progress=90
        )

        # 整合内容并生成最终文件
        final_content = await ai_writer.integrate(
            content=content_result,
            images=images_result,
            formats=formats
        )

        # 保存文章内容
        await storage.save_content(article_id, final_content)

        # 更新状态：完成
        await storage.update_status(
            article_id,
            status="completed",
            progress=100,
            completed_at=datetime.now().isoformat()
        )

        print(f"✅ Article {article_id} generation completed")

    except Exception as e:
        print(f"❌ Article {article_id} generation failed: {str(e)}")

        # 更新状态：失败
        await storage.update_status(
            article_id,
            status="failed",
            error=str(e)
        )
