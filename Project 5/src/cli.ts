type CliSupportedTypes = string | number
type CliRunnerFunc = (...args: CliSupportedTypes[]) => any
type CliType = "string" | "int" | "float"

interface CliArg {
    name: string
    type: CliType
    defaults?: CliSupportedTypes
}

export interface CliCommand {
    name: string
    args: CliArg[]
    runner: CliRunnerFunc
}

class Cli {
    private commands: CliCommand[]

    constructor() {
        this.commands = []
    }

    private help() {
        for (const command of this.commands)
            this.helpForCommand(command)
    }

    private helpForCommand(command: CliCommand) {
        let args = ""
        for (const arg of command.args) {
            const argStr = arg.name + ":" + arg.type

            args += " " + (
                typeof arg.defaults == "undefined" ?
                    "<" + argStr + ">" :
                    "[" + argStr + "=" + arg.defaults + "]"
            )
        }
        console.log("npm start -- " + command.name + args)
    }

    private defaultCommand(): string {
        return this.commands[0].name
    }

    add(command: CliCommand): this {
        this.commands.push(command)
        return this
    }

    run(): any {
        let argIndex = 2
        const commandName: string = process.argv[argIndex++] || this.defaultCommand()
        const index = this.commands.map(x => x.name).indexOf(commandName)

        if (index == -1) {
            if (commandName != "help")
                console.log("Error: Unknown command - " + commandName)

            this.help()
            return
        }

        const command = this.commands[index]

        const args: CliSupportedTypes[] = []

        for (const arg of command.args) {
            let value = process.argv[argIndex++] || arg.defaults
            if (typeof value == "undefined") {
                console.log("Error: command " + commandName + " contains a required parameter - " + arg.name)
                this.helpForCommand(command)
                return
            }

            if (arg.type == "int" || arg.type == "float") {
                if (typeof value != "number") {
                    value = Number(value)
                    if (isNaN(value) || (arg.type == "int" && value != Math.floor(value))) {
                        console.log("Error: parameter  " + arg.name + " of the command " + commandName +
                            " must be a " + arg.type + " number")
                        this.helpForCommand(command)
                        return
                    }
                }
            }

            args.push(value)
        }

        return command.runner(...args)
    }
}

export function cmd(name: string, runner: CliRunnerFunc, ...args: CliArg[]): CliCommand {
    return {
        name,
        runner,
        args
    }
}


export function arg(name: string, type: CliType): CliArg
export function arg(name: string, type: "string", defaults: string): CliArg
export function arg(name: string, type: "int" | "float", defaults: number): CliArg
export function arg(name: string, type: CliType, defaults?: CliSupportedTypes): CliArg {
    return {
        name,
        type,
        defaults
    }
}

export function cli() { return new Cli() }