-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "Update bsg_people" of module 8 exploration
-- Update Rental
DROP PROCEDURE IF EXISTS sp_UpdateRental;

-- DELIMITER //

CREATE PROCEDURE sp_UpdateRental (
    IN p_rental_id INT,
    IN p_customer_id INT,
    IN p_rental_date DATETIME,
    IN p_due_date DATE,
    IN p_all_items_returned_at DATETIME,
    IN p_rental_status ENUM('Open', 'Closed', 'Overdue', 'Cancelled'),
    IN p_deposit_amount DECIMAL(8,2)
)
BEGIN
    UPDATE Rentals 
    SET 
        customer_id = p_customer_id,
        rental_date = p_rental_date,
        due_date = p_due_date,
        all_items_return_at = p_all_items_returned_at,
        rental_status = p_rental_status,
        deposit_amount = p_deposit_amount
    WHERE rental_id = p_rental_id;
END
-- //

-- DELIMITER ;