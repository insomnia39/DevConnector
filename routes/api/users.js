const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

const arrValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

async function userExistValidation(email, res){
    const user = await User.findOne({ email });
    if(user){
        res.status(400).json({ errors: [{ msg: 'User already exists'}]});
    }
}

async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(password, salt);
    return result;
}

// @route   POST api/users
// @desc    TEST route
// @access  Public
router.post('/', arrValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        let { name, email, password } = req.body;
        await userExistValidation(email, res);
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm'});
        password = await hashPassword(password);
        const user = new User({name, email, avatar, password});
        user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {
                expiresIn: config.get('jwtExpire')
            },
            (err, token) => {
                if(err) throw err;
                res.json({token})
            }
        );
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
