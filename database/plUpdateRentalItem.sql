-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "Update bsg_people" of module 8 exploration
-- Update Rental
DROP PROCEDURE IF EXISTS sp_UpdateRentalItem;

-- DELIMITER //

CREATE PROCEDURE sp_UpdateRentalItem (
    IN p_rental_item_id INT,
    IN p_rental_id INT,
    IN p_item_id INT,
    IN p_item_due_date DATETIME,
    IN p_item_returned_at DATE,
    IN p_line_daily_rate DECIMAL(8,2)
)
BEGIN
    UPDATE Rental_Items 
    SET 
        rental_id = p_rental_id,
        item_id = p_item_id,
        item_due_date = p_item_due_date,
        item_returned_at = p_item_returned_at,
        line_daily_rate = p_line_daily_rate
    WHERE rental_item_id = p_rental_item_id;
END
-- //

-- DELIMITER;