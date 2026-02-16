document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('noteInput');
    const noteTagSelect = document.getElementById('noteTag');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const notesList = document.getElementById('notesList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Load notes from localStorage
    let notes = JSON.parse(localStorage.getItem('nofap_notes')) || [];
    let currentFilter = 'all';

    // Initial render
    renderNotes();

    // Save Note
    saveNoteBtn.addEventListener('click', () => {
        const content = noteInput.value.trim();
        const tag = noteTagSelect.value;
        
        if (content) {
            const newNote = {
                id: Date.now(),
                content: content,
                tag: tag,
                date: new Date().toLocaleString('en-US', { hour12: false })
            };
            notes.unshift(newNote); // Add to beginning
            saveNotes();
            renderNotes();
            noteInput.value = ''; // Clear input
        } else {
            alert('Please enter note content');
        }
    });

    // Filter Notes
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            renderNotes();
        });
    });

    function renderNotes() {
        notesList.innerHTML = '';
        
        const filteredNotes = currentFilter === 'all' 
            ? notes 
            : notes.filter(note => (note.tag || 'Other') === currentFilter);

        if (filteredNotes.length === 0) {
            notesList.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 20px;">No related notes</div>';
            return;
        }

        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            
            // Default tag if older note doesn't have one
            // Map old Chinese tags to English if necessary (simple mapping)
            let tag = note.tag || 'Other';
            
            // Simple migration for display purposes if old data exists
            const tagMap = {
                '心得': 'Insight',
                '知识': 'Knowledge',
                '反思': 'Reflection',
                '警句': 'Motto',
                '其他': 'Other'
            };
            if (tagMap[tag]) {
                tag = tagMap[tag];
            }
            
            noteCard.innerHTML = `
                <div class="note-tag-badge tag-${tag}">${tag}</div>
                <div class="note-date">${note.date}</div>
                <div class="note-content">${escapeHtml(note.content)}</div>
                <button class="delete-note">Delete</button>
            `;
            
            const deleteBtn = noteCard.querySelector('.delete-note');
            deleteBtn.addEventListener('click', () => {
                if(confirm('Are you sure you want to delete this note?')) {
                    deleteNote(note.id);
                }
            });

            notesList.appendChild(noteCard);
        });
    }

    function saveNotes() {
        localStorage.setItem('nofap_notes', JSON.stringify(notes));
    }

    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
