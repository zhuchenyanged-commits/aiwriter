"""
使用 GPT5 生成文章
通过 APICore API 调用
"""

import os
from typing import Dict, Any
import httpx
from dotenv import load_dotenv

load_dotenv()


class GPT5Writer:
    """GPT5 文章生成器（通过 APICore）"""

    def __init__(self):
        """初始化 GPT5"""
        self.api_key = os.getenv("GPT5_API_KEY")
        if not self.api_key:
            print("⚠️  GPT5_API_KEY 未设置，API 调用将失败")
            print("   请在 Railway 上添加 GPT5_API_KEY 环境变量")
        self.api_base = "https://api.apicore.ai/v1"
        self.model = "gpt-5"
        if self.api_key:
            print("✅ 使用 GPT5 (APICore) 生成文章")

    async def generate_article(
        self,
        topic: str,
        tier: str,
        research_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        使用 GPT5 生成文章

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

        print(f"✍️  GPT5 生成文章: {topic} ({tier}档, 约{target_words}字)")

        try:
            content = await self._generate_with_gpt5(prompt)

            return {
                "title": topic,
                "markdown": content,
                "word_count": len(content)
            }

        except Exception as e:
            print(f"❌ GPT5 生成失败: {e}")
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
- 包含清晰的标题结构（使用 # ## ###）
- 每段有明确的主题
- 适当使用列表和引用
- 文章要有开头、正文、结尾

请开始撰写文章。"""

    async def _generate_with_gpt5(self, prompt: str) -> str:
        """使用 GPT5 API 生成"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 8192,
            "stream": False
        }

        # 增加超时时间（生成文章需要较长时间）
        timeout = httpx.Timeout(300.0)  # 5 分钟

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{self.api_base}/chat/completions",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            result = response.json()

            # 返回生成的内容
            return result["choices"][0]["message"]["content"]
