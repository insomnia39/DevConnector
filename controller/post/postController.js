const Post = require('../../models/Post');
const userController = require('../user/userController');

async function createPost(userId, payload){
    try {
        const user = await userController.getUserById(userId);
        const post = new Post({
            text: payload.text,
            name: user.name,
            avatar: user.avatar,
            user: user.id
        });
        post.save();
        return post;
    } catch (err) {
        throw err;
    }
}

module.exports = { createPost }