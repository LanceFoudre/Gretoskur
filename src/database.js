const sqlite3 = require('sqlite3').verbose();

let handle = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Connected to database');
});

process.on('exit', function () {
    handle.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed database connection');
    });
});


// Getters
exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        sql = 'SELECT * FROM User WHERE username = ?';
        handle.get(sql, [username], (err, row) => {
            if (err) reject(err.message);
            else resolve(row);
        });
    });
};

exports.getPost = function (id, callback) {
    sql = 'SELECT * FROM Post WHERE rowid = ?';
    handle.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(undefined);
        }
        callback(row);
    });
}

// Setters
