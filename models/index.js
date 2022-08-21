const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create associations
// one-to-many relationship. creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// reverse of above. this defines relationship of Post to User. Post can belong to one user, but not many.
Post.belongsTo(User, {
    foreignKey: 'user_id',
});
// 2 below, when we query Post, we can see a total of how many votes a user creates; and when we query a User, we can see all of the posts they've voted on. The User and Post models are connected, through the Vote model. The foreign key is in Vote, which aligns with the fields we set up in the model. We also stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative.
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// directly connects User and Vote?
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
// directly connects Post and Vote?
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };
