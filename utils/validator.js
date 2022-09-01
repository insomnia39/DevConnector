const { check } = require('express-validator');

const email = check('email', 'Please include a valid email').not().isEmpty();
const name = check('name', 'Name is required').not().isEmpty();
const password = check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 });

const validator = {
    registValidation : [
        name,
        email,
        password,
    ],
    loginValidation : [
        email,
        password
    ],
};

module.exports = validator;