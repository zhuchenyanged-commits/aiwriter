# AI Writer 系统部署完整指南
## 大师级操作流程 - 从后端到前端完整配置

---

## 📋 部署状态概览

✅ **已完成：**
- GitHub 仓库配置
- Railway 后端部署
- Procfile 配置
- 域名分配：`https://aiwriter-production.up.railway.app`

⏳ **待完成（本指南将引导完成）：**
- [ ] 步骤 1: 配置后端环境变量
- [ ] 步骤 2: 验证后端 API 功能
- [ ] 步骤 3: 部署前端到 Vercel
- [ ] 步骤 4: 配置前端环境变量
- [ ] 步骤 5: 端到端测试
- [ ] 步骤 6: 生产环境验证

---

## 🔑 步骤 1: 配置后端环境变量

### 目标
为 Railway 后端添加必需的 API 密钥

### 操作清单

#### 1.1 打开 Railway 项目设置

**操作路径：**
```
Railway 项目页面 → 点击项目名称 → 查找 "Variables" 或 "Settings"
```

**视觉提示：**
- 左侧导航找 🔑 "Variables" 或 ⚙️ "Settings"
- 或右上角齿轮图标

#### 1.2 添加环境变量

**变量 1: Anthropic API Key**

```
KEY:   ANTHROPIC_API_KEY
VALUE: sk-ant-api03-... (您的 Anthropic API 密钥)
```

**获取密钥：**
1. 访问 https://console.anthropic.com/
2. 登录 → API Keys → Create Key
3. 复制密钥（只显示一次，请保存）

---

**变量 2: Google API Key**

```
KEY:   GOOGLE_API_KEY
VALUE: AIzaSy... (您的 Google API 密钥)
```

**获取密钥：**
1. 访问 https://makersuite.google.com/app/apikey
2. 登录 → Create API Key
3. 复制密钥

#### 1.3 保存并重新部署

**操作：**
- 添加完变量后，Railway 会自动重新部署
- 等待 2-3 分钟直到部署完成
- 状态变为 🟢 "Active"

**验证点：**
- [ ] 环境变量已添加（在 Variables 页面能看到）
- [ ] 部署状态为 Active（绿色）
- [ ] 日志中无错误信息

---

## 🧪 步骤 2: 验证后端 API

### 目标
确认后端所有功能正常工作

### 操作清单

#### 2.1 健康检查

**在浏览器访问：**
```
https://aiwriter-production.up.railway.app/health
```

**期望结果：**
```json
{"status": "healthy"}
```

**✅ 通过条件：** 返回 JSON 且状态码为 200

---

#### 2.2 查看 API 文档

**在浏览器访问：**
```
https://aiwriter-production.up.railway.app/docs
```

**应该看到：**
- FastAPI Swagger UI 界面
- 所有 API 端点列表：
  - POST /api/generate
  - GET /api/status
  - GET /api/articles
  - POST /api/articles/{id}
  - DELETE /api/articles/{id}

**✅ 通过条件：** 能看到完整的 API 文档界面

---

#### 2.3 测试状态接口

**在浏览器访问：**
```
https://aiwriter-production.up.railway.app/api/status
```

**期望结果：**
```json
{
  "status": "operational",
  "models": {
    "anthropic": "configured",
    "google": "configured"
  },
  "storage": "connected"
}
```

**✅ 通过条件：** 所有状态显示 "configured" 或 "connected"

**⚠️ 如果显示 "not configured"：**
- 检查环境变量是否正确添加
- 等待 Railway 重新部署完成

---

## 🎨 步骤 3: 部署前端到 Vercel

### 目标
将 Next.js 前端部署到生产环境

### 操作清单

#### 3.1 准备 Vercel 账号

**访问：** https://vercel.com/

**操作：**
1. 使用 GitHub 登录
2. 授权 Vercel 访问仓库
3. 进入 Dashboard

#### 3.2 导入前端项目

**操作路径：**
```
Vercel Dashboard → "Add New..." → "Project"
```

**配置项目：**
1. **导入 GitHub 仓库**
   - 选择：`zhuchenyanged-commits/aiwriter`
   - Root Directory：设置为 `frontend`

2. **配置项目设置**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build (自动检测)
   Output Directory: .next (自动检测)
   ```

3. **点击 "Deploy"**
   - 等待 2-3 分钟
   - 部署成功后会获得域名

**✅ 通过条件：**
- Vercel 部署成功
- 获得 `https://aiwriter.vercel.app` 类似域名

---

## 🔗 步骤 4: 配置前端环境变量

### 目标
连接前端到 Railway 后端

### 操作清单

#### 4.1 在 Vercel 添加环境变量

**操作路径：**
```
Vercel 项目 → Settings → Environment Variables
```

**添加变量：**

```
KEY:   NEXT_PUBLIC_API_URL
VALUE: https://aiwriter-production.up.railway.app
```

**重要提示：**
- 变量名必须是 `NEXT_PUBLIC_API_URL`（NEXT_PUBLIC_ 前缀）
- 值使用 Railway 后端域名（不要加 /）
- 不要在末尾加斜杠 /

#### 4.2 重新部署前端

**操作路径：**
```
Vercel 项目 → Deployments → 点击最新部署右侧 "..." → "Redeploy"
```

