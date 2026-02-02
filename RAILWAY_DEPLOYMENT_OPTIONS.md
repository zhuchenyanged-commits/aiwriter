# Railway 部署方案说明

## 🔥 方案 1: Nixpacks（推荐）

**优点：**
- Railway 原生支持，自动检测配置
- 最简单，无需手动配置 Docker
- 自动处理 Python 依赖

**配置文件：**
- `railway.json` - 已配置为使用 NIXPACKS
- `backend/nixpacks.toml` - Nixpacks 配置

**适用场景：** 大多数情况下的首选方案

---

## 🐳 方案 2: 根目录 Dockerfile

**优点：**
- 完全控制构建过程
- 路径清晰（从根目录构建）
- 适合需要自定义构建的场景

**配置文件：**
- `Dockerfile`（根目录）
- 修改 `railway.json` 的 `dockerfilePath` 为 `Dockerfile`

**适用场景：** 需要 Docker 高级功能时

**启用方法：**
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

---

## 📝 方案 3: Procfile

**优点：**
- Heroku 兼容
- 最简单的配置文件
- 适合简单应用

**配置文件：**
- `Procfile`
- 需要设置 `PYTHON_VERSION` 环境变量为 `3.10`

**适用场景：** 从 Heroku 迁移或简单应用

**启用方法：**
删除或重命名 `railway.json`，让 Railway 自动检测

---

## ✅ 当前配置

**已启用：** 方案 1 (Nixpacks)

配置文件：
- `railway.json` - 使用 NIXPACKS builder
- `backend/nixpacks.toml` - Python 构建配置
- `backend/requirements.txt` - Python 依赖

---

## 🚀 部署步骤

### 1. 确认配置
```bash
cat railway.json
```

### 2. 提交并推送
```bash
git add .
git commit -m "feat: 添加多种 Railway 部署方案"
git push
```

### 3. 在 Railway 配置环境变量
```
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
PYTHON_VERSION=3.10
```

### 4. 监控部署
在 Railway 控制台查看构建日志

---

## 🔄 切换方案

### 切换到 Dockerfile（根目录）：
修改 `railway.json`：
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

### 切换到 Procfile：
删除 `railway.json`：
```bash
mv railway.json railway.json.bak
```

---

## 🐛 故障排查

### 如果 Nixpacks 失败：
1. 检查 `backend/requirements.txt` 是否存在
2. 确认所有依赖都正确列出
3. 查看 Railway 构建日志

### 如果 Dockerfile 失败：
1. 确认 Docker 构建在本地成功
2. 检查文件路径是否正确
3. 查看 Docker 构建日志

### 如果所有方案都失败：
考虑使用 Railway 的 **Python 模板**重新创建项目：
1. 在 Railway 创建新项目
2. 选择 "Python" 模板
3. 连接 GitHub 仓库
4. 设置根目录为 `backend`
