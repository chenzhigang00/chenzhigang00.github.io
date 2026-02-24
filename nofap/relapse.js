document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    const relapseGrid = document.getElementById('relapseGrid');
    
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
            'page.title': '常见破戒类型',
            'page.subtitle': '知己知彼，百战不殆。了解这些诱因是战胜它们的第一步。',
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
            'page.title': 'Common Relapse Types',
            'page.subtitle': 'Understanding these triggers is the first step to mastering them. Vigilance is key.',
            'footer.copyright': '&copy; 2024 NoFap Notes. All rights reserved. Stay true to yourself.'
        }
    };

    // Initialize
    renderRelapseCards();
    updateStaticUI();

    // Language Toggle Event
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage();
    });

    function renderRelapseCards() {
        relapseGrid.innerHTML = '';

        relapseData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'relapse-card';
            
            const title = item.title[currentLang];
            const desc = item.desc[currentLang];

            card.innerHTML = `
                <h3>${item.icon} ${title}</h3>
                <p>${desc}</p>
            `;
            
            relapseGrid.appendChild(card);
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
        renderRelapseCards();
    }
});
