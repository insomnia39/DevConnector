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

// @route   GET api/posts
// @desc    Get all posts
// @access  PRIVATE
router.get('/', [auth], async (req, res) => {
    try {
        const post = await controller.getAllPost();
        res.json(post);
    } catch (error) {
        res.status(500).json({error});
    }
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  PRIVATE
router.get('/:post_id', [auth], async (req, res) => {
    try {
        const post = await controller.getPost(req.params.post_id);
        res.json(post);
    } catch (error) {
        res.status(500).json({error});
    }
});

// @route   DELTE api/posts/:post_id
// @desc    Delete a post
// @access  PRIVATE
router.delete('/:post_id', [auth], async (req, res) => {
    try {
        await controller.deletePost(req.user.id, req.params.post_id);
        res.send("Post deleted");
    } catch (error) {
        res.status(500).json({error});
    }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  PRIVATE
router.put('/like/:post_id', [auth], async (req, res) => {
    try {
        await controller.addLike(req.user.id, req.params.post_id);
        res.send("Post liked");
    } catch (error) {
        res.status(500).json({error});
    }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  PRIVATE
router.put('/unlike/:post_id', [auth], async (req, res) => {
    try {
        await controller.removeLike(req.user.id, req.params.post_id);
        res.send("Post unliked");
    } catch (error) {
        res.status(500).json({error});
    }
});

module.exports = router;
