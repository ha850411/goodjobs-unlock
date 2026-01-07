if (window.hasInjectedExperience) {
    console.log("Script already injected, re-initializing...");
}
window.hasInjectedExperience = true;

(function() {
    console.log("Company inject script loaded");
    let previousUrl = window.location.href;
    let companyName = decodeURIComponent(previousUrl.split('/')[4] || '');

    window.companyInterval = setInterval(() => {
        if (typeof __data !== 'undefined') {
            clearInterval(window.companyInterval);
            handler();
        }
    }, 500);

    // 加上 2 秒超時保護
    setTimeout(() => clearInterval(window.companyInterval), 2000);

    function handler() {
        const data = window.__data;
        console.log("Company data found:", data);

        let salaryWorkTimes = data?.companyIndex?.overviewByName[companyName]?.data?.salaryWorkTimes;

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

        // hiddenBlocks.forEach(block => {
        //     block.innerHTML = `<span style="color: green;">內容已解鎖！</span>`;
        // });
    }
})();
