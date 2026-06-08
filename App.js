/**
 * URCC - Main Application Logic
 * Full Routing & Rendering System
 */

const state = {
    currentRole: 'student',
    currentView: 'dashboard',
    user: {
        name: 'Alex Doe',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=3b82f6&color=fff'
    }
};

// --- Mock Data ---

const mockProjects = [
    { title: 'Quantum Machine Learning Models', author: 'Prof. Alan Turing', tags: ['Quantum', 'AI', 'Python'], match: '95%' },
    { title: 'NLP for Medical Records', author: 'Dr. Jane Smith', tags: ['NLP', 'Healthcare', 'PyTorch'], match: '88%' },
    { title: 'Robotics Path Planning', author: 'Dr. John Doe', tags: ['Robotics', 'C++', 'ROS'], match: '72%' },
    { title: 'Blockchain for Academic Publishing', author: 'Prof. Satoshi', tags: ['Blockchain', 'Cryptography'], match: '65%' }
];

const mockFaculty = [
    { name: 'Dr. Sarah Connor', dept: 'Computer Science', interests: ['Artificial Intelligence', 'Cybersecurity'], avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=8b5cf6&color=fff' },
    { name: 'Prof. Richard Feynman', dept: 'Physics', interests: ['Quantum Mechanics', 'Nanotechnology'], avatar: 'https://ui-avatars.com/api/?name=Richard+Feynman&background=ec4899&color=fff' },
    { name: 'Dr. Emmet Brown', dept: 'Engineering', interests: ['Time Travel', 'Energy Systems'], avatar: 'https://ui-avatars.com/api/?name=Emmet+Brown&background=10b981&color=fff' }
];

const mockRequests = [
    { student: 'Michael Chang', program: 'MSc Computer Science', date: '2 hours ago', match: '90%' },
    { student: 'Emma Watson', program: 'PhD Physics', date: '1 day ago', match: '85%' },
    { student: 'Liam Neeson', program: 'BSc Engineering', date: '3 days ago', match: '60%' }
];

// --- Navigation Config ---

const navConfig = {
    student: [
        { id: 'dashboard', icon: 'fa-solid fa-house', label: 'Dashboard', active: true },
        { id: 'find-collab', icon: 'fa-solid fa-users', label: 'Find Collaborators' },
        { id: 'opportunities', icon: 'fa-solid fa-briefcase', label: 'Opportunities' },
        { id: 'analytics', icon: 'fa-solid fa-chart-pie', label: 'My Analytics' }
    ],
    faculty: [
        { id: 'dashboard', icon: 'fa-solid fa-house', label: 'Dashboard', active: true },
        { id: 'my-projects', icon: 'fa-solid fa-folder-open', label: 'My Projects' },
        { id: 'requests', icon: 'fa-solid fa-inbox', label: 'Review Requests' }
    ],
    external: [
        { id: 'discovery', icon: 'fa-solid fa-magnifying-glass', label: 'Discover Faculty', active: true },
        { id: 'network', icon: 'fa-solid fa-network-wired', label: 'My Network' },
        { id: 'messages', icon: 'fa-solid fa-envelope', label: 'Messages' }
    ],
    admin: [
        { id: 'reports', icon: 'fa-solid fa-chart-line', label: 'System Reports', active: true },
        { id: 'users', icon: 'fa-solid fa-users-gear', label: 'User Management' },
        { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' }
    ]
};

// --- DOM Elements ---
const roleSelect = document.getElementById('role-select');
const navMenu = document.getElementById('nav-menu');
const viewContainer = document.getElementById('view-container');

// --- Initialization ---
function init() {
    initTheme();
    roleSelect.addEventListener('change', (e) => switchRole(e.target.value));
    
    // Global Modal Listeners (Delegated)
    document.addEventListener('click', (e) => {
        // Open Modal
        if(e.target.closest('#btn-post-project') || e.target.closest('#btn-post-project-2')) {
            document.getElementById('post-modal').classList.remove('d-none');
        }
        // Close Modal via X or Cancel
        if(e.target.closest('#close-modal') || e.target.closest('#cancel-modal')) {
            document.getElementById('post-modal').classList.add('d-none');
        }
    });

    document.getElementById('post-opportunity-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Opportunity Published Successfully! (Mock)');
        document.getElementById('post-modal').classList.add('d-none');
        e.target.reset();
    });

    switchRole('student');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.dataset.theme = 'light';
        updateThemeIcon('light');
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.dataset.theme || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.dataset.theme = newTheme;
            }
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        if (theme === 'light') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}

