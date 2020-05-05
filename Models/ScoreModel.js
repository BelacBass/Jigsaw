class ScoreModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Scores (
            puzzle TEXT,
            player TEXT,
            time INTEGER,
            score INTEGER
        )`
        return this.DAO.run(sql)
    }

    async addScore (puzzle, player, time, score) {
        const sql = `INSERT INTO Scores (puzzle, player, time, score) VALUES (?, ?, ?, ?)`;
        await this.DAO.run(sql, [puzzle, player, time, score]);
    }

    async updateTime (puzzle, player, newtime) {
        const sql = `UPDATE Scores SET time = ? WHERE puzzle = ? AND player = ? AND ? < time`;
        await this.DAO.run(sql, [newtime, puzzle, player, newtime]);
    }

    async updateScore (puzzle, player, newscore) {
        const sql = `UPDATE Scores SET score = ? WHERE puzzle = ? AND player = ? AND ? > score`;
        await this.DAO.run(sql, [newscore, puzzle, player, newscore]);
    }

    async getTime (puzzle, player) {
        const sql = `SELECT time FROM Scores WHERE puzzle = ? AND player = ?`;
        await this.DAO.get(sql, [puzzle, player]);
    }

    async getScore (puzzle, player) {
        const sql = `SELECT score FROM Scores WHERE puzzle = ? AND player = ?`;
        await this.DAO.get(sql, [puzzle, player]);
    }
    
    async getHighScore (puzzle) {
        const sql = `SELECT player, time, score FROM Scores WHERE puzzle = ? AND score = MAX(score)`;
        await this.DAOget(sql,[puzzle]);
    }



}

module.exports = ScoreModel;