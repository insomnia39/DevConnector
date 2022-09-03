const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const validator = require('../../utils/validator');
const controller = require('../../controller/user/userController');
const { validationResult } = require('express-validator');

// @route   GET api/auth
// @desc    TEST route
// @access  private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -_id -__v');
        if(!user){
            res.status(404).json({msg:"user is not found"});
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  private
router.post('/', validator.loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const result = await controller.checkUser(email, password);

        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;