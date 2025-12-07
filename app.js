//Citation: this is created based on the sample code from Build app.js section 
// of Exploration Web Application Technology
// Date: 11/19/25
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

// ADD THIS DEBUGGING MIDDLEWARE
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});


// ########################################
// ########## RESET DB
app.post('/home/reset', async (req, res) => {
    try {
        let data = req.body;

        const [results] = await db.execute('CALL sp_ResetDatabase();');

        res.redirect('/');
    } catch (error) {
        console.error('Error executing queries for reset database:', error);
        res.status(500).send('An error occurred while executing the database queries to reset.');
    }
});

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
        // Get rental items with item names
        const query1 = `SELECT 
            Rental_Items.rental_item_id, 
            Rental_Items.rental_id, 
            Rental_Items.item_id,
            Items.item_name,
            Rental_Items.item_due_date,
            Rental_Items.item_returned_at,
            Rental_Items.line_daily_rate
        FROM Rental_Items 
        JOIN Items ON Items.item_id = Rental_Items.item_id`;

        // Get rentals for dropdown
        const query2 = 'SELECT rental_id FROM Rentals';

        // Get items for dropdown
        const query3 = 'SELECT item_id, item_name FROM Items';

        const [rental_item] = await db.query(query1);
        const [rentals] = await db.query(query2);
        const [items] = await db.query(query3);

        res.render('rental_items', {
            rental_item: rental_item,
            rentals: rentals,
            items: items
        });
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


// Citation for the following code: 
// Date: 11/19/2025
// Code based on CREATE, UPDATE, DELETE ROUTES sample code from exploration of module 8

// CREATE Customer ROUTES 
app.post('/customers/create', async function (req, res) {
    try {
        // Parse frontend form information 
        let data = req.body;

        // Create and execute queries 
        // Using parameterized queries 
        const query1 = `CALL sp_CreateCustomer(?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row 
        await db.query(query1, [
            data.create_customer_first_name,
            data.create_customer_last_name,
            data.create_customer_address,
            data.create_customer_email,
        ]);

        // get the new id by selecting the session variable
        const [[idResult]] = await db.query('SELECT @new_id as new_id');
        const newId = idResult.new_id;

        console.log(`CREATE customer ID: ${newId} ` +
            `Name: ${data.create_customer_first_name} ${data.create_customer_last_name}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/customers')

    } catch (error) {
        console.error('Error executing queries for creating customer:', error);
        res.status(500).send('An error occurred while executing the database queries to create customer.');
    }
});

// Customer UPDATE ROUTES 
app.post('/customers/update', async function (req, res) {
    try {
        // Parse frontend information form 
        const data = req.body;

        // create and execute query 
        const query1 = 'CALL sp_UpdateCustomer(?, ?, ?, ?, ?);';
        const query2 = 'SELECT first_name, last_name, address, email FROM Customers WHERE customer_id = ?;';
        await db.query(query1, [
            data.update_customer_id,
            data.update_customer_first_name,
            data.update_customer_last_name,
            data.update_customer_address,
            data.update_customer_email,
        ]);
        const [[rows]] = await db.query(query2, [data.update_customer_id]);

        console.log(`UPDATE customer ID: ${data.update_customer_id} ` +
            `Name: ${rows.first_name} ${rows.last_name} ` +
            `Address and Email: ${rows.address} ${rows.email}`
        );

        // Redirect the user to the updated webpage 
        res.redirect('/customers');

    } catch (error) {
        console.error('Error executing queries for updating customer:', error);
        res.status(500).send('An error occured while executing the database queries to update customer.');
    }
});

// DELETE CUSTOMER ROUTES 
app.post('/customers/delete', async function (req, res) {
    try {
        let data = req.body;

        const query1 = `CALL sp_DeleteCustomer(?)`;
        await db.query(query1, [data.delete_customer_id]);

        console.log(`DELETE customer ID: ${data.delete_customer_id} ` +
            `Name: ${data.delete_customer_name} `
        );

        res.redirect('/customers')
    } catch (error) {
        console.error('Error executing queries for deleting customer:', error);
        res.status(500).send('An error occured while executing the database queries to deleting customer.');
    }
});

// CREATE ITEM ROUTE 
app.post('/items/create', async function (req, res) {
    console.log('=== CREATE ITEM ROUTE HIT ===');
    console.log('Form data:', req.body);

    try {
        let data = req.body;

        const itemStatus = data.create_item_status.charAt(0).toUpperCase() +
            data.create_item_status.slice(1).toLowerCase();

        const query1 = `CALL sp_CreateItem(?, ?, ?, ?, ?, ?, ?, @new_id);`;
        console.log('Executing query with params:', [
            data.create_item_name,
            data.create_description,
            data.create_size,
            data.create_color,
            data.create_sku || null,  
            parseFloat(data.create_daily_rate),
            itemStatus,
        ]);

        await db.query(query1, [
            data.create_item_name,
            data.create_description,
            data.create_size,
            data.create_color,
            data.create_sku || null,  
            parseFloat(data.create_daily_rate),
            itemStatus,
        ]);

        const [[result]] = await db.query('SELECT @new_id as new_id');
        const newItemId = result.new_id;

        console.log(`CREATE item ID: ${newItemId} Name: ${data.create_item_name}`);

        return res.redirect('/items');

    } catch (error) {
        console.error('Error executing queries for creating items:', error);
        return res.status(500).send('Error executing queries for creating items:');
    }
});


