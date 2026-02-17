document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    const vibrationGrid = document.getElementById('vibrationGrid');
    
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
            'nav.vibration': '提升能量',
            'nav.test': '知识测试',
            'nav.exam': '综合考试',
            'page.title': '提高振动频率的方法',
            'page.subtitle': '高频能量吸引美好事物。这里有16种提升生命状态的方法。',
            'footer.copyright': '&copy; 2024 戒色笔记. All rights reserved. 愿你归来仍是少年。'
        },
        'en': {
            'logo': 'NoFap Notes',
            'nav.features': 'Features',
            'nav.checkin': 'Check-in',
            'nav.notes': 'Notes',
            'nav.relapse': 'Relapse Types',
            'nav.vibration': 'Raise Vibration',
            'nav.test': 'Knowledge Test',
            'nav.exam': 'Exam',
            'page.title': 'Raise Your Vibration',
            'page.subtitle': 'High frequency energy attracts positivity. Here are 16 ways to elevate your state of being.',
            'footer.copyright': '&copy; 2024 NoFap Notes. All rights reserved. Stay true to yourself.'
        }
    };

    // Initialize
    renderVibrationCards();
    updateStaticUI();

    // Language Toggle Event
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage();
    });

    function renderVibrationCards() {
        vibrationGrid.innerHTML = '';

        vibrationData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'vibration-card';
            
            const title = item.title[currentLang];
            const desc = item.desc[currentLang];

            card.innerHTML = `
                <div class="vibration-icon">${item.icon}</div>
                <h3>${index + 1}. ${title}</h3>
                <p>${desc}</p>
            `;
            
            vibrationGrid.appendChild(card);
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
        renderVibrationCards();
    }
});
