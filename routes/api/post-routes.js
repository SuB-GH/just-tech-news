const router = require('express').Router();
const sequelize = require('../../config/connection');
//we are including User model below, so we can retrieve some data from the user model, with a "join"

const { Post, User, Vote, Comment } = require("../../models");


// get all users
router.get('/', (req, res) => {
    console.log('======================');
    // this will retrieve all posts in the database
    Post.findAll({
        // this sorts the posts by date in descending order
        order: [['created_at', 'DESC']],
        // Query configuration
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // this will "JOIN" to the User table. notice it is an an array of objects. To define this object, we need a reference to the model and attributes
        include: [
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]

    })
        //this is a query to the database with a Promise that captures the response from the database call. 
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    
               
})
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);

        });
    // create the vote
    // Vote.create({
    //     user_id: req.body.user_id,
    //     post_id: req.body.post_id
    // }).then(() => {
    //     // then find the post we just voted on
    //     return Post.findOne({
    //         where: {
    //             id: req.body.post_id
    //         },
    //         attributes: [
    //             'id',
    //             'post_url',
    //             'title',
    //             'created_at',
    //             // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
    //             [
    //                 sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
    //                 'vote_count'
    //             ]
    //         ]
    //     })
    //         .then(dbPostData => res.json(dbPostData))
    //         .catch(err => {
    //             console.log(err);
    //             res.status(400).json(err);
    //         });
    // });



    router.put('/:id', (req, res) => {
        Post.update(
            {
                title: req.body.title
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
            .then(dbPostData => {
                if (!dbPostData) {
                    res.status(404).json({ message: 'No post found with this id' });
                    return;
                }
                res.json(dbPostData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    });

    router.delete('/:id', (req, res) => {
        Post.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(dbPostData => {
                if (!dbPostData) {
                    res.status(404).json({ message: 'No post found with this id' });
                    return;
                }
                res.json(dbPostData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    });
})
module.exports = router;