const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database initialization
const db = new sqlite3.Database('./db/blog.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
    
    db.run(`CREATE TABLE IF NOT EXISTS Posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Comments (
        comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        comment_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES Posts (post_id)
    )`);

    // Seed an initial post if the database is empty
    db.get("SELECT COUNT(*) AS count FROM Posts", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO Posts (title, content) VALUES (?, ?)`, 
                ["Welcome to TechByte", "This is the first post on the blog, generated automatically."]);
        }
    });
});

// --- SECURITY MIDDLEWARE ---
// Basic Authentication for Admin Routes
const requireAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Hard-coded credentials: admin / password123
    if (login === 'admin' && password === 'password123') {
        return next();
    }

    // If unauthorized, prompt the browser's native login modal
    res.set('WWW-Authenticate', 'Basic realm="TechByte Admin"');
    res.status(401).send('Authentication required. Please log in.');
};

// --- ROUTES ---

// 1. Home Page: Fetch all posts and render index.ejs
app.get('/', (req, res) => {
    db.all("SELECT * FROM Posts ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Database error");
        }
        res.render('index', { posts: rows });
    });
});

// 2. Admin Page: Show the form (PROTECTED)
app.get('/admin', requireAuth, (req, res) => {
    res.render('admin');
});

// 3. Admin Page: Process the form submission and save to database (PROTECTED)
app.post('/admin', requireAuth, (req, res) => {
    const { title, content } = req.body;
    db.run(`INSERT INTO Posts (title, content) VALUES (?, ?)`, [title, content], (err) => {
        if (err) {
            return res.status(500).send("Error saving post");
        }
        res.redirect('/'); // Send the user back to the home page after publishing
    });
});

// 4. Post Detail Page: Fetch a single post and its comments
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    
    // First, fetch the post
    db.get("SELECT * FROM Posts WHERE post_id = ?", [postId], (err, post) => {
        if (err || !post) {
            return res.status(404).send("Post not found");
        }
        
        // Next, fetch the comments for this post
        db.all("SELECT * FROM Comments WHERE post_id = ? ORDER BY created_at ASC", [postId], (err, comments) => {
            if (err) {
                return res.status(500).send("Database error");
            }
            res.render('post', { post: post, comments: comments });
        });
    });
});

// 5. API Route for AJAX Comments: Receive JSON and save to database
app.post('/api/comments', (req, res) => {
    const { post_id, author_name, comment_text } = req.body;
    
    db.run(`INSERT INTO Comments (post_id, author_name, comment_text) VALUES (?, ?, ?)`, 
    [post_id, author_name, comment_text], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        
        // Respond with success and the data so the frontend can display it instantly
        res.json({ 
            success: true, 
            comment: {
                id: this.lastID,
                author_name: author_name,
                comment_text: comment_text
            }
        });
    });
});

// 6. Delete Route (PROTECTED)
app.post('/post/:id/delete', requireAuth, (req, res) => {
    const postId = req.params.id;
    // Delete the post and its associated comments
    db.run("DELETE FROM Posts WHERE post_id = ?", [postId], (err) => {
        db.run("DELETE FROM Comments WHERE post_id = ?", [postId]); 
        res.redirect('/');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});