或者：
- 推送任意代码到 GitHub 触发自动部署

**✅ 通过条件：**
- 前端重新部署成功
- 访问前端域名能正常加载

---

## 🎯 步骤 5: 端到端测试

### 目标
验证完整系统功能

### 测试场景

#### 测试 1: 访问首页

**操作：**
```
在浏览器打开前端域名
例如：https://aiwriter.vercel.app
```

**✅ 预期结果：**
- 页面正常加载
- 无控制台错误
- UI 显示正常

---

#### 测试 2: 创建文章（核心功能）

**操作：**
1. 在首页点击 "创建文章" 或类似按钮
2. 输入主题，例如："人工智能的未来"
3. 选择等级/风格（如果有）
4. 点击生成

**✅ 预期结果：**
- 请求发送到后端
- 后端调用 AI API
- 返回生成的内容
- 前端显示结果

**⏱️ 预计时间：** 10-30 秒（AI 生成需要时间）

---

#### 测试 3: 查看文章列表

**操作：**
```
访问：https://aiwriter.vercel.app/articles
或点击导航栏的 "文章" / "Articles"
```

**✅ 预期结果：**
- 显示所有生成的文章列表
- 能看到文章标题、状态等信息

---

#### 测试 4: API 调用验证

**打开浏览器开发者工具：**
- Mac: Cmd + Option + I
- Windows: F12 或 Ctrl + Shift + I

**切换到 Network 标签：**

**操作：**
1. 创建一个新文章
2. 观察 Network 面板

**✅ 预期结果：**
```
Request URL: https://aiwriter-production.up.railway.app/api/generate
Method: POST
Status: 200
```

**检查要点：**
- [ ] 请求发送到正确的后端域名
- [ ] 状态码为 200
- [ ] Response 包含生成的文章内容

---

## 🚀 步骤 6: 生产环境验证

### 目标
确保系统在生产环境稳定运行

### 检查清单

#### 6.1 后端监控

**在 Railway 项目：**
- [ ] 查看 Metrics 标签
- [ ] 确认 CPU、内存使用正常
- [ ] 检查错误率是否为 0

**查看日志：**
```
Deployments → 最新部署 → Logs 标签
```

**检查要点：**
- [ ] 无 ERROR 级别日志
- [ ] 请求正常响应
- [ ] 健康检查通过

---

#### 6.2 前端监控

**在 Vercel 项目：**
- [ ] 查看 Analytics 标签
- [ ] 确认页面加载速度 < 3秒
- [ ] 错误率 = 0%

**查看部署日志：**
```
Deployments → 最新部署 → Functions
```

**检查要点：**
- [ ] 所有函数构建成功
- [ ] 无运行时错误

---

#### 6.3 跨域配置验证

**测试 CORS：**
```bash
# 在命令行执行
curl -H "Origin: https://aiwriter.vercel.app" \
     https://aiwriter-production.up.railway.app/api/status
```

**✅ 预期结果：**
- 返回包含 CORS 头的响应
- 状态码 200

---

## 📊 部署完成检查表

### 后端 (Railway)
- [ ] 🟢 状态为 Active
- [ ] 🔑 环境变量已配置
- [ ] 🌐 域名可访问
- [ ] ✅ /health 端点返回 200
- [ ] ✅ /docs 页面可访问
- [ ] ✅ API 功能正常

### 前端 (Vercel)
- [ ] 🟢 部署成功
- [ ] 🔗 环境变量已配置
- [ ] 🌐 域名可访问
- [ ] ✅ 页面加载正常
- [ ] ✅ API 调用成功
- [ ] ✅ 无控制台错误

### 集成测试
- [ ] 🎯 创建文章功能正常
- [ ] 🎯 查看文章列表正常
- [ ] 🎯 API 响应时间 < 10秒
- [ ] 🎯 跨域配置正确

---

## 🎉 部署成功！

### 您的生产环境地址

**前端：** `https://aiwriter.vercel.app` (Vercel 域名)
**后端：** `https://aiwriter-production.up.railway.app` (Railway 域名)

### 下一步优化建议

1. **配置自定义域名**
   - 前端：Vercel Settings → Domains
   - 后端：Railway Settings → Domains

2. **设置监控告警**
   - Railway: Metrics → Alerts
   - Vercel: Analytics → Alerts

3. **配置 CDN**
   - Vercel 自动配置 Cloudflare

4. **数据库持久化**
   - 考虑升级 Railway PostgreSQL
   - 配置定期备份

5. **API 限流**
   - 添加速率限制
   - 防止滥用

---

## 🆘 故障排查

### 问题：前端无法连接后端

**检查：**
1. NEXT_PUBLIC_API_URL 是否正确？
2. 后端是否正常运行？
3. CORS 是否正确配置？

**解决：**
- 检查浏览器控制台错误
- 查看 Network 标签请求
- 验证后端健康检查

### 问题：AI 生成失败

**检查：**
1. API 密钥是否正确？
2. 是否有配额限制？
3. 后端日志有无错误？

**解决：**
- 验证 API 密钥有效性
- 检查 API 账户余额
- 查看 Railway 部署日志

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. 具体的错误信息
2. 浏览器控制台截图
3. Railway/Vercel 部署日志
4. Network 标签请求详情

祝部署顺利！🚀
