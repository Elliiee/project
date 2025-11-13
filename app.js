//Citation: this is modified and updated based the sample code 
// from Build app.js section of Exploration Web Application Technology
//
// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 55421;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.


// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});


app.get('/customers', async function (req, res) {
    try {
        const query1 = 'SELECT * FROM Customers;';
        const [customer] = await db.query(query1);
        res.render('customers', { customer: customer });
    } catch (error) {
        console.error('Error executing queries for customers:', error);
        res.status(500).send('An error occurred while executing the database queries for customers.');
    }
});

app.get('/items', async function (req, res) {
    try {
        const query1 = 'SELECT * FROM Items;';
        const [item] = await db.query(query1);
        res.render('items', { item: item });
    } catch (error) {
        console.error('Error executing queries for items:', error);
        res.status(500).send('An error occurred while executing the database queries for items.');
    }
});

app.get('/rentals', async function (req, res) {
    try {
        const query1 = 'SELECT Rentals.rental_id, Customers.customer_id, Customers.first_name, \
        Customers.last_name, Rentals.rental_date, Rentals.due_date, Rentals.all_items_return_at,\
        Rentals.rental_status, Rentals.deposit_amount \
        FROM Rentals JOIN Customers ON Rentals.customer_id = Customers.customer_id;';
        const [rental] = await db.query(query1);

        const query2 = 'SELECT * FROM Customers;';
        const [customer] = await db.query(query2);
        res.render('rentals', { rental: rental, customer: customer });
    } catch (error) {
        console.error('Error executing queries for rentals:', error);
        res.status(500).send('An error occurred while executing the database queries for rentals.');
    }
});

app.get('/rental_items', async function (req, res) {
    try {
        const query1 = 'SELECT Rental_Items.rental_item_id, Rental_Items.rental_id, Rental_Items.item_id, \
        Items.item_name, Rental_Items.item_due_date, Rental_Items.item_returned_at, Rental_Items.line_daily_rate \
        FROM Rental_Items JOIN Items ON Items.item_id = Rental_Items.rental_item_id';
        const [rental_item] = await db.query(query1);
        res.render('rental_items', { rental_item: rental_item });
    } catch (error) {
        console.error('Error executing queries for rental_items:', error);
        res.status(500).send('An error occurred while executing the database queries for rental_items.');
    }
});

app.get('/payments', async function (req, res) {
    try {
        const query1 = 'SELECT * FROM Payments;';
        const [payment] = await db.query(query1);
        const query2 = 'SELECT * FROM Rentals;';
        const [rental] = await db.query(query2);
        res.render('payments', { payment: payment, rental: rental });
    } catch (error) {
        console.error('Error executing queries for payments:', error);
        res.status(500).send('An error occurred while executing the database queries for payments.');
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
        PORT +
        '; press Ctrl-C to terminate.'
    );
});