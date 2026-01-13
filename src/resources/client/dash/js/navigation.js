const oficiosLink = document.getElementById('oficios_link');
const emitidosLink = document.getElementById('emitidos_link');
const usersLink = document.getElementById('users_link');

const oficioSearch = document.getElementById('oficios-controls');
const emitidoSearch = document.getElementById('emitidos-controls');
const userSearch = document.getElementById('users-controls');

const oficioRegPanel = document.getElementById('oficio-panel');
const emittedRegPanel = document.getElementById('emitted-panel');
const userRegPanel = document.getElementById('user-panel');

const oficioRegBtn = document.getElementById('btn_create_oficio');
const emittedRegBtn = document.getElementById('btn_create_emitido');
const userRegBtn = document.getElementById('btn_create_user');

const oficioRegClose = document.getElementById('oficio-panel-close');
const emittedRegClose = document.getElementById('emitted-panel-close');
const userRegClose = document.getElementById('user-panel-close');

const links = document.querySelector('#navigation_links').querySelectorAll('li');
const searchForms = [oficioSearch, emitidoSearch, userSearch];

const cookieRaw = getCookie('session_info');

if (typeof cookieRaw === 'undefined') {
    console.warn('Session info failure');
} else {
    const cookie = JSON.parse(decodeURIComponent(cookieRaw));

    const { name, user, group, role } = cookie;

    if(role === 'system' && group === 'SYSTEM') {
        usersLink.classList.remove('dis-none');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

oficiosLink.addEventListener('click', () => {
    hideShow(oficiosLink, oficioSearch);
});

emitidosLink.addEventListener('click', () => {
    hideShow(emitidosLink, emitidoSearch);
});

usersLink.addEventListener('click', () => {
    hideShow(usersLink, userSearch);
});

function hideShow(link, target) {
    for (const f of searchForms) {
        f.classList.add('dis-none')
    }

    for (const l of links) {
        l.classList.remove('selected');
    }

    link.classList.add('selected');
    target.classList.remove('dis-none');
}

oficioRegBtn.addEventListener('click', () => {
    oficioRegPanel.classList.remove('dis-none');
    oficioRegBtn.setAttribute('disabled', 'true');
});

oficioRegClose.addEventListener('click', () => {
    oficioRegPanel.classList.add('dis-none');
    oficioRegBtn.removeAttribute('disabled');
});

// -------------------------------------------
emittedRegBtn.addEventListener('click', () => {
    emittedRegPanel.classList.remove('dis-none');
    emittedRegBtn.setAttribute('disabled', 'true');
});

emittedRegClose.addEventListener('click', () => {
    emittedRegPanel.classList.add('dis-none');
    emittedRegBtn.removeAttribute('disabled');
});

// -------------------------------------------
userRegBtn.addEventListener('click', () => {
    userRegPanel.classList.remove('dis-none');
    userRegBtn.setAttribute('disabled', 'true');
});

userRegClose.addEventListener('click', () => {
    userRegPanel.classList.add('dis-none');
    userRegBtn.removeAttribute('disabled');
});