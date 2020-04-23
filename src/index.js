// Libs
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares/auth.js');
const db = require('./model/database.js');

const app = express();
const port = 8080;

// Application setup
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.auth.validate);

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

app.get('/auth', function (req, res) {
    res.render('auth/index');
});

app.post('/auth', function (req, res) {
    const data = req.body;
    db.authUser(data.username, data.password)
        .then((user) => {
            if (user) {
                middlewares.auth.connect(user)
                    .then((token) => {
                        res.cookie('gretagram_auth_token', token);
                        let redirect = '/';
                        if (req.query.redirect) redirect = decodeURIComponent(req.query.redirect);
                        res.redirect(redirect);
                    })
                    .catch((err) => console.error(err));
            }
            else res.send('WRONG'); // TODO
        })
        .catch((err) => console.error(err));
});


app.get('/panzo', function (req, res) {
    db.getUser('d.panzoli')
        .catch((msg) => console.error(msg))
        .then((data) => res.send(data.biography));
});
    
app.get('/homepage', function (req, res) {
    res.render('root/homepage');
});

app.get('/profile', function (req, res) {
    res.render('root/profile');
});

app.get('/greta-moche', function (req, res) {
    res.send('Pauvre greta, la bullied');
});
