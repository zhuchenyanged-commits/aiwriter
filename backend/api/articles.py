"""
文章管理 API
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
from core.storage import Storage

router = APIRouter()

# 全局存储实例
storage = Storage()


@router.get("/articles")
async def get_articles_list(
    page: int = 1,
    limit: int = 20,
    status: Optional[str] = None
):
    """
    获取文章列表

    - **page**: 页码
    - **limit**: 每页数量
    - **status**: 状态筛选（可选）
    """
    try:
        articles = await storage.list_articles(
            page=page,
            limit=limit,
            status=status
        )

        return {
            "articles": articles,
            "page": page,
            "limit": limit,
            "total": len(articles)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/articles/{article_id}")
async def get_article_detail(article_id: str):
    """
    获取文章详情

    - **article_id**: 文章 ID
    """
    try:
        article = await storage.get_article(article_id)

        if not article:
            raise HTTPException(status_code=404, detail="文章不存在")

        return article

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/articles/{article_id}/download/{format}")
async def download_article(article_id: str, format: str):
    """
    下载文章

    - **article_id**: 文章 ID
    - **format**: 格式 (pdf, markdown, html, xiaohongshu)
    """
    try:
        article = await storage.get_article(article_id)

        if not article:
            raise HTTPException(status_code=404, detail="文章不存在")

        if article["status"] != "completed":
            raise HTTPException(status_code=400, detail="文章尚未生成完成")

        content = article.get("content", {})

        if format == "markdown":
            return {
                "filename": f'{article["topic"]}.md',
                "content": content.get("markdown", ""),
                "content_type": "text/markdown"
            }
        elif format == "pdf":
            return {
                "filename": f'{article["topic"]}.pdf',
                "url": content.get("pdf_url", ""),
                "content_type": "application/pdf"
            }
        elif format == "html":
            return {
                "filename": f'{article["topic"]}.html',
                "content": content.get("html", ""),
                "content_type": "text/html"
            }
        elif format == "xiaohongshu":
            return {
                "filename": f'{article["topic"]}_xiaohongshu.txt',
                "content": content.get("xiaohongshu", ""),
                "content_type": "text/plain"
            }
        else:
            raise HTTPException(status_code=400, detail="不支持的格式")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
