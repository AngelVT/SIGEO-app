const btnAllOficio = document.getElementById('btn_all_oficio');
const btnAllEmitido = document.getElementById('btn_all_emitido');
const btnAllUsers = document.getElementById('btn_all_user');

const oficioSearchForm = document.getElementById('oficio_search');

const resultContainer = document.getElementById('results');

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

    for (const o of oficios) {
        const result = createOficioResult(o, o.oficio_uuid, o.oficio_invoice);

        resultContainer.appendChild(result)
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

    for (const u of users) {
        const result = createUserResult(u, u.user_uuid, `${u.name} (${u.username})`);

        resultContainer.appendChild(result)
    }
});

oficioSearchForm.addEventListener('submit', async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(oficioSearchForm));

    const parameters = []

    for (const key in data) {
        if (!Object.hasOwn(data, key)) continue;
        
        if (data[key])
            parameters.push(encodeURI(`${key}=${data[key]}`));
    }

    const res = await fetch(`/api/oficio/in/filtered?${parameters.join('&')}`, {
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

    for (const o of oficios) {
        const result = createOficioResult(o, o.oficio_uuid, o.oficio_invoice);

        resultContainer.appendChild(result)
    }
});