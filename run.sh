#!/bin/bash

# 私人助手 - 快速启动脚本

echo "🍅 私人助手 - 番茄钟应用"
echo "=========================="
echo ""

# 检查 Rust 是否安装
if ! command -v cargo &> /dev/null; then
    echo "❌ 错误: 未找到 Rust/Cargo"
    echo "请先安装 Rust: https://www.rust-lang.org/tools/install"
    exit 1
fi

# 检查 Tauri CLI 是否安装
if ! command -v tauri &> /dev/null && ! cargo tauri --version &> /dev/null; then
    echo "⚠️  未找到 Tauri CLI，正在安装..."
    cargo install tauri-cli
fi

echo "✅ 环境检查通过"
echo ""
echo "🚀 启动开发模式..."
echo ""

# 进入 src-tauri 目录运行
cd src-tauri
cargo tauri dev
