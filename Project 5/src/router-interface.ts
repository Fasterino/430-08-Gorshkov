import Database from "./database-interface"

export interface Cookie {
    [key: string]: string
}

export interface Response {
    code: number
    answer: any
}

export type GetCallback = (db: Database, cookie: Cookie) => PromiseLike<any>
export type PostCallback<T> = (db: Database, cookie: Cookie, data: T) => PromiseLike<any>

export function withCode(code: number, answer: any): Response {
    return {
        code,
        answer
    }
}

export async function getResponse(resPromise: PromiseLike<any>): Promise<Response> {
    const res = await resPromise;
    if (typeof res == "object" && typeof res.code == "number" && res.answer)
        return res
    return withCode(200, res)
}

export default interface Router {
    setDatabase(db: Database): this
    static(folder: string): this
    get(path: string, cb: GetCallback): this
    post<T>(path: string, cb: PostCallback<T>): this
    listen(port: number, host?: string): void
}