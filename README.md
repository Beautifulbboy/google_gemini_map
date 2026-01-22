# Gemini Chat Minimap

[English] | [简体中文](./README.zh-CN.md)

---

<a name="english"></a>
## English

An interactive browser extension designed to enhance the Gemini (Google AI) chat experience. It adds a navigation bar similar to the **VS Code Minimap** on the right side of the page, helping users quickly locate, preview, and jump through long conversations.

### 🌟 Key Features

* **Visual Conversation Flow**: Displays a thumbnail of the entire conversation on the right, with blue blocks for user queries and green blocks for Gemini responses.
* **Interactive Preview**: Hovering over a block triggers a floating card on the left that displays a text summary of that specific dialogue.
* **Smart Mask Indicator**: A semi-transparent blue mask tracks the currently viewed "Question + Answer" pair in real-time, providing excellent visual feedback.
* **Precise One-Click Jump**: Clicking a block smoothly scrolls the page to the corresponding position with a custom top offset to avoid being obscured by the navigation bar.
* **High-Performance Rendering**: Uses incremental update logic to re-render only when the number of messages changes, completely eliminating page flickering.
* **Immersive Design**: Supports backdrop blur effects and mouse passthrough, ensuring no interference with normal web operations.

### 🛠️ Installation

1.  **Prepare Files**: Ensure `manifest.json`, `content.js`, and `styles.css` are saved in the same folder.
2.  **Open Extensions Page**: Enter `chrome://extensions/` in the Chrome address bar.
3.  **Enable Developer Mode**: Click the "Developer mode" toggle in the top right.
4.  **Load Extension**: Click "Load unpacked" and select the folder containing the files.
5.  **Start Using**: Refresh [Gemini](https://gemini.google.com/) to see the Minimap.

### 🔧 Customization

* **Jump Offset**: Modify `containerOffset` (current: 20) or `offset` (current: 70) in `content.js` to adjust the scroll position.
* **Container Position**: Modify the `top` (current: 80px) or `height` (current: 80vh) of `#gemini-minimap-container` in `styles.css`.