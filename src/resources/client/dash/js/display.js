const OFICIO_MAP = {
    true_invoice: {
        text: 'Folio',
        type: 'text'
    },
    name: {
        text: 'Nombre',
        type: 'text'
    },
    subject: {
        text: 'Asunto',
        type: 'text'
    },
    reception_date: {
        text: 'Fecha de recepción',
        type: 'date'
    },
    deadline: {
        text: 'Fecha limite',
        type: 'date'
    }
}

const EMITTED_MAP = {
    name: {
        text: 'Nombre',
        type: 'text'
    },
    position: {
        text: 'Cargo',
        type: 'text'
    },
    subject: {
        text: 'Asunto',
        type: 'text'
    },
    emission_date: {
        text: 'Fecha de emisión',
        type: 'date'
    },
    reception_date: {
        text: 'Fecha de recepción',
        type: 'date'
    }
}

const USER_MAP = {
    name: {
        text: 'Nombre',
        type: 'text'
    },
    username: {
        text: 'Usuario',
        type: 'text'
    },
    group: {
        text: 'Dirección',
        nested: true,
        property: 'group',
        type: 'text'
    },
    role: {
        text: 'Rol',
        nested: true,
        property: 'role',
        type: 'text'
    }
}

function hideShowResult(trigger, target) {
    const targetElement = document.getElementById(target);

    trigger.classList.toggle("border-round");
    trigger.classList.toggle("border-round-top");
    targetElement.classList.toggle("dis-none");
}

function generateResultTop(uuid, labelText) {
    const top = document.createElement('div');
    const label = document.createElement('p');

    top.setAttribute('class', 'result-top border-round');
    top.setAttribute('id', `top_${uuid}`);

    label.innerText = labelText;

    top.appendChild(label);

    top.setAttribute('onclick', `hideShowResult(this, 'body_${uuid}')`)

    return top;
}

function generateResultBody(uuid, content, keys = [], map, options = { comments: true, status: true, permissions: false, layout: 'oficio' }) {
    const body = document.createElement('div');

    body.setAttribute('class', 'dis-none result-body');
    body.setAttribute('id', `body_${uuid}`);

    const dataDiv = document.createElement('div');
    dataDiv.setAttribute('class', `result-data ${options.layout}`);

    body.appendChild(dataDiv);

    for (const key in content) {
        if (!Object.hasOwn(content, key)) continue;
        
        if (keys.includes(key)) {
            const p = document.createElement('p');
            const b = document.createElement('b');
            const span = document.createElement('span');

            b.innerText = `${map[key].text}: `;

            p.appendChild(b);

            span.innerText = map[key].type === 'date' ? new Date(content[key]).toLocaleDateString(undefined, { timeZone: 'UTC' }) : map[key].nested ? content[key][map[key].property] : content[key];

            p.appendChild(span);

            dataDiv.appendChild(p);
        }
    }

    if (options.status) {
        const statusDiv = document.createElement('div');
        statusDiv.setAttribute('class', 'result-status');

        for (const s of content.status) {
            const p = document.createElement('p');
            p.setAttribute('class', `status ${s.replaceAll(' ', '-')}`);

            p.innerText = s;

            statusDiv.appendChild(p);
        }

        body.appendChild(statusDiv);
    }

    if (options.permissions) {
        const permissionsDiv = document.createElement('div');
        permissionsDiv.setAttribute('class', 'result-permissions');

        if (content.permissions.length === 0) {
            const p = document.createElement('p');
            p.setAttribute('class', 'no-comment')

            p.innerText = 'Sin permisos asignados';

            commentsDiv.appendChild(p);
        }

        for (const p of content.permissions) {
            const permission = document.createElement('p');
            permission.setAttribute('class', 'bi-list-check permission');

            permission.innerText = ` ${p.permission}`;

            permissionsDiv.appendChild(permission);
        }

        body.appendChild(permissionsDiv);
    }

    if (options.comments) {
        const commentsDiv = document.createElement('div');
        commentsDiv.setAttribute('class', 'result-comments');

        if (content.comments.length === 0) {
            const p = document.createElement('p');
            p.setAttribute('class', 'no-comment')

            p.innerText = 'Sin comentarios';

            commentsDiv.appendChild(p);
        }

        for (const c of content.comments) {
            const comment = document.createElement('article');
            comment.setAttribute('class', 'comment')

            comment.innerHTML = `
            <header>
                <strong class="bi-person-circle"> ${c.user.name} (${c.user.username})</strong>
                <p>${new Date(c.createdAt).toLocaleString()}</p>
            </header>
            <section>
                <p>${c.comment_txt}</p>
            </section>
            `

            commentsDiv.appendChild(comment);
        }

        body.appendChild(commentsDiv);
    }

    return body;
}

function createOficioResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice);
    const body = generateResultBody(uuid, obj, ['true_invoice', 'name', 'subject', 'reception_date', 'deadline'], OFICIO_MAP);

    result.appendChild(top);
    result.appendChild(body);

    return result;
}

function createEmittedResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice);
    const body = generateResultBody(uuid, obj, ['name', 'subject', 'position', 'emission_date', 'reception_date'], EMITTED_MAP, { comments: false, status: false, layout: 'emitted' });

    result.appendChild(top);
    result.appendChild(body);

    return result;
}

function createUserResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice);
    const body = generateResultBody(uuid, obj, ['name', 'username', 'group', 'role'], USER_MAP, { comments: false, status: false, permissions: true, layout: 'users' });

    result.appendChild(top);
    result.appendChild(body);

    return result;
}