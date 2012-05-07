/* Relationships */
CREATE TABLE `company_quoted` (
    id int NOT NULL AUTO_INCREMENT,
    company_id int NOT NULL,
    quote_id int NOT NULL,
    ship_to_address varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (company_id) REFERENCES Company(id),
    FOREIGN KEY (quote_id) REFERENCES Quote(id)
);

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
    FOREIGN KEY (lead_id) REFERENCES "Lead"(id),
    FOREIGN KEY (opportunity_id) REFERENCES "Opportunity"(id)
);

CREATE TABLE `opportunity_requests` (
    id int NOT NULL AUTO_INCREMENT,
    opportunity_id int NOT NULL,
    quote_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (opportunity_id) REFERENCES "Opportunity"(id),
    FOREIGN KEY (quote_id) REFERENCES "Quote"(id)
);

CREATE TABLE `quote_consists_of` (
    id int NOT NULL AUTO_INCREMENT,
    quote_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES "Quote"(id),
    FOREIGN KEY (product_id) REFERENCES "Product"(id)
);

CREATE TABLE `quote_becomes` (
    id int NOT NULL AUTO_INCREMENT,
    quote_id int NOT NULL,
    order_id int NOT NULL,
    create_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES "Quote"(id),
    FOREIGN KEY (order_id) REFERENCES "Order"(id)
);

CREATE TABLE `quote_priced_with` (
    id int NOT NULL AUTO_INCREMENT,
    quote_id int NOT NULL,
    currency_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES "Quote"(id),
    FOREIGN KEY (currency_id) REFERENCES "Currency"(id)
);

CREATE TABLE `order_priced_with` (
    id int NOT NULL AUTO_INCREMENT,
    order_id int NOT NULL,
    currency_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES "Order"(id),
    FOREIGN KEY (currency_id) REFERENCES "Currency"(id)
);

CREATE TABLE `currency_converts_to` (
    id int NOT NULL AUTO_INCREMENT,
    from_currency_id int NOT NULL,
    to_currency_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (from_currency_id) REFERENCES "Currency"(id),
    FOREIGN KEY (to_currency_id) REFERENCES "Currency"(id)
);