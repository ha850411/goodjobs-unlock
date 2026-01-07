chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 監聽 URL 改變且頁面載入到一定程度
    if (changeInfo.url) {
        const url = new URL(changeInfo.url);
        const pathParts = url.pathname.split('/');

        let scriptToInject = null;
        if (pathParts[1] === 'experiences') {
            scriptToInject = 'inject.js';
        } else if (pathParts[1] === 'companies') {
            scriptToInject = 'company_inject.js';
        }

        if (scriptToInject) {
            console.log('SPA Navigation detected, injecting:', scriptToInject);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: [scriptToInject],
                world: 'MAIN'
            });
        }
    }
});

// 原有的訊息監聽保留，以支援首次進入頁面
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_SCRIPT') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: [message.script || 'inject.js'],
            world: 'MAIN'
        });
    }
});