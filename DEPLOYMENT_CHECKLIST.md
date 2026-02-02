# 🚀 AI Writer 部署清单

## ✅ 代码准备
- [x] Git 仓库初始化
- [x] 首次提交完成
- [ ] 创建 GitHub 仓库（待用户完成）
- [ ] 推送代码到 GitHub

## 🔧 后端部署 (Railway)

### 准备工作
- [ ] 创建 GitHub 仓库
- [ ] 获取仓库地址

### 部署步骤
1. [ ] 登录 https://railway.app
2. [ ] 点击 "New Project" → "Deploy from GitHub repo"
3. [ ] 选择 `aiwriter-tech` 仓库
4. [ ] 配置：
   - **Root Directory**: `backend`
   - **Dockerfile**: 自动检测 `backend/Dockerfile`

5. [ ] 添加环境变量：
   ```
   GPT5_API_KEY=sk-jcu7PHNo8ym4lbnLnllRbqGqaRIJocxUXfgvKECkZBbRBnZh
   GEMINI_API_KEY=sk-IKXHApO5ZZD94qSKmoZVotpukAOryLi1ky4041DBefG26ymQ
   FRONTEND_URL=https://你的前端域名.vercel.app
   DATABASE_URL=postgresql://... (Railway 提供)
   ```

6. [ ] 点击 "Deploy"
7. [ ] 等待部署完成（约 2-3 分钟）
8. [ ] 复制生成的域名（如：`aiwriter-backend.up.railway.app`）

## 🎨 前端部署 (Vercel)

### 准备工作
- [ ] 代码已推送到 GitHub

### 部署步骤
1. [ ] 登录 https://vercel.com
2. [ ] 点击 "Add New" → "Project"
3. [ ] 导入 GitHub 仓库 (`aiwriter-tech`)
4. [ ] 配置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`（自动检测）
   - **Output Directory**: `.next`（自动检测）

5. [ ] 添加环境变量：
   ```
   NEXT_PUBLIC_API_URL=https://你的后端域名.up.railway.app
   ```

6. [ ] 点击 "Deploy"
7. [ ] 等待部署完成（约 1-2 分钟）
8. [ ] 访问生成的域名（如：`aiwriter-tech.vercel.app`）

## 🔗 连接前后端

### 更新后端 CORS
1. [ ] 回到 Railway 项目
2. [ ] 更新环境变量 `FRONTEND_URL`
3. [ ] 重新部署

### 测试
1. [ ] 访问前端 Vercel 域名
2. [ ] 尝试生成一篇文章
3. [ ] 检查是否成功调用后端 API

## 📊 部署后的 URL

- **前端**: https://aiwriter-tech.vercel.app（示例）
- **后端**: https://aiwriter-backend.up.railway.app（示例）
- **API**: https://aiwriter-backend.up.railway.app/docs

## 🎉 部署完成标志

- [ ] 前端可访问
- [ ] 后端 API 可访问
- [ ] 文章生成功能正常
- [ ] 数据库持久化正常
- [ ] 文章列表正常显示

## 💡 提示

1. **免费额度监控**
   - Railway: $5 免费额度/月
   - Vercel: 100GB 带宽/月
   - 监控使用量避免超额

2. **数据持久化**
   - Railway PostgreSQL (512MB 免费)
   - 部署后会自动切换到 PostgreSQL
   - SQLite 数据会丢失（需要迁移或接受）

3. **自定义域名**（可选）
   - 在 Vercel: Settings → Domains
   - 在 Railway: Settings → Domains
   - 配置 DNS CNAME 记录

---

**准备好后告诉我，我会继续带领你完成部署！** 🚀
