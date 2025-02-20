import { cmd, arg } from "./cli"
import database from "./sqllite-database"

async function addAdmin(login: string) {
    const db = database()

    if (!(await db.open())) {
        console.log("Не удалось открыть базу данных!")
    }

    db.upgradeUserToAdmin(login).then(
        user => console.log("Пользователь " + user.name + " [" +
            user.login + "] теперь является администратором"),
        (err: Error) => console.log("Ошибка: " + err.message)
    )
}

export const addAdminCommand = cmd(
    "add-admin",
    addAdmin,
    arg("login", "string"),
)