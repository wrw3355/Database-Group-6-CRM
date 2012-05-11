CREATE VIEW `CompanyView` AS
SELECT name FROM `Company`;

CREATE VIEW `LeadView` AS
SELECT name, create_date FROM `Company` JOIN `company_gets`;

CREATE VIEW `OpportunityView` AS
SELECT description, create_date FROM `Opportunity` JOIN `lead_becomes`;

CREATE VIEW `QuoteView` AS
SELECT description, create_date FROM `Quote` JOIN `opportunity_requests`;

CREATE VIEW `ProductView` AS
SELECT description, price FROM `Quote`;

CREATE VIEW `OrderView` AS
SELECT description, create_date FROM `Quote` JOIN `quote_becomes`;

CREATE VIEW `Currency` AS
SELECT description, ISO_code FROM `Currency`;
