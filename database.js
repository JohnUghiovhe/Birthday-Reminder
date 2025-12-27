const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'birthdays.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Function to add a new user
function addUser(username, email, dateOfBirth) {
  const stmt = db.prepare('INSERT INTO users (username, email, date_of_birth) VALUES (?, ?, ?)');
  return stmt.run(username, email, dateOfBirth);
}

// Function to get users with birthdays today
function getBirthdayUsers() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePattern = `${month}-${day}`;
  
  const stmt = db.prepare('SELECT * FROM users WHERE strftime("%m-%d", date_of_birth) = ?');
  return stmt.all(datePattern);
}

// Function to get all users
function getAllUsers() {
  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
  return stmt.all();
}

module.exports = {
  addUser,
  getBirthdayUsers,
  getAllUsers,
  db
};

