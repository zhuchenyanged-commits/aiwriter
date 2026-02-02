# 🤖 AI Writer - 智能写作系统

> 基于 Claude 和 Gemini 的下一代 AI 写作平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.1-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)

## ✨ 特性

- 🔍 **多源智能调研** - Web 搜索、微信公众号、小红书、学术论文
- 🤖 **Claude 驱动生成** - 基于 Claude 3.5 的强大能力
- 🎨 **KAFKA 风格配图** - Gemini 驱动的独特配图风格
- 📦 **多格式导出** - 支持 PDF、HTML、Markdown、小红书格式
- 🚀 **科技感 UI** - 赛博朋克风格的现代化界面

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────┐
│         Next.js 14 Frontend (Vercel)            │
│  • React + Tailwind + Framer Motion             │
│  • 赛博朋克 UI (深色主题 + 玻璃态 + 粒子效果)     │
└─────────────────┬───────────────────────────────┘
                  │ API 调用
                  ▼
┌─────────────────────────────────────────────────┐
│      Python FastAPI (Railway/Render)            │
│  • 复用现有 aiwriter Python 代码                │
│  • 提供 REST API 接口                           │
│  • 调用 Claude + Gemini API                     │
└─────────────────────────────────────────────────┘
```

## 📦 项目结构

```
aiwriter-tech/
├── frontend/                    # Next.js 前端
│   ├── app/                     # 页面
│   ├── components/              # 组件
│   │   ├── tech/               # 科技感组件
│   │   └── ui/                 # 基础 UI 组件
│   └── lib/                    # 工具库
│
├── backend/                     # Python FastAPI
│   ├── api/                     # API 路由
│   ├── core/                    # 核心逻辑
│   └── main.py                 # 应用入口
│
└── ai-writer/                   # 现有 Python 代码（复用）
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Claude API Key
- Gemini API Key

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd aiwriter-tech
```

### 2. 启动后端

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 API Keys

# 启动服务
python main.py
```

后端将运行在 http://localhost:8000

### 3. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 NEXT_PUBLIC_API_URL=http://localhost:8000

# 启动开发服务器
npm run dev
```

前端将运行在 http://localhost:3000

## 🌐 部署到生产环境

### 前端部署（Vercel）

1. **连接 GitHub 仓库**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入 `frontend` 目录

2. **配置环境变量**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

3. **部署**
   - 点击 "Deploy"
   - Vercel 会自动构建和部署

### 后端部署（Railway）

1. **连接 GitHub 仓库**
   - 访问 [railway.app](https://railway.app)
   - 点击 "New Project"
   - 导入 `backend` 目录

2. **配置环境变量**
   ```
   ANTHROPIC_API_KEY=sk-ant-xxx
   GEMINI_API_KEY=AIzaSy-xxx
   USE_REDIS=true
   REDIS_URL=redis://...
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

3. **部署**
   - Railway 会自动检测 Dockerfile 并部署
   - 部署完成后会获得一个公网 URL

### 后端部署（Render）- 备选方案

1. **访问 [render.com](https://render.com)**
2. **创建新的 Web Service**
3. **连接 GitHub 仓库**
4. **配置**：
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables: 同 Railway

## 🎨 自定义主题

编辑 `frontend/app/globals.css` 修改配色：

```css
:root {
  --bg-primary: #0a0a0f;        /* 深空黑 */
  --bg-secondary: #13131f;      /* 深空蓝 */
  --accent-cyan: #00f5ff;       /* 霓虹青 */
  --accent-purple: #b000ff;     /* 霓虹紫 */
  --accent-pink: #ff00aa;       /* 霓虹粉 */
}
```

## 📝 API 文档

后端启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 主要 API

#### 生成文章
```http
POST /api/generate
Content-Type: application/json

{
  "topic": "大语言模型的发展趋势",
  "tier": "B",
  "formats": ["markdown", "pdf"]
}
```

#### 查询状态
```http
GET /api/status/{article_id}
```

#### 获取文章列表
```http
GET /api/articles?page=1&limit=20
```

#### 获取文章详情
```http
GET /api/articles/{article_id}
```

## 💰 成本估算

| 服务 | 免费额度 | 预估成本 |
|------|---------|---------|
| Vercel (前端) | 100GB 带宽/月 | $0 |
| Railway (后端) | $5 免费额度/月 | $0-5 |
| Claude API | - | ~$5-10/月 (100 DAU) |
| Gemini API | - | ~$2-3/月 |
| **总计** | | **~$7-18/月** |

## 🔒 环境变量说明

### 后端 (.env)
```bash
# AI API Keys
ANTHROPIC_API_KEY=sk-ant-xxx          # Claude API Key
GEMINI_API_KEY=AIzaSy-xxx             # Gemini API Key

# 存储
USE_REDIS=false                       # 是否使用 Redis
REDIS_URL=redis://localhost:6379     # Redis 连接 URL

# 前端 URL
FRONTEND_URL=http://localhost:3000   # 前端地址（用于 CORS）
```

### 前端 (.env.local)
```bash
# 后端 API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 故障排查

### CORS 错误
确保后端 `.env` 中的 `FRONTEND_URL` 包含你的前端域名。

### API 连接失败
1. 检查后端是否正在运行：`curl http://localhost:8000/health`
2. 检查前端 `NEXT_PUBLIC_API_URL` 是否正确

### 文章生成失败
1. 检查 API Keys 是否有效
2. 查看后端日志获取详细错误信息
3. 确认 `ai-writer` 项目路径正确

## 📸 截图

> TODO: 添加项目截图

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Google Gemini](https://ai.google.dev/)

---

**Made with ❤️ by [Your Name]**
