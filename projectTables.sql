DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    `customer_id` int(11) NOT NULL AUTO_INCREMENT, 
    `first_name` varchar(60) NOT NULL, 
    `last_name` varchar(60) NOT NULL,
    `address` varchar(180),
    `email` varchar(320) NOT NULL, 
    PRIMARY KEY (`customer_id`), 
    UNIQUE (`email`));

DROP TABLE IF EXISTS Items;
CREATE TABLE Items (
	`item_id`     int  NOT NULL AUTO_INCREMENT,
	`item_name`   varchar(255) NOT NULL,
	`description` varchar(511) NOT NULL,
	`size`        varchar(25)  NOT NULL,
	`color`       varchar(30)  NOT NULL,
	`sku`         varchar(40),
	`daily_rate`  decimal(8,2) NOT NULL,
	`item_status` enum('Available','Rented','Cleaning','Repair','Retired') NOT NULL DEFAULT 'Available',
	PRIMARY KEY (item_id));

DROP TABLE IF EXISTS Rentals;
CREATE TABLE Rentals (
	`rental_id`           int NOT NULL AUTO_INCREMENT,
	`customer_id`         int NOT NULL,
	`rental_date`         datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`due_date`            date NOT NULL,
	`all_items_return_at` datetime NULL,
	`rental_status`       enum('Open','Closed','Overdue','Cancelled') NOT NULL DEFAULT 'Open',
	`deposit_amount`      decimal(8,2) NOT NULL DEFAULT 50.00,
	PRIMARY KEY (`rental_id`),
	FOREIGN KEY (`customer_id`) REFERENCES Customers(`customer_id`)ON DELETE CASCADE);

DROP TABLE IF EXISTS Rental_Items;
CREATE TABLE Rental_Items (
	`rental_item_id`   INT NOT NULL AUTO_INCREMENT,
	`rental_id`        INT NOT NULL,
	`item_id`          INT NOT NULL,
	`item_due_date`    DATE NOT NULL,
	`item_returned_at` DATETIME NULL,
	`line_daily_rate`  DECIMAL(8,2) NOT NULL,
	PRIMARY KEY (`rental_item_id`),
	FOREIGN KEY (`rental_id`) REFERENCES Rentals(rental_id)ON DELETE CASCADE,
	FOREIGN KEY (`item_id`) REFERENCES Items(item_id)ON DELETE CASCADE );

DROP TABLE IF EXISTS Payments;
CREATE TABLE Payments (
	`payment_id` int NOT NULL AUTO_INCREMENT,
	`rental_id`  int NOT NULL,
	`amount`     decimal(10,2) NOT NULL,
	`payment_status`   enum('Authorized','Captured','Refunded','Failed','Voided') NOT NULL,
	`payment_method`   enum('Card','Cash','PayPal','Bank') NOT NULL,
	`paid_at`     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`transaction_number` varchar(64) NOT NULL,
	`card_last4`  char(4) NULL,
	`card_brand`   varchar(20) NULL,
	PRIMARY KEY (`payment_id`),
	FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)ON DELETE CASCADE);


INSERT INTO Customers (`first_name`, `last_name`, `address`, `email`)
              VALUES ('Sandy', 'Lie', '213 Water Dr, Ellen, TX', 'sandy@gmail.com'),
	                ('Jerry', 'Smith', '756 Daisy Dr, Richland, TX', 'jerry@gmail.com'),
                	('Tom', 'Hamilton', '5467 Park Ln, Highland, TX', 'hamilton@gmail.com');
            

INSERT INTO Items (`item_name`, `daily_rate`, `description`, `sku`, `item_status`)
VALUES ('blazer', '0.3', 'wedding blazer', 'NULL', 'Available'),
    	('dress', '0.5', 'dress blazer', 'NULL', 'Available'),
		('hat', '0.1', 'party hat', 'NULL', 'Available'),
		('shoes', '0.3', 'wedding shoes', 'NULL', 'Available'),
		('blouse', '0.2', 'party clothes', 'women', 'Available');


INSERT INTO Rentals (`customer_id`, `deposit_amount`, `rental_date`, `due_date`, `rental_status`)
VALUES (1, 100, '2020-10-12', '2020-10-24', 'Closed'),
		(1, 200, '2022-12-12', '2022-12-24', 'Closed'),
		(2, 300, '2025-10-12', '2025-10-24', 'Overdue'),
		(3, 150, '2025-10-12', '2025-12-24', 'Open');

INSERT INTO Rental_Items (`item_id`, `rental_id`, `item_due_date`, `item_returned_at`, `line_daily_rate`)
VALUES (1, 1, '2020-10-24', '2020-10-23', 0.5),
	   (2, 1, '2020-10-24', '2020-10-23', 0.5),
	   (3, 1, '2020-10-24', '2020-10-23', 0.5),
		(3, 2, '2022-12-24', '2020-12-23', 0.6),
		(4, 3, '2025-10-24', NULL, 0.2),
		(5, 4, '2025-12-24', NULL, 0.3);

INSERT INTO Payments (`rental_id`, `amount`, `card_brand`, `card_last4`, `paid_at`, `payment_status`, `transaction_number`)
VALUES (1, 300, 'Amex', '9867', '2020-10-23', 'Authorized', '346587'),
		(2, 200, 'Capital', '5413', '2022-12-23', 'Authorized', '346598'),
		(3, 100, 'American', '0078', '2025-10-23', 'Authorized', '398587'),
		(4, 110, 'American', '6500', '2025-10-12', 'Authorized', '567587');
