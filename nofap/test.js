document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    const questionsContainer = document.getElementById('questionsContainer');
    const testForm = document.getElementById('testForm');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');
    
    // UI Elements to translate
    const i18nElements = document.querySelectorAll('[data-i18n]');

    let currentLang = 'zh'; // Default language

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
            'test.title': '戒色知识自测 (35题)',
            'test.intro': '请认真回答以下问题，以检验你对戒色知识的掌握程度。',
            'test.progress': '完成进度:',
            'test.history': '查看历史记录',
            'test.submit': '提交测试',
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
            'nav.exam': 'Exam','test.title': 'NoFap Knowledge Test (35 Questions)',
            'test.intro': 'Please answer the following questions carefully to test your knowledge about NoFap.',
            'test.progress': 'Progress:',
            'test.history': 'View History',
            'test.submit': 'Submit Test',
            'footer.copyright': '&copy; 2024 NoFap Notes. All rights reserved. Stay true to yourself.'
        }
    };

    // Initialize
    renderQuestions();
    updateProgress();

    // Language Toggle Event
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage();
    });

    // Form Input Event (for progress tracking)
    testForm.addEventListener('input', () => {
        updateProgress();
    });

    // Submit Event
    testForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation: check if all questions have some input
        const unanswered = [];
        testData.forEach(item => {
            let hasAnswer = false;
            if (item.type === 'text') {
                const input = document.querySelector(`textarea[name="q${item.id}"]`);
                if (input && input.value.trim().length > 0) hasAnswer = true;
            } else if (item.type === 'radio') {
                const checked = document.querySelector(`input[name="q${item.id}"]:checked`);
                if (checked) hasAnswer = true;
            }
            
            if (!hasAnswer) unanswered.push(item.id);
        });

        if (unanswered.length > 0) {
            const msg = currentLang === 'zh' 
                ? `请回答所有问题。未完成题号: ${unanswered.join(', ')}`
                : `Please answer all questions. Unanswered: ${unanswered.join(', ')}`;
            alert(msg);
            
            // Scroll to first unanswered
            const firstUnanswered = document.getElementById(`q${unanswered[0]}`);
            if (firstUnanswered) {
                firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstUnanswered.style.borderColor = 'var(--danger-color)';
                setTimeout(() => firstUnanswered.style.borderColor = 'var(--border-color)', 2000);
            }
        } else {
            // Save answers to localStorage
            const userAnswers = {};
            testData.forEach(item => {
                if (item.type === 'text') {
                    const input = document.querySelector(`textarea[name="q${item.id}"]`);
                    userAnswers[item.id] = input.value;
                } else if (item.type === 'radio') {
                    const checked = document.querySelector(`input[name="q${item.id}"]:checked`);
                    userAnswers[item.id] = checked.value;
                }
            });

            const historyRecord = {
                timestamp: Date.now(),
                answers: userAnswers,
                totalQuestions: testData.length
            };

            let history = JSON.parse(localStorage.getItem('nofap_test_history')) || [];
            history.unshift(historyRecord); // Add to beginning
            localStorage.setItem('nofap_test_history', JSON.stringify(history));

            const msg = currentLang === 'zh' 
                ? '测试提交成功！结果已保存。'
                : 'Test submitted successfully! Results saved.';
            alert(msg);
            
            // Redirect to history page
            window.location.href = 'history.html';
        }
    });

    function renderQuestions() {
        questionsContainer.innerHTML = '';

        testData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.id = `q${item.id}`;

            const header = document.createElement('div');
            header.className = 'question-header';
            
            const number = document.createElement('span');
            number.className = 'question-number';
            number.textContent = `${item.id}.`;
            
            const text = document.createElement('span');
            text.className = 'question-text';
            text.dataset.qid = item.id; // Mark for translation update
            text.textContent = item.question[currentLang];

            header.appendChild(number);
            header.appendChild(text);
            card.appendChild(header);

            if (item.type === 'text') {
                const textarea = document.createElement('textarea');
                textarea.className = 'answer-area';
                textarea.name = `q${item.id}`;
                textarea.placeholder = currentLang === 'zh' ? '请输入你的回答...' : 'Enter your answer here...';
                // Restore value if exists (handled by browser usually, but good to be safe if re-rendering)
                // Since we re-render on lang switch, we must preserve values!
                // Wait, re-rendering wipes values. 
                // Better approach: Don't re-render entire DOM on lang switch. Just update text nodes.
                // BUT, initial render needs this structure.
                card.appendChild(textarea);
            } else if (item.type === 'radio') {
                const optionsGroup = document.createElement('div');
                optionsGroup.className = 'options-group';

                item.options.forEach(opt => {
                    const label = document.createElement('label');
                    label.className = 'radio-label';
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `q${item.id}`;
                    radio.value = opt.value;
                    
                    const span = document.createElement('span');
                    span.className = 'radio-text';
                    span.dataset.qid = item.id;
                    span.dataset.opt = opt.value;
                    span.textContent = `${opt.value}. ${opt.text[currentLang]}`;

                    label.appendChild(radio);
                    label.appendChild(span);
                    optionsGroup.appendChild(label);
                });
                card.appendChild(optionsGroup);
            }

            questionsContainer.appendChild(card);
        });
    }

    function updateLanguage() {
        // Update Static UI
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });

        // Update Button Text
        langToggleBtn.textContent = currentLang === 'zh' ? '中文 / English' : 'English / 中文';

        // Update Question Texts (without destroying inputs)
        const questionTexts = document.querySelectorAll('.question-text');
        questionTexts.forEach(el => {
            const qid = parseInt(el.dataset.qid);
            const data = testData.find(d => d.id === qid);
            if (data) {
                el.textContent = data.question[currentLang];
            }
        });

        // Update Radio Options Texts
        const radioTexts = document.querySelectorAll('.radio-text');
        radioTexts.forEach(el => {
            const qid = parseInt(el.dataset.qid);
            const optVal = el.dataset.opt;
            const data = testData.find(d => d.id === qid);
            if (data && data.options) {
                const optData = data.options.find(o => o.value === optVal);
                if (optData) {
                    el.textContent = `${optVal}. ${optData.text[currentLang]}`;
                }
            }
        });

        // Update Textarea Placeholders
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(el => {
            el.placeholder = currentLang === 'zh' ? '请输入你的回答...' : 'Enter your answer here...';
        });
    }

    function updateProgress() {
        let answeredCount = 0;
        const total = testData.length;

        testData.forEach(item => {
            if (item.type === 'text') {
                const input = document.querySelector(`textarea[name="q${item.id}"]`);
                if (input && input.value.trim().length > 0) answeredCount++;
            } else if (item.type === 'radio') {
                const checked = document.querySelector(`input[name="q${item.id}"]:checked`);
                if (checked) answeredCount++;
            }
        });

        const percent = Math.round((answeredCount / total) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${answeredCount}/${total}`;
        
        // Visual feedback for progress bar color
        if (percent === 100) {
            progressBar.style.backgroundColor = 'var(--success-color)';
            progressBar.style.boxShadow = '0 0 10px var(--success-glow)';
        } else {
            progressBar.style.backgroundColor = 'var(--primary-color)';
            progressBar.style.boxShadow = '0 0 10px var(--accent-glow)';
        }
    }
});
