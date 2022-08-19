//this creates an Express.js router to help keep the routes organized
const router = require('express').Router();

const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    //when client makes GET request to /api/users, all users from the user table in the database get sent back as JSON
    User.findAll({ //.findAll() is an inherited method from the Model class. it lets us query all of the users from the user table in the database and is the equivalent of this SQL query "SELECT * FROM users;"
        attributes: { exclude: ['password'] } // this prevents password data from being returned
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
//this indicates that we only want one piece of data back,and is similar to the SQL query " SELECT * FROM users WHERE id = 1"
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
// .create is used to insert data. Pass in key/value pairs, where keys are what we defined in the User model and the values are what we get from req.body. In SQL this command would be: 
//INSERT INTO users
// (username, email, password)
// VALUES
//   ("Lernantino", "lernantino@gmail.com", "password1234");
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// below: http://localhost:3001/api/users/login
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    // this queries User table using findOne() method for the email entered by user, and assigned it to req.body.email
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(dbUserData => {
        if (!dbUserData) {
            // message if user with that email was not found,
          res.status(400).json({ message: 'No user with that email address!' });
          return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
          }
          
          res.json({ user: dbUserData, message: 'You are now logged in!' });
    
        //res.json({ user: dbUserData });
    
        // Verify user
    
      });  
    });

// PUT /api/users/1
//This .update() method combines the parameters for creating data and looking up data. We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used. The SQl syntax would be:
//UPDATE users
// SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
// WHERE id = 1;
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        // hooks statement below - for hashing the password when user wants to update password - see user.js
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
// To delete data, use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;