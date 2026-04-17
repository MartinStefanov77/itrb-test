// ========================
// Configuration
// ========================
let content = null;
let currentSection = "hero";
let currentLang = "en";
let saveTimeout = null;

// ========================
// Load from JSON
// ========================
async function loadContent() {
    const res = await fetch('data/content.json?v=' + Date.now());
    content = await res.json();
    renderPageSelector();
    renderSectionSelector();
    renderForm();
}

// ========================
// Save to JSON (директно)
// ========================
async function saveContent() {
    await fetch('save-content.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
    });
    const status = document.getElementById('save-status');
    if (status) {
        status.innerHTML = '✓ Saved';
        status.style.background = '#28a745';
        setTimeout(() => {
            status.innerHTML = '● Auto-save';
            status.style.background = '#28a745';
        }, 2000);
    }
}

function triggerSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveContent(), 1000);
    const status = document.getElementById('save-status');
    if (status) {
        status.innerHTML = '● Saving...';
        status.style.background = '#ffc107';
    }
}

// ========================
// Page Selector
// ========================
const pages = {
    home: { name: '🏠 Home Page', sections: ['hero', 'whatWeDo', 'homeServices', 'ourEdge', 'approach', 'contact'] },
    services: { name: '🛠️ Services Page', sections: ['servicesHero', 'serviceItems'] },
    whoWeAre: { name: '👥 Who We Are', sections: ['whoWeAreHero', 'approachSection', 'lifecycle', 'principles', 'industries', 'team'] },
    contact: { name: '📞 Contact Page', sections: ['contactPage'] }
};
let currentPage = 'home';

function renderPageSelector() {
    const container = document.getElementById('page-selector');
    if (!container) return;
    container.innerHTML = `
        <div class="page-selector-buttons">
            ${Object.keys(pages).map(key => `
                <button class="page-btn ${currentPage === key ? 'active' : ''}" onclick="switchPage('${key}')">
                    ${pages[key].name}
                </button>
            `).join('')}
        </div>
    `;
}

function switchPage(page) {
    currentPage = page;
    currentSection = pages[page].sections[0];
    renderPageSelector();
    renderSectionSelector();
    renderForm();
}

function renderSectionSelector() {
    const sections = pages[currentPage].sections;
    const container = document.getElementById('section-selector');
    if (!container) return;
    container.innerHTML = sections.map(section => `
        <button class="section-btn ${currentSection === section ? 'active' : ''}" onclick="switchSection('${section}')">
            ${section}
        </button>
    `).join('');
}

function switchSection(section) {
    currentSection = section;
    renderSectionSelector();
    renderForm();
}

// ========================
// Render Form
// ========================
function renderForm() {
    const data = content[currentSection];
    if (!data) return;
    
    const container = document.getElementById('form-container');
    let html = '<div class="form-card">';
    
    // Language tabs
    html += `
        <div class="lang-tabs">
            <button class="lang-tab ${currentLang === 'en' ? 'active' : ''}" onclick="setLang('en')">🇬🇧 English</button>
            <button class="lang-tab ${currentLang === 'bg' ? 'active' : ''}" onclick="setLang('bg')">🇧🇬 Български</button>
        </div>
    `;
    
    // English content
    html += `<div id="lang-en" class="lang-content ${currentLang === 'en' ? 'active' : ''}">`;
    html += renderFields(data.en, currentSection);
    html += `</div>`;
    
    // Bulgarian content
    html += `<div id="lang-bg" class="lang-content ${currentLang === 'bg' ? 'active' : ''}">`;
    html += renderFields(data.bg, currentSection);
    html += `</div>`;
    
    html += '</div>';
    container.innerHTML = html;
}

