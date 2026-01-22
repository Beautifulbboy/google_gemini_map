function initMinimap() {
    // 1. 防止重复创建容器
    if (document.getElementById('gemini-minimap-container')) return;

    // 2. 创建 Minimap 主容器
    const minimap = document.createElement('div');
    minimap.id = 'gemini-minimap-container';
    document.body.appendChild(minimap);

    // 3. 创建预览浮窗 (Preview Card)
    const previewCard = document.createElement('div');
    previewCard.id = 'gemini-minimap-preview';
    document.body.appendChild(previewCard);


    let lastMessageCount = 0;
    let isInternalScrolling = false;
    // 核心更新逻辑
    const updateMinimap = () => {
        const messageBlocks = document.querySelectorAll('user-query, model-response');
        
        // 获取容器用于检查
        const minimapContainer = document.getElementById('gemini-minimap-container');
        
        // 核心逻辑：如果对话数量没变，且 Minimap 已经有内容了，就不要重画
        if (messageBlocks.length === lastMessageCount && minimapContainer && minimapContainer.children.length > 0) {
            return;
        }
        lastMessageCount = messageBlocks.length;

        minimap.innerHTML = '';

        // --- 新增：创建指示器元素 ---
        const indicator = document.createElement('div');
        indicator.id = 'minimap-viewport-indicator';
        minimap.appendChild(indicator);

        messageBlocks.forEach((block) => {
            const isUser = block.tagName.toLowerCase() === 'user-query';
            // 提取文本，移除多余换行
            const rawText = block.innerText || "";
            const cleanText = rawText.replace(/\s+/g, ' ').trim(); 

            // 如果没有内容，跳过
            if (cleanText.length === 0) return;

            // 创建 Minimap 色块
            const mapItem = document.createElement('div');
            mapItem.className = `minimap-item ${isUser ? 'minimap-user' : 'minimap-model'}`;
            
            // 计算高度 (加一点权重，让短对话也能看清)
            const height = Math.min(Math.max(rawText.length / 150, 6), 60); 
            mapItem.style.height = `${height}px`;

            // --- 鼠标交互事件 ---

            // 1. 点击跳转 (修正版：兼容内部滚动容器)
            mapItem.addEventListener('click', () => {
                isInternalScrolling = true;
                previewCard.style.display = 'none';
                // 找到最近的可以滚动的祖先元素
                const getScrollParent = (node) => {
                    if (node == null) return null;
                    if (node.scrollHeight > node.clientHeight) {
                        return node;
                    } else {
                        return getScrollParent(node.parentNode);
                    }
                };

                const scrollParent = getScrollParent(block);

                if (scrollParent && scrollParent !== document.body) {
                    // 如果是在内部容器滚动 (Gemini 的常见情况)
                    const targetOffsetTop = block.offsetTop;
                    const containerOffset = 20; // 预留顶部距离
                    
                    scrollParent.scrollTo({
                        top: targetOffsetTop - containerOffset,
                        behavior: 'smooth'
                    });
                } else {
                    // 如果是在 window 滚动 (备选方案)
                    const offset = 70;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = block.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
                setTimeout(() => { isInternalScrolling = false; }, 1000);
            });

            // 2. 鼠标移入：显示预览
            mapItem.addEventListener('mouseenter', () => {
                // 获取当前色块在屏幕的位置
                const rect = mapItem.getBoundingClientRect();
                
                // 设置预览内容
                const roleText = isUser ? "我 (User)" : "Gemini (Model)";
                const previewText = cleanText.length > 180 ? cleanText.substring(0, 180) + "..." : cleanText;
                
                previewCard.innerHTML = `<strong>${roleText}</strong>${previewText}`;
                
                // 设置样式区分
                previewCard.style.borderLeftColor = isUser ? '#4285f4' : '#34a853';

                // 计算位置：让预览框的中心对齐色块的中心
                // 但要防止超出屏幕底部
                let topPos = rect.top - 20; 
                // 简单的边界检查 (防止显示到屏幕外)
                if (topPos + previewCard.offsetHeight > window.innerHeight) {
                    topPos = window.innerHeight - previewCard.offsetHeight - 10;
                }
                
                previewCard.style.top = `${topPos}px`;
                previewCard.style.display = 'block';
            });

            // 3. 鼠标移出：隐藏预览
            mapItem.addEventListener('mouseleave', () => {
                previewCard.style.display = 'none';
            });

            minimap.appendChild(mapItem);
        });
        syncIndicator();
    };

    // 延时启动 + 监听变化
    setTimeout(updateMinimap, 2000);

    const observer = new MutationObserver((mutations) => {
        clearTimeout(window.refreshTimer);
        window.refreshTimer = setTimeout(updateMinimap, 1000);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', () => {
        if (!isInternalScrolling) {
            const preview = document.getElementById('gemini-minimap-preview');
            if (preview) {
                preview.style.opacity = '0';
                // 停留一瞬后彻底隐藏，防止挡住点击
                setTimeout(() => {
                    if (preview.style.opacity === '0') preview.style.display = 'none';
                }, 300);
            }
        }
    }, { passive: true });
    // 定时检查并绑定滚动容器，确保最新对话加载后依然有效
    setInterval(syncIndicator, 1000); // 兜底每秒同步一次

    // 捕获所有滚动事件
    window.addEventListener('scroll', syncIndicator, { capture: true, passive: true });
}

window.addEventListener('load', initMinimap);
// 路由兜底
setInterval(() => {
    if (!document.getElementById('gemini-minimap-container')) {
        initMinimap();
    }
}, 3000);

// 同步指示器位置的函数
function syncIndicator() {
    const indicator = document.getElementById('minimap-viewport-indicator');
    const minimap = document.getElementById('gemini-minimap-container');
    if (!indicator || !minimap) return;

    // 1. 找到屏幕中心点当前的对话块
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const centerElement = document.elementFromPoint(centerX, centerY);
    
    // 2. 确定当前视口聚焦的 Block
    const currentBlock = centerElement?.closest('user-query, model-response');

    if (currentBlock) {
        // 获取所有对话块列表，通过索引来确定“上一条”或“下一条”
        const allBlocks = Array.from(document.querySelectorAll('user-query, model-response'));
        const currentIndex = allBlocks.indexOf(currentBlock);
        
        if (currentIndex === -1) return;

        // 3. 确定“完整对话组”的起始和结束索引
        // 核心逻辑：无论当前看的是提问还是回答，都高亮 [提问, 回答] 这一对
        let startIndex = currentIndex;
        let endIndex = currentIndex;

        const currentTag = currentBlock.tagName.toLowerCase();

        if (currentTag === 'user-query') {
            // 如果当前看的是【提问】，尝试把紧接着的【回答】也包进来
            const nextBlock = allBlocks[currentIndex + 1];
            if (nextBlock && nextBlock.tagName.toLowerCase() === 'model-response') {
                endIndex = currentIndex + 1;
            }
        } else if (currentTag === 'model-response') {
            // 如果当前看的是【回答】，尝试把上面的【提问】也包进来
            const prevBlock = allBlocks[currentIndex - 1];
            if (prevBlock && prevBlock.tagName.toLowerCase() === 'user-query') {
                startIndex = currentIndex - 1;
            }
        }

        // 4. 映射到 Minimap 上的色块元素
        const items = minimap.querySelectorAll('.minimap-item');
        const startItem = items[startIndex];
        const endItem = items[endIndex];

        if (startItem && endItem) {
            // 5. 计算覆盖高度：从“起始块的顶部”到“结束块的底部”
            // 加上 gap (2px) 的微调，让框看起来更完整
            const topPos = startItem.offsetTop;
            const bottomPos = endItem.offsetTop + endItem.offsetHeight;
            const totalHeight = bottomPos - topPos;

            // 应用样式
            indicator.style.top = `${topPos}px`;
            indicator.style.height = `${totalHeight}px`;
            indicator.style.opacity = "1";
            return;
        }
    }
    
    // 如果没有找到焦点（比如在页面顶部空白处），让指示器变淡
    indicator.style.opacity = "0.3"; 
}

// 绑定滚动事件，实时更新指示器
// 找到 Gemini 的滚动监听目标（通常是 window 捕获内部滚动）
window.addEventListener('scroll', syncIndicator, { capture: true, passive: true });