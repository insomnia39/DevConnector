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

async function getAllPost(){
    try {
        const posts = await Post.find().sort({ date: -1 });
        if(posts.count > 0) return posts;
        throw "There is no post found";
    } catch (err) {
        throw err;
    }
}

async function getPost(postId){
    try {
        const post = await Post.findById(postId);
        if(post) return post;
        throw `Post with id ${postId} is not found`;
    } catch (err) {
        throw `Post with id ${postId} is not found`;
    }
}

async function deletePost(userId, postId){
    try {
        const post = await getPost(postId);
        if(post.user != userId) throw "This post is not owned by user";
        post.remove();
    } catch (err) {
        throw err;
    }
}

async function addLike(userId, postId){
    try {
        const post = await getPost(postId);
        const postHasBeenLiked = post.likes.filter( s => s.user.toString() === userId).length > 0;
        if(postHasBeenLiked) throw "This post already liked";
        post.likes.unshift({ user: userId});
        post.save();
    } catch (err) {
        throw err;
    }
}

async function removeLike(userId, postId){
    try {
        const post = await getPost(postId);
        const postHasBeenLiked = post.likes.filter( s => s.user.toString() === userId).length > 0;
        if(!postHasBeenLiked) throw "This post has not yet been liked";
        const likeIndex = post.likes.map(s => s.user.toString()).indexOf(userId);
        post.likes.splice(likeIndex, 1);
        post.save();
    } catch (err) {
        throw err;
    }
}

module.exports = { createPost, getPost, getAllPost, deletePost, addLike, removeLike}