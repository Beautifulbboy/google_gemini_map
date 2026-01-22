<div align="center"> 

# Gemini Chat Minimap

</div>

<p align="center">
  <a href="https://github.com/Beautifulbboy/gemini-chat-minimap.git">
    <img src="./icons/icon-origin.png" alt="Logo" width="18%">
  </a>

<div align="center"><a href="README.md" >English</a> | 简体中文</div>

---

这是一个专为增强 Gemini (Google AI) 聊天体验而设计的浏览器扩展程序。它在页面右侧添加了一个类似 **VS Code Minimap** 的交互式导航条，帮助用户在长对话中快速定位、预览和跳转。

### 🌟 核心功能

* **可视化对话流**：在右侧展示整个对话的缩略图，蓝色块代表用户提问，绿色块代表 Gemini 回答。
* **交互式预览**：鼠标悬停在缩略块上时，左侧会弹出悬浮卡片，展示该段对话的文字摘要。
* **智能遮罩指示器**：采用遮罩高亮风格，实时追踪当前阅读的对话组（提问+回答），提供极佳的视觉反馈。
* **精准一键跳转**：点击缩略块，页面将平滑滚动至对应位置，并自动预留顶部边距以避开导航栏。
* **高性能渲染**：采用增量更新逻辑，仅在对话数量变化时触发重绘，彻底解决页面闪烁问题。
* **沉浸式设计**：支持背景模糊 (Backdrop Filter) 和鼠标穿透，不干扰正常的网页操作。

### 🛠️ 安装步骤

1.  **准备文件**：确保 `manifest.json`, `content.js`, 和 `styles.css` 保存在同一个文件夹中。
2.  **打开扩展程序页面**：在 Chrome 浏览器地址栏输入 `chrome://extensions/`。
3.  **启用开发者模式**：点击右上角的“开发者模式”开关。
4.  **加载插件**：点击“加载已解压的扩展程序”，选择包含上述文件的文件夹。
5.  **开始使用**：刷新 [Gemini](https://gemini.google.com/) 页面即可看到右侧的 Minimap。

### 🔧 自定义调节

* **跳转间距**：修改 `content.js` 中的 `containerOffset` (当前为 20) 或 `offset` (当前为 70) 来调整跳转后的位置。
* **容器高度与位置**：修改 `styles.css` 中 `#gemini-minimap-container` 的 `top` (当前为 80px) 或 `height` (当前为 80vh)。
