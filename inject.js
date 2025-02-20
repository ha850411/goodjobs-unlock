
(function() {

    let previousUrl = window.location.href;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (window.location.href !== previousUrl) {
                console.log('網址變化（DOM）：', window.location.href);
                previousUrl = window.location.href;
                // 在這裡執行你的程式碼
                handler();
            }
        });
    });
    
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    
    // init
    handler();

    function handler() {
        console.log('previousUrl');
        console.log('Inject script executed');
        // 獲取當前 URL
        const url = new URL(previousUrl);
        // 提取最後一部分作為 ID
        const pathParts = url.pathname.split('/');
        const experienceId = pathParts[pathParts.length - 1];
    
        console.log('Experience ID:', experienceId);
    
        const scripts = document.querySelectorAll('script[charset="UTF-8"]')[2];
    
        var jsonData = scripts.textContent.replace('window.__data=', '');
        
        jsonData = jsonData.slice(0, -1);
    
        jsonData = JSON.parse(jsonData);
        
        // 取得對應的 experience 資料
        const experienceData = jsonData.experience.experienceById[experienceId]?.data;

        if (jsonData.experience.experienceById[experienceId] === undefined) {
            // reload
            window.location.reload();
        }

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