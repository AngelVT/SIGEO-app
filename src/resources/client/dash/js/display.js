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
        functionName: 'getEmittedUUID',
        type: 'none',
    },
    file: {
        text: 'Archivo PDF',
        type: 'file',
        accept: '.pdf',
        name: 'oficio_pdf'
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
    oficio_uuid: {
        text: 'Respuesta para',
        type: 'select',
        default: {
            text: 'oficio_text',
            value: 'oficio_uuid'
        },
        options: [],
        links: 'oficio_uuid',
        text: 'Respuesta para',
        linkText: 'oficio_text',
        functionName: 'getOficioUUID',
    },
    file: {
        text: 'Archivo PDF',
        type: 'file',
        accept: '.pdf',
        name: 'oficio_pdf'
    }
}

const USER_MAP = {
    name: {
        text: 'Nombre',
        type: 'text'
    },
    username: {
        text: 'Usuario',
        type: 'text',
        attributes: 'readonly'
    },
    group_id: {
        text: 'Dirección',
        type: 'select',
        options: [
            {
                value: 1,
                text: 'Sistema SIGEO'
            },
            {
                value: 2,
                text: 'Dirección General'
            },
            {
                value: 3,
                text: 'Dirección de Licencias y Control Urbano'
            },
            {
                value: 4,
                text: 'Dirección de Investigación y Planeación Estratégica'
            },
            {
                value: 5,
                text: 'Órgano Interno de Control'
            },
            {
                value: 6,
                text: 'Dirección de Asuntos Jurídico'
            },
            {
                value: 7,
                text: 'Dirección de Finanzas y Administración'
            }
        ]
    },
    role_id: {
        text: 'Rol',
        type: 'select',
        options: [
            {
                value: 1,
                text: 'System'
            },
            {
                value: 2,
                text: 'Admin'
            },
            {
                value: 3,
                text: 'Moderator'
            },
            {
                value: 4,
                text: 'User'
            }
        ]
    },
    permissions: {
        text: 'Permisos',
        type: 'checkbox-group',
        checkboxes: [
            {
                value: 1,
                text: "user:manage"
            },
            {
                value: 2,
                text: "user:read"
            },
            {
                value: 3,
                text: "user:create"
            },
            {
                value: 4,
                text: "user:update"
            },
            {
                value: 5,
                text: "user:delete"
            },
            {
                value: 6,
                text: "oficio:manage"
            },
            {
                value: 7,
                text: "oficio:read"
            },
            {
                value: 8,
                text: "oficio:create"
            },
            {
                value: 9,
                text: "oficio:update"
            },
            {
                value: 10,
                text: "oficio:delete"
            },
            {
                value: 11,
                text: "oficio:comment"
            }
        ]
    }
}

function hideShowResult(trigger, target) {
    const targetElement = document.getElementById(target);

    trigger.classList.toggle("border-round");
    trigger.classList.toggle("border-round-top");
    targetElement.classList.toggle("dis-none");
}

function generateResultTop(uuid, labelText, {
    relationFlag = false,
    useAccomplishedStatus = false,
    accomplishedStatus = false,
} = {}) {
    const top = document.createElement('div');
    const label = document.createElement('p');

    top.setAttribute('class', 'result-top border-round');
    top.setAttribute('id', `top_${uuid}`);

    label.innerText = labelText;

    if (relationFlag) {
        const relationFlag = document.createElement('span');

        relationFlag.setAttribute('class', 'bi-files');

        label.appendChild(relationFlag);
    }

    if (useAccomplishedStatus) {
        const status = document.createElement('span');

        status.setAttribute('class', accomplishedStatus ? 'bi-check-circle' : 'bi-x-circle');

        label.appendChild(status);
    }

    top.appendChild(label);

    top.setAttribute('onclick', `hideShowResult(this, 'body_${uuid}')`)

    return top;
}

