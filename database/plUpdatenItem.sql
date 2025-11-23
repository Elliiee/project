-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "Update bsg_people" of module 8 exploration
-- Update Item

-- DELIMITER //

DROP PROCEDURE IF EXISTS sp_UpdateItem;

CREATE PROCEDURE sp_UpdateItem (
    IN p_item_id INT,
    IN p_item_name VARCHAR(255),
    IN p_description VARCHAR(511),
    IN p_size VARCHAR(25),
    IN p_color VARCHAR(30),
    IN p_sku VARCHAR(40),
    IN p_daily_rate DECIMAL(8,2),
    IN p_item_status ENUM('Available', 'Rented', 'Cleaning', 'Repair', 'Retired')
)
BEGIN
    UPDATE Items 
    SET `item_name` = p_item_name, 
    `description` = p_description, 
    `size` = p_size, 
    `color` = p_color, 
    `sku` = p_sku, 
    `daily_rate` = p_daily_rate, 
    `item_status` = p_item_status 
    WHERE `item_id` = p_item_id;
END
-- //

-- DELIMITER;