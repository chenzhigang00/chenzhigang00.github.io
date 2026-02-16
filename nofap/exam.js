document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const examSelector = document.getElementById('examSelector');
    const examTitle = document.getElementById('examTitle');
    const totalScoreElement = document.getElementById('totalScore');
    const examScope = document.getElementById('examScope');
    const contentDiv = document.getElementById('examContent');
    const timerElement = document.getElementById('timer');
    const examResult = document.getElementById('examResult');
    const objectiveScoreSpan = document.getElementById('objectiveScore');
    const maxObjectiveScoreSpan = document.getElementById('maxObjectiveScore');
    const referenceAnswersDiv = document.getElementById('referenceAnswers');
    const toggleAnswersBtn = document.getElementById('toggleAnswersBtn');
    const submitBtn = document.getElementById('submitExamBtn');

    let currentExamData = null;
    let timerInterval = null;

    // Initialize
    loadExam('A');

    // Exam Selector Event
    examSelector.addEventListener('change', (e) => {
        if(confirm('切换试卷将重置当前进度，确定切换吗？')) {
            loadExam(e.target.value);
        } else {
            // Revert selection if cancelled
            e.target.value = currentExamData === examDataA ? 'A' : 'B';
        }
    });

    function loadExam(examId) {
        // Reset State
        currentExamData = examId === 'A' ? examDataA : examDataB;
        examTitle.textContent = currentExamData.title;
        totalScoreElement.textContent = `${currentExamData.totalScore} 分`;
        
        // Update scope based on exam (Exam A has specific scope text, B implies general)
        if (examId === 'A') {
            examScope.innerHTML = '<strong>考试范围：</strong>杜绝性刺激｜看黄必破机制｜洗脑与定力｜戒色三阶段｜作息久坐运动｜补法与中医养生｜频遗与固肾功｜常见症状与恢复逻辑';
        } else {
            examScope.innerHTML = '<strong>考试范围：</strong>戒色认知进阶｜情境判断｜机制串讲｜纠错辨析｜系统补法｜综合实战方案';
        }

        // Reset UI
        examResult.style.display = 'none';
        referenceAnswersDiv.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        toggleAnswersBtn.textContent = '查看参考答案';
        
        // Reset Timer
        if (timerInterval) clearInterval(timerInterval);
        let startTime = Date.now();
        timerInterval = setInterval(() => {
            let diff = Date.now() - startTime;
            let h = Math.floor(diff / 3600000);
            let m = Math.floor((diff % 3600000) / 60000);
            let s = Math.floor((diff % 60000) / 1000);
            timerElement.textContent = 
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }, 1000);

        renderExamContent();
    }

    function renderExamContent() {
        let html = '';
        
        currentExamData.parts.forEach(part => {
            html += `<div class="exam-part"> <h2 class="part-title">${part.title}</h2>`;
            
            if (part.type === 'fillTable') {
                // Special rendering for table questions
                html += renderTableQuestions(part);
            } else {
                // Standard questions
                part.questions.forEach(item => {
                    html += `<div class="question-item" id="q${item.id}">`;
                    
                    // Question Title
                    let qText = item.q;
                    if (part.type === 'fillBlank') {
                        qText = qText.replace(/_+/g, `<input type="text" class="input-blank" name="q${item.id}">`);
                    }
                    html += `<div class="question-title">${item.id}. ${qText.replace(/\n/g, '<br>')}</div>`;

                    // Options or Inputs
                    if (part.type === 'singleChoice' || part.type === 'trueFalse') {
                        html += `<div class="options-list">`;
                        if (part.type === 'singleChoice') {
                            item.options.forEach((opt, idx) => {
                                const letter = String.fromCharCode(65 + idx);
                                html += `
                                    <label class="option-label">
                                        <input type="radio" name="q${item.id}" value="${letter}">
                                        <span class="option-text">${letter}. ${opt}</span>
                                    </label>
                                `;
                            });
                        } else { // trueFalse
                            html += `
                                <label class="option-label">
                                    <input type="radio" name="q${item.id}" value="T">
                                    <span class="option-text">对</span>
                                </label>
                                <label class="option-label">
                                    <input type="radio" name="q${item.id}" value="F">
                                    <span class="option-text">错</span>
                                </label>
                            `;
                        }
                        html += `</div>`;
                    } else if (part.type === 'multiChoice') {
                        html += `<div class="options-list">`;
                        item.options.forEach((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            html += `
                                <label class="option-label">
                                    <input type="checkbox" name="q${item.id}" value="${letter}">
                                    <span class="option-text">${letter}. ${opt}</span>
                                </label>
                            `;
                        });
                        html += `</div>`;
                    } else if (part.type === 'shortAnswer' || part.type === 'essay') {
                        html += `<textarea class="textarea-answer" placeholder="在此输入你的答案..." style="${part.type === 'essay' ? 'min-height: 200px;' : ''}"></textarea>`;
                    }
                    
                    html += `</div>`;
                });
            }
            html += '</div>';
        });

        contentDiv.innerHTML = html;
    }

    function renderTableQuestions(part) {
        let html = `<div class="table-responsive"><table class="exam-table"><thead><tr>`;
        part.header.forEach(h => html += `<th>${h}</th>`);
        html += `</tr></thead><tbody>`;
        
        part.questions.forEach(item => {
            html += `<tr><td><strong>${item.rowLabel}</strong></td>`;
            for (let i = 0; i < item.cols; i++) {
                html += `<td><textarea class="table-input" placeholder="填写..."></textarea></td>`;
            }
            html += `</tr>`;
        });
        
        html += `</tbody></table></div>`;
        return html;
    }

    // Submission Logic
    document.getElementById('examForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if(confirm('确定要提交试卷吗？提交后将显示参考答案。')) {
            calculateScore();
            showResults();
            window.scrollTo(0, 0);
            if (timerInterval) clearInterval(timerInterval);
        }
    });

    toggleAnswersBtn.addEventListener('click', () => {
        const answersDiv = document.getElementById('referenceAnswers');
        if (answersDiv.style.display === 'none') {
            answersDiv.style.display = 'block';
            toggleAnswersBtn.textContent = '隐藏参考答案';
        } else {
            answersDiv.style.display = 'none';
            toggleAnswersBtn.textContent = '查看参考答案';
        }
    });

    function calculateScore() {
        let score = 0;
        let maxObjScore = 0;

        currentExamData.parts.forEach(part => {
            if (part.type === 'singleChoice' || part.type === 'multiChoice' || part.type === 'trueFalse') {
                const pointsPerQ = part.type === 'multiChoice' ? 3 : (part.type === 'singleChoice' && currentExamData === examDataB ? 4 : 2); // Exam B Single Choice is 4 pts, Exam A is 2 pts. Logic check needed.
                // Better: define points in data or infer.
                // Exam A: Single(2), Multi(3), TF(2) -> Total 40+30+20 = 90
                // Exam B: Single(4) -> Total 40. No Multi/TF.
                
                let qPoints = 2;
                if (part.type === 'multiChoice') qPoints = 3;
                if (part.type === 'singleChoice' && currentExamData === examDataB) qPoints = 4;

                part.questions.forEach(item => {
                    maxObjScore += qPoints;
                    
                    if (part.type === 'singleChoice' || part.type === 'trueFalse') {
                        const selected = document.querySelector(`input[name="q${item.id}"]:checked`);
                        if (selected && selected.value === item.answer) {
                            score += qPoints;
                            markCorrect(`q${item.id}`);
                        } else {
                            let ansDisplay = item.answer;
                            if (part.type === 'trueFalse') ansDisplay = item.answer === 'T' ? '对' : '错';
                            markWrong(`q${item.id}`, ansDisplay);
                        }
                    } else if (part.type === 'multiChoice') {
                        const selected = Array.from(document.querySelectorAll(`input[name="q${item.id}"]:checked`)).map(el => el.value);
                        const correct = item.answer.sort();
                        selected.sort();
                        if (JSON.stringify(selected) === JSON.stringify(correct)) {
                            score += qPoints;
                            markCorrect(`q${item.id}`);
                        } else {
                            markWrong(`q${item.id}`, correct.join(''));
                        }
                    }
                });
            }
        });
        
        objectiveScoreSpan.textContent = score;
        maxObjectiveScoreSpan.textContent = ` / ${maxObjScore}`;
    }

    function markCorrect(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.borderLeft = "4px solid var(--success-color)";
            el.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
        }
    }

    function markWrong(elementId, correctAnswer) {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.borderLeft = "4px solid var(--danger-color)";
            el.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
            
            const ansDiv = document.createElement('div');
            ansDiv.style.color = "var(--danger-color)";
            ansDiv.style.marginTop = "8px";
            ansDiv.style.fontWeight = "bold";
            ansDiv.textContent = `正确答案: ${correctAnswer}`;
            el.appendChild(ansDiv);
        }
    }

    function showResults() {
        examResult.style.display = 'block';
        submitBtn.style.display = 'none';
        
        // Populate Reference Answers (simplified rendering)
        let ansHtml = '';
        
        currentExamData.parts.forEach(part => {
            ansHtml += `<div class="answer-section"><h3>${part.title} 答案</h3>`;
            
            if (part.type === 'fillTable') {
                ansHtml += '<p>请对照题目中的核心关键词进行自我评分。</p>';
            } else if (part.type === 'shortAnswer' || part.type === 'essay') {
                ansHtml += '<p>请对照题目要求与核心要点进行自我评分。</p>';
            } else {
                ansHtml += '<p>';
                part.questions.forEach((item, i) => {
                    let ans = item.answer;
                    if (Array.isArray(ans)) ans = ans.join('');
                    if (part.type === 'trueFalse') ans = ans === 'T' ? '对' : '错';
                    ansHtml += `<span class="answer-item">${i+1}. <span class="answer-key">${ans}</span></span>; `;
                });
                ansHtml += '</p>';
            }
            ansHtml += '</div>';
        });

        referenceAnswersDiv.innerHTML = ansHtml;
    }
});
