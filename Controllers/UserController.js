const UserModel = require('../Models/UserModel');

exports.getUserID = async function (username) {
    console.log("calling UserController");
    return await UserModel.getUserID(username);
}