// --- Role Switching & Routing ---
function switchRole(role) {
    state.currentRole = role;
    state.currentView = navConfig[role][0].id;
    updateUserInfoWidget(role);
    renderNavMenu(role);
    loadView(role, state.currentView);
}

function updateUserInfoWidget(role) {
    const roleLabels = {
        student: { name: 'Alex Doe', title: 'Student Researcher', color: '3b82f6' },
        faculty: { name: 'Dr. Jane Smith', title: 'Faculty Member', color: '8b5cf6' },
        external: { name: 'Elon M.', title: 'External Partner', color: 'ec4899' },
        admin: { name: 'System Admin', title: 'Administrator', color: '10b981' }
    };
    const info = roleLabels[role];
    document.querySelector('.user-name').textContent = info.name;
    document.querySelector('.user-role').textContent = info.title;
    document.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${info.name.replace(' ', '+')}&background=${info.color}&color=fff`;
}

function renderNavMenu(role) {
    navMenu.innerHTML = '';
    const items = navConfig[role];
    items.forEach((item, index) => {
        const link = document.createElement('a');
        link.className = `nav-item ${item.id === state.currentView ? 'active' : ''}`;
        link.dataset.view = item.id;
        link.innerHTML = `<i class="${item.icon}"></i> <span>${item.label}</span>`;
        link.href = '#';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            link.classList.add('active');
            state.currentView = item.id;
            loadView(state.currentRole, item.id);
        });
        navMenu.appendChild(link);
    });
}

function loadView(role, viewId) {
    viewContainer.innerHTML = '';
    const templateId = `tpl-${role}-${viewId}`;
    const template = document.getElementById(templateId);
    
    if (template) {
        viewContainer.appendChild(template.content.cloneNode(true));
        executeViewScripts(role, viewId);
    } else {
        viewContainer.innerHTML = `<h2 style="color:var(--text-primary);">Template \`${templateId}\` not found</h2>`;
    }
}

// --- Specific View Initialization Logic ---

