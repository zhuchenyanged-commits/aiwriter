"""
存储模块
使用数据库持久化存储
"""

from typing import Dict, List, Optional, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import os

from .database import Article, get_session, init_db


class Storage:
    """存储类 - 使用数据库"""

    def __init__(self):
        """初始化存储"""
        self.use_database = True
        print("✅ Using Database storage (SQLite/PostgreSQL)")

    async def create_article(self, article_id: str, data: Dict[str, Any]):
        """创建文章记录"""
        async with async_session() as session:
            article = Article(
                id=article_id,
                topic=data.get("topic"),
                tier=data.get("tier"),
                status=data.get("status", "pending"),
                progress=data.get("progress", 0),
                created_at=datetime.utcnow()
            )
            session.add(article)
            await session.commit()
            print(f"✅ Created article {article_id}")

    async def get_article(self, article_id: str) -> Optional[Dict[str, Any]]:
        """获取文章"""
        async with async_session() as session:
            result = await session.execute(
                select(Article).where(Article.id == article_id)
            )
            article = result.scalar_one_or_none()
            return article.to_dict() if article else None

    async def update_status(
        self,
        article_id: str,
        status: Optional[str] = None,
        progress: Optional[int] = None,
        completed_at: Optional[str] = None,
        error: Optional[str] = None
    ):
        """更新状态"""
        async with async_session() as session:
            # 构建更新数据
            update_data = {}
            if status is not None:
                update_data["status"] = status
            if progress is not None:
                update_data["progress"] = progress
            if completed_at is not None:
                update_data["completed_at"] = datetime.fromisoformat(completed_at)
            if error is not None:
                update_data["error"] = error

            if update_data:
                await session.execute(
                    update(Article)
                    .where(Article.id == article_id)
                    .values(**update_data)
                )
                await session.commit()
                print(f"✅ Updated article {article_id}: {update_data}")

    async def save_content(self, article_id: str, content: Dict[str, Any]):
        """保存文章内容"""
        async with async_session() as session:
            await session.execute(
                update(Article)
                .where(Article.id == article_id)
                .values(content=content)
            )
            await session.commit()
            print(f"✅ Saved content for article {article_id}")

    async def list_articles(
        self,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """获取文章列表"""
        async with async_session() as session:
            query = select(Article)

            # 状态过滤
            if status:
                query = query.where(Article.status == status)

            # 按创建时间倒序
            query = query.order_by(Article.created_at.desc())

            # 分页
            query = query.limit(limit).offset((page - 1) * limit)

            result = await session.execute(query)
            articles = result.scalars().all()

            return [article.to_dict() for article in articles]

    async def delete_article(self, article_id: str):
        """删除文章"""
        async with async_session() as session:
            await session.execute(
                delete(Article).where(Article.id == article_id)
            )
            await session.commit()
            print(f"✅ Deleted article {article_id}")


# 全局存储实例
storage = Storage()

# 导入 async_session（需要在函数内部导入以避免循环导入）
from .database import async_session


async def initialize_storage():
    """初始化存储（创建数据库表）"""
    await init_db()
    print("✅ Database initialized")
