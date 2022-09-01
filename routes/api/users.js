const express = require('express');
const router = express.Router();
const validator = require('../../utils/validator');
const controller = require('../../controller/user/userController');
const { validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    TEST route
// @access  Public
router.post('/', validator.registValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        let { name, email, password } = req.body;
        const result = await controller.regist(name, email , password);
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
