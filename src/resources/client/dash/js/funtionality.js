const btnAllOficio = document.getElementById('btn_all_oficio');
const btnAllEmitido = document.getElementById('btn_all_emitido');
const btnAllUsers = document.getElementById('btn_all_user');

const oficioSearchForm = document.getElementById('oficio_search');
const emittedSearchForm = document.getElementById('emitido_search');
const userSearchForm = document.getElementById('user_search');

const oficioRegForm = document.getElementById('oficio-registration');
const emittedRegForm = document.getElementById('emitted-registration');
const userRegForm = document.getElementById('user-registration');

const isResponseCheckbox = document.getElementById('response_required_checkbox');
const responseRequiredSelect = document.getElementById('response_required_select');

const resultContainer = document.getElementById('results');

function parameterBuilder(form) {
    const data = Object.fromEntries(new FormData(form));

    const parameters = []

    for (const key in data) {
        if (!Object.hasOwn(data, key)) continue;
        
        if (data[key])
            parameters.push(encodeURI(`${key}=${data[key]}`));
    }

    return parameters;
}

btnAllOficio.addEventListener('click', async () => {
    const res = await fetch('/api/oficio/in', {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg)
        return;
    }

    const { oficios } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const o of oficios) {
        const result = createOficioResult(o, o.oficio_uuid, o.oficio_invoice);

        resultContainer.appendChild(result);
    }
});

btnAllEmitido.addEventListener('click', async () => {
    const res = await fetch('/api/oficio/emitted', {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { emittedOficios } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const eo of emittedOficios) {
        const result = createEmittedResult(eo, eo.emitted_of_uuid, eo.emitted_of_invoice);

        resultContainer.appendChild(result)
    }
});

btnAllUsers.addEventListener('click', async () => {
    const res = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { users } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const u of users) {
        const result = createUserResult(u, u.user_uuid, `${u.name} (${u.username})`);

        resultContainer.appendChild(result)
    }
});

oficioSearchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const parameters = parameterBuilder(oficioSearchForm);

    const res = await fetch(`/api/oficio/in/filtered?${parameters.join('&')}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { oficios } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const o of oficios) {
        const result = createOficioResult(o, o.oficio_uuid, o.oficio_invoice);

        resultContainer.appendChild(result);
    }
});

emittedSearchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const parameters = parameterBuilder(emittedSearchForm);

    const res = await fetch(`/api/oficio/emitted/filtered?${parameters.join('&')}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg)
        return;
    }

    const { emittedOficios } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const eo of emittedOficios) {
        const result = createEmittedResult(eo, eo.emitted_of_uuid, eo.emitted_of_invoice);

        resultContainer.appendChild(result)
    }
});

userSearchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const parameters = parameterBuilder(emittedSearchForm);

    const res = await fetch(`/api/user/filtered?${parameters.join('&')}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg)
        return;
    }

    const { users } = response;

    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const u of users) {
        const result = createUserResult(u, u.user_uuid, `${u.name} (${u.username})`);

        resultContainer.appendChild(result);
    }
});

async function getOficioUUID(uuid) {
    const res = await fetch(`/api/oficio/in/id/${uuid}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { oficio } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    const result = createOficioResult(oficio, oficio.oficio_uuid, oficio.oficio_invoice);

    resultContainer.appendChild(result);
}

oficioRegForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(oficioRegForm);

    formData.set('response_required', oficioRegForm.elements['response_required'].checked);

    const res = await fetch('/api/oficio/in', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    await getOficioUUID(response.oficio.oficio_uuid);

    oficioRegForm.reset();

    oficioRegPanel.classList.add('dis-none');
    oficioRegBtn.removeAttribute('disabled');
});

isResponseCheckbox.addEventListener('change', async () => {
    if (isResponseCheckbox.checked) {
        responseRequiredSelect.setAttribute('required', true);

        responseRequiredSelect.innerHTML = '<option value="">Seleccionar ... </option>';

        const res = await fetch('/api/oficio/in/unanswered', {
            method: 'GET',
            credentials: 'include'
        });

        const response = await res.json();

        if (!res.ok) {
            alert(response.msg);
            return;
        }

        const { oficios } = response;

        for (const o of oficios) {
            const option = document.createElement('option');

            option.value = o.oficio_uuid;
            option.innerText = o.oficio_invoice;

            responseRequiredSelect.appendChild(option);
        }

        return;
    }

    responseRequiredSelect.removeAttribute('required');
});

async function getEmittedUUID(uuid) {
    const res = await fetch(`/api/oficio/emitted/id/${uuid}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { emittedOficio } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    const result = createEmittedResult(emittedOficio, emittedOficio.emitted_of_uuid, emittedOficio.emitted_of_invoice);

    resultContainer.appendChild(result);
}

emittedRegForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(emittedRegForm);

    formData.set('is_response', emittedRegForm.elements['is_response'].checked);

    const res = await fetch('/api/oficio/emitted', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    await getEmittedUUID(response.emittedOficio.emitted_of_uuid);

    emittedRegForm.reset();

    emittedRegPanel.classList.add('dis-none');
    emittedRegBtn.removeAttribute('disabled');
});

async function getUserUUID(uuid) {
    const res = await fetch(`/api/user/id/${uuid}`, {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { user } = response;
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    const result = createUserResult(user, user.user_uuid, `${user.name} (${user.username})`);

    resultContainer.appendChild(result);
}

userRegForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(userRegForm);

    const selectedPermissions = formData.getAll('permissions');

    if (selectedPermissions.length === 0 || !selectedPermissions) {
        alert('You need to select at least one permission');
        return;
    }

    const data = Object.fromEntries(formData);
    
    data.permissions = selectedPermissions;

    const res = await fetch('/api/user/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    await getUserUUID(response.user.user_uuid);

    userRegForm.reset();

    userRegPanel.classList.add('dis-none');
    userRegBtn.removeAttribute('disabled');
});