-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration
-- Create Item
DROP PROCEDURE IF EXISTS sp_CreateItem;

DELIMITER / /

CREATE PROCEDURE sp_CreateItem (
    IN p_item_name VARCHAR(255),
    IN p_description VARCHAR(511),
    IN p_size VARCHAR(25),
    IN p_color VARCHAR(30),
    IN p_sku VARCHAR(40),
    IN p_daily_rate DECIMAL(8,2),
    IN p_item_status ENUM('Available', 'Rented', 'Cleaning', 'Repair', 'Retired'),
    OUT p_item_id INT
)
BEGIN
    INSERT INTO Items (`item_name`, `description`, `size`, `color`, `sku`, `daily_rate`, `item_status`)
    VALUES (p_item_name, p_description, p_size, p_color, p_sku, p_daily_rate, p_item_status);

    -- Store the item_id of the last inserted row
    SELECT LAST_INSERT_ID() INTO p_item_id;

END //

DELIMITER;