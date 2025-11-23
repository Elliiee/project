-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration
-- Create Rental
DROP PROCEDURE IF EXISTS sp_CreateRental;

-- DELIMITER //

CREATE PROCEDURE sp_CreateRental (
    IN p_customer_id INT,
    IN p_rental_date DATETIME,
    IN p_due_date DATE,
    IN p_all_items_returned_at DATETIME,
    IN p_rental_status ENUM('Open', 'Closed', 'Overdue', 'Cancelled'),
    IN p_deposit_amount DECIMAL(8,2),
    OUT p_rental_id INT
)
BEGIN
    INSERT INTO Rentals (
        customer_id, 
        rental_date, 
        due_date, 
        all_items_return_at, 
        rental_status, 
        deposit_amount
    ) VALUES (
        p_customer_id, 
        p_rental_date, 
        p_due_date, 
        p_all_items_returned_at, 
        p_rental_status, 
        p_deposit_amount
    );

    SELECT LAST_INSERT_ID() INTO p_rental_id;
END
-- //

-- DELIMITER;