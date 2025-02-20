import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import RouterInterface, { GetCallback, getResponse, PostCallback } from './router-interface'
import Database from './database-interface'

export class Router implements RouterInterface {
    app: express.Express
    db: Database

    constructor() {
        this.app = express()
        this.app.use(cookieParser())
        this.app.use(bodyParser.json())
    }

    setDatabase(db: Database): this {
        this.db = db

        return this
    }

    static(folder: string): this {
        this.app.use(express.static(folder))
        return this
    }

    get(path: string, cb: GetCallback): this {
        this.app.get(path, async (req, res) => {
            const response = await getResponse(cb(this.db, req.cookies))

            res.status(response.code).json(response.answer)
        })
        return this
    }

    post<T>(path: string, cb: PostCallback<T>): this {
        this.app.post(path, async (req, res) => {
            const response = await getResponse(cb(this.db, req.cookies, req.body))

            res.status(response.code).json(response.answer)
        })
        return this
    }

    async listen(port: number, host: string = "0.0.0.0") {
        if (!(await this.db.open())) {
            console.log("Не удалось открыть базу данных!")
            return
        }

        this.app.listen(port, host, () => {
            console.log("Прослушивание на http://" + host + ":" + port + "/")
        })
    }
}

export default function router() {
    return new Router()
}