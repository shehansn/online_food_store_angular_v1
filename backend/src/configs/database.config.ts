import { connect, ConnectOptions } from 'mongoose'

export const dbConnect = () => {
    connect(process.env.CONNECTION_STRING!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Online_Food_Store_Database",
    } as ConnectOptions).then(
        () => {
            console.log("Database Connected Successfully")
        },
        (error) => {
            console.log("Database Connection Failed", error)
        }
    )
}