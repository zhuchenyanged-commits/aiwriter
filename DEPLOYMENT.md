# 🚀 部署指南

本文档详细说明如何将 AI Writer 部署到生产环境。

## 📋 部署前准备

### 1. 获取 API Keys

#### Claude API Key
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建账户并登录
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 保存 Key（格式：`sk-ant-xxx`）

#### Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 创建项目并启用 Gemini API
3. 生成 API Key
4. 保存 Key（格式：`AIzaSy-xxx`）

### 2. 准备代码仓库

将代码推送到 GitHub：

```bash
cd aiwriter-tech
git init
git add .
git commit -m "Initial commit: AI Writer v1.0"
git remote add origin <your-github-repo>
git push -u origin main
```

## 🌐 部署方案

### 方案 A：Vercel (前端) + Railway (后端) - 推荐

#### 第一步：部署后端到 Railway

1. **登录 Railway**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择你的仓库
   - Railway 会自动检测项目

3. **配置项目**
   - Root Directory: `backend`
   - Dockerfile: 自动检测 `backend/Dockerfile`

4. **设置环境变量**
   在项目Settings → Variables 中添加：
   ```
   ANTHROPIC_API_KEY=sk-ant-xxx
   GEMINI_API_KEY=AIzaSy-xxx
   FRONTEND_URL=https://your-frontend.vercel.app
   USE_REDIS=true  # 如果使用 Railway Redis
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 2-3 分钟）
   - 部署成功后，复制生成的域名（如：`aiwriter-backend.up.railway.app`）

6. **测试后端**
   ```bash
   curl https://your-backend.railway.app/health
   ```

#### 第二步：部署前端到 Vercel

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "Add New" → "Project"
   - 选择你的仓库
   - 配置项目：
     - Framework Preset: Next.js
     - Root Directory: `frontend`

3. **设置环境变量**
   在 Environment Variables 中添加：
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 1-2 分钟）
   - 部署成功后会获得域名（如：`aiwriter.vercel.app`）

5. **更新后端 CORS 配置**
   回到 Railway，更新环境变量：
   ```
   FRONTEND_URL=https://aiwriter.vercel.app
   ```

6. **测试前端**
   - 访问你的 Vercel 域名
   - 尝试生成一篇文章

---

### 方案 B：Vercel (前端) + Render (后端)

#### 部署后端到 Render

1. **登录 Render**
   - 访问 [render.com](https://render.com)
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New" → "Web Service"
   - 选择你的仓库

3. **配置**
   - Name: `aiwriter-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **环境变量**
   ```
   ANTHROPIC_API_KEY=sk-ant-xxx
   GEMINI_API_KEY=AIzaSy-xxx
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成
   - 复制生成的域名（如：`aiwriter-backend.onrender.com`）

#### 部署前端到 Vercel

步骤同方案 A，将 `NEXT_PUBLIC_API_URL` 指向 Render 域名。

---

### 方案 C：全部部署到 Vercel（使用 Serverless Functions）

如果你想将整个项目部署到 Vercel，需要将 Python 后端改造为 Serverless Functions。

**注意**：这需要额外的工作，建议使用方案 A 或 B。

---

## 🔧 部署后配置

### 1. 配置自定义域名（可选）

#### Vercel
1. 进入项目 Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

#### Railway
1. 进入项目 Settings → Domains
2. 添加自定义域名
3. 配置 DNS CNAME 记录

### 2. 配置 CDN（国内访问优化）

如果需要优化国内访问速度：

1. **使用 CloudFlare CDN**
   - 将域名托管到 CloudFlare
   - 启用 CDN 缓存
   - 配置 Page Rules

2. **配置缓存规则**
   ```
   *.js, *.css, *.jpg, *.png → 缓存 1 年
   /api/* → 不缓存
   ```

### 3. 配置监控（可选）

#### Vercel Analytics
```bash
cd frontend
npm install @vercel/analytics
```

在 `app/layout.tsx` 中添加：
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Sentry（错误监控）
```bash
npm install @sentry/nextjs
```

---

## 🧪 测试部署

### 健康检查

```bash
# 后端健康检查
curl https://your-backend.railway.app/health

# 前端访问
curl https://your-frontend.vercel.app
```

### 完整流程测试

1. 访问前端首页
2. 点击"开始使用"
3. 输入主题，选择档位
4. 提交生成任务
5. 查看生成状态页面
6. 等待生成完成
7. 查看最终文章
8. 测试下载功能

---

## 📊 成本优化

### 免费额度利用

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| Vercel | 100GB 带宽/月 | 足够 100 DAU |
| Railway | $5/月额度 | 约 500 小时运行时间 |
| Claude | - | 按使用量计费 |
| Gemini | - | 每月免费额度 |

### 成本控制建议

1. **设置请求上限**
   ```python
   # 在 backend/api/generate.py 中添加
   MAX_REQUESTS_PER_DAY = 100
   ```

2. **使用更便宜的模型**
   ```python
   # 使用 Claude Haiku 代替 Sonnet
   model="claude-3-haiku-20240307"
   ```

3. **启用缓存**
   - 相似主题复用内容
   - 调研结果缓存

---

## 🐛 常见问题

### 问题 1：CORS 错误

**症状**：前端无法调用后端 API

**解决方案**：
1. 检查后端 `FRONTEND_URL` 环境变量
2. 确保包含正确的 Vercel 域名
3. 重启后端服务

### 问题 2：部署失败

**症状**：Railway 或 Vercel 部署时报错

**解决方案**：
1. 检查构建日志
2. 确保 `requirements.txt` 或 `package.json` 正确
3. 检查 Dockerfile 路径

### 问题 3：API 调用失败

**症状**：文章生成失败

**解决方案**：
1. 检查 API Keys 是否正确
2. 查看后端日志
3. 确认 API 额度是否充足

### 问题 4：Redis 连接失败

**症状**：无法连接到 Redis

**解决方案**：
1. 检查 `REDIS_URL` 是否正确
2. 或设置 `USE_REDIS=false` 使用内存存储

---

## 📈 扩展和优化

### 添加数据库

当需要持久化存储时：

1. **使用 Vercel Postgres**
   ```bash
   npm install @vercel/postgres
   ```

2. **使用 Supabase**
   - 创建免费项目
   - 获取数据库 URL
   - 在后端配置连接

### 添加队列系统

对于高并发场景：

1. **使用 BullMQ**（Redis 队列）
2. **使用 AWS SQS**
3. **使用 RabbitMQ**

### 添加用户认证

1. **使用 Clerk**（推荐）
   ```bash
   npm install @clerk/nextjs
   ```

2. **使用 NextAuth.js**
   ```bash
   npm install next-auth
   ```

---

## 🎉 完成！

你的 AI Writer 现在已经部署到生产环境了！

如果有任何问题，请查看：
- [Railway 文档](https://docs.railway.app/)
- [Vercel 文档](https://vercel.com/docs)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Next.js 文档](https://nextjs.org/docs)
