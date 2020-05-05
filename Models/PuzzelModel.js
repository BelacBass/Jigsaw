class PuzzelModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Puzzels (
            title TEXT PRIMARY KEY,
            size INTEGER,
            rating INTEGER,
            picturefile TEXT,
            creator TEXT
        )`
        return this.DAO.run(sql)
    }

    async addPuzzle (title, size, rating, pictureFile, creator) {
        const sql = `INSERT INTO Puzzels (title, size, rating, pictureFile, creator) VALUES (?, ?, ?, ?, ?)`;
        await this.DAO.run(sql, [title, size, rating, pictureFile, creator]);
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
