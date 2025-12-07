-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration
-- Create Payment
DROP PROCEDURE IF EXISTS sp_CreatePayment;

DELIMITER //

CREATE PROCEDURE sp_CreatePayment (
    IN p_rental_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_payment_status ENUM('Authorized', 'Captured', 'Refunded', 'Failed', 'Voided'),
    IN p_payment_method ENUM('Card', 'Cash', 'PayPal', 'Bank'),
    IN p_paid_at DATETIME,
    IN p_transaction_number VARCHAR(64),
    IN p_card_last4 CHAR(4), 
    IN p_card_brand VARCHAR(20),
    OUT p_payment_id INT
)
BEGIN
    INSERT INTO Payments (`rental_id`, `amount`, `payment_status`, `payment_method`, `paid_at`, `transaction_number`, `card_last4`, `card_brand`)
    VALUES (p_rental_id, p_amount, p_payment_status, p_payment_method, p_paid_at, p_transaction_number, p_card_last4, p_card_brand);

    -- Store the p_payment_id of the last inserted row
    SELECT LAST_INSERT_ID() INTO p_payment_id;

END //

DELIMITER;