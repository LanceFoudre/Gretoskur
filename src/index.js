const express = require('express');
const path = require('path');
const app = express();

const port = 8080;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));


app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

app.get('/', function (req, res) {
    res.render('test');
});

app.get('/greta-moche', function (req, res) {
    res.send('Pauvre greta, la bullied');
});