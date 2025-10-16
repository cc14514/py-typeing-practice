#!/bin/bash

echo "🎮 Modern Typing Adventure Launcher"
echo "=================================="
echo ""

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# 寻找可用端口
find_available_port() {
    for port in 8081 8082 8083 8084 8085; do
        if check_port $port; then
            echo "✅ Found available port: $port"
            return $port
        fi
    done
    echo "❌ No available ports found"
    exit 1
}

# 启动服务器
start_server() {
    local port=$1
    echo "🚀 Starting server on port $port..."
    echo "📍 URL: http://localhost:$port/modern-demo.html"
    echo ""
    echo "🎯 Game Features:"
    echo "   • 🔥 Combo system with explosions"
    echo "   • 🏆 Achievement unlocks"
    echo "   • 🎨 4 beautiful themes"
    echo "   • 📊 Real-time WPM meter"
    echo "   • 🎵 Keyboard sound effects"
    echo "   • ✨ Particle animations"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "=================================="
    
    python3 -m http.server $port
}

# 主程序
cd "$(dirname "$0")"

if [ ! -f "modern-demo.html" ]; then
    echo "❌ modern-demo.html not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

find_available_port
PORT=$?
start_server $PORT