import { cmd, arg } from "./cli"
import { Cookie, withCode } from "./router-interface"
import router from "./express-router"
import Database, { CreateAppealDto, LoginDto, RegisterDto } from "./database-interface"
import database from "./sqllite-database"

interface SetAppealStatusDto { id: number, status: 1 | 2 }
const LOGIN_REGEX = /^[\w-]{0,19}[0-9a-zA-Z]$/
const EMAIL_REGEX = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/
const LICENSE_PLATE_REGEX = /^[АВЕКМНОРСТУХ]{2}\d{3}[АВЕКМНОРСТУХ]\|\d{1,3}$/

function startServer(port: number, host: string) {
    const COOKIE_TOKEN_NAME = "__nn_token"
    const NO_TOKEN = withCode(401, "Не авторизован")
    const WRONG_DATA = withCode(401, "Неверные данные")

    function dbError(err: Error) {
        return withCode(400, err.message)
    }

    function dbWrapper<T>(promise: Promise<T>) {
        return promise.then(x => x, dbError)
    }

    function check<T extends { [key: string]: any }>(obj: T, type: { [key in keyof T]: "string" | "number" | "boolean" }) {
        if (!obj && typeof obj != "object")
            return true

        for (const [key, value] of Object.entries(type)) {
            if (typeof obj[key] != value)
                return true
        }

        return false
    }

    async function getUser(db: Database, cookie: Cookie) {
        if (!cookie[COOKIE_TOKEN_NAME])
            return NO_TOKEN

        return await dbWrapper(db.getUser(cookie[COOKIE_TOKEN_NAME]))
    }

    async function getAppeals(db: Database, cookie: Cookie) {
        if (!cookie[COOKIE_TOKEN_NAME])
            return NO_TOKEN

        return await dbWrapper(db.getAppeals(cookie[COOKIE_TOKEN_NAME]))
    }


    async function login(db: Database, cookie: Cookie, data: LoginDto) {
        if (check(data, {
            login: "string",
            password: "string"
        }) || data.login.length < 4 || data.password.length < 8)
            return WRONG_DATA

        return await dbWrapper(db.login(data))
    }

    async function register(db: Database, cookie: Cookie, data: RegisterDto) {
        if (check(data, {
            login: "string",
            password: "string",
            surname: "string",
            name: "string",
            phoneNumber: "string",
            email: "string"
        }) || data.password.length < 8
            || data.login.length < 4 || data.login.length > 32
            || !LOGIN_REGEX.test(data.login)
            || data.surname.length < 1 || data.surname.length > 32
            || data.name.length < 1 || data.name.length > 32
            || data.phoneNumber.length != 10 || isNaN(data.phoneNumber as any)
            || data.email.length < 5 || data.email.length > 64
            || !EMAIL_REGEX.test(data.email))
            return WRONG_DATA

        return await dbWrapper(db.register(data))
    }


    async function setAppealStatus(db: Database, cookie: Cookie, data: SetAppealStatusDto) {
        if (!cookie[COOKIE_TOKEN_NAME])
            return NO_TOKEN

        if (!(await db.isUserAdmin(cookie[COOKIE_TOKEN_NAME])))
            return withCode(403, "Недоступно")

        if (check(data, {
            id: "number",
            status: "number"
        }) || (data.status != 1 && data.status != 2))
            return WRONG_DATA

        return await dbWrapper(db.setAppealStatus(data.id, data.status))
    }

    async function createAppeal(db: Database, cookie: Cookie, data: Omit<CreateAppealDto, "userId">) {
        if (!cookie[COOKIE_TOKEN_NAME])
            return NO_TOKEN

        if (check(data, {
            licensePlate: "string",
            message: "string"
        }) || !LICENSE_PLATE_REGEX.test(data.licensePlate)
            || data.message.length < 1 || data.message.length > 255)
            return WRONG_DATA

        try {
            const user = await db.getUser(cookie[COOKIE_TOKEN_NAME])

            return await dbWrapper(db.createAppeal({
                userId: user.id,
                licensePlate: data.licensePlate,
                message: data.message
            }))
        }
        catch (err) {
            return dbError(err)
        }

    }

    router()
        .setDatabase(database())
        .static('./public/')
        .get('/api/user/', getUser)
        .get('/api/appeal/list/', getAppeals)
        .post<LoginDto>('/api/user/login/', login)
        .post<RegisterDto>('/api/user/register/', register)
        .post<Omit<CreateAppealDto, "userId">>('/api/appeal/', createAppeal)
        .post<SetAppealStatusDto>('/api/appeal/status/', setAppealStatus)
        .listen(port, host)
}

export const startServerCommand = cmd(
    "start-server",
    startServer,
    arg("port", "int", 8080),
    arg("host", "string", "localhost"),
)
