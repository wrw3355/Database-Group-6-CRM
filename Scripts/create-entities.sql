/* Entities */
CREATE TABLE `Company` (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    company_type varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Lead` (
    id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    source varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Opportunity` (
    id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    win_percentage double NOT NULL,
    close_reason varchar(255) NOT NULL,
    open_date date NOT NULL,
    close_date date NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Quote` (
    id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    ship_from_address varchar(255) NOT NULL,
    discount double NOT NULL,
    tax double NOT NULL,
    open_date date NOT NULL,
    close_date date NOT NULL,
    total_price double NOT NULL,
    ship_type varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Product` (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    product_type varchar(255) NOT NULL,
    price double NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Order` (
    id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    ship_from_address varchar(255) NOT NULL,
    ship_type varchar(255) NOT NULL,
    close_type date NOT NULL,
    total_price double NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Currency` (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    isPrimary int(1) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE `Product` (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    product_type varchar(255) NOT NULL,
    price double NOT NULL,
    PRIMARY KEY (id)
);