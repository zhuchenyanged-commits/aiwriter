"""
使用 Gemini 生成文章
支持 Google 官方 API 和 APICore
"""

import os
from typing import Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


class GeminiWriter:
    """Gemini 文章生成器"""

    def __init__(self):
        """初始化 Gemini"""
        api_key = os.getenv("GEMINI_API_KEY")

        # 判断 API Key 类型
        if api_key.startswith("AIzaSy"):
            # Google 官方 API
            self.use_official = True
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            print("✅ 使用 Google 官方 Gemini API")
        elif api_key.startswith("sk-"):
            # APICore（OpenAI 兼容格式）
            self.use_official = False
            # APICore 使用 OpenAI 格式的 API
            self.api_key = api_key
            self.api_base = "https://api.apicore.ai/v1"
            print("✅ 使用 APICore (OpenAI 兼容) API")
        else:
            raise ValueError("无效的 GEMINI_API_KEY 格式")

    async def generate_article(
        self,
        topic: str,
        tier: str,
        research_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        使用 Gemini 生成文章

        Args:
            topic: 文章主题
            tier: 字数档位
            research_data: 调研数据

        Returns:
            文章内容
        """
        # 字数档位对应
        tier_words = {
            "A": 2500,
            "B": 4000,
            "C": 6500,
            "D": 10000
        }

        target_words = tier_words.get(tier, 4000)

        # 构建提示词
        prompt = self._build_prompt(topic, target_words, research_data)

        print(f"✍️  Gemini 生成文章: {topic} ({tier}档, 约{target_words}字)")

        try:
            if self.use_official:
                # 使用 Google 官方 API
                content = await self._generate_with_official_api(prompt)
            else:
                # 使用 APICore
                content = await self._generate_with_apicore(prompt)

            return {
                "title": topic,
                "markdown": content,
                "word_count": len(content)
            }

        except Exception as e:
            print(f"❌ Gemini 生成失败: {e}")
            raise e

    def _build_prompt(
        self,
        topic: str,
        target_words: int,
        research_data: Dict[str, Any]
    ) -> str:
        """构建提示词"""
        return f"""请基于以下调研结果，撰写一篇关于"{topic}"的深度文章。

**字数要求**：{target_words}字左右

**写作原则**：
1. 说人话：用通俗的语言解释复杂概念
2. 有温度：使用第一人称，加入个人见解
3. 有洞察：深入分析技术原理和趋势
4. 有节制：克制煽情，理性客观

**调研参考**：
{research_data}

**输出要求**：
- 使用 Markdown 格式
- 包含清晰的标题结构
- 每段有明确的主题
- 适当使用列表和引用

请开始撰写文章。"""

    async def _generate_with_official_api(self, prompt: str) -> str:
        """使用 Google 官方 API 生成"""
        response = await self.model.generate_content_async(prompt)
        return response.text

    async def _generate_with_apicore(self, prompt: str) -> str:
        """使用 APICore（OpenAI 兼容格式）生成"""
        import httpx

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "gemini-pro",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 8192
        }

        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{self.api_base}/chat/completions",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
