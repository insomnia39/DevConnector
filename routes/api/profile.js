const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const controller = require('../../controller/profile/profileController');
const { validationResult } = require('express-validator');
const validator = require('../../utils/validator');

// @route   GET api/profile/me
// @desc    Get current profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await controller.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({error});
    }
});

// @route   POST api/profile
// @desc    Create or update profile
// @access  Private
router.post('/', [auth, validator.createProfile], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const profileDto = req.body;
        const { msg, profile } = await controller.createProfile(profileDto, req.user.id);
        res.json({msg, profile});
    } catch (error) {
        res.status(400).json({error});
    }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async(req, res) => {
    try {
        const profiles = await controller.getProfiles();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({error});
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await controller.getProfileByUserId(req.params.user_id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({error});
    }
})

// @route   DELETE api/profile/user/:user_id
// @desc    DELETE profile by user ID
// @access  Private
router.delete('/', [auth], async(req, res) => {
    try {
        const profile = await controller.getProfileByUserId(req.user.id);
        await controller.deleteProfile(req.user.id);
        res.send("Profile Deleted");
    } catch (error) {
        res.status(500).json({error});
    }
})

module.exports = router;
