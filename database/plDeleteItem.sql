-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "DELETE bsg_people" of module 8 exploration
-- Delete Item
DROP PROCEDURE IF EXISTS sp_DeleteItem;

-- DELIMITER //

CREATE PROCEDURE sp_DeleteItem(IN p_item_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding row from the parent table
        -- ON DELETE CASCADE will automatically delete from foreign key tables. 
        DELETE FROM `Items` WHERE `item_id` = p_item_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Items for id: ', p_item_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END
-- //

-- DELIMITER ;