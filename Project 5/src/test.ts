import { cmd } from "./cli"
import database from "./sqllite-database"

async function test(login: string) {
    const db = database()

    const isOpen = await db.open()

    if (!isOpen) {
        console.log("Не удалось открыть базу данных!")
    }

    // const token = await db.register({
    //     login: "admin-user1",
    //     password: "qwerty123",
    //     surname: "Иванов",
    //     name: "Артем",
    //     phoneNumber: "9312312444",
    //     email: "admin-user1@example.ru",
    // })

    const token = await db.login({
        login: "admin-user2",
        password: "qwerty123",
        // surname: "Иванов",
        // name: "Артем",
        // phoneNumber: "9312312444",
        // email: "admin-user1@example.ru",
    })

    console.log(token)
}

export const testCommand = cmd(
    "test",
    test,
)