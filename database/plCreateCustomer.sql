-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "CREATE bsg_people" of module 8 exploration

-- Create Customer

DROP PROCEDURE IF EXISTS sp_CreateCustomer;

-- DELIMITER //  -- DELIMITER is a client command, it doesn't work in some environment
CREATE PROCEDURE sp_CreateCustomer (
    IN p_first_name VARCHAR(60),
    IN p_last_name VARCHAR(60),
    IN p_address VARCHAR(180),
    IN p_email VARCHAR(320),
    OUT p_customer_id INT
)
BEGIN
    INSERT INTO Customers (`first_name`, `last_name`, `address`, `email`)
    VALUES (p_first_name, p_last_name, p_address, p_email);

    -- Store the customer_id of the last inserted row
    SELECT LAST_INSERT_ID() into p_customer_id;

    -- Display the ID of the last inserted person. 
    -- SELECT LAST_INSERT_ID() AS 'new_id';

    -- Example of how to get the ID of the newly created customer: 
    -- CALL sp_CreateCustomer('Lisa', 'Green', '234 flower Dr, Dallas, Texas, 75089', 'lisagreen@gmail.com', @new_id);
    -- SELECT @new_id AS 'New Customer ID'; 

END;

-- //

-- DELIMITER ;