// Libs
const express = require('express');
const path = require('path');


const app = express();
const port = 8080;


// Application setup
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));
app.locals.basedir = app.get('views');

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});


// Pages
app.get('/', function (req, res) {
    res.render('root/index');
});

app.get('/homepage', function (req, res) {
    res.render('root/homepage');
});

app.get('/greta-moche', function (req, res) {
    res.send('Pauvre greta, la bullied');
});

app.get('/test-post', function (req, res) {
    res.render('templates/post');
});