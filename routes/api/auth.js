const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    TEST route
// @access  Public
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

module.exports = router;