// Item UPDATE ROUTES 
app.post('/items/update', async function (req, res) {
    try {
        const data = req.body;

        const query1 = 'CALL sp_UpdateItem(?, ?, ?, ?, ?, ?, ?, ?);';
        const query2 = 'SELECT item_name, description, size, color, sku, daily_rate, item_status FROM Items WHERE item_id = ?;';

        const params = [
            data.update_item_id,
            data.update_item_name,
            data.update_description,
            data.update_size,
            data.update_color,
            data.update_sku,
            data.update_daily_rate,
            data.update_item_status
        ];

        console.log('Parameters being passed:', params);

        await db.query(query1, params);

        const [[rows]] = await db.query(query2, [data.update_item_id]);

        console.log(`UPDATE item ID: ${data.update_item_id} Name: ${rows.item_name}`);

        res.redirect('/items');

    } catch (error) {
        console.error('Error executing queries for updating items:', error);
        res.status(500).send('An error occurred while executing the database queries to update items.');
    }
});

// DELETE Item ROUTES 
app.post('/items/delete', async function (req, res) {
    try {
        let data = req.body;

        const query1 = `CALL sp_DeleteItem(?)`;
        await db.query(query1, [data.delete_item_id]);

        console.log(`DELETE customer ID: ${data.delete_item_id} ` +
            `Name: ${data.delete_item_name} `
        );

        res.redirect('/items')
    } catch (error) {
        console.error('Error executing queries for deleting items:', error);
        res.status(500).send('An error occured while executing the database queries to deleting items.');
    }
});


// CREATE Rental ROUTE 
app.post('/rentals/create', async function (req, res) {
    try {
        let data = req.body;

        const query1 = `CALL sp_CreateRental(?, ?, ?, ?, ?, ?, @new_id);`;
        await db.query(query1, [
            data.customer_id,
            data.create_rental_date,
            data.create_due_date,
            data.create_all_return_date,
            data.create_rental_status,
            data.create_deposit_amount,
        ]);

        const [[result]] = await db.query('SELECT @new_id as new_id');
        const newRentalId = result.new_id;

        console.log(`CREATE item ID: ${newRentalId} `);

        res.redirect('/rentals');

    } catch (error) {
        console.error('Error executing queries for creating rentals:', error);
        res.status(500).send('An error occured while executing the database queries to creating rentals.');
    }
});


// Rental UPDATE ROUTES 
app.post('/rentals/update', async function (req, res) {
    try {
        const data = req.body;

        const customerId = parseInt(data.update_customer_name);
        const depositAmount = parseFloat(data.update_deposit_amount);

        const query = 'CALL sp_UpdateRental(?, ?, ?, ?, ?, ?, ?);';
        await db.query(query, [
            data.update_rental_id,
            customerId,
            data.update_rental_date,
            data.update_due_date,
            data.update_all_items_return_at || null,
            data.update_rental_status,
            depositAmount
        ]);

        console.log(`UPDATE rental ID: ${data.update_rental_id} for customer ID: ${customerId}`);
        res.redirect('/rentals');

    } catch (error) {
        console.error('Error executing queries for updating rental:', error);
        res.status(500).send('An error occurred while executing the database queries to update rental.');
    }
});


// DELETE RENTAL ROUTES 
app.post('/rentals/delete', async function (req, res) {
    try {
        let data = req.body;

        const query1 = `CALL sp_DeleteRental(?)`;
        await db.query(query1, [data.delete_rental_id]);

        console.log(`DELETE rental ID: ${data.delete_rental_id} `);

        res.redirect('/rentals')
    } catch (error) {
        console.error('Error executing queries for deleting rentals:', error);
        res.status(500).send('An error occured while executing the database queries to deleting rentals.');
    }
});

