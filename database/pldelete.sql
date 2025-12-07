-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "DELETE bsg_people" of module 8 exploration

-- DELETE Customer

DROP PROCEDURE IF EXISTS sp_DeleteCustomer;

-- DELIMITER //

CREATE PROCEDURE sp_DeleteCustomer(IN c_customer_id INT)
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
        DELETE FROM `Customers` WHERE `customer_id` = c_customer_id; 

        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in customers for id: ', c_customer_id);
            -- Trigger customer error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
    
END
-- //

-- DELIMITER;