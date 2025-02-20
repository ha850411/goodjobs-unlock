// 獲取當前 URL
const url = new URL(window.location.href);
const pathParts = url.pathname.split('/');

// 確認 URL 是否符合需求
if (pathParts.length >= 3 && pathParts[1] === 'experiences') {
  // 將腳本注入到頁面上下文中
  chrome.runtime.sendMessage({ type: 'INJECT_SCRIPT' });
}