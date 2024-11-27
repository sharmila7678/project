const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost', // XAMPP default host
    user: 'root',      // Default username
    password: '',      // Default password
    database: 'waste_management' // Your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Handle POST Request for Waste Data Submission
app.post('/submit', (req, res) => {
    const data = req.body;

    // Destructure form fields
    const {
        date, building,
        biodegradable_food,
        non_biodegradable_metal,
        non_biodegradable_ceramics,
        non_biodegradable_plastics,
        recyclable_paper,
        recyclable_tin,
        recyclable_glass,
        recyclable_plastics,
        reusable_clothes,
        reusable_tables,
        reusable_containers,
        reusable_books,
        biomedical,
        plastic
    } = data;

    // Insert Query
    const query = `
        INSERT INTO waste_data (
            date, building_name, biodegradable_food,
            non_biodegradable_metal, non_biodegradable_ceramics, non_biodegradable_plastics,
            recyclable_paper, recyclable_tin, recyclable_glass, recyclable_plastics,
            reusable_clothes, reusable_tables, reusable_containers, reusable_books,
            biomedical, plastic
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute Query
    db.query(query, [
        date, building, biodegradable_food || 0,
        non_biodegradable_metal || 0, non_biodegradable_ceramics || 0, non_biodegradable_plastics || 0,
        recyclable_paper || 0, recyclable_tin || 0, recyclable_glass || 0, recyclable_plastics || 0,
        reusable_clothes || 0, reusable_tables || 0, reusable_containers || 0, reusable_books || 0,
        biomedical || 0, plastic || 0
    ], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).json({ error: 'Failed to submit data.' });
        } else {
            res.status(200).json({ message: 'Data successfully submitted!' });
        }
    });
});



// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
