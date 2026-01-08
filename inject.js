// 防止重複注入
if (!window.hasInjectedExperience) {
    window.hasInjectedExperience = true;
    
    // 清理舊的輪詢（如果有）
    if (window.checkData) {
        clearInterval(window.checkData);
    }

    (function() {
        window.checkData = setInterval(() => {
        const targetElement = document.querySelector('section[class^="Article-module__main___"]');
        // 確保 __data 存在且 DOM 元素已出現
        if (typeof __data !== 'undefined' && targetElement) {
            clearInterval(window.checkData);
            handler();
        }
    }, 100);

    // 加上 2 秒超時保護
    setTimeout(() => clearInterval(window.checkData), 2000);

    function handler() {
        // 獲取當前 URL
        const url = new URL(window.location.href);
        // 提取最後一部分作為 ID
        const pathParts = url.pathname.split('/');
        const experienceId = pathParts[pathParts.length - 1];
    
        var jsonData = window.__data;

        // 取得對應的 experience 資料
        const experienceData = jsonData.experience.experienceById[experienceId]?.data;

        if (experienceData && experienceData.sections && Array.isArray(experienceData.sections)) {
            // 使用 starts-with 選擇器來取得 div，其 class 以 "Article-module__article___" 開頭
            const articleDiv = document.querySelector('section[class^="Article-module__main___"]');
            if (articleDiv) {
                // 清空原本內容
                articleDiv.innerHTML = "";
                
                // 逐一建立 section 元素
                experienceData.sections.forEach(section => {
                    // 建立 div 元素並且     padding: 25px 40px;
                    const sectionContainer = document.createElement("div");
                    sectionContainer.style.padding = "25px 40px";
              
                    if (section.subtitle) {
                        const subtitleElement = document.createElement("div");
                        subtitleElement.style.fontWeight = "bold";
                        subtitleElement.style["margin-bottom"] = "8px";
                        subtitleElement.textContent = section.subtitle;
                        sectionContainer.appendChild(subtitleElement);
                    }
    
                    if (section.content) {
                        const contentElement = document.createElement("div");
                        contentElement.innerHTML = section.content.replace('\n', '<br>');
                        // 增加文字間的垂直間距
                        contentElement.style.lineHeight = "1.8";
                        contentElement.style.marginTop = "15px";
                        contentElement.style.marginBottom = "15px";
                        sectionContainer.appendChild(contentElement);
                    }
                    articleDiv.appendChild(sectionContainer);
                });
            } else {
                console.warn('找不到符合 div[class^="Article-module__article___"] 的元素');
            }
        } else {
            console.warn('experienceData 或 sections 資料無效');
        }
    }
    })();
}