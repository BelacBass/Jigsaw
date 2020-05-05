class BadgeModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Badges (
            name TEXT PRIMARY KEY,
            points INTEGER,
            challenge TEXT,
            picturefile TEXT
        )`
        return this.DAO.run(sql)
    }

    async addBadge (name, challenge, points, pictureFile) {
        const sql = `INSERT INTO Badges (name, challenge, points, pictureFile) VALUES (?, ?, ?, ?)`;
        await this.DAO.run(sql, [name, challenge, points, pictureFile]);
    }

    async deleteBadge (name) {
        const sql = `DELETE FROM Badges WHERE name = ?`;
        await this.DAO.run(sql, [name]);
    }

}

module.exports = BadgeModel;