DROP TRIGGER IF EXISTS deleteLead;
DROP TRIGGER IF EXISTS deleteOpportunity;
DROP TRIGGER IF EXISTS deleteQuote;
DROP TRIGGER IF EXISTS deleteOrder;

DELIMITER //

CREATE TRIGGER deleteLead AFTER DELETE ON Company FOR EACH ROW
BEGIN
   DELETE FROM Lead WHERE Lead.id IN (SELECT lead_id FROM company_gets WHERE company_id = OLD.id);
END//

CREATE TRIGGER deleteOpportunity AFTER DELETE ON Lead FOR EACH ROW
BEGIN
   DELETE FROM Opportunity WHERE Opportunity.id IN (SELECT opportunity_id FROM lead_becomes WHERE lead_id = OLD.id);
END//

CREATE TRIGGER deleteQuote AFTER DELETE ON Opportunity FOR EACH ROW
BEGIN
   DELETE FROM Quote WHERE Quote.id IN (SELECT quote_id FROM opportunity_requests WHERE opportunity_id = OLD.id);
END//

CREATE TRIGGER deleteOrder AFTER DELETE ON Quote FOR EACH ROW
BEGIN
   DELETE FROM Order WHERE Order.id IN (SELECT order_id FROM quote_becomes WHERE quote_id = OLD.id);
END//
DELIMITER ;