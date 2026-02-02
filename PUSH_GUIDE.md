# 📤 推送代码到 GitHub - 快速指南

## 方法 1: 使用 GitHub CLI（推荐，最简单）

如果你已安装 gh 命令行工具：

```bash
# 1. 登录 GitHub
gh auth login

# 2. 推送代码
git push -u origin main
```

---

## 方法 2: 使用 Personal Access Token

### 步骤 1: 创建 Token
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate token (classic)"
3. 勾选 `repo` 权限
4. 点击 "Generate token"
5. **重要**：复制生成的 token（只显示一次）

### 步骤 2: 推送代码
```bash
# 在项目目录执行
cd /Users/eddie.zhu/skills/aiwriter-tech

# 添加远程仓库（如果还没添加）
git remote add origin https://github.com/zhuchenyanged-commits/aiwriter.git

# 推送代码（会提示输入用户名和 token）
git push -u origin main

# Username: 你的 GitHub 用户名
# Password: 粘贴刚才生成的 Token（不是密码！）
```

---

## 方法 3: 使用 SSH 密钥（最安全，但配置复杂）

### 步骤 1: 生成 SSH 密钥
```bash
# 生成密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

### 步骤 2: 添加到 GitHub
1. 复制公钥内容
2. 访问：https://github.com/settings/ssh
3. 点击 "New SSH key"
4. 粘贴公钥，添加

### 步骤 3: 修改远程仓库地址为 SSH
```bash
git remote set-url origin git@github.com:zhuchenyanged-commits/aiwriter.git

# 推送代码
git push -u origin main
```

---

## 🎯 推荐方案

作为开发端大师，我推荐使用 **方法 2（Personal Access Token）**：

**原因**：
- ✅ 配置简单（2 分钟）
- ✅ 不需要安装额外工具
- ✅ 一次性配置，长期有效
- ✅ 安全性可控

**执行步骤**：

```bash
cd /Users/eddie.zhu/skills/aiwriter-tech
git push -u origin main
```

会提示输入：
- **Username**: `zhuchenyanged-commits`
- **Password**: 你的 Personal Access Token

---

## 🚨 推送成功后的下一步

推送成功后，告诉我："推送成功"，我会立即帮你：
1. ✅ 部署后端到 Railway
2. ✅ 部署前端到 Vercel
3. ✅ 配置环境变量
4. ✅ 测试线上功能

---

**准备好后，告诉我推送结果，我们继续！** 🚀