function executeViewScripts(role, viewId) {
    // ==== STUDENT ====
    if (role === 'student' && viewId === 'dashboard') {
        const projEl = document.getElementById('student-projects');
        mockProjects.slice(0, 2).forEach(proj => {
            projEl.insertAdjacentHTML('beforeend', getProjectCardHTML(proj));
        });
        const colEl = document.getElementById('student-collaborators');
        mockFaculty.slice(0, 2).forEach(fac => {
            colEl.insertAdjacentHTML('beforeend', getFacultyCardSmallHTML(fac));
        });
    }
    if (role === 'student' && viewId === 'find-collab') {
        const searchRes = document.getElementById('student-search-results');
        mockFaculty.forEach((fac, idx) => {
            searchRes.insertAdjacentHTML('beforeend', getFacultyCardLargeHTML(fac, idx));
        });
    }
    if (role === 'student' && viewId === 'opportunities') {
        const list = document.getElementById('student-opportunity-list');
        mockProjects.forEach(proj => list.insertAdjacentHTML('beforeend', getProjectCardHTML(proj)));
    }
    
    // ==== FACULTY ====
    if (role === 'faculty' && viewId === 'dashboard') {
        const dashTbody = document.getElementById('faculty-dashboard-projects');
        [{ title: 'NLP Model Optimization', app: 5, st: 'Open' }, { title: 'Legacy Systems Migration', app: 0, st: 'Closed' }].forEach(p => {
            dashTbody.insertAdjacentHTML('beforeend', `<tr><td><strong>${p.title}</strong></td><td>${p.app} pending</td><td><span class="status-badge ${p.st === 'Open' ? 'status-open' : 'status-closed'}">${p.st}</span></td></tr>`);
        });
        const dashReqs = document.getElementById('faculty-dashboard-requests');
        dashReqs.insertAdjacentHTML('beforeend', getRequestCardHTML(mockRequests[0], 0));
        dashReqs.insertAdjacentHTML('beforeend', getRequestCardHTML(mockRequests[1], 1));
        attachRequestActions();
    }
    if (role === 'faculty' && viewId === 'my-projects') {
        const tbody = document.getElementById('faculty-all-projects');
        [{ title: 'NLP Model Optimization', desc: 'Training BERT on EHR...', st: 'Open' }, { title: 'Legacy Systems Migration', desc: 'Moving from COBOL...', st: 'Closed' }].forEach(p => {
            tbody.insertAdjacentHTML('beforeend', `<tr><td><strong>${p.title}</strong></td><td><span style="color:var(--text-muted)">${p.desc}</span></td><td><span class="status-badge ${p.st === 'Open' ? 'status-open' : 'status-closed'}">${p.st}</span></td><td><button class="btn btn-outline btn-sm">Edit</button></td></tr>`);
        });
    }
    if (role === 'faculty' && viewId === 'requests') {
        const allReqs = document.getElementById('faculty-all-requests');
        mockRequests.forEach((req, idx) => allReqs.insertAdjacentHTML('beforeend', getRequestCardHTML(req, idx)));
        attachRequestActions();
    }

    // ==== EXTERNAL ====
    if (role === 'external' && viewId === 'discovery') {
        const searchRes = document.getElementById('external-faculty-results');
        mockFaculty.forEach((fac, idx) => {
            searchRes.insertAdjacentHTML('beforeend', getFacultyCardLargeHTML(fac, idx));
        });
    }
    if (role === 'external' && viewId === 'network') {
        const list = document.getElementById('external-network-list');
        list.insertAdjacentHTML('beforeend', getFacultyCardSmallHTML(mockFaculty[0]));
        list.insertAdjacentHTML('beforeend', getFacultyCardSmallHTML(mockFaculty[1]));
    }
    if (role === 'external' && viewId === 'messages') {
        const threads = document.getElementById('message-threads');
        ['Dr. Sarah Connor', 'Prof. Richard Feynman'].forEach((name, idx) => {
            threads.insertAdjacentHTML('beforeend', `
                <div class="list-item" style="border-radius: 0; border-left: none; border-right: none; border-top: ${idx===0?'none':'1px solid var(--border-color)'}; cursor: pointer;">
                    <div class="item-main">
                        <img src="https://ui-avatars.com/api/?name=${name.replace(' ','+')}&background=random" style="width:40px; height:40px; border-radius:50%;">
                        <div><h4 style="font-size:0.95rem">${name}</h4><p style="font-size:0.8rem">Re: The AI Project...</p></div>
                    </div>
                </div>
            `);
        });
    }

    // ==== ADMIN ====
    if (role === 'admin' && viewId === 'reports') {
        const ul = document.getElementById('admin-recent-logs');
        ul.insertAdjacentHTML('beforeend', `<li><div class="activity-details"><p><strong>Dr. Smith</strong> accepted request from <strong>Jane Doe</strong></p><span style="color:var(--text-muted); font-size: 0.8rem;">2 mins ago</span></div></li>`);
        ul.insertAdjacentHTML('beforeend', `<li><div class="activity-details"><p><strong>Prof. Alan</strong> posted a new opportunity in Quantum ML</p><span style="color:var(--text-muted); font-size: 0.8rem;">1 hour ago</span></div></li>`);
    }
    if (role === 'admin' && viewId === 'users') {
        const tbody = document.getElementById('admin-users-table');
        [{n:'Alex Doe', r:'Student', s:'Active'}, {n:'Dr. Jane Smith', r:'Faculty', s:'Active'}, {n:'John Hacker', r:'External', s:'Suspended'}].forEach(u => {
            tbody.insertAdjacentHTML('beforeend', `<tr><td><strong>${u.n}</strong></td><td>${u.r}</td><td><span class="status-badge ${u.s==='Active'?'status-open':'status-closed'}">${u.s}</span></td><td><button class="btn btn-outline btn-sm">Manage</button></td></tr>`);
        });
    }
}


