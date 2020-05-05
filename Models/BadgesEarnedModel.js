class BadgeEarnedModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS BadgesEarned (
            name TEXT,
            player TEXT,
            earned INTEGER
        )`
        return this.DAO.run(sql)
    }

}

module.exports = BadgeEarnedModel;