function renderFields(langData, section) {
    if (!langData) return '<p>No data</p>';
    
    // Hero sections (simple text fields)
    if (section === 'hero' || section === 'servicesHero' || section === 'whoWeAreHero') {
        let html = '';
        for (let key in langData) {
            if (typeof langData[key] === 'string') {
                html += `
                    <div class="form-group">
                        <label>${key}</label>
                        <textarea onchange="updateField('${section}', '${currentLang}', '${key}', this.value)">${escape(langData[key])}</textarea>
                    </div>
                `;
            }
        }
        return html;
    }
    
    // What We Do
    if (section === 'whatWeDo') {
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            <div class="form-group"><label>p1</label><textarea onchange="updateField('${section}', '${currentLang}', 'p1', this.value)">${escape(langData.p1)}</textarea></div>
            <div class="form-group"><label>p2</label><textarea onchange="updateField('${section}', '${currentLang}', 'p2', this.value)">${escape(langData.p2)}</textarea></div>
        `;
    }
    
    // Services with repeater
    if (section === 'homeServices' || section === 'serviceItems') {
        let itemsHtml = '';
        if (langData.items) {
            itemsHtml = langData.items.map((item, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeItem('${section}', ${i})">✕</button>
                    <div class="form-group"><label>name</label><input type="text" value="${escape(item.name)}" onchange="updateItem('${section}', ${i}, 'name', this.value)"></div>
                    <div class="form-group"><label>description</label><textarea onchange="updateItem('${section}', ${i}, 'description', this.value)">${escape(item.description)}</textarea></div>
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            ${itemsHtml}
            <button class="add-btn" onclick="addItem('${section}')">+ Add Item</button>
            ${langData.cta ? `<div class="form-group"><label>cta</label><input type="text" value="${escape(langData.cta)}" onchange="updateField('${section}', '${currentLang}', 'cta', this.value)"></div>` : ''}
        `;
    }
    
    // Our Edge
    if (section === 'ourEdge') {
        let itemsHtml = '';
        if (langData.items) {
            itemsHtml = langData.items.map((item, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeItem('${section}', ${i})">✕</button>
                    <div class="form-group"><label>title</label><input type="text" value="${escape(item.title)}" onchange="updateItem('${section}', ${i}, 'title', this.value)"></div>
                    <div class="form-group"><label>description</label><textarea onchange="updateItem('${section}', ${i}, 'description', this.value)">${escape(item.description)}</textarea></div>
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            ${itemsHtml}
            <button class="add-btn" onclick="addItem('${section}')">+ Add Item</button>
        `;
    }
    
    // Approach
    if (section === 'approach' || section === 'approachSection') {
        let html = '';
        for (let key in langData) {
            if (typeof langData[key] === 'string') {
                html += `<div class="form-group"><label>${key}</label><textarea onchange="updateField('${section}', '${currentLang}', '${key}', this.value)">${escape(langData[key])}</textarea></div>`;
            }
        }
        return html;
    }
    
    // Lifecycle
    if (section === 'lifecycle') {
        let stepsHtml = '';
        if (langData.steps) {
            stepsHtml = langData.steps.map((step, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeArrayItem('${section}', 'steps', ${i})">✕</button>
                    <input type="text" value="${escape(step)}" onchange="updateArrayItem('${section}', 'steps', ${i}, this.value)" style="width:100%">
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            <div class="form-group"><label>intro</label><textarea onchange="updateField('${section}', '${currentLang}', 'intro', this.value)">${escape(langData.intro)}</textarea></div>
            <div><label>steps</label>${stepsHtml}</div>
            <button class="add-btn" onclick="addArrayItem('${section}', 'steps')">+ Add Step</button>
        `;
    }
    
    // Principles
    if (section === 'principles') {
        let itemsHtml = '';
        if (langData.items) {
            itemsHtml = langData.items.map((item, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeItem('${section}', ${i})">✕</button>
                    <div class="form-group"><label>title</label><input type="text" value="${escape(item.title)}" onchange="updateItem('${section}', ${i}, 'title', this.value)"></div>
                    <div class="form-group"><label>description</label><textarea onchange="updateItem('${section}', ${i}, 'description', this.value)">${escape(item.description)}</textarea></div>
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            ${itemsHtml}
            <button class="add-btn" onclick="addItem('${section}')">+ Add Item</button>
        `;
    }
    
    // Industries
    if (section === 'industries') {
        let listHtml = '';
        if (langData.list) {
            listHtml = langData.list.map((item, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeArrayItem('${section}', 'list', ${i})">✕</button>
                    <input type="text" value="${escape(item)}" onchange="updateArrayItem('${section}', 'list', ${i}, this.value)" style="width:100%">
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            <div class="form-group"><label>intro</label><textarea onchange="updateField('${section}', '${currentLang}', 'intro', this.value)">${escape(langData.intro)}</textarea></div>
            <div><label>list</label>${listHtml}</div>
            <button class="add-btn" onclick="addArrayItem('${section}', 'list')">+ Add Item</button>
        `;
    }
    
    // Team
    if (section === 'team') {
        let membersHtml = '';
        if (langData.members) {
            membersHtml = langData.members.map((member, i) => `
                <div class="repeater-item">
                    <button class="remove-btn" onclick="removeArrayItem('${section}', 'members', ${i})">✕</button>
                    <div class="form-group"><label>name</label><input type="text" value="${escape(member.name)}" onchange="updateTeamMember(${i}, 'name', this.value)"></div>
                    <div class="form-group"><label>role</label><input type="text" value="${escape(member.role)}" onchange="updateTeamMember(${i}, 'role', this.value)"></div>
                    <div class="form-group"><label>bio</label><textarea onchange="updateTeamMember(${i}, 'bio', this.value)">${escape(member.bio)}</textarea></div>
                </div>
            `).join('');
        }
        return `
            <div class="form-group"><label>heading</label><input type="text" value="${escape(langData.heading)}" onchange="updateField('${section}', '${currentLang}', 'heading', this.value)"></div>
            <div class="form-group"><label>sub</label><input type="text" value="${escape(langData.sub)}" onchange="updateField('${section}', '${currentLang}', 'sub', this.value)"></div>
            <div class="form-group"><label>tag</label><input type="text" value="${escape(langData.tag)}" onchange="updateField('${section}', '${currentLang}', 'tag', this.value)"></div>
            <div><label>members</label>${membersHtml}</div>
            <button class="add-btn" onclick="addTeamMember()">+ Add Member</button>
        `;
    }
    
    // Contact
    if (section === 'contact' || section === 'contactPage') {
        let html = '';
        for (let key in langData) {
            if (key === 'form') {
                html += `<div class="form-group"><label>form.submit</label><input type="text" value="${escape(langData.form?.submit)}" onchange="updateField('${section}', '${currentLang}', 'form.submit', this.value)"></div>`;
                if (langData.form.name) html += `<div class="form-group"><label>form.name</label><input type="text" value="${escape(langData.form.name)}" onchange="updateField('${section}', '${currentLang}', 'form.name', this.value)"></div>`;
                if (langData.form.email) html += `<div class="form-group"><label>form.email</label><input type="text" value="${escape(langData.form.email)}" onchange="updateField('${section}', '${currentLang}', 'form.email', this.value)"></div>`;
            } else if (typeof langData[key] === 'string') {
                html += `<div class="form-group"><label>${key}</label><textarea onchange="updateField('${section}', '${currentLang}', '${key}', this.value)">${escape(langData[key])}</textarea></div>`;
            }
        }
        return html;
    }
    
    // Generic
    let html = '';
    for (let key in langData) {
        if (typeof langData[key] === 'string') {
            html += `<div class="form-group"><label>${key}</label><textarea onchange="updateField('${section}', '${currentLang}', '${key}', this.value)">${escape(langData[key])}</textarea></div>`;
        }
    }
    return html;
}

// ========================
// Update Functions
// ========================
function updateField(section, lang, field, value) {
    if (field.includes('.')) {
        const parts = field.split('.');
        let obj = content[section][lang];
        for (let i = 0; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) obj[parts[i]] = {};
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    } else {
        content[section][lang][field] = value;
    }
    triggerSave();
}

function addItem(section) {
    if (!content[section][currentLang].items) content[section][currentLang].items = [];
    content[section][currentLang].items.push({ name: "New Item", description: "Description" });
    renderForm();
    triggerSave();
}

function removeItem(section, index) {
    content[section][currentLang].items.splice(index, 1);
    renderForm();
    triggerSave();
}

function updateItem(section, index, field, value) {
    content[section][currentLang].items[index][field] = value;
    triggerSave();
}

function addArrayItem(section, arrayName) {
    if (!content[section][currentLang][arrayName]) content[section][currentLang][arrayName] = [];
    content[section][currentLang][arrayName].push("New item");
    renderForm();
    triggerSave();
}

function removeArrayItem(section, arrayName, index) {
    content[section][currentLang][arrayName].splice(index, 1);
    renderForm();
    triggerSave();
}

function updateArrayItem(section, arrayName, index, value) {
    content[section][currentLang][arrayName][index] = value;
    triggerSave();
}

function addTeamMember() {
    if (!content.team[currentLang].members) content.team[currentLang].members = [];
    content.team[currentLang].members.push({ name: "New Member", role: "Role", bio: "Bio" });
    renderForm();
    triggerSave();
}

function updateTeamMember(index, field, value) {
    content.team[currentLang].members[index][field] = value;
    triggerSave();
}

function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-editor-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    renderForm();
}

function escape(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

// ========================
// Export/Import
// ========================
function downloadJSON() {
    const dataStr = JSON.stringify(content, null, 2);
    const link = document.createElement('a');
    link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    link.download = 'content.json';
    link.click();
}

function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        content = JSON.parse(e.target.result);
        renderForm();
        saveContent();
    };
    reader.readAsText(file);
}

// ========================
// Initialize
// ========================
loadContent();

// Make functions global
window.switchPage = switchPage;
window.switchSection = switchSection;
window.setLang = setLang;
window.updateField = updateField;
window.addItem = addItem;
window.removeItem = removeItem;
window.updateItem = updateItem;
window.addArrayItem = addArrayItem;
window.removeArrayItem = removeArrayItem;
window.updateArrayItem = updateArrayItem;
window.addTeamMember = addTeamMember;
window.updateTeamMember = updateTeamMember;
window.downloadJSON = downloadJSON;
window.importJSON = importJSON;