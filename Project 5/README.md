> [Back](../README.md)
# Project 5

Node.js backend application.

---


## Requirements

* **Windows**, **Linux** or **MacOS**
* **Internet connection** - to install libraries
* **Node.js** - v20 and higher
* **npm** - v8 and higher (recommended)

## Preparation

1. Open the terminal in this folder
2. Install libraries with command:
    ```sh
    npm install
    ```

## Start Application

1. Open the terminal in this folder
2. If you need to get help, use this command:
    ```sh
    npm start -- help
    ```
3. Run the application with this command:
    ```sh
    npm start
        # or
    npm start -- start-server [port:int=8080] [host:string=localhost]
        # npm start -- start-server
        # npm start -- start-server 8080
    ```
4. If you need to add a new administrator, use this command:
    ```sh
    npm start -- add-admin <login:string>
        # npm start -- add-admin mr_steve
    ```

## How To Log Out

* **Option A**: Press "Go back" in your browser, you will be taken to the register or login page
* **Option B**: Open DevTools -> Console, then enter: ```setToken("")```
* **Option C**: Open DevTools -> Application -> Cookies, then delete "__nn_token" cookie

## Already Created Users

| Login       | Password     | Surname | Name    | PhoneNumber | Email                  | Is Admin |
| ----------- | ------------ | ------- | ------- | :---------: | ---------------------- | :------: |
| admin-user1 | qwerty123    | Иванов  | Артем   | 9312312444  | admin-user1@example.ru |   Yes    |
| admin_user2 | dqwddas!1dwq | Иванова | Алиса   | 9233452175  | admin_user2@example.ru |   Yes    |
| mr_steve    | P@ssword     | Иванов  | Стив    | 9324141241  | mr_steve@example.ru    |    No    |
| MrsAnna     | cookies44    | Иванова | Анна    | 9412412412  | MrsAnna@example.ru     |    No    |
| Ca55ady     | pop-st4r     | Иванова | Кэсседи | 9312312331  | Ca55ady@example.ru     |    No    |

> Node.js backend application by **Vadim Gorshkov** (Fasterino), student of 430c group.
>
> Special for task: **Project 5**.