/**
 * 
 * @param {(elem: JQuery<HTMLDivElement>, args?: {[key: string]: any}) => void} cb 
 * @returns {{use: (args?: {[key: string]: any}) => void}}
 */
function page(cb) {
    return {
        use: (args) => {
            const content = $('#content')
            window.scrollTo({ top: 0, behavior: 'smooth', left: 0 });
            $(document.body).css({
                minHeight: '200vh',
                overflow: 'hidden',
                pointerEvents: 'none'
            });
            content
                .children()
                .attr('data-remove', '')
                .css('scale', 1)
                .animate({ scale: 0, opacity: 0 }, 500, function () { $(this).remove() })
            cb(content, args)
            content
                .children(':not([data-remove])')
                .css('opacity', 0)
            setTimeout(() => {
                content
                    .children()
                    .css('opacity', 0)
                    .animate({ scale: 1, opacity: 1 }, 500)
                $(document.body).css({
                    minHeight: '',
                    overflow: '',
                    pointerEvents: ''
                })
            }, 500)
        }
    }
}
/**
 * @type {{[key in keyof HTMLElementTagNameMap]: () => JQuery<HTMLElementTagNameMap[key]>}} cb 
 */
const $e = new Proxy({}, { get: (_, x) => () => $(document.createElement(x)) })

/**
 * @type {{[key in keyof HTMLElementTagNameMap]: (text: string) => JQuery<HTMLElementTagNameMap[key]>}} cb 
 */
const $t = new Proxy({}, { get: (_, x) => (text) => $(document.createElement(x)).text(text) })


/**
 * @param {string} text 
 * @param {JQuery.TypeEventHandler<HTMLDivElement, undefined, HTMLDivElement, HTMLDivElement, 'click'>} onclick 
 * @param {boolean} alt
 */
function button(text, onclick, alt = false) {
    return $t.div(text)
        .addClass(alt ? 'button button-alt' : 'button')
        .on('click', onclick)
}
/**
 * @param {*} user
 * @param {number} id
 * @param {string} alt
 * @param {string} image 
 * @param {string} style
 * @param {boolean} complete 
 */
function controlButton(user, id, alt, image, style, complete) {
    return $e.div()
        .addClass('control-button ' + style)
        .append(
            $e.img()
                .attr("alt", alt)
                .attr("src", "/img/" + image + ".svg")
        )
        .on('click', async () => {
            const appeal = await api.setAppealStatus(id, complete)

            if (!appeal)
                return

            const counter = $('#appeals-counter')
            counter.text(Number(counter.text()) - 1)

            $('[data-appeal-id=' + id + ']').remove()

            $('#appeals-anchor')
                .after(appealBox(user, appeal))
        })

    return elem
}

function box(promo = false) {
    return $e.div()
        .addClass(promo ? 'box promo-box' : 'box')
}

/**
 * @param {string} text 
 * @param {string} href
 */
function a(text, href) {
    return $t.a(text)
        .attr('href', href)
}
/**
 * @param {JQuery<HTMLTextAreaElement} textarea 
 */
function applyTextAreaScripts(textarea) {
    autoResizeTextArea(textarea[0])
    return textarea
}

/**
 * @param {{
 *  type: string
 *  name: string
 *  placeholder?: string
 *  maxlength?: string
 * }} data 
 */
function input(data) {
    const elem = data.type == "textarea" ? applyTextAreaScripts($e.textarea()) : $e.input().attr('type', data.type)
    elem.attr('name', data.name)
    if (data.placeholder)
        elem.attr('placeholder', data.placeholder)
    if (data.maxlength)
        elem.attr('maxlength', data.maxlength)
    return elem
}

function title() {
    return $t.div('Нарушениям NET')
        .addClass('title')
}

function phone() {
    return input({
        type: 'tel',
        name: 'phoneNumber',
        placeholder: 'Номер телефона...',
        maxlength: 16
    }).on('keydown', e => {
        if (e.ctrlKey) { return; }
        if (e.key.length > 1) { return; }
        if (/[0-9.]/.test(e.key)) { return; }
        e.preventDefault();
    }).on('keyup', e => {
        const digits = e.target.value.replace(/\D/g, '').substring(0, 10);
        const areaCode = digits.substring(0, 3);
        const prefix = digits.substring(3, 6);
        const suffix = digits.substring(6, 10);

        if (digits.length > 6) { e.target.value = `(${areaCode}) ${prefix} - ${suffix}`; }
        else if (digits.length > 3) { e.target.value = `(${areaCode}) ${prefix}`; }
        else if (digits.length > 0) { e.target.value = `(${areaCode}`; }
    })

}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = String(date.getFullYear() % 100).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const APPEAL_STATUSES = [{
    style: "in-work",
    text: "В работе"
}, {
    style: "complete",
    text: "Выполнено"
}, {
    style: "deny",
    text: "Отклонено"
}]

