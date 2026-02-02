"""
状态查询 API
"""

from fastapi import APIRouter, HTTPException
from core.storage import Storage

router = APIRouter()

# 全局存储实例
storage = Storage()


@router.get("/status/{article_id}")
async def get_article_status(article_id: str):
    """
    查询文章生成状态

    - **article_id**: 文章 ID
    """
    try:
        article = await storage.get_article(article_id)

        if not article:
            raise HTTPException(status_code=404, detail="文章不存在")

        return {
            "id": article["id"],
            "topic": article["topic"],
            "tier": article["tier"],
            "status": article["status"],
            "progress": article["progress"],
            "created_at": article["created_at"],
            "completed_at": article.get("completed_at"),
            "error": article.get("error")
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
