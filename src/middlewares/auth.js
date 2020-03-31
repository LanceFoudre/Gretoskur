const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto')

const handle = new sqlite3.Database(':memory:', (err) => {
    if (err) console.error(err.message);
    else {
        console.log('Created login database');
        handle.run('CREATE TABLE Connected (token TEXT, username TEXT, valid TEXT)', (err) => {
            if (err) console.error(err.message);
            else console.log('Initialized login database');
        });
    }
});

exports.auth = {
    validate: function (req, res, next) {
        const token = req.cookies.gretagram_auth_token;

        const sql = 'SELECT username FROM Connected WHERE token = ?';
        handle.get(sql, [token], (err, row) => {
            if (err) {
                res.status(500).send('DB Error');
                console.error(err);
            }
            else {
                if (row) {
                    req.username = row.username;
                    next();

                } else {
                    // User is not connected
                    if (['/auth', '/favicon.ico'].includes(req.path)) next(); // The only pages accessible without being authenticated
                    else {
                        let fullUrl = encodeURIComponent(req.protocol + '://' + req.get('host') + req.originalUrl);
                        res.redirect('/auth?redirect=' + fullUrl);
                    }
                }
            }
        });
    },

    connect: function (username) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(48, (err, buffer) => {
                let token = buffer.toString('hex');
                let abortTransact = function (err) {
                    handle.run('ROLLBACK TRANSACTION', (err2) => {
                        if (err2) reject(err2.message);
                        else reject(err.message)
                    });
                }

                handle.run('BEGIN TRANSACTION', (err) => {
                    if (err) return reject(err);

                    handle.get('SELECT 1 FROM Connected WHERE username = ?', [username], (err, row) => {
                        if (err) return abortTransact(err);

                        let sql = "";
                        if (row) sql = "UPDATE Connected SET token = ?, valid = DATETIME('now', '+1 day') WHERE username = ?";
                        else sql = "INSERT INTO Connected VALUES (?, ?, DATETIME('now', '+1 day'))";
                        handle.run(sql, [token, username], (err) => {
                            if (err) return abortTransact(err);

                            handle.run('COMMIT TRANSACTION', (err) => {
                                if (err) return abortTransact(err);
                                resolve(token);
                            });
                        });
                    });
                });
            });
        });
    },
}