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
  - Linux: `webkit2gtk`, `libappindicator3`, `librsvg2-dev`
  - macOS: Xcode Command Line Tools
  - Windows: Microsoft Visual Studio C++ Build Tools

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

```bash
npm run dev
# 或
cargo tauri dev
```

### 4. 构建生产版本

```bash
npm run build
# 或
cargo tauri build
```

构建产物位于 `src-tauri/target/release/` 目录。

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
