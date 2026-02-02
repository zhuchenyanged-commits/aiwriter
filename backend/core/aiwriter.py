"""
AI Writer 核心逻辑
复用现有 ai-writer Python 代码
"""

import os
import sys
from typing import Dict, List, Any
from anthropic import Anthropic
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# 添加现有 ai-writer 项目路径
AIWRITER_PATH = os.path.join(os.path.dirname(__file__), "../../../ai-writer")
sys.path.insert(0, AIWRITER_PATH)

# 尝试导入 ai-writer 模块
try:
    from src.gemini_client import GeminiClient
    GEMINI_AVAILABLE = True
except ImportError as e:
    print(f"⚠️  Warning: Could not import gemini_client: {e}")
    GEMINI_AVAILABLE = False


class AIWriter:
    """AI 写作系统"""

    def __init__(self):
        """初始化"""
        # 使用 GPT5 生成文章（最新最强大）
        from .gpt5_writer import GPT5Writer
        self.writer = GPT5Writer()

        # Gemini API（用于图片生成）- 可选功能
        self.image_generator = None
        if GEMINI_AVAILABLE:
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            if gemini_api_key:
                try:
                    genai.configure(api_key=gemini_api_key)
                    self.image_generator = GeminiClient()
                    print("✅ Gemini 图片生成已启用")
                except Exception as e:
                    print(f"⚠️  Gemini 初始化失败: {e}")
            else:
                print("⚠️  GEMINI_API_KEY 未设置，图片生成功能将使用占位图")
        else:
            print("⚠️  Gemini 模块未导入，图片生成功能将使用占位图")

    async def research(self, topic: str) -> Dict[str, Any]:
        """
        执行调研（简化版）

        Args:
            topic: 文章主题

        Returns:
            调研结果
        """
        # 简化版：直接返回基础调研信息
        # 生产环境可以接入真实的搜索 API
        print(f"📚 调研主题: {topic}")

        return {
            "topic": topic,
            "web_results": [
                {"title": f"关于 {topic} 的研究", "url": "https://example.com", "snippet": "相关内容..."}
            ],
            "wechat_results": [],
            "xiaohongshu_results": [],
            "academic_results": []
        }

    async def write(
        self,
        topic: str,
        tier: str,
        research_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        生成文章内容（使用 GPT5）

        Args:
            topic: 文章主题
            tier: 字数档位
            research_data: 调研数据

        Returns:
            文章内容
        """
        print(f"✍️  GPT5 生成文章: {topic} ({tier}档)")
        return await self.writer.generate_article(topic, tier, research_data)

    async def generate_images(
        self,
        topic: str,
        content: Dict[str, Any]
    ) -> List[str]:
        """
        生成 KAFKA 风格配图

        Args:
            topic: 文章主题
            content: 文章内容

        Returns:
            图片 URL 列表
        """
        print(f"🎨 生成配图: {topic}")

        # 如果没有 Gemini Client，使用占位图
        if not self.image_generator:
            return [
                f"https://via.placeholder.com/1280x720/0a0a0f/00f5ff?text=KAFKA+Style+1",
                f"https://via.placeholder.com/1280x720/0a0a0f/b000ff?text=KAFKA+Style+2",
                f"https://via.placeholder.com/1280x720/0a0a0f/ff00aa?text=KAFKA+Style+3"
            ]

        try:
            # 尝试调用 Gemini 生成图片
            markdown = content.get("markdown", "")
            images = []

            for i in range(3):
                try:
                    # 假设 GeminiClient 有 generate_kafka_image 方法
                    # 实际需要根据你的 GeminiClient 实现调整
                    image_url = getattr(self.image_generator, 'generate_kafka_image', lambda **_: None)(
                        topic=topic,
                        context=markdown[:500]
                    )
                    if image_url:
                        images.append(image_url)
                    else:
                        images.append(f"https://via.placeholder.com/1280x720/0a0a0f/00f5ff?text=Image+{i+1}")
                except Exception as e:
                    print(f"Image {i} generation error: {e}")
                    images.append(f"https://via.placeholder.com/1280x720/0a0a0f/00f5ff?text=Image+{i+1}")

            return images
        except Exception as e:
            print(f"Generate images error: {e}")
            return [
                f"https://via.placeholder.com/1280x720/0a0a0f/00f5ff?text=KAFKA+1",
                f"https://via.placeholder.com/1280x720/0a0a0f/b000ff?text=KAFKA+2",
                f"https://via.placeholder.com/1280x720/0a0a0f/ff00aa?text=KAFKA+3"
            ]

    async def integrate(
        self,
        content: Dict[str, Any],
        images: List[str],
        formats: List[str]
    ) -> Dict[str, Any]:
        """
        整合内容和图片，生成最终文件

        Args:
            content: 文章内容
            images: 图片列表
            formats: 输出格式

        Returns:
            整合后的内容
        """
        try:
            # 在 Markdown 中插入图片
            markdown = content.get("markdown", "")
            title = content.get("title", "Untitled")

            # 在标题后添加第一张图片
            if images:
                markdown = f"# {title}\n\n![配图]({images[0]})\n\n" + markdown

            result = {
                "title": title,
                "markdown": markdown,
                "images": images,
                "html": "",
                "pdf_url": "",
                "xiaohongshu": ""
            }

            # 生成 HTML
            if "html" in formats:
                result["html"] = self._markdown_to_html(markdown)

            # 生成小红书格式
            if "xiaohongshu" in formats:
                result["xiaohongshu"] = self._to_xiaohongshu_format(markdown, images)

            # 生成 PDF（如果需要）
            if "pdf" in formats:
                result["pdf_url"] = await self._generate_pdf(markdown, title)

            return result

        except Exception as e:
            print(f"Integrate error: {e}")
            return {
                "title": content.get("title", "Untitled"),
                "markdown": content.get("markdown", ""),
                "images": images,
                "html": "",
                "pdf_url": "",
                "xiaohongshu": ""
            }

    def _markdown_to_html(self, markdown: str) -> str:
        """Markdown 转 HTML"""
        try:
            import markdown
            return markdown.markdown(markdown)
        except:
            # 简单转换
            replaced = markdown.replace('\n', '<br>')
            return f"<div>{replaced}</div>"

    def _to_xiaohongshu_format(self, markdown: str, images: List[str]) -> str:
        """转换为小红书格式"""
        # 移除 Markdown 语法
        content = markdown
        content = content.replace("#", "")
        content = content.replace("*", "")
        content = content.replace("```", "")

        # 添加表情符号
        content = "✨ " + content

        # 添加图片链接
        if images:
            content += "\n\n图片：\n" + "\n".join(images)

        # 添加话题标签
        content += "\n\n#AI写作 #科技分享"

        return content

    async def _generate_pdf(self, markdown: str, title: str) -> str:
        """生成 PDF（占位实现）"""
        # TODO: 实现真实的 PDF 生成
        # 可以使用 reportlab 或 weasyprint
        return f"#PDF-{title}.pdf"  # 返回标识符而不是 URL
