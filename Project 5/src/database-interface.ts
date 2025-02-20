
export interface UserDto {
    id: number
    login: string
    surname: string
    name: string
    phoneNumber: string
    email: string
    isAdmin: boolean
}

export interface AppealDto {
    id: number
    createdAt: number
    licensePlate: string
    message: string
    status: number
}

export interface LoginDto {
    login: string
    password: string
}

export interface RegisterDto {
    login: string
    password: string
    surname: string
    name: string
    phoneNumber: string
    email: string
}

export interface CreateAppealDto {
    userId: number
    licensePlate: string
    message: string
}

export default interface Database {
    open(): Promise<boolean>

    login(data: LoginDto): Promise<string>

    register(data: RegisterDto): Promise<string>

    createAppeal(data: CreateAppealDto): Promise<AppealDto>

    getUser(token: string): Promise<UserDto>

    getAppeals(token: string): Promise<AppealDto[]>

    setAppealStatus(id: number, status: number): Promise<AppealDto>

    upgradeUserToAdmin(login: string): Promise<UserDto>

    isUserAdmin(token: string): Promise<boolean>
}