let lastUrl = location.href;

function checkUrl() {
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split('/');

  if (pathParts[1] === 'experiences' && pathParts.length >= 3) {
    chrome.runtime.sendMessage({ type: 'INJECT_SCRIPT', script: 'inject.js' });
  } else if (pathParts[1] === 'companies' && pathParts.length >= 3) {
    chrome.runtime.sendMessage({ type: 'INJECT_SCRIPT', script: 'company_inject.js' });
  }
}

// 監控 URL 變化 (SPA)
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('SPA URL changed to:', lastUrl);
    // 重新整理頁面
    console.log('Reloading page due to URL change...');
    window.location.reload();
  }
});

observer.observe(document, { subtree: true, childList: true });

// 初始執行
checkUrl();