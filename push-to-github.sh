#!/bin/bash

# AI Writer - GitHub 推送脚本

echo "🚀 正在推送代码到 GitHub..."

cd /Users/eddie.zhu/skills/aiwriter-tech

# 设置 Git credential helper
git config credential.helper store

# 添加远程仓库（如果还没有）
if ! git remote get-url origin &>/dev/null; then
    git remote add origin https://zhuchenyanged-commits@github.com/zhuchenyanged-commits/aiwriter.git
fi

# 推送代码
echo "请输入 GitHub Personal Access Token（作为密码）："
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "访问你的仓库："
    echo "https://github.com/zhuchenyanged-commits/aiwriter"
    echo ""
    echo "下一步："
    echo "1. 回到这个对话告诉我'推送成功'"
    echo "2. 我会立即帮你部署到 Railway + Vercel"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. Token 是否正确"
    echo "2. 网络连接是否正常"
    echo "3. 仓库地址是否正确"
fi
