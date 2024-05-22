import server from './app'
import { AppDataSource } from './utils/database'

const port = process.env.PORT

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established')
        server.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })
    })
    .catch((error) => {
        console.log(`Error initiating database connection: ${error.message}`)
    })