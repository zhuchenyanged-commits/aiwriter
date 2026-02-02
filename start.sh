#!/bin/bash

echo "🚀 Starting AI Writer..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# 启动后端
echo "📦 Starting backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit backend/.env and add your API keys"
    echo "   Press Enter when done..."
    read
fi

pip install -r requirements.txt
python main.py &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"

# 等待后端启动
sleep 5

# 启动前端
echo "🎨 Starting frontend..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from .env.local.example..."
    cp .env.local.example .env.local
fi

npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 AI Writer is now running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# 等待用户中断
trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
