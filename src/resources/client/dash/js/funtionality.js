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

async function updateUnansweredList() {
    const responseOptions = await getUnansweredOficios();

    EMITTED_MAP.oficio_uuid.options = [{
        value: '',
        text: 'Seleccionar ...'
    }]

    for (const ro of responseOptions) {
        EMITTED_MAP.oficio_uuid.options.push({
            value: ro.oficio_uuid,
            text: ro.oficio_invoice
        });
    }
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

    await updateUnansweredList();
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const eo of emittedOficios) {
        eo.oficio_uuid = eo.oficio?.oficio_uuid;
        eo.oficio_text = eo.oficio?.oficio_invoice;

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
        u.permissions = u.permissions.map(
            p => p.permission_id
        );
        const result = createUserResult(u, u.user_uuid, `${u.name} (${u.username})`);

        resultContainer.appendChild(result);
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

    await updateUnansweredList();
    
    resultContainer.innerHTML = '';
    resultContainer.scrollTop = resultContainer.scrollHeight;

    for (const eo of emittedOficios) {
        eo.oficio_uuid = eo.oficio?.oficio_uuid;
        eo.oficio_text = eo.oficio?.oficio_invoice;

        const result = createEmittedResult(eo, eo.emitted_of_uuid, eo.emitted_of_invoice);

        resultContainer.appendChild(result)
    }
});

userSearchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const parameters = parameterBuilder(userSearchForm);

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
        u.permissions = u.permissions.map(
            p => p.permission_id
        );

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

async function getUnansweredOficios() {
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

        return oficios;
}

isResponseCheckbox.addEventListener('change', async () => {
    if (isResponseCheckbox.checked) {
        responseRequiredSelect.setAttribute('required', true);

        responseRequiredSelect.innerHTML = '<option value="">Seleccionar ... </option>';

        const oficios = await getUnansweredOficios();

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

    emittedOficio.oficio_uuid = eo.oficio?.oficio_uuid;
    emittedOficio.oficio_text = eo.oficio?.oficio_invoice;

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

    user.permissions = user.permissions.map(
        p => p.permission_id
    );

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

const areArraysEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && 
        arr1.every((val, index) => val === arr2[index]);
};

async function updateResult(e) {
    e.preventDefault();

    const url = e.target.action;
    const form = e.target;
    const originalInput = form.querySelector('input[type=hidden]');

    const bodyType = form.getAttribute('body');

    const data = new FormData(form);

    const { file, ...originalData } = JSON.parse(data.get('original_data'));

    data.delete('original_data');

    const { oficio_pdf, ...currentData} = Object.fromEntries(data);

    for (const key in originalData) {
        if (!Object.hasOwn(originalData, key)) continue;
        
        if (!isNaN(originalData[key])) {
            currentData[key] = parseInt(currentData[key]);
        }
    }

    const patchPayload = Object.keys(currentData).reduce((acc, key) => {
        if (Array.isArray(originalData[key])) {
            let selected = data.getAll(key);

            const mappedSelected = selected.map(s => (s !== "" && !isNaN(s)) ? Number(s) : s);
            
            data.set(key, JSON.stringify(mappedSelected));
            currentData[key] = mappedSelected;
        }

        console.log(key, ': ', originalData[key], 'vs new ', currentData[key])
        if(Array.isArray(originalData[key])) {
            if (areArraysEqual(originalData[key], currentData[key])) {
                data.delete(key);
            }
        } else if (currentData[key] === originalData[key] || !currentData[key]) {
            data.delete(key);
        }

        if(Array.isArray(originalData[key])) {
            if (!areArraysEqual(originalData[key], currentData[key])) {
                acc[key] = currentData[key];
            }
        } else if (currentData[key] !== originalData[key] && currentData[key]) {
            acc[key] = currentData[key];
        }

        return acc;
    }, {});

    const updatedCount = Object.keys(patchPayload).length;

    if (oficio_pdf && oficio_pdf.size === 0) {
        data.delete('oficio_pdf');
    }

    if ((updatedCount === 0 && !oficio_pdf) || (updatedCount === 0 && oficio_pdf && oficio_pdf.size === 0)) {
        alert('No se han realizado cambios');
        return;
    }

    if(!confirm('Estas seguro de que quieres actualizar este recurso?')) {
        return;
    }

    let fetchOptions = {
        method: 'PATCH',
        credentials: 'include',
        body: data
    }

    if (bodyType === 'json') {
        fetchOptions = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(data))
        }
    }

    const res = await fetch(url, fetchOptions);

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return;
    }

    const { oficio, emittedOficio, user } = response;

    const updateOriginalInput = (newData, oldData) => {
        const updated = Object.keys(newData).reduce((acc, key) => {
            if (Object.keys(newData).includes(key) && Object.keys(oldData).includes(key)) {
                acc[key] = newData[key];
            }
            if (newData.file) {
                acc.file = newData.file;
            }
            return acc;
        }, {});

        return updated
    }

    if (oficio) {
        alert(`Se ha actualizado correctamente el oficio ${oficio.oficio_invoice}`)
        originalInput.value = JSON.stringify(updateOriginalInput(oficio, originalData));
        return;
    }

    if (emittedOficio) {
        alert(`Se ha actualizado correctamente el oficio emitido ${emittedOficio.emitted_of_invoice}`)
        originalInput.value = JSON.stringify(updateOriginalInput(emittedOficio, originalData));
        return;
    }

    if (user) {
        alert(`Se ha actualizado correctamente el usuario ${user.name} (${user.username})`)
        originalInput.value = JSON.stringify(updateOriginalInput(user, originalData));
        return;
    }
} 