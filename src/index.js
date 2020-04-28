// Libs
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const pug = require('pug');

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
app.locals.private_res = path.join(__dirname, '../private');

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

moment.locale('fr');

// CDN data

app.get('/cdn/user/:username/:data', function (req, res) {
    switch (req.params.data) {
        case 'pfp': {
            db.getUser(req.params.username)
                .then((user) => {
                    if (!user) return res.sendStatus(404);

                    let toSend = user.pfp_file ? user.pfp_file : 'default.png';
                    res.sendFile(path.join(app.locals.private_res, 'user', toSend), (err) => {
                        if (err) {
                            console.error(err);
                            if (!res.headersSent) res.sendStatus(404);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.sendStatus(500);
                });
            break;
        }
        default: {
            res.sendStatus(400);
            break;
        }
    }
});

app.get('/cdn/post/:id/:data', function (req, res) {
    switch (req.params.data) {
        case 'img': {
            db.getPost(req.params.id)
                .then((post) => {
                    if (!post) return res.sendStatus(404);

                    res.sendFile(path.join(app.locals.private_res, 'post', post.img_file), (err) => {
                        if (err) {
                            console.error(err);
                            if (!res.headersSent) res.sendStatus(404);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.sendStatus(500);
                });
            break;
        }
        default: {
            res.sendStatus(404);
            break;
        }
    }
});

app.get('/cdn/feed', function (req, res) {
    if (req.query.after) {
        // Get next post after some date
    } else {
        // Get last post
    }
});



// Authentification system

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
                    .catch((err) => {
                        console.error(err);
                        res.sendStatus(500);
                    });
            }
            else res.send('WRONG'); // TODO
        })
        .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
});



// Pages

app.get('/', function (req, res) {
    res.render('root/homepage');
});

app.get('/profile/:username', function (req, res) {
    db.getUser(req.params.username)
        .then((user) => {
            if (user) {
                db.getUserPosts(user.username)
                    .then((user_posts) => {
                        db.getUserLikes(user.username)
                            .then((user_likes) => {
                                res.render('root/profile', {
                                    display_name: user.display_name,
                                    username: user.username,
                                    biography: user.biography,
                                    pfp_path: user.pfp_path,
                                    posts: user_posts,
                                    likes: user_likes
                                });
                            })
                            .catch((err) => {
                                console.error(err);
                                res.sendStatus(500);
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.sendStatus(500);
                    });
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.get('/new_post', function (req, res) {
    res.render('root/new_post');
});

app.get('/panzo', function (req, res) {
    db.getUser('d.panzoli')
        .catch((msg) => console.error(msg))
        .then((data) => res.send(data.biography));
});

app.get('/greta-moche', function (req, res) {
    res.send('Pauvre greta, la bullied');
});

//Temporaire pour tester la page de post
app.get('/post', function (req, res) {
    res.render('root/post');
});

app.get('/stat', function (req, res) {
    res.render('root/stats');
});
//console.log(require('crypto').randomBytes(12).toString('hex'));
//console.log(moment('2010-05-10').fromNow());
