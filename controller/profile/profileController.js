const Profile = require('../../models/Profile');
const userController = require('../user/userController');
const enums = require("../../utils/enums");

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

async function updateProfile(userId, payload){
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: payload},
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

async function createFields(userId, payload, source){
    try{
        const profile = await getProfileByUserId(userId);
        
        const newFields = createNewFields(payload, source);

        switch(source){
            case enums.PROFILE_FIELDS.experience: {
                if(!profile.experience) profile.experience = [];
                profile.experience.unshift(newFields);
            };
                break;
            case enums.PROFILE_FIELDS.education: {
                if(!profile.education) profile.education = [];
                profile.education.unshift(newFields);
            };
                break;
            default: 
                throw "Unrecognized source call";
        }
        profile.save();
    }catch(err){
        throw err;
    }
}

async function deleteFields(userId, fieldsId, source){
    try{
        console.log("start");

        const profile = await getProfileByUserId(userId);
        let currentFields = [];
        let message = "";
        console.log("start");

        switch(source){
            case enums.PROFILE_FIELDS.experience: {
                currentFields = profile.experience ?? profile.experience.length == 0 ? profile.experience : [];
                message = "Experience";
            }
                break;
            case enums.PROFILE_FIELDS.education: {
                currentFields = profile.education ?? profile.education.length == 0 ? profile.education : [];
                message = "Education";
            }
                break;
            default: throw "Unrecognized source call";
        }

        if(currentFields.length == 0) throw `${message} is empty`;

        let updatedFields = currentFields.filter(x => x.id != fieldsId);
        if(currentFields.length == updatedFields.length) throw `${message} id is not found`;
        
        switch(source){
            case enums.PROFILE_FIELDS.experience: profile.experience = updatedFields;
                break;
            case enums.PROFILE_FIELDS.education: profile.education = updatedFields;
                break;
        }

        console.log(currentFields);

        
        profile.save();
    }catch(err){
        console.log(err);
        throw err;
    }
}

function createNewFields(payload, source){
    const newFields = {};

    switch(source){
        case enums.PROFILE_FIELDS.experience: {
            const { title, company, location, from, to, current, description } = payload;
            if(title) newFields.title = title;
            if(company) newFields.company = company;
            if(location) newFields.location = location;
            if(from) newFields.from = from;
            if(to) newFields.to = to;
            if(current) newFields.current = current;
            if(description) newFields.description = description;
        }
            break;
        case enums.PROFILE_FIELDS.education: {
            const { school, degree, fieldofstudy, from, to, current, description } = payload;
            if(school) newFields.school = school;
            if(degree) newFields.degree = degree;
            if(fieldofstudy) newFields.fieldofstudy = fieldofstudy;
            if(from) newFields.from = from;
            if(to) newFields.to = to;
            if(current) newFields.current = current;
            if(description) newFields.description = description;
        }
            break;
        default: throw "Unrecognized source call";
    }
    
    return newFields;
}

module.exports = { 
    getProfileByUserId, 
    createProfile, 
    getProfiles, 
    deleteProfile, 
    createFields, 
    deleteFields 
};