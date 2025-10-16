#!/usr/bin/env python3
"""
🎮 Modern Typing Adventure - Easy Launcher
一键启动游戏化英文打字练习应用
"""

import webbrowser
import http.server
import socketserver
import threading
import time
import sys
import os

def find_available_port(start_port=8081):
    """寻找可用端口"""
    import socket
    for port in range(start_port, start_port + 10):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def start_server(port):
    """启动HTTP服务器"""
    class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass  # 静默日志输出
    
    with socketserver.TCPServer(("", port), QuietHTTPRequestHandler) as httpd:
        print(f"🚀 Server started at http://localhost:{port}")
        httpd.serve_forever()

def main():
    print("🎮 Modern Typing Adventure")
    print("=" * 40)
    
    # 检查文件是否存在
    if not os.path.exists('modern-demo.html'):
        print("❌ Error: modern-demo.html not found!")
        print("Please run this script from the project directory.")
        sys.exit(1)
    
    # 寻找可用端口
    port = find_available_port()
    if not port:
        print("❌ Error: No available ports found!")
        sys.exit(1)
    
    # 显示游戏特性
    print("🌟 Game Features:")
    print("   🔥 Combo system with visual effects")
    print("   🏆 Achievement system with unlocks")
    print("   🎨 4 beautiful themes (Cyber/Nature/Sunset/Ocean)")
    print("   📊 Real-time WPM speed meter")
    print("   🎵 Keyboard sound effects")
    print("   ✨ Particle animations & explosions")
    print("   📚 English typing practice texts")
    print("")
    
    # 在后台启动服务器
    server_thread = threading.Thread(target=start_server, args=(port,), daemon=True)
    server_thread.start()
    
    # 等待服务器启动
    time.sleep(1)
    
    # 自动打开浏览器
    url = f"http://localhost:{port}/modern-demo.html"
    print(f"🌐 Opening browser: {url}")
    webbrowser.open(url)
    
    print("\n🎯 How to play:")
    print("   1. Choose your favorite theme")
    print("   2. Click 'START TYPING ADVENTURE'")
    print("   3. Type the English text shown")
    print("   4. Build combos for higher scores!")
    print("   5. Unlock achievements!")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 40)
    
    try:
        # 保持程序运行
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Game server stopped. Thanks for playing!")

if __name__ == "__main__":
    main()