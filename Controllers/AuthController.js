const UserModel = require('../Models/UserModel');
const argon2    = require('argon2');

class AuthController {
    constructor (dao) {
        this.UserModel = new UserModel(dao);
    }

    async register (username, password) {
        const passwordHash = await this.hashPassword(password);
        await this.UserModel.addUser(username, passwordHash);
    }

    async hashPassword (password) {
        const hash = await argon2.hash(password, {
            type: argon2.argon2id, 
            memory: 2 ** 16,    
            hashLength: 32,     
            timeCost: 3,        
            parallelism: 1,     
        })
        return hash;
    }

    async login (username, password) {
        console.log(`coming from inside login()`);
        const result = await this.UserModel.getPasswordHash(username)
            .then( async res => {
                console.log(`${res}`);
            });
        console.log(`The login result is ${result}`);
        if (result === undefined) {
            return false;
        } else {
            return await this.verifyPassword(result.passwordHash, password);
        }
    }

    async verifyPassword (passwordHash, password) {
        return await argon2.verify(passwordHash, password);
    }
}

module.exports = AuthController;