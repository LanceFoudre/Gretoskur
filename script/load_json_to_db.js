const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const decomment = require('decomment');
const crypto = require('crypto');

fs.readFile('template.json', (err, data) => {
    if (err) throw err;

    const handle = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err) throw err;
        console.log('Connected to global database');

        const insertAll = (values) => {
            return new Promise((resolve, reject) => {
                let index = 0;
                const insertRec = () => {
                    if (index < values.length) {
                        let sql = 'INSERT INTO '
                            + values[index].table + '('
                            + Object.keys(values[index].data).join(', ')
                            + ')' + ' VALUES('
                            + (new Array(Object.values(values[index].data).length)).fill('?').join(', ')
                            + ')';

                        handle.run(sql, Object.values(values[index].data), (err) => {
                            if (err) throw err;
                            console.log(index);
                            ++index;
                            insertRec();
                        });
                    } else {
                        resolve();
                    }
                }
                insertRec();
            });
        };

        const execAll = (stmts) => {
            return new Promise((resolve, reject) => {
                let index = 0;
                const execRec = () => {
                    if (index < stmts.length) {
                        let sql = stmts[index];
                        handle.run(sql, (err) => {
                            if (err) throw err;
                            console.log(index);
                            ++index;
                            execRec();
                        });
                    } else {
                        resolve();
                    }
                }
                execRec();
            });
        };

        console.log('Cleaning up DB...');
        execAll([
            'DELETE FROM Like',
            'DELETE FROM PostComment',
            'DELETE FROM Post',
            'DELETE FROM User'
        ]).then(() => {
            console.log('Done.\nInserting data...');

            const jsonData = JSON.parse(decomment(data.toString()));

            let toInsert = [];

            for (user of jsonData.users) {
                const hasher = crypto.createHmac('sha512', user.username + 'REQUINQUER MDR');
                hasher.update(user.password);

                let obj = {
                    id: user.id,
                    username: user.username,
                    password: hasher.digest('hex'),
                    biography: user.biography,
                    display_name: user.display_name,
                    pfp_file: user.pfp_file,
                    _comment: 'password: ' + user.password
                };

                toInsert.push({
                    table: 'User',
                    data: obj
                });
            }

            for (post of jsonData.posts) {
                toInsert.push({
                    table: 'Post',
                    data: post
                });
            }

            for (comment of jsonData.comments) {
                toInsert.push({
                    table: 'PostComment',
                    data: comment
                });
            }

            for (like of jsonData.likes) {
                toInsert.push({
                    table: 'Like',
                    data: like
                });
            }

            insertAll(toInsert).then(() => {
                console.log('Done.');
            });

        }).catch((err) => console.error(err));
    });
});