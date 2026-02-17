document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    const historyContainer = document.getElementById('historyContainer');
    
    // UI Elements to translate
    const i18nElements = document.querySelectorAll('[data-i18n]');

    let currentLang = 'zh'; // Default language

    // Translation Dictionary
    const translations = {
        'zh': {
            'logo': '戒色笔记',
            'nav.features': '功能',
            'nav.checkin': '每日打卡',
            'nav.notes': '学习笔记',
            'nav.relapse': '破戒类型',
            'nav.test': '知识测试',
            'nav.exam': '综合考试',
            'history.title': '测试历史记录',
            'history.intro': '回顾你的每一次自测，见证认知的提升。',
            'history.back': '返回测试',
            'history.empty': '暂无测试记录',
            'footer.copyright': '&copy; 2024 戒色笔记. All rights reserved. 愿你归来仍是少年。',
            'record.date': '测试时间',
            'record.score': '完成题数',
            'record.view': '查看详情',
            'record.delete': '删除',
            'record.answer': '你的回答',
            'record.question': '问题'
        },
        'en': {
            'logo': 'NoFap Notes',
            'nav.features': 'Features',
            'nav.checkin': 'Check-in',
            'nav.notes': 'Notes',
            'nav.relapse': 'Relapse Types',
            'nav.test': 'Knowledge Test',
            'nav.exam': 'Exam',
            'history.title': 'Test History',
            'history.intro': 'Review your self-tests and witness your cognitive improvement.',
            'history.back': 'Back to Test',
            'history.empty': 'No test records found',
            'footer.copyright': '&copy; 2024 NoFap Notes. All rights reserved. Stay true to yourself.',
            'record.date': 'Date',
            'record.score': 'Completed',
            'record.view': 'View Details',
            'record.delete': 'Delete',
            'record.answer': 'Your Answer',
            'record.question': 'Question'
        }
    };

    // Initialize
    renderHistory();
    updateLanguage();

    // Language Toggle Event
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage();
        renderHistory(); // Re-render to update content inside records
    });

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('nofap_test_history')) || [];
        historyContainer.innerHTML = '';

        if (history.length === 0) {
            historyContainer.innerHTML = `<div class="history-empty" data-i18n="history.empty">${translations[currentLang]['history.empty']}</div>`;
            return;
        }

        history.forEach((record, index) => {
            const date = new Date(record.timestamp).toLocaleString(currentLang === 'zh' ? 'zh-CN' : 'en-US');
            const answeredCount = Object.keys(record.answers).length;
            
            const card = document.createElement('div');
            card.className = 'history-card';
            
            // Header
            const header = document.createElement('div');
            header.className = 'history-header';
            header.innerHTML = `
                <div class="history-meta">
                    <span class="history-date">📅 ${date}</span>
                    <span class="history-score">✅ ${answeredCount} / ${record.totalQuestions}</span>
                </div>
                <div class="history-actions">
                    <button class="btn-toggle-details" data-index="${index}">${translations[currentLang]['record.view']}</button>
                    <button class="btn-delete-record" data-index="${index}">${translations[currentLang]['record.delete']}</button>
                </div>
            `;
            
            // Details (Hidden by default)
            const details = document.createElement('div');
            details.className = 'history-details';
            details.style.display = 'none';
            details.id = `details-${index}`;

            // Render Q&A pairs
            let detailsHtml = '';
            testData.forEach(q => {
                const userAnswer = record.answers[q.id];
                if (userAnswer) {
                    let answerDisplay = userAnswer;
                    // If radio, find text
                    if (q.type === 'radio' && q.options) {
                        const opt = q.options.find(o => o.value === userAnswer);
                        if (opt) answerDisplay = `${userAnswer}. ${opt.text[currentLang]}`;
                    }

                    detailsHtml += `
                        <div class="history-qa">
                            <div class="qa-question"><strong>${q.id}. ${q.question[currentLang]}</strong></div>
                            <div class="qa-answer">${translations[currentLang]['record.answer']}: <span class="highlight">${escapeHtml(answerDisplay)}</span></div>
                        </div>
                    `;
                }
            });
            details.innerHTML = detailsHtml;

            card.appendChild(header);
            card.appendChild(details);
            historyContainer.appendChild(card);
        });

        // Event Listeners for buttons
        document.querySelectorAll('.btn-toggle-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                const detailsDiv = document.getElementById(`details-${index}`);
                if (detailsDiv.style.display === 'none') {
                    detailsDiv.style.display = 'block';
                    e.target.textContent = currentLang === 'zh' ? '收起详情' : 'Hide Details';
                } else {
                    detailsDiv.style.display = 'none';
                    e.target.textContent = translations[currentLang]['record.view'];
                }
            });
        });

        document.querySelectorAll('.btn-delete-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm(currentLang === 'zh' ? '确定要删除这条记录吗？' : 'Delete this record?')) {
                    const index = parseInt(e.target.dataset.index);
                    history.splice(index, 1);
                    localStorage.setItem('nofap_test_history', JSON.stringify(history));
                    renderHistory();
                }
            });
        });
    }

    function updateLanguage() {
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        
        // Update button text
        langToggleBtn.textContent = currentLang === 'zh' ? '中文 / English' : 'English / 中文';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
