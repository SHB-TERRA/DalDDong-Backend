import dotenv from "dotenv";
import mariadb from "mariadb";

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.MARIA_URL,
    port:process.env.MARIA_PORT,
    user: process.env.MARIA_USER,
    password: process.env.MARIA_PWD,
    database: process.env.MARIA_DB,
    connectionLimit: 5
})

const handleOpen = error => {if (!error) console.log("✅ Connected to DB");}
const handleError = error => console.log(`❌ Error on DB Connection:${error}`);

async function getConnection(callback) {
    console.log("function conn")
    pool.getConnection()
        .then(conn => {
            console.log("✅ Connected to DB");
            callback(conn);
        })
        .catch(err => {
            console.log(`❌ Error on DB Connection:${err}`);
            throw err;
        });
}

module.exports = getConnection;