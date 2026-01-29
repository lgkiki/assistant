# 图标文件

请在此目录放置应用图标文件：

- `32x32.png` - 32x32 像素 PNG 图标
- `128x128.png` - 128x128 像素 PNG 图标
- `128x128@2x.png` - 256x256 像素 PNG 图标（高分辨率）
- `icon.icns` - macOS 图标文件
- `icon.ico` - Windows 图标文件

## 生成图标

你可以使用在线工具或图像编辑软件生成这些图标：
- [Tauri Icon Generator](https://github.com/tauri-apps/tauri-icon)
- [ImageMagick](https://imagemagick.org/) 或其他图像处理工具

## 临时方案

如果暂时没有图标文件，可以创建简单的占位图标，或者注释掉 `tauri.conf.json` 中的图标配置。
