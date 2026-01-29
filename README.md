# 私人助手 - 番茄钟应用

一个基于 Rust + Tauri 开发的桌面级私人助手应用，当前实现了番茄钟（Pomodoro）功能。

## 功能特性

- ⏱️ **番茄钟计时器**：支持自定义时间设置（默认25分钟）
- ▶️ **开始/暂停/重置**：完整的计时器控制功能
- 🔔 **提醒通知**：计时结束时自动弹出系统通知
- 📊 **可视化进度**：圆形进度条显示剩余时间
- 🎨 **现代化UI**：美观的渐变界面设计
- ⚡ **高性能**：基于 Rust 后端，资源占用低

## 技术栈

- **后端**: Rust + Tauri
- **前端**: HTML + CSS + JavaScript
- **特性**: 系统通知、事件通信

## 开发环境要求

- Rust (最新稳定版)
- Node.js (用于 Tauri CLI)
- 系统依赖：
  - **Linux**: `webkit2gtk`, `libappindicator3`, `librsvg2-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools 或 Visual Studio 2019/2022（包含 C++ 工作负载）

### Windows 详细安装步骤

1. **安装 Rust**
   - 访问 https://www.rust-lang.org/tools/install
   - 下载并运行 `rustup-init.exe`
   - 按照提示完成安装

2. **安装 Visual Studio Build Tools**
   - 下载 Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
   - 选择 "C++ build tools" 工作负载
   - 或者安装完整的 Visual Studio（任何版本，包含 C++ 开发工具）

3. **安装 Node.js**
   - 访问 https://nodejs.org/
   - 下载并安装 LTS 版本

4. **安装 Tauri CLI**
   ```powershell
   cargo install tauri-cli
   # 或
   npm install -g @tauri-apps/cli
   ```

## 安装与运行

### 1. 安装 Tauri CLI

```bash
npm install -g @tauri-apps/cli
# 或
cargo install tauri-cli
```

### 2. 安装依赖

```bash
# 前端依赖（如果需要）
npm install

# Rust 依赖会自动通过 Cargo 安装
```

### 3. 开发模式运行

**Linux/macOS:**
```bash
npm run dev
# 或
cd src-tauri && cargo tauri dev
```

**Windows (PowerShell):**
```powershell
npm run dev
# 或
cd src-tauri; cargo tauri dev
```

也可以直接运行 `run.sh` (Linux/macOS) 或 `run.bat` (Windows)

### 4. 构建生产版本

**Linux/macOS:**
```bash
npm run build
# 或
cd src-tauri && cargo tauri build
```

**Windows (PowerShell):**
```powershell
npm run build
# 或
cd src-tauri; cargo tauri build
```

构建产物位于 `src-tauri/target/release/` 目录：
- **Windows**: `src-tauri/target/release/assistant.exe` 或安装包在 `src-tauri/target/release/bundle/msi/`
- **Linux**: `src-tauri/target/release/assistant` 或 AppImage/DEB 包
- **macOS**: `src-tauri/target/release/assistant.app` 或 DMG 包

## 项目结构

```
assistant/
├── dist/                 # 前端文件
│   ├── index.html       # 主页面
│   ├── style.css        # 样式文件
│   └── main.js          # 前端逻辑
├── src-tauri/           # Rust 后端
│   └── src/
│       └── main.rs      # 主程序入口
├── Cargo.toml           # Rust 依赖配置
├── tauri.conf.json      # Tauri 配置文件
├── build.rs             # 构建脚本
└── package.json         # Node.js 配置
```

## 跨平台支持

✅ **完全支持 Windows、macOS 和 Linux**

本项目使用 Tauri 框架开发，原生支持三大主流操作系统：
- 🪟 **Windows 10/11** - 需要 Visual Studio Build Tools（开发时）
- 🍎 **macOS 10.13+** - 需要 Xcode Command Line Tools（开发时）
- 🐧 **Linux** - 需要 webkit2gtk 等依赖（开发时）

所有功能在所有平台上都能正常工作，包括：
- 系统通知
- 窗口管理
- 文件系统访问
- 原生对话框

## 运行已编译的程序（assistant.exe）

如果你已经获得了编译好的 `assistant.exe` 文件，**不需要安装 Rust、Node.js 或 Visual Studio**。

### Windows 运行前置要求

运行 `assistant.exe` 只需要：

1. **Microsoft Edge WebView2 Runtime**（必需）
   - Windows 10/11 通常已自带
   - 如果程序无法启动或出现白屏，请下载安装：
     - 下载地址：https://developer.microsoft.com/microsoft-edge/webview2/
     - 选择 "Evergreen Runtime" 版本

2. **Visual C++ Redistributable**（可能需要）
   - 如果提示缺少 DLL 文件（如 `VCRUNTIME140.dll`），请安装：
     - 下载地址：https://aka.ms/vs/17/release/vc_redist.x64.exe
     - 或搜索 "Microsoft Visual C++ Redistributable 2015-2022"

### 运行方式

直接双击 `assistant.exe` 即可运行，无需任何额外配置。

## 使用说明

1. **设置时间**：点击预设按钮（25分钟、15分钟、5分钟、10分钟）快速设置
2. **开始计时**：点击"开始"按钮启动番茄钟
3. **暂停计时**：点击"暂停"按钮暂停当前计时
4. **重置计时**：点击"重置"按钮恢复到初始时间
5. **完成提醒**：计时结束时自动弹出系统通知和对话框提醒

## 未来计划

- [ ] 添加休息时间提醒
- [ ] 统计功能（完成次数、总时长）
- [ ] 自定义主题
- [ ] 快捷键支持
- [ ] 更多助手功能模块

## 许可证

MIT License
