import {createConnection} from 'mysql2/promise'

export let connection

createConnection({
    host: 'localhost',
    user: 'root',
    database: 'kabanchik',
    password: 'root'
}).then(newConnection => {
    connection = newConnection
})
