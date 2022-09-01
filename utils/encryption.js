const bcrypt = require('bcryptjs');

async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(password, salt);
    return result;
}

async function comparePassword(plainPassword, hashPassword){
    return await bcrypt.compare(plainPassword, hashPassword);
}

module.exports = { hashPassword, comparePassword };