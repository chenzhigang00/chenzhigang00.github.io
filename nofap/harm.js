document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    const physicalGrid = document.getElementById('physicalGrid');
    const psychoGrid = document.getElementById('psychoGrid');
    
    // UI Elements to translate
    const i18nElements = document.querySelectorAll('[data-i18n]');

    let currentLang = 'en'; // Default language

    // Translation Dictionary for static UI elements
    const translations = {
        'zh': {
            'logo': '戒色笔记',
            'nav.features': '功能',
            'nav.checkin': '每日打卡',
            'nav.notes': '学习笔记',
            'nav.relapse': '破戒类型',
            'nav.harm': '破戒危害',
            'nav.vibration': '提升能量',
            'nav.test': '知识测试',
            'nav.exam': '综合考试',
            'page.title': '破戒的危害',
            'page.subtitle': '了解危害是恢复健康的第一步。肾精是人体的健康货币。',
            'harm.physical': '生理危害',
            'harm.physical.count': '17类',
            'harm.psycho': '心理危害',
            'harm.psycho.count': '9类',
            'harm.psycho.desc': '虽然这些可能不直接致命，但会带来巨大的痛苦，严重降低生活质量。',
            'footer.copyright': '&copy; 2024 戒色笔记. All rights reserved. 愿你归来仍是少年。'
        },
        'en': {
            'logo': 'NoFap Notes',
            'nav.features': 'Features',
            'nav.checkin': 'Check-in',
            'nav.notes': 'Notes',
            'nav.relapse': 'Relapse Types',
            'nav.harm': 'Harms',
            'nav.vibration': 'Raise Vibration',
            'nav.test': 'Knowledge Test',
            'nav.exam': 'Exam',
            'page.title': 'Harms of PMO',
            'page.subtitle': 'Understanding the consequences is crucial for recovery. Kidney essence is the currency of health.',
            'harm.physical': 'Physical Consequences',
            'harm.physical.count': '17 Types',
            'harm.psycho': 'Psychological Consequences',
            'harm.psycho.count': '9 Types',
            'harm.psycho.desc': 'While these may not be directly fatal, they can cause immense suffering and reduce quality of life.',
            'footer.copyright': '&copy; 2024 NoFap Notes. All rights reserved. Stay true to yourself.'
        }
    };

    // Initialize
    renderHarmCards();
    updateStaticUI();

    // Language Toggle Event
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage();
    });

    function renderHarmCards() {
        // Physical Harms
        physicalGrid.innerHTML = '';
        harmData.physical.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'harm-card';
            
            const title = item.title[currentLang];
            const desc = item.desc[currentLang];

            card.innerHTML = `
                <div class="harm-icon">${item.icon}</div>
                <h3>${index + 1}. ${title}</h3>
                <p>${desc}</p>
            `;
            physicalGrid.appendChild(card);
        });

        // Psychological Harms
        psychoGrid.innerHTML = '';
        harmData.psychological.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'psycho-card';
            
            const title = item.title[currentLang];

            card.innerHTML = `
                <h3>${index + 1}. ${title}</h3>
            `;
            psychoGrid.appendChild(card);
        });
    }

    function updateStaticUI() {
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });

        // Update Button Text
        langToggleBtn.textContent = currentLang === 'zh' ? '中文 / English' : 'English / 中文';
    }

    function updateLanguage() {
        updateStaticUI();
        renderHarmCards();
    }
});