// CREATE Rental_Items ROUTES 
app.post('/rental_items/create', async function (req, res) {
    try {
        let data = req.body;

        let returnedAt = null;
        if (data.create_item_returned_at && data.create_item_returned_at.trim() !== '') {
            returnedAt = new Date(data.create_item_returned_at).toISOString().slice(0, 19).replace('T', ' ');
        }

        const query1 = `CALL sp_CreateRentalItem(?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            data.create_rental_id,
            data.create_item_id,
            data.create_item_due_date,
            returnedAt,
            parseFloat(data.create_line_daily_rate)
        ]);

        const [[{ new_id }]] = await db.query('SELECT @new_id as new_id');

        console.log(`CREATE rental item. ID: ${new_id}, ` +
            `Rental ID: ${data.create_rental_id}, ` +
            `Item ID: ${data.create_item_id}`
        );

        res.redirect('/rental_items');

    } catch (error) {
        console.error('Error executing queries for creating rental_items:', error);
        res.status(500).send('Error executing queries for creating rental_items:');
    }
});


// Rental_Items UPDATE ROUTES 
app.post('/rental_items/update', async function (req, res) {
    try {
        const data = req.body;

        const lineDailyRate = parseFloat(data.update_line_daily_rate);

        const query = 'CALL sp_UpdateRentalItem(?, ?, ?, ?, ?, ?);';
        await db.query(query, [
            data.update_rental_item_id,
            data.update_rental_id,
            data.update_item_id,
            data.update_item_due_date,
            data.update_item_returned_at,
            lineDailyRate
        ]);

        console.log(`UPDATE rental item ID: ${data.update_rental_item_id} `);
        res.redirect('/rental_items');

    } catch (error) {
        console.error('Error executing queries for updating rental items:', error);
        res.status(500).send('An error occurred while executing the database queries to update rental items.');
    }
});

// DELETE Rental_Item ROUTES
app.post('/rental_items/delete', async function (req, res) {
    try {
        let data = req.body;

        const query1 = `CALL sp_DeleteRentalItem(?);`;
        await db.query(query1, [data.delete_rental_item_id]);

        console.log(`DELETE rental_item ID: ${data.delete_rental_item_id} `);

        res.redirect('/rental_items');
    } catch (error) {
        console.error('Error executing queries for deleting rental_items:', error);
        res.status(500).send(
            'An error occurred while executing the database queries for deleting rental_items.'
        );
    }
});



// CREATE PAYMENT ROUTES 
app.post('/payments/create', async function (req, res) {
    try {
        let data = req.body;

        const paymentStatus = data.create_payment_status.charAt(0).toUpperCase() +
            data.create_payment_status.slice(1);
        const paymentMethod = data.create_payment_method.charAt(0).toUpperCase() +
            data.create_payment_method.slice(1);

        const paidAt = new Date(data.create_payment_date).toISOString().slice(0, 19).replace('T', ' ');

        const query1 = `CALL sp_CreatePayment(?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            data.create_rental_id,
            parseFloat(data.create_payment_amount),
            paymentStatus,
            paymentMethod,
            paidAt,
            data.create_transaction_number,
            data.create_card_last4 || null,  
            data.create_card_brand || null   
        ]);

        const [[{ new_id }]] = await db.query('SELECT @new_id as new_id');

        console.log(`CREATE payment. ID: ${new_id}, ` +
            `Rental ID: ${data.create_rental_id}, ` +
            `Payment amount: ${data.create_payment_amount}`
        );

        res.redirect('/payments')
    } catch (error) {
        console.error('Error executing queries for creating payments:', error);
        res.status(500).send(
            'An error occurred while executing the database queries for creating payments.'
        );
    }
});


// UPDATE PAYMENT ROUTES
app.post('/payments/update', async function (req, res) {
    try {
        const data = req.body;

        // Validate payment amount
        const paymentAmount = parseFloat(data.update_payment_amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            console.error('Invalid payment amount:', data.update_payment_amount);
            return res.redirect('/payments?error=Invalid payment amount');
        }

        // Validate payment date
        if (!data.update_payment_date || data.update_payment_date.trim() === '') {
            console.error('Missing payment date');
            return res.redirect('/payments?error=Payment date is required');
        }

        const paymentDate = new Date(data.update_payment_date);
        if (isNaN(paymentDate.getTime())) {
            console.error('Invalid payment date:', data.update_payment_date);
            return res.redirect('/payments?error=Invalid payment date format');
        }

        // Format date for database
        const formattedPaymentDate = paymentDate.toISOString().slice(0, 19).replace('T', ' ');

        // Use your stored procedure or direct UPDATE
        const query = `
            UPDATE Payments 
            SET rental_id = ?, 
                amount = ?, 
                payment_status = ?, 
                payment_method = ?, 
                paid_at = ?, 
                transaction_number = ?, 
                card_last4 = ?, 
                card_brand = ?
            WHERE payment_id = ?;
        `;

        await db.query(query, [
            data.update_rental_id,
            paymentAmount,
            dbPaymentStatus,
            dbPaymentMethod,
            formattedPaymentDate,
            data.update_transaction_number,
            cardLast4,
            cardBrand,
            data.update_payment_id
        ]);

        console.log(`UPDATE payment ID: ${data.update_payment_id}, Amount: $${paymentAmount.toFixed(2)}`);

        res.redirect('/payments');

    } catch (error) {
        console.error('Error executing queries for updating payment:', error);
        res.status(500).send(
            'An error occurred while executing the database queries for updateing payments.'
        );
    }
});


// DELETE PAYMENT ROUTE
app.post('/payments/delete', async function (req, res) {
    try {
        let data = req.body;

        // Create and execute our query
        const query1 = `CALL sp_DeletePayment(?);`;
        await db.query(query1, [data.delete_payment_id]);

        console.log(`DELETE payment ID: ${data.delete_payment_id} `);

        res.redirect('/payments');
    } catch (error) {
        console.error('Error executing deleting payment queries:', error);
        res.status(500).send(
            'An error occurred while executing the deleting payment queries.'
        );
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