const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path'); // this makes the css stylesheet available to the client

const app = express();
const PORT = process.env.PORT || 3001;

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // this is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets

// turn on routes
app.use(routes);

// turn on connection to db and server
// below is the "sync method". by changing "false" to "true", database connection must sync with the model definitions and associations. By forcing the sync method to true, we will make the tables re-create if there are any association changes. Similar to "DROP TABLE IF EXISTS"
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});