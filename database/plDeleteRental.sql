-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "DELETE bsg_people" of module 8 exploration
-- Delete Rentals

DROP PROCEDURE IF EXISTS sp_DeleteRental;

-- DELIMITER //

CREATE PROCEDURE sp_DeleteRental(IN p_rental_id INT)
BEGIN
    DECLARE rental_count INT DEFAULT 0;
    
    -- Check if rental exists
    SELECT COUNT(*) INTO rental_count FROM Rentals WHERE rental_id = p_rental_id;
    
    IF rental_count = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No matching record found in Rentals';
    ELSE
        DELETE FROM Rentals WHERE rental_id = p_rental_id;
    END IF;
END
-- //

-- DELIMITER;