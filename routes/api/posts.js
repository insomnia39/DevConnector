const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const controller = require('../../controller/post/postController');
const { validationResult } = require('express-validator');
const validator = require('../../utils/validator');

// @route   POST api/posts
// @desc    Create a post
// @access  PRIVATE
router.post('/', [auth, validator.createPost], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const post = await controller.createPost(req.user.id, req.body);
        res.send(post);
    } catch (error) {
        res.status(500).json({error});
    }
});

module.exports = router;
