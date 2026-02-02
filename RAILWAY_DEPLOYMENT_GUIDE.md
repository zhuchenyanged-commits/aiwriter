# Railway 后端部署指南 - 从零开始

## 📦 当前部署配置（最简方案）

您的后端使用 **Heroku 标准配置**，Railway 会自动识别：

```
backend/
├── Procfile          # 启动命令
├── runtime.txt       # Python 版本
├── requirements.txt  # Python 依赖
└── main.py           # 应用入口
```

**无其他配置文件！** 之前删除了所有 railway.json、Dockerfile 等复杂配置。

---

## 🚀 第一次登录 Railway 部署步骤

### 1. 登录 Railway
访问：https://railway.app/

### 2. 创建新项目
- 点击 **"New Project"**
- 选择 **"Deploy from GitHub repo"**

### 3. 连接 GitHub
- 点击 **"Connect GitHub"**
- 授权 Railway 访问您的仓库
- 找到并选择：`zhuchenyanged-commits/aiwriter`

### 4. 配置部署（重要！）

在部署配置页面：

#### **Root Directory（根目录）**
```
backend
```
⚠️ **关键！** 必须设置为 `backend`，因为所有文件在 backend 目录

#### **Environment Variables（环境变量）**
点击 "+ New Variable" 添加：

```
ANTHROPIC_API_KEY = your_anthropic_key_here
GOOGLE_API_KEY = your_google_key_here
PORT = 8000
```

### 5. 开始部署
- 点击 **"Deploy Now"**
- Railway 会自动检测 Procfile 和 runtime.txt
- 等待构建完成（约 2-3 分钟）

---

## ✅ 部署成功的标志

成功后您会看到：
- ✅ 绿色的 "Active" 状态
- ✅ 分配的域名，如：`https://aiwriter-backend.up.railway.app`
- ✅ 可以访问 https://your-domain.up.railway.app/docs 查看 API 文档

---

## 🔴 如果部署失败

### 查看构建日志
1. 点击项目
2. 进入 "Deployments" 标签
3. 点击失败的部署
4. 查看 "Build logs"

### 常见问题

#### 问题 1: "Cannot find module 'main'"
**原因：** Root Directory 未设置或设置错误
**解决：** 设置 Root Directory = `backend`

#### 问题 2: "Python version not found"
**原因：** runtime.txt 文件错误
**解决：** 确保 backend/runtime.txt 内容为 `python-3.10`

#### 问题 3: "Missing dependencies"
**原因：** requirements.txt 问题
**解决：** 检查 backend/requirements.txt 是否存在且格式正确

#### 问题 4: "Port already in use"
**原因：** PORT 环境变量问题
**解决：** 确保设置 PORT = 8000，或删除让 Railway 自动分配

---

## 🧪 测试部署

部署成功后，测试 API：

```bash
# 健康检查
curl https://your-domain.up.railway.app/health

# API 文档
浏览器打开: https://your-domain.up.railway.app/docs
```

---

## 🔧 高级配置（可选）

### 添加自定义域名
1. 项目设置 → "Domains"
2. 点击 "Add Domain"
3. 输入您的域名并配置 DNS

### 查看实时日志
1. 点击项目
2. "Deployments" → 选择部署
3. 点击 "Logs" 标签

### 设置自动部署
Railway 默认启用：
- 推送到 GitHub main 分支
- 自动触发新部署

---

## 📝 文件说明

### backend/Procfile
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```
- 定义启动命令
- `web:` 表示 web 服务
- `$PORT` 是 Railway 提供的环境变量

### backend/runtime.txt
```
python-3.10
```
- 指定 Python 版本
- Railway 会自动安装该版本

### backend/requirements.txt
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
...
```
- Python 依赖列表
- Railway 会自动安装

---

## 🎯 总结

**核心要点：**
1. ✅ Root Directory 设置为 `backend`
2. ✅ 添加必要的环境变量
3. ✅ 无需其他配置文件
4. ✅ Railway 自动检测 Procfile

**部署流程：**
连接 GitHub → 选择仓库 → 设置 Root=backend → 添加环境变量 → Deploy

---

## 🆘 需要帮助？

如果还有问题，请提供：
1. 部署日志的完整错误信息
2. Railway 设置页面的截图
3. Root Directory 和环境变量的配置
