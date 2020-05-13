
const uuidV4 = require('uuid').v4;


class PuzzelModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
        //think about an id
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Puzzels (
            uuid TEXT PRIMARY KEY,
            title,
            size INTEGER,
            imgFileName TEXT,
            creator TEXT
        )`;
        return this.DAO.run(sql);
    }

    async addPuzzle (title, size, imgFileName) {
        const sql = `INSERT INTO Puzzels (uuid, title, size, imgFileName) VALUES (?, ?, ?, ?)`;
        const uuid = uuidV4();
        await this.DAO.run(sql, [uuid, title, size, imgFileName]);
    }

    async getCreator (title) {
        const sql = `SELECT creator FROM Puzzels WHERE title = ?`;
        await this.DAO.get(sql, [title]);
    }

    async deletePuzzel (title) {
        const sql = `DELETE FROM Scores WHERE title = ?`;
        await this.DAO.run(sql, [title]);
    }

}

module.exports = PuzzelModel;
