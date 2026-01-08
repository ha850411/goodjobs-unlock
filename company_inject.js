// 防止重複注入
if (!window.hasInjectedCompany) {
    window.hasInjectedCompany = true;
    
    // 清理舊的輪詢（如果有）
    if (window.companyInterval) {
        clearInterval(window.companyInterval);
    }

    (function() {

        let companyName = decodeURIComponent(window.location.href.split('/')[4] || '');

        window.companyInterval = setInterval(() => {
            if (typeof window.__data !== 'undefined') {
                clearInterval(window.companyInterval);
                handler();
            }
        }, 100);

        // 加上 2 秒超時保護
        setTimeout(() => clearInterval(window.companyInterval), 2000);

        function handler() {
            const data = window.__data;

            let pathParts = window.location.href.split('/');

            let salaryWorkTimes = [];

            if (pathParts[5] && /^salary-work-times/i.test(pathParts[5])) {
                salaryWorkTimes = data?.companyIndex?.timeAndSalaryByName[companyName]?.data?.salaryWorkTimes;
            } else {
                salaryWorkTimes = data?.companyIndex?.overviewByName[companyName]?.data?.salaryWorkTimes;
            }

            let hiddenBlocks = document.querySelectorAll('td[class^="injectHideContentBlock"]');

            for (let i = 0; i < hiddenBlocks.length; i++) {
                let block = hiddenBlocks[i];
                let salary = salaryWorkTimes?.[i]?.salary || {};
                let amount = salary?.amount?.toLocaleString() || '未知';
                if (salary?.type && salary?.amount) {
                    let type = '';
                    switch (salary.type) {
                        case 'hour':
                            type = '時薪';
                            break;
                        case 'month':
                            type = '月薪';
                            break;
                        case 'year':
                            type = '年薪';
                            break;
                        default:
                            type = salary.type;
                    }

                    block.innerHTML = `<span style="color: green;">${type}: ${amount}</span>`;
                }
            }
        }
    })();
}
