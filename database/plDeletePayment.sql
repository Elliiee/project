-- Citation for the following code:
-- Date: 12/03/2025
-- Based on the sample code from "DELETE bsg_people" of module 8 exploration
-- Delete Payment
DROP PROCEDURE IF EXISTS sp_DeletePayment;

DELIMITER //

CREATE PROCEDURE sp_DeletePayment(IN p_payment_id INT)
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
        DELETE FROM `Payments` WHERE `payment_id` = p_payment_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Payments for id: ', p_payment_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //

DELIMITER ;