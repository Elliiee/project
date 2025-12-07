-- Citation for the following code:
-- Date: 12/2/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration
-- Create sp_CreateRentalItem
DROP PROCEDURE IF EXISTS sp_CreateRentalItem;

DELIMITER //

CREATE PROCEDURE sp_CreateRentalItem (
    IN p_rental_id INT,
    IN p_item_id INT,
    IN p_item_due_date DATE,
    IN p_item_returned_at DATETIME,
    IN p_line_daily_rate DECIMAL(8, 2),
    OUT p_rental_item_id INT
)
BEGIN
    INSERT INTO Rental_Items (`rental_id`, `item_id`, `item_due_date`, `item_returned_at`, `line_daily_rate`)
    VALUES (p_rental_id, p_item_id, p_item_due_date, p_item_returned_at, p_line_daily_rate);

    -- Store the p_rental_item_id of the last inserted row
    SELECT LAST_INSERT_ID() INTO p_rental_item_id;

END //

DELIMITER ;