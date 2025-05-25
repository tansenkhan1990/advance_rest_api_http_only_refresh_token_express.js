const bcrypt = require("bcryptjs");

class User {
    constructor(username, password) {
        this.username = username;
        this.password = bcrypt.hashSync(password, 10);
    }
}

const users = []; // Temporary storage (Replace with DB)

module.exports = { User, users };