function appealBox(user, appeal) {
    const box = $e.div()
        .addClass('appeal-box')
        .attr('data-appeal-id', appeal.id)
        .append(
            $t.h2("Обращение от " + formatTimestamp(appeal.createdAt)),
            $t.p("Номер авто: " + appeal.licensePlate),
            $t.p(appeal.message)
        )

    if (user.isAdmin && appeal.status == 0) {
        box.append(
            $e.div()
                .addClass("control-buttons")
                .append(
                    controlButton(user, appeal.id, "Принять", "check-mark", "complete", true),
                    controlButton(user, appeal.id, "Отклонить", "slash-mark", "deny", false),
                )
        )
    }
    else {
        box.append(
            $e.p()
                .append(
                    $t.span("Статус: "),
                    $t.span(APPEAL_STATUSES[appeal.status].text)
                        .addClass("status " + APPEAL_STATUSES[appeal.status].style)
                )
        )
    }

    return box
}


const index = page(x => {
    $e.div()
        .addClass('title-box')
        .append(
            title()
        )
        .appendTo(x)

    box(true)
        .append(
            $t.p('Для продолжения, необходима авторизация'),
            button('Войти', () => {
                window.location.href = '#login'
            }),
            $e.p()
                .append(
                    $t.span('В первый раз здесь? '),
                    a('Регистация..', '#register')
                )
        )
        .appendTo(x)
})

const login = page(x => {
    const login = input({
        type: 'text',
        name: 'login',
        placeholder: 'Логин...',
        maxlength: 32
    })
    const password = input({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль...'
    })

    title()
        .appendTo(x)

    box()
        .append(
            login,
            password,
            button("Войти", () => {
                api.login(
                    login.val(),
                    password.val(),
                )
            }),
            button("У меня нет аккаунта", () => {
                window.location.href = '#register'
            }, true)
        )
        .appendTo(x)
})

const register = page(x => {
    const login = input({
        type: 'text',
        name: 'login',
        placeholder: 'Логин...',
        maxlength: 32
    })
    const password = input({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль...'
    })
    const surname = input({
        type: 'text',
        name: 'surname',
        placeholder: 'Фамилия...',
        maxlength: 32
    })
    const name = input({
        type: 'text',
        name: 'name',
        placeholder: 'Имя...',
        maxlength: 32
    })
    const phoneNumber = phone()
    const email = input({
        type: 'email',
        name: 'email',
        placeholder: 'Электронная почта...',
        maxlength: 64
    })

    title()
        .appendTo(x)

    box()
        .append(
            login,
            password,
            surname,
            name,
            phoneNumber,
            email,
            button("Регистрация", () => {
                api.register(
                    login.val(),
                    password.val(),
                    surname.val(),
                    name.val(),
                    phoneNumber.val().replace(/\D/g, ''),
                    email.val(),
                )
            }),
            button("Я уже зарегистрирован", () => {
                window.location.href = '#login'
            }, true)
        )
        .appendTo(x)

})

const userPage = page((x, { user, appeals }) => {
    const licensePlate = input({
        type: 'text',
        name: 'license-plate',
        placeholder: 'Номер авто...',
        maxlength: 6
    })

    const region = input({
        type: 'text',
        name: 'region',
        placeholder: 'Регион...',
        maxlength: 3
    })

    const message = input({
        type: 'textarea',
        name: 'message',
        placeholder: 'Сообщение...',
        maxlength: 255
    })

    title()
        .appendTo(x)

    box()
        .append(
            $t.p("Привет, " + user.name + "."),
            $t.h1("Новое обращение"),
            $e.div()
                .addClass("license-plate-block")
                .append(licensePlate, region),
            message,
            button("Отправить", async () => {
                const appeal = await api.createAppeal(
                    licensePlate.val(), region.val(), message.val())

                if (!appeal)
                    return

                $('#appeals-anchor')
                    .after(appealBox(user, appeal))

                licensePlate.val("")
                region.val("")
                message.val("")
            }),
            $t.h1("Мои обращения")
                .attr('id', 'appeals-anchor'),
            ...appeals.map(x => appealBox(user, x))
        )
        .appendTo(x)
})

const adminPage = page((x, { user, appeals }) => {
    const newAppeals = appeals.filter(x => x.status == 0)
    const oldAppeals = appeals.filter(x => x.status != 0)

    title()
        .appendTo(x)

    box()
        .append(
            $e.p()
                .append(
                    $t.span("Новых обращений: "),
                    $t.span(newAppeals.length)
                        .attr('id', 'appeals-counter')
                ),
            $t.h1("Новые обращения"),
            ...newAppeals.map(x => appealBox(user, x)),
            $t.h1("Архив")
                .attr('id', 'appeals-anchor'),
            ...oldAppeals.map(x => appealBox(user, x))
        )
        .appendTo(x)
})

let plannedHash = false

function setHash(hash) {
    if (window.location.hash == hash)
        return

    plannedHash = true;
    window.location.hash = hash
}

function loadPage() {
    if (plannedHash) {
        plannedHash = false
        return
    }
    switch (window.location.hash) {
        case '#login':
            setToken("")
            login.use()
            return
        case '#register':
            setToken("")
            register.use()
            return
    }

    api.getUser().then(user => {
        if (!user) {
            setHash('#home')
            index.use()
            return
        }

        setHash('#user-page')

        api.getAppeals().then(appeals => {

            if (user.isAdmin) {
                adminPage.use({ user, appeals })
                return
            }

            userPage.use({ user, appeals })
        })
    })
}

document.addEventListener('DOMContentLoaded', loadPage)
window.addEventListener('hashchange', loadPage)