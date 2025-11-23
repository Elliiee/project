-- Citation for the following code:
-- Date: 11/19/2025
-- Based on the sample code from "Update bsg_people" of module 8 exploration

-- Update Customer

-- DELIMITER / /

DROP PROCEDURE IF EXISTS sp_UpdateCustomer;

CREATE PROCEDURE sp_UpdateCustomer(
    IN c_id INT, 
    IN c_first_name VARCHAR(60),
    IN c_last_name VARCHAR(60),
    IN c_address VARCHAR(180),
    IN c_email VARCHAR(320)
)

BEGIN
    UPDATE `Customers` SET `first_name` = c_first_name, `last_name` = c_last_name, `address` = c_address, `email` = c_email WHERE `customer_id` = c_id;
END
-- //

-- DELIMITER;