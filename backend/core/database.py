"""
数据库模型和连接管理
支持 SQLite（本地开发）和 PostgreSQL（生产环境）
"""

from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime, JSON
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
import os
from datetime import datetime
from typing import Optional

# 数据库配置
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./aiwriter.db"  # 默认使用 SQLite
)

# 创建异步引擎
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # 设置为 True 可以看到 SQL 语句
    future=True
)

# 创建 Session 工厂
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 数据库基类
Base = declarative_base()


class Article(Base):
    """文章表"""
    __tablename__ = "articles"

    id = Column(String, primary_key=True)
    topic = Column(String(255), nullable=False)
    tier = Column(String(10), nullable=False)
    status = Column(String(20), default="pending")
    progress = Column(Integer, default=0)

    # 内容字段
    content = Column(JSON, nullable=True)
    research_data = Column(JSON, nullable=True)
    extra_metadata = Column(JSON, nullable=True)  # metadata 是保留字，改名

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # 错误信息
    error = Column(Text, nullable=True)

    # 用户识别（用于限流）
    ip_address = Column(String(45), nullable=True)
    user_fingerprint = Column(String(64), nullable=True)

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "topic": self.topic,
            "tier": self.tier,
            "status": self.status,
            "progress": self.progress,
            "content": self.content,
            "research_data": self.research_data,
            "metadata": self.extra_metadata,  # 对外接口仍使用 metadata
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "error": self.error
        }


async def init_db():
    """初始化数据库（创建表）"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:
    """获取数据库 Session"""
    async with async_session() as session:
        yield session
