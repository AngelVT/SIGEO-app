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
    },
    emitted_oficio: {
        links: 'emitted_of_uuid',
        text: 'Respuesta',
        linkText: 'emitted_of_invoice',
        functionName: 'getEmittedUUID'
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
    },
    oficio: {
        links: 'oficio_uuid',
        text: 'Respuesta para',
        linkText: 'oficio_invoice',
        functionName: 'getOficioUUID'
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

function generateResultTop(uuid, labelText, file, {
    relationFlag = false,
    useAccomplishedStatus = false,
    accomplishedStatus = false,
} = {}) {
    const top = document.createElement('div');
    const label = document.createElement('p');

    top.setAttribute('class', 'result-top border-round');
    top.setAttribute('id', `top_${uuid}`);

    label.innerText = labelText;

    if (file) {
        const fileLink = document.createElement('a');

        fileLink.setAttribute('class', 'bi-file-earmark-pdf-fill');

        fileLink.target = '_blank';
        fileLink.href = file;

        label.appendChild(fileLink)
    }

    if (relationFlag) {
        const relationFlag = document.createElement('span');

        relationFlag.setAttribute('class', 'bi-files');

        label.appendChild(relationFlag);
    }

    if (useAccomplishedStatus) {
        const status = document.createElement('span');

        status.setAttribute('class', accomplishedStatus ? 'bi-file-earmark-check-fill' : 'bi-file-earmark-x-fill');

        label.appendChild(status);
    }

    top.appendChild(label);

    top.setAttribute('onclick', `hideShowResult(this, 'body_${uuid}')`)

    return top;
}

function generateResultBody(uuid, content, keys = [], map, { 
    comments = true, 
    status = true, 
    permissions = false, 
    layout = 'oficio', 
    hasRelation = false, 
    relation = '' 
} = {}) {
    const body = document.createElement('div');

    body.setAttribute('class', 'dis-none result-body');
    body.setAttribute('id', `body_${uuid}`);

    const dataDiv = document.createElement('div');
    dataDiv.setAttribute('class', `result-data ${layout}`);

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

    if (hasRelation) {
        const { text, linkText, functionName, links } = map[relation];

        if (content[relation]) {
            const p = document.createElement('p');
            const b = document.createElement('b');
            const link = document.createElement('span');

            b.innerText = `${text}: `;

            p.appendChild(b);

            link.innerText = content[relation][linkText];
            link.setAttribute('onclick', `${functionName}('${content[relation][links]}');`);
            
            p.appendChild(link);

        dataDiv.appendChild(p);
        }
    }

    if (status) {
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

    if (permissions) {
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

    if (comments) {
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

    const top = generateResultTop(uuid, invoice, obj.file, {
        relationFlag: obj.response_required,
        useAccomplishedStatus: true,
        accomplishedStatus: obj.accomplished
    });
    const body = generateResultBody(uuid, obj, ['true_invoice', 'name', 'subject', 'reception_date', 'deadline'], OFICIO_MAP, {
        hasRelation: obj.response_required,
        relation: 'emitted_oficio'
    });

    result.appendChild(top);
    result.appendChild(body);

    return result;
}

function createEmittedResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice, obj.file, {
        relationFlag: obj.is_response
    });
    const body = generateResultBody(uuid, obj, ['name', 'subject', 'position', 'emission_date', 'reception_date'], EMITTED_MAP, { comments: false, status: false, layout: 'emitted', hasRelation: true, relation: 'oficio' });

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