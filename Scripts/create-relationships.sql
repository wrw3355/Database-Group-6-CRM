/* Relationships */
CREATE TABLE `company_gets` (
    id int NOT NULL AUTO_INCREMENT,
    company_id int NOT NULL,
    lead_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (company_id) REFERENCES Company(id),
    FOREIGN KEY (lead_id) REFERENCES Lead(id)
);

CREATE TABLE `lead_becomes` (
    id int NOT NULL AUTO_INCREMENT,
    lead_id int NOT NULL,
    opportunity_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (lead_id) REFERENCES `Lead`(id),
    FOREIGN KEY (opportunity_id) REFERENCES `Opportunity`(id)
);

CREATE TABLE `opportunity_requests` (
    id int NOT NULL AUTO_INCREMENT,
    opportunity_id int NOT NULL,
    quote_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (opportunity_id) REFERENCES `Opportunity`(id),
    FOREIGN KEY (quote_id) REFERENCES `Quote`(id)
);

CREATE TABLE `quote_consists_of` (
    id int NOT NULL AUTO_INCREMENT,
    quote_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES `Quote`(id),
    FOREIGN KEY (product_id) REFERENCES `Product`(id)
);

CREATE TABLE `quote_becomes` (
    id int NOT NULL AUTO_INCREMENT,
    quote_id int NOT NULL,
    order_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES `Quote`(id),
    FOREIGN KEY (order_id) REFERENCES `Order`(id)
);
