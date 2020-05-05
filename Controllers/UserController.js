const UserModel = require('../Models/UserModel');

exports.getUserID = async function (username) {
    return await UserModel.getUserID(username);
}

