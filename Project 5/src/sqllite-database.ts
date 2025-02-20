import { AsyncDatabase } from "promised-sqlite3"
import * as bcrypt from "bcrypt"

import DatabaseInterface, { AppealDto, CreateAppealDto, LoginDto, RegisterDto, UserDto } from "./database-interface"
import { v4 as uuid } from "uuid"

const SALT_ROUNDS = 10

async function hash(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS)
}

async function compareHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash)
}

function timestamp() {
    return Math.floor(Date.now() / 1000);
}


interface User {
    Id: number
    Login: string
    PasswordHash: string
    Surname: string
    Name: string
    PhoneNumber: string
    Email: string
}

interface Token {
    Token: string
    UserId: number
}

interface Administrator {
    UserId: number
}

interface Appeal {
    Id: number
    UserId: number
    CreatedAt: number
    LicensePlate: string
    Message: string
    Status: number
}

export class Database implements DatabaseInterface {
    db: AsyncDatabase | null

    constructor() {
        this.db = null
    }

    async open(): Promise<boolean> {
        this.db = await AsyncDatabase.open("./database.db")
            .then(x => x, () => null)

        return this.db != null
    }

    async getNewToken(userId: number) {
        const token = uuid()

        await this.db.run(`--sql
            INSERT INTO Tokens (Token, UserId)
            VALUES (?, ?)
        `, token, userId)

        return token
    }

    userToDto(user: User, isAdmin: boolean): UserDto {
        return {
            id: user.Id,
            login: user.Login,
            surname: user.Surname,
            name: user.Name,
            phoneNumber: user.PhoneNumber,
            email: user.Email,
            isAdmin,
        }
    }

    appealToDto(appeal: Appeal): AppealDto {
        return {
            id: appeal.Id,
            createdAt: appeal.CreatedAt * 1000,
            licensePlate: appeal.LicensePlate,
            message: appeal.Message,
            status: appeal.Status,
        }
    }

    async getUserByLogin(login: string): Promise<User> {
        return await this.db.get<User>(`--sql
            SELECT * FROM Users
            WHERE Login = ?
        `, login).then(x => {
            if (!x)
                throw new Error("Пользователь не найден")

            return x
        })
    }
    async getUserByToken(token: string): Promise<User> {
        const tokenObj = await this.db.get<Token>(`--sql
            SELECT * FROM Tokens
            WHERE Token = ?
        `, token).then(x => {
            if (!x)
                throw new Error("Токен не валиден")

            return x
        })

        return await this.db.get<User>(`--sql
            SELECT * FROM Users
            WHERE Id = ?
        `, tokenObj.UserId)
    }
    async isUserAdmin(id: number): Promise<boolean>
    async isUserAdmin(token: string): Promise<boolean>
    async isUserAdmin(data: number | string): Promise<boolean> {
        let id: number
        if (typeof data == "number")
            id = data
        else
            try {
                const user = await this.getUserByToken(data)
                id = user.Id
            }
            catch {
                return false
            }
        return await this.db.get<Administrator>(`--sql
            SELECT * FROM Administrators
            WHERE UserId = ?
        `, id).then(x => !!x)
    }

    async login(data: LoginDto): Promise<string> {
        const user = await this.getUserByLogin(data.login)

        if (!(await compareHash(data.password, user.PasswordHash)))
            throw new Error("Неверный пароль")

        return await this.getNewToken(user.Id)
    }

    async register(data: RegisterDto): Promise<string> {
        const userId: number = await this.db.run(`--sql
            INSERT INTO Users (Login, PasswordHash, Surname, Name, PhoneNumber, Email)
            VALUES (?, ?, ?, ?, ?, ?)
        `, data.login, await hash(data.password), data.surname,
            data.name, data.phoneNumber, data.email)
            .then(x => x.lastID, () => { throw new Error("Ошибка регистрации пользователя") })

        return await this.getNewToken(userId)
    }

    async getUser(token: string): Promise<UserDto> {
        const user = await this.getUserByToken(token)

        const isAdmin = await this.isUserAdmin(user.Id)

        return this.userToDto(user, isAdmin)
    }

    async createAppeal(data: CreateAppealDto): Promise<AppealDto> {
        const appealId: number = await this.db.run(`--sql
            INSERT INTO Appeals (UserId, CreatedAt, LicensePlate, Message)
            VALUES (?, ?, ?, ?)
        `, data.userId, timestamp(), data.licensePlate, data.message)
            .then(x => x.lastID, () => { throw new Error("Ошибка создания обращения") })

        return await this.db.get<Appeal>(`--sql
            SELECT * FROM Appeals
            WHERE Id = ?
        `, appealId).then(this.appealToDto)
    }

    async getAppeals(token: string): Promise<AppealDto[]> {
        const user = await this.getUser(token)

        if (user.isAdmin)
            return (await this.db.all<Appeal>(`--sql
                SELECT * FROM Appeals
                ORDER BY CreatedAt DESC
            `)).map(this.appealToDto)
        else
            return (await this.db.all<Appeal>(`--sql
                SELECT * FROM Appeals
                WHERE UserId = ?
                ORDER BY CreatedAt DESC
            `, user.id)).map(this.appealToDto)

    }
    async setAppealStatus(id: number, status: number): Promise<AppealDto> {
        await this.db.all<Appeal>(`--sql
            UPDATE Appeals
            SET Status = ?
            WHERE Id = ?
        `, status, id)

        return await this.db.get<Appeal>(`--sql
            SELECT * FROM Appeals
            WHERE Id = ?
        `, id).then(x => {
            if (!x)
                throw new Error("Обращение не найдено")

            return this.appealToDto(x)
        })
    }
    async upgradeUserToAdmin(login: string): Promise<UserDto> {
        const user = await this.getUserByLogin(login)
        if (await this.isUserAdmin(user.Id))
            throw new Error("Пользователь уже является администратором")

        await this.db.run(`--sql
            INSERT INTO Administrators (UserId) VALUES (?)
        `, user.Id)

        return this.userToDto(user, true)
    }
}
export default function database() {
    return new Database()
}