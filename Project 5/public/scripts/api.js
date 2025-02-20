const LOGIN_REGEX = /^[\w-]{0,19}[0-9a-zA-Z]$/
const EMAIL_REGEX = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/
const LICENSE_PLATE_REGEX = /^[АВЕКМНОРСТУХ]{2}\d{3}[АВЕКМНОРСТУХ]$/
const REGION_REGEX = /^\d{1,3}$/

function getToken() {
    return getCookie('__nn_token')
}

function setToken(value) {
    setCookie('__nn_token', value)
    if (value)
        window.location.href = "#user-page"
}

async function apiCall(method, path, data) {
    return await fetch(path, {
        method,
        body: data ? JSON.stringify(data) : null,
        headers: data ? {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        } : { 'Accept': 'application/json' },
    }).then(async x => { return { ok: x.ok, res: await x.json() } })
}

const api = {
    getUser: async () => {
        const token = getToken()
        if (!token)
            return null

        const { ok, res } = await apiCall('GET', '/api/user/')

        return ok ? res : null
    },
    getAppeals: async () => {
        const token = getToken()
        if (!token)
            return null

        const { ok, res } = await apiCall('GET', '/api/appeal/list/')

        return ok ? res : null
    },
    login: async (login, password) => {
        const { ok, res } = await apiCall('POST', '/api/user/login/', {
            login, password
        })

        if (!ok) {
            alert(res)
            return
        }

        setToken(res)
    },
    register: async (login, password, surname, name, phoneNumber, email) => {
        if (login.length < 4) {
            alert("В логине должно быть не менее 4 символов")
            return
        }

        if (!LOGIN_REGEX.test(login)) {
            alert("В логине можно использовать только символы 0-9, a-Z, -, _")
            return
        }

        if (password.length < 8) {
            alert("В пароле должно быть не менее 8 символов")
            return
        }

        if (surname.length < 1) {
            alert("Фамилия не должна быть пустой")
            return
        }

        if (name.length < 1) {
            alert("Имя не должно быть пустым")
            return
        }

        if (phoneNumber.length != 10) {
            alert("Неверная запись номера телефона")
            return
        }

        if (!EMAIL_REGEX.test(email)) {
            alert("Неверная запись электронной почты")
            return
        }


        const { ok, res } = await apiCall('POST', '/api/user/register/', {
            login, password, surname, name, phoneNumber, email
        })

        if (!ok) {
            alert(res)
            return
        }

        setToken(res)
    },

    createAppeal: async (licensePlate, region, message) => {
        const token = getToken()
        if (!token)
            return null

        licensePlate = licensePlate.toUpperCase()

        if (!LICENSE_PLATE_REGEX.test(licensePlate)) {
            alert("Неверный номер автомобиля")
            return
        }
        if (!REGION_REGEX.test(region)) {
            alert("Неверный регион")
            return
        }

        if (message.length < 1) {
            alert("Сообщение не должно быть пустым")
            return
        }

        licensePlate += '|' + region

        const { ok, res } = await apiCall('POST', '/api/appeal/', {
            licensePlate, message
        })

        if (!ok) {
            alert(res)
            return
        }

        return res
    },
    setAppealStatus: async (id, complete) => {
        const status = complete ? 1 : 2


        const token = getToken()
        if (!token)
            return null

        const { ok, res } = await apiCall('POST', '/api/appeal/status/', {
            id, status
        })

        if (!ok) {
            alert(res)
            return
        }

        return res
    }
}