function generateResultBody(uuid, content, keys = [], map, { 
    comments = true, 
    status = true, 
    //permissions = false, 
    layout = 'oficio', 
    hasRelation = false,
    closeable = false,
    relation = '',
    updateURL = '/home',
    bodyType = 'form-data',
    file = undefined
} = {}) {
    const body = document.createElement('section');
    const originalData = {};

    body.setAttribute('class', 'dis-none result-body');
    body.setAttribute('id', `body_${uuid}`);

    const linksDiv = document.createElement('div');

    if (file) {
        const fileLink = document.createElement('a');

        linksDiv.setAttribute('class', 'links');
        fileLink.setAttribute('class', 'bi-file-earmark-pdf');

        fileLink.target = '_blank';
        fileLink.href = file;

        linksDiv.appendChild(fileLink);
    }

    if(closeable) {
        const closeBtn = document.createElement('a');

        linksDiv.setAttribute('class', 'links');
        closeBtn.setAttribute('class', 'bi-folder-check');

        closeBtn.setAttribute('onclick', `closeOficio('${uuid}');`);

        linksDiv.appendChild(closeBtn);
    }

    body.appendChild(linksDiv);

    const dataDiv = document.createElement('form');
    dataDiv.setAttribute('class', `result-data ${layout}`);
    dataDiv.setAttribute('action', `${updateURL}`);
    dataDiv.setAttribute('onsubmit', `updateResult(event);`);
    dataDiv.setAttribute('body', `${bodyType}`);

    body.appendChild(dataDiv);

    for (const key in content) {
        if (!Object.hasOwn(content, key)) continue;
        
        if (keys.includes(key)) {
            originalData[key] = map[key].nested ? content[key][map[key].property] : content[key];

            const label = document.createElement('label');

            switch(map[key].type) {
                case 'text':
                    label.innerHTML = `
                    <b>${map[key].text}:</b>
                    <input type="text" name="${key}" value="${map[key].nested ? content[key][map[key].property] : content[key]}" ${map[key].attributes}>
                    `

                    dataDiv.appendChild(label);
                    break;
                case 'date':
                    label.innerHTML = `
                    <b>${map[key].text}:</b>
                    <input type="date" name="${key}" ${content[key] === null ? '' : `value="${content[key]}"`} ${map[key].attributes}>
                    `

                    dataDiv.appendChild(label);
                    break;
                case 'file':
                    label.innerHTML = `
                    <b>${map[key].text}:</b>
                    <input type="file" name="${map[key].name}" accept="${map[key].accept}" ${map[key].attributes}>
                    `

                    dataDiv.appendChild(label);
                    break;
                case 'select':
                    const options = [];
                    for (const o of map[key].options) {
                        const option = `<option value="${o.value}" ${
                        map[key].default ? '' : content[key] === o.value ? 'selected' : ''
                        }>${o.text}</option>`;

                        options.push(option);
                    }

                    if (map[key].default && content[map[key].default.value]) {
                        options.push(`<option value="${content[map[key].default.value]}" selected>${content[map[key].default.text]}</option>`);
                    }

                    label.innerHTML = `
                    <b>${map[key].text}:</b>
                    <select name="${key}" ${map[key].attributes}>
                        ${options.join('\n')}
                    </select>
                    `

                    dataDiv.appendChild(label);
                    break;

                case 'checkbox-group':
                    const div = document.createElement('div');
                    const checkOptions = [];

                    for (const c of map[key].checkboxes) {
                        const option = `<label>
                        <input value="${c.value}" name="${key}" type="checkbox" ${content[key].includes(c.value) ? 'checked' : ''}>
                        ${c.text}
                        </label>`;

                        checkOptions.push(option);
                    }

                    div.innerHTML = `
                    <b>${map[key].text}:</b>
                    ${checkOptions.join('\n')}`

                    dataDiv.appendChild(div);
                    break;
            }
        }
    }

    const originalInput = document.createElement('input');
    const submitButton = document.createElement('button');

    originalInput.type = 'hidden';
    originalInput.value = JSON.stringify(originalData);
    originalInput.name = 'original_data'

    dataDiv.appendChild(originalInput);

    submitButton.type = 'submit';
    submitButton.innerText = 'Actualizar';

    dataDiv.appendChild(submitButton);

    if (hasRelation) {
        const { functionName, links } = map[relation];

        if (content[relation]) {
            const link = document.createElement('a');

            link.setAttribute('class', 'bi-send-arrow-down');
            link.setAttribute('onclick', `${functionName}('${content[links]}');`);

            linksDiv.appendChild(link);
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

    if (comments) {
        const commentsDiv = document.createElement('section');
        commentsDiv.setAttribute('class', 'result-comments');

        const commentContainer = document.createElement('div');
        commentContainer.setAttribute('id', `comments_${uuid}`);

        commentsDiv.appendChild(commentContainer);

        const commentForm = document.createElement('form');
        commentForm.setAttribute('uuid', `${uuid}`);
        commentForm.setAttribute('onsubmit', `commentOficio(event);`);

        if (content.comments.length === 0) {
            const p = document.createElement('p');
            p.setAttribute('class', 'no-comment')

            p.innerText = 'Sin comentarios';

            commentContainer.appendChild(p);
        }

        for (const c of content.comments) {
            const comment = document.createElement('article');
            comment.setAttribute('class', 'comment');

            comment.innerHTML = `
            <header>
                <strong class="bi-person-circle"> ${c.user.name} (${c.user.username})</strong>
                <p>${new Date(c.createdAt).toLocaleString()}</p>
            </header>
            <section>
                <p>${c.comment_txt}</p>
            </section>
            `

            commentContainer.appendChild(comment);
        }

        commentForm.innerHTML = `
        <textarea name="comment" required></textarea>
        <button class="bi-chat-dots" type="submit"></button>
        `;

        commentsDiv.appendChild(commentForm);

        body.appendChild(commentsDiv);
    }

    return body;
}

function createOficioResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice, {
        relationFlag: obj.response_required,
        useAccomplishedStatus: true,
        accomplishedStatus: obj.accomplished
    });
    const body = generateResultBody(uuid, obj, ['true_invoice', 'name', 'subject', 'reception_date', 'deadline', 'file'], OFICIO_MAP, {
        hasRelation: obj.response_required,
        relation: 'emitted_oficio',
        updateURL: `/api/oficio/in/${uuid}`,
        file: obj.file,
        closeable: true
    });

    result.appendChild(top);
    result.appendChild(body);

    return result;
}

function createEmittedResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice, {
        relationFlag: obj.is_response
    });
    const body = generateResultBody(uuid, obj, ['name', 'subject', 'position', 'emission_date', 'reception_date', 'file', 'oficio_uuid'], EMITTED_MAP, { comments: false, status: false, layout: 'emitted', hasRelation: true, relation: 'oficio_uuid', updateURL: `/api/oficio/emitted/${uuid}`,  file: obj.file});

    result.appendChild(top);
    result.appendChild(body);

    return result;
}

function createUserResult(obj, uuid, invoice) {
    const result = document.createElement('div');

    const top = generateResultTop(uuid, invoice);
    const body = generateResultBody(uuid, obj, ['name', 'username', 'group_id', 'role_id', 'permissions'], USER_MAP, { comments: false, status: false, layout: 'users', updateURL: `/api/user/${uuid}`, bodyType: 'json' });

    result.appendChild(top);
    result.appendChild(body);

    return result;
}