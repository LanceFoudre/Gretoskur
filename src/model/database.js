const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const handle = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Connected to global database');
});

process.on('exit', function () {
    handle.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed database connection');
    });
});

function sanitizedDatabaseObject(dbObject) {
    // Remove columns beginning with an underscore, they may contain sensitive information
    if (!dbObject) return undefined;
    
    let obj = {};
    for (const property in dbObject) {
        if (!property.startsWith('_')) obj[property] = dbObject[property];
    }
    return obj;
}


// Getters
exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        sql = 'SELECT * FROM User WHERE username = ?';
        handle.get(sql, [username], (err, row) => {
            if (err) reject(err.message);
            else resolve(sanitizedDatabaseObject(row));
        });
    });
};

exports.getPost = function (id) {
    return new Promise((resolve, reject) => {
        sql = 'SELECT * FROM Post WHERE rowid = ?';
        handle.get(sql, [id], (err, row) => {
            if (err) reject(err.message);
            else resolve(sanitizedDatabaseObject(row));
        });
    });
};

exports.authUser = function (username, password) {
    return new Promise((resolve, reject) => {
        const hasher = crypto.createHmac('sha512', username + 'REQUINQUER MDR');
        hasher.update(password);
        const hashed = hasher.digest('hex');

        //console.log(hashed);
        
        sql = 'SELECT 1 FROM User WHERE username = ? AND password = ?';
        handle.get(sql, [username, hashed], (err, row) => {
            if (err) return reject(err.message);
            if (row) resolve(username);
            else resolve(null);
        });
    });
};

// Setters
