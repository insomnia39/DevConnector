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

async function addComment(userId, postId, text){
    try {
        const user = await userController.getUserById(userId);
        const post = await getPost(postId);
        const comment = {
            user: userId,
            text: text,
            avatar: user.avatar
        }
        post.comments.unshift(comment);
        post.save();
    } catch (err) {
        throw err;
    }
}

async function removeComment(userId, postId, commentId){
    try {
        const post = await getPost(postId);
        const comments = post.comments.map(s => s.id);
        const comment = post.comments.find(s => s.id === commentId);
        if(!comment) throw "Comment is not found";
        const isCommentOwnedByUser = comment.user.toString() == userId;
        if(!isCommentOwnedByUser) throw "Only the comment creator can delete";
        const commentIndex = comments.indexOf(commentId);
        post.comments.splice(commentIndex, 1);
        post.save()
    } catch (err) {
        throw err;
    }
}

module.exports = { createPost, getPost, getAllPost, deletePost, addLike, removeLike, addComment, removeComment}