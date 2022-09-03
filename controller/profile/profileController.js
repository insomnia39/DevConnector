const Profile = require('../../models/Profile');
const User = require('../../models/User');
const userController = require('../user/userController');

async function getProfileByUserId(userId){
    const profile = await Profile.findOne({ user: userId}).populate('user', ['name', 'avatar']);
    if(!profile){
        throw {msg: "There is no profile"};
    }
    return profile;
}

async function createProfile(profile, userId){
    let currentProfile = await Profile.findOne({ user: userId})

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = profile;
    const profileFields = {}
    profileFields.user = userId;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    };

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    if(currentProfile) {
        const updatedProfile = await updateProfile(userId, profileFields);
        return { msg: "update", profile: updatedProfile};
    }else{
        const newProfile = new Profile(profileFields);
        await newProfile.save();
        return { msg: "created", profile: newProfile};
    }
}

async function getProfiles(){
    const profiles = await Profile.find().populate('user', '[name, avatar]');
    return profiles;
}

async function updateProfile(userId, profile){
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: profile},
            { new : true }
        )
        return updatedProfile;
    } catch (error) {
        throw {error};
    }
}

async function deleteProfile(userId){
    try{
        await Profile.findOneAndRemove({ user: userId });
        await userController.deleteUser(userId);
    }catch(err){
        throw err;
    }
}

module.exports = { getProfileByUserId, createProfile, getProfiles, deleteProfile };