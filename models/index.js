const User = require('./User');
const Post = require('./Post');

// create associations
// one-to-many relationship. creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

  // reverse of above. this defines relationship of Post to User. Post can belong to one user, but not many.
  Post.belongsTo(User, {
    foreignKey: 'user_id',
  });
module.exports = { User, Post };
