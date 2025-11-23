-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration
-- Create Paymen
DROP PROCEDURE IF EXISTS sp_CreatePayment;

DELIMITER / /

CREATE PROCEDURE sp_CreatePayment (
    IN p_ental_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_payment_status ENUM('Authorized', 'Captured', 'Refunded', 'Failed', 'Voided')
    OUT p_payment_id INT
)
BEGIN
    INSERT INTO Items (`item_name`, `description`, `size`, `color`, `sku`, `daily_rate`, `item_status`)
    VALUES (p_item_name, p_description, p_size, p_color, p_sku, p_daily_rate, p_item_status);

    -- Store the item_id of the last inserted row
    SELECT LAST_INSERT_ID() INTO p_item_id;

END //

DELIMITER;