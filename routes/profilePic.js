const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const {conInit, con } = require('../config/connection');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    // destination: './public/uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

router.post('/', upload.single('myImage'), (req, res) => {
    if (req.file) {
        if (!req.session.image) {
            const imageName = `/uploads/${req.file.filename}`;
            
            const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;

            con.query(`SELECT * FROM comments WHERE username = '${req.session.username}'`, (err, result) => {
                if (err) throw err;
                if (result.length !== 0) {
                    con.query('UPDATE images SET imagePath = ? WHERE username = ?', [imageName, req.session.username], (err, db) => {
                        if (err) throw err;
                        req.session.image = imageName;
                        console.log(db.affectedRows + " record(s) updated");
                    })
                }
            })
            
            con.query(sql, [imageName, req.session.username], (err, result) => {
                if (err) throw err;
                req.session.image = imageName;
                console.log('1 Document inserted');
                return res.redirect('/profile');
            });
        } else {
            const imageName = `/uploads/${req.file.filename}`;

            const sql = `UPDATE images SET imagePath = ? WHERE username = ?`;
            con.query(`SELECT * FROM comments WHERE username = '${req.session.username}'`, (err, result) => {
                if (err) throw err;
                if (result.length !== 0) {
                    con.query('UPDATE images SET imagePath = ? WHERE username = ?', [imageName, req.session.username], (err, db) => {
                        if (err) throw err;
                        req.session.image = imageName;
                        console.log(db.affectedRows + " record(s) updated");
                    })
                }
            })
            con.query(sql, [imageName, req.session.username], (err, result) => {
                if (err) throw err;
                req.session.image = imageName;
                console.log(result.affectedRows + " record(s) updated");
                return res.redirect('/profile');
            });
        }
    }else {
        console.log('Image upload fail!');
    }
});

module.exports = router;