// --- HTML Generators for Reusability ---

function getProjectCardHTML(proj) {
    return `
        <div class="list-item">
            <div class="item-main">
                <div class="item-icon"><i class="fa-solid fa-flask"></i></div>
                <div class="item-details">
                    <h4>${proj.title}</h4>
                    <p>By ${proj.author} • ${proj.tags.join(', ')}</p>
                </div>
            </div>
            <div class="item-actions">
                <span class="match-badge">Match ${proj.match}</span>
                <button class="btn btn-outline btn-sm" style="margin-left: 12px;">Apply</button>
            </div>
        </div>
    `;
}

function getFacultyCardSmallHTML(fac) {
    return `
        <div class="list-item">
            <div class="item-main">
                <img src="${fac.avatar}" alt="${fac.name}" style="width:48px; height:48px; border-radius:12px;">
                <div class="item-details">
                    <h4>${fac.name}</h4>
                    <p>${fac.dept} • ${fac.interests[0]}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-sm">Message</button>
            </div>
        </div>
    `;
}

function getFacultyCardLargeHTML(fac, idx) {
    const tagsHtml = fac.interests.map(t => `<span class="tag">${t}</span>`).join('');
    return `
        <div class="faculty-card glass slide-up" style="animation-delay: ${idx * 0.1}s">
            <div class="faculty-header">
                <img src="${fac.avatar}" alt="${fac.name}">
                <div>
                    <h4 style="font-size:1.1rem;">${fac.name}</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary);">${fac.dept}</p>
                </div>
            </div>
            <div class="faculty-tags">${tagsHtml}</div>
            <div style="margin-top: auto; padding-top: 16px;">
                <button class="btn btn-outline" style="width: 100%;">View Full Profile</button>
            </div>
        </div>
    `;
}

function getRequestCardHTML(req, idx) {
    return `
        <div class="request-card fade-in" style="animation-delay: ${idx * 0.1}s">
            <div class="request-header">
                <div class="req-user">
                    <img src="https://ui-avatars.com/api/?name=${req.student.replace(' ', '+')}&background=random" alt="${req.student}">
                    <div>
                        <h4>${req.student} <span class="match-badge" style="font-size:0.7rem; margin-left:8px;">${req.match} Match</span></h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${req.program} • Applied ${req.date}</p>
                    </div>
                </div>
                <div class="req-actions">
                    <button class="btn btn-outline btn-sm action-btn" data-action="reject"><i class="fa-solid fa-xmark text-danger"></i> Reject</button>
                    <button class="btn btn-outline btn-sm action-btn" data-action="hold"><i class="fa-solid fa-pause text-warning"></i> Hold</button>
                    <button class="btn btn-primary btn-sm action-btn" data-action="accept"><i class="fa-solid fa-check"></i> Accept</button>
                </div>
            </div>
            <div class="req-body">
                <p style="font-size: 0.9rem; color: var(--text-muted);">&quot;I am very interested in this project given my prior works...&quot;</p>
            </div>
        </div>
    `;
}

function attachRequestActions() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        // use pointer events to avoid multi-adding if called multiple times, or just handle normally:
        btn.onclick = function() {
            const card = this.closest('.request-card');
            const action = this.dataset.action;
            if(action === 'accept') card.style.borderLeft = '4px solid var(--success)';
            if(action === 'reject') { card.style.opacity = '0.5'; card.style.pointerEvents = 'none'; }
            if(action === 'hold') card.style.borderLeft = '4px solid var(--warning)';
            this.closest('.req-actions').innerHTML = `<span style="font-size:0.9rem; font-weight:600; text-transform:uppercase;">Status: ${action}ed</span>`;
        };
    });
}

// Boot up
document.addEventListener('DOMContentLoaded', init);