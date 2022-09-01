const User = require('../../models/User');
const gravatar = require('gravatar');
const encryption = require('../../utils/encryption');
const jwt = require('jsonwebtoken');
const config = require('config');

async function login(email, password){
    const user = await User.findOne({ email });
    // Bad error message, just for dev
    if(!user) throw "Email is wrong";
    const isPasswordCorrect = await encryption.comparePassword(password, user.password);
    if(!isPasswordCorrect) throw "Password is wrong";

    const payload = {
        user: {
            id: user.id
        }
    }
    const result = createJwt(payload);
    
    return result;
}

async function regist(name, email, password){
    const isUserExist = await CheckUserExist(email);
    if(isUserExist) throw "user is already exist";

    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm'});
    password = await encryption.hashPassword(password);
    const user = new User({name, email, avatar, password});
    user.save();
    const payload = {
        user: {
            id: user.id
        }
    }
    const result = createJwt(payload);

    return result;
}

async function CheckUserExist(email){
    const user = await User.findOne({ email });
    return user ? true : false;
}

function createJwt(payload){
    const token = jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {
            expiresIn: config.get('jwtExpire')
        }
    );
    return token;
}

module.exports = { login, regist };