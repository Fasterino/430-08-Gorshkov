import { cli } from "./cli"
import { startServerCommand } from "./server-app"
import { addAdminCommand } from "./admin-app"
import { testCommand } from "./test"

cli()
    .add(startServerCommand)
    .add(addAdminCommand)
    .add(testCommand)
    .run()