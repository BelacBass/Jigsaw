const uuidV4 = require('uuid').v4;

class UserModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Users (
            uuid TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            passwordHash TEXT
        )`
        return this.DAO.run(sql)
    }

    async addUser (username, passwordHash) {
        const sql = `INSERT INTO Users (uuid, username, passwordHash) VALUES (?, ?, ?)`;
        const uuid = uuidV4();
        console.log(`${username}, ${passwordHash}`);
        await this.DAO.run(sql, [uuid, username, passwordHash]);
    }

    async getPasswordHash (username) {
        // console.log(`coming from getPasswordHash()`);
        // const sql = `SELECT passwordHash FROM Users WHERE username = ?`;
        // const result = this.DAO.get(sql, [username]);
        
        // console.log(`getPasswordHash() result is ${result}`);
        // //console.log(`${result}`);
        // //console.log(`getPasswordHash() finished`);
        // await result;

        const sql = `SELECT passwordHash FROM Users WHERE username = ?`;
        return await this.DAO.get(sql, [username]);

        // return await this.DAO.get(
        //     'select passwordHash from Users where username=?', 
        //     [username]
        // );

    }

    async getUserID (username) {
        console.log(`grabing uuid`);
        const sql = `SELECT uuid FROM Users WHERE username = ?`;
        await this.DAO.get(sql, [username]);
    }

}

module.exports = UserModel;