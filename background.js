chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_SCRIPT') {
      console.log('Injecting script into tab', sender.tab.id);
      // 插入腳本標籤到頁面中
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ['inject.js']
      }, () => {
        console.log('Script file injected');
      });
    }
  });