// Citation: the following code is from Exploration Web Application Technology
// Citations: Build db-connector.js section example code
// Get an instance of mysql we can use in the app
let mysql = require('mysql2');

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: '[cs340_user]',
    password: '[xxxx]',
    database: '[cs340_user]'
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
module.exports = pool;
