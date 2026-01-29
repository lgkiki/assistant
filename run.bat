@echo off
REM 私人助手 - Windows 快速启动脚本

echo.
echo ========================================
echo   私人助手 - 番茄钟应用
echo ========================================
echo.

REM 检查 Rust 是否安装
where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 Rust/Cargo
    echo 请先安装 Rust: https://www.rust-lang.org/tools/install
    pause
    exit /b 1
)

REM 检查是否在正确的目录
if not exist "src-tauri\Cargo.toml" (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo [信息] 环境检查通过
echo.
echo [信息] 启动开发模式...
echo.

REM 进入 src-tauri 目录并运行
cd src-tauri
cargo tauri dev

pause
