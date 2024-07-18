const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'my_notes'
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send('User already exists');
            } else {
                res.status(500).send('Error registering user');
            }
            return;
        }
        res.status(201).send({ userId: result.insertId });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT user_id FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length > 0) {
            res.status(200).send({ userId: results[0].user_id });
        } else {
            res.status(400).send('Invalid username or password');
        }
    });
});


app.get('/notes/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM notes WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching notes');
            return;
        }
        res.status(200).send(results);
    });
});


app.post('/notes', (req, res) => {
    const { userId, title, content } = req.body;
    const query = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';

    db.query(query, [userId, title, content], (err, result) => {
        if (err) {
            res.status(500).send('Error adding note');
            return;
        }
        res.status(201).send('Note added successfully');
    });
});


app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';

    db.query(query, [title, content, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating note');
            return;
        }
        res.status(200).send('Note updated successfully');
    });
});


app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting note');
            return;
        }
        res.status(200).send('Note deleted successfully');
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
