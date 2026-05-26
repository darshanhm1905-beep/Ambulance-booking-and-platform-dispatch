const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use /tmp on Vercel to avoid read-only filesystem errors, otherwise use local directory
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? '/tmp/ambulance.db' : path.resolve(__dirname, 'ambulance.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientName TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            latitude REAL,
            longitude REAL,
            address TEXT,
            emergencyType TEXT,
            status TEXT DEFAULT 'Pending',
            driverId INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            username TEXT,
            mobile TEXT,
            vehicleNumber TEXT NOT NULL,
            status TEXT DEFAULT 'Available'
        )`, () => {
            // Seed a driver if empty
            db.get("SELECT COUNT(*) as count FROM drivers", (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO drivers (name, phone, username, mobile, vehicleNumber) VALUES ('John Doe', '555-0101', 'john', '1234567890', 'AMB-101')`);
                    db.run(`INSERT INTO drivers (name, phone, username, mobile, vehicleNumber) VALUES ('Jane Smith', '555-0202', 'jane', '0987654321', 'AMB-102')`);
                }
            });
        });
    }
});

module.exports = db;
