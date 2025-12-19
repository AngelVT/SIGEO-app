const btnAllOficio = document.getElementById('btn_all_oficio');
const btnAllEmitido = document.getElementById('btn_all_emitido');
const btnAllUsers = document.getElementById('btn_all_user');

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
        const result = document.createElement('pre');

        result.innerText = JSON.stringify(o, null, 8);

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
        const result = document.createElement('pre');

        result.innerText = JSON.stringify(eo, null, 8);

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
        const result = document.createElement('pre');

        result.innerText = JSON.stringify(u, null, 8);

        resultContainer.appendChild(result)
    }
});