-- Citation for the following code:
-- Date: 12/03/2025
-- Based on the sample code from "Update bsg_people" of module 8 exploration
-- Update Payment

DELIMITER //

DROP PROCEDURE IF EXISTS sp_UpdatePayment;

CREATE PROCEDURE sp_UpdatePayment (
    IN p_payment_id INT,
    IN p_rental_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_payment_status ENUM('Authorized', 'Captured', 'Refunded', 'Failed', 'Voided'),
    IN p_payment_method ENUM('Card', 'Cash', 'PayPal', 'Bank'),
    IN p_paid_at DATETIME,
    IN p_transaction_number VARCHAR(64),
    IN p_card_last4 CHAR(4), 
    IN p_card_brand VARCHAR(20)
)
BEGIN
    UPDATE Payments 
    SET `rental_id` = p_rental_id, 
    `amount` = p_amount, 
    `payment_status` = p_payment_status, 
    `payment_method` = p_payment_method, 
    `paid_at` = p_paid_at, 
    `transaction_number` = p_transaction_number, 
    `card_last4` = p_card_last4, 
    `card_brand` = p_card_brand
    WHERE `payment_id` = p_payment_id;
END //

DELIMITER;