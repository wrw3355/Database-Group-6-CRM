
var idMatches = $.deparam.querystring( true );

var MODE_CREATE = "create";
var MODE_VIEW = "view";
var MODE_EDIT = "edit";
var MODE_DELETE = "delete";

var TYPE_TEXT = "varchar";
var TYPE_DOUBLE = "double";
var TYPE_DATE = "date";
var TYPE_BOOLEAN = "tinyint";


function initEntityPage() {
    var entity = idMatches["entity"];
    var mode = idMatches["mode"];
    
    populateEntityMenu();
    
    $("#header > h1").html(toTitleCase(mode) + " - " + toTitleCase(entity));
    
    populateEntityPage();
}

function populateEntityPage() {
    var entityForm = $("#entity");
    var entity = idMatches["entity"];
    var id = idMatches["id"];
    var mode = idMatches["mode"];
    
    var fields = getSchemaForEntity(entity);
    
    var entities = {};
    if (mode != MODE_CREATE) {
    	entities = getRecordForEntity(toTitleCase(entity), id);
    }
    
    for (name in fields) {
        var element = "";
        var label = $("<label/>");
        if (fields[name] == TYPE_TEXT || fields[name] == TYPE_DATE 
        		|| fields[name] == TYPE_DOUBLE) {
            label.attr("for", name);
            label.html(toTitleCase(name).replace("_", " ") + ": ");
            
            if(mode == MODE_CREATE || mode == MODE_EDIT) {

                element = $("<input/>");
                element.attr("type", "text");
                element.attr("id", name);
                
                if (mode == MODE_EDIT) {
                    if (typeof entities == "undefined" || entities == null) {
                        alert("A record with the id '" + id + "' does not exist.");
                        return;
                    }
                    
                    var value = entities[name];
                    element.attr("value", value);
                }
            }
            else if (mode == MODE_VIEW) {
                element = $("<div/>");
                element.attr("class", "attributeText");
                element.attr("id", name);
                
                if(typeof entities == "undefined" || entities == null) {
                    alert("A record with the id '" + id + "' does not exist.");
                    return;
                }
                
                var value = entities[name];
                element.html(value);
            }
        }
        else if (fields[name] == TYPE_BOOLEAN) {
        	label.attr("for", name);
            label.html(toTitleCase(name) + ": ");
            
            element = $("<div/>");
            element.attr("class", "checkboxContainer");
            
            var box = $("<input/>");
            box.attr("type", "checkbox");
            box.attr("id", name);
            
            if(mode == MODE_EDIT) {
                if(typeof entities == "undefined" || entities == null) {
                    alert("A record with the id '" + id + "' does not exist.");
                    return;
                }
            }
            
            var value = entities[name];
        	box.attr("checked", value == "1"); 
            
            if(mode == MODE_VIEW) {
            	box.attr("disabled", true);
            }
            
            element.append(box);
        }
        
        var separator = $("<br/>");
        
        var clear = $("<span/>");
        clear.attr("class", "clear");
        
        entityForm.append(label);
        entityForm.append(element);
        entityForm.append(clear);
        entityForm.append(separator);
    }
    
    if (entity == "Lead") {
    	insertExternalReference("company", entity, id, mode == MODE_CREATE);
    }
    else if (entity == "Opportunity") {
    	insertExternalReference("lead", entity, id, mode == MODE_CREATE);
    }
    else if (entity == "Quote") {
    	insertExternalReference("opportunity", entity, id, mode == MODE_CREATE);
    	insertProductTable(id);
    }
    else if (entity == "Order") {
    	insertExternalReference("quote", entity, id, mode == MODE_CREATE);
    }
    
    if ($("#external").length > 0) {
    	if (mode == MODE_VIEW) {
    		$("#external").attr("disabled", true);
    	}
    }
    	
}

function populateMenu() {

    var menu = getEntitiesWithText();
    var list = $("#top-options");
    
    // Side menu    
    for (var entity in menu) {
        var listItem = $("<li/>");
        
        var link = $("<a/>");
        link.attr("href", "entityList.html?entity=" + entity);
        link.html(menu[entity]);
        
        listItem.append(link);
        
        list.append(listItem);
    }
        
    var topNav = $("#top-nav > ul");

    if (idMatches != null) {
        var entity = toTitleCase(idMatches["entity"]);
        
        var createButton = $("<li/>");
        createButton.html("Create " + toTitleCase(entity));
        createButton.click(function() {
            showModalEntityPage(entity, null, MODE_CREATE);
            location.reload(true);
        });
        
        var editButton = $("<li/>");
        editButton.html("Edit");
        editButton.click(function() {
            var checkboxes = $("input[type=checkbox]:checked");
            
            if (checkboxes.length < 1) {
                alert("You have not selected any records to edit.");
                return;
            }
            
            checkboxes.each(function() {
                showModalEntityPage(entity, this.value, MODE_EDIT);
                location.reload(true);
            });
        });
        
        var deleteButton = $("<li/>");
        deleteButton.html("Delete");
        deleteButton.click(function() {
            var checkboxes = $("input[type=checkbox]:checked");
            
            if (checkboxes.length < 1) {
                alert("You have not selected any records to delete.");
                return;
            }
            
            if(confirm("Are you sure you want to delete the selected records?")) {
                checkboxes.each(function() {
                    // TODO: Delete from database
                	deleteEntity(entity, this.value);
                });
                location.reload(true);
            }
            else {
                return;
            }
        });
        
        topNav.append(createButton);
        topNav.append(editButton);
        topNav.append(deleteButton);
    }
}

function populateEntityMenu() {
    var topNav = $("#top-nav > ul");
    var id = idMatches["id"];
    var entity = toTitleCase(idMatches["entity"]);
    var mode = idMatches["mode"];
    
    if (idMatches != null) {        
        var editButton = $("<li/>");
        editButton.html("Edit");
        editButton.click(function() {
            window.location = "entityPage.html?id=" + id + "&entity=" + entity + "&mode=edit";
        });
        
        var saveButton = $("<li/>");
        saveButton.html("Save");
        saveButton.click(function() {
        	if(!validateForm()) {
        		alert("All fields are required.");
        		return;
        	}
        	
        	var jsonRecordString = getJSONFromForm();
        	
            if(mode == MODE_CREATE) {                
                id = createEntity(entity, jsonRecordString);
            }
            else if(mode == MODE_EDIT) {
            	updateEntity(entity, jsonRecordString, id);
            }
            
            if($("#external").length > 0) {
            	handleExternalReference(entity, id, $("#external").attr("value"), mode == MODE_CREATE);
            }
            
            window.location = "entityPage.html?id=" + id + "&entity=" + entity + "&mode=view";
        });
        
        var deleteButton = $("<li/>");
        deleteButton.html("Delete");
        deleteButton.click(function() {
            if(confirm("Are you sure you want to delete this record?")) {
                // TODO: Delete from database
            	deleteEntity(entity, id);
            	
                window.close();
            }
            else {
                return;
            }
        });
        
        if (mode == MODE_VIEW) {
            topNav.append(editButton);
        }
        
        if (mode == MODE_CREATE || mode == MODE_EDIT) {
            topNav.append(saveButton);
        }
        
        if (mode == MODE_VIEW || mode == MODE_EDIT) {
            topNav.append(deleteButton);
        }
        
    }
}

function insertProductTable(quoteId) {
	var products = getRecordForEntity("quote_consists_of", quoteId);
	var entity = $("#entity");
	var productTable = generateProductTable(products);
	
	var productTableHeader = $("<h2/>");
	productTableHeader.html("Products");
	
	entity.append(productTableHeader);
	entity.append(productTable);
	
	insertExternalReference("product", "quote", quoteId, false, "productSelect", "Add a product: ");
	
	var quantityLabel = $("<label/>");
	quantityLabel.attr("for", "quantity");
	quantityLabel.attr("id", "quantityLabel")
	quantityLabel.html("Quantity: ");
	
	var quantity = $("<input/>");
	quantity.attr("type", "text");
	quantity.attr("id", "quantity");
	quantity.attr("name", "quantity");
	quantity.attr("value", "0");
	
	var addButton = $("<input/>");
	addButton.attr("type", "button");
	addButton.attr("id", "addProduct");
	addButton.attr("name", "addProduct");
	addButton.attr("value", "Add product");
	
	entity.append(quantityLabel);
	entity.append(quantity);
	entity.append(addButton);
	
	if ($("#productSelect option").size() <= 0) {
		$("#productSelect").attr("disabled", true);
		quantity.attr("disabled", true);
		addButton.attr("disabled", true);
	}
}

function generateProductTable(products) {
	var table = $("<table/>");
    table.attr("id", "products");
    
    var headers = {
    		"Name": "name",
    		"Quantity": "quantity"
    };
    
    insertHeaderRow(headers, table);
    
    // Insert an error row if there are no entities of this type
    if (typeof entities == "undefined" || entities == null || $.isEmptyObject(entities)) {
        table.append(generateErrorRow());
        return table;
    }
    
    var count = 0;
    for (var id in products) {
        var row = $("<tr/>");
        row.attr("class", "row" + count);
        
        var deleteCol = $("<td/>");
        deleteCol.attr("class", "checkboxContainer");
        
        var deleteButton = $("<input/>");
        deleteButton.attr("value", "Delete");
        deleteButton.attr("id", id);
        deleteButton.attr("type", "button");
        deleteCol.append(checkbox);
        deleteCol.append(checkboxCol);
        
        for (var key in headers) {
            var content = $("<td/>");
            content.attr("id", id);
            
            content.html(entities[id][headers[key]]/*["value"]*/);
            
            row.append(content);
        }
        
        
        table.append(row);
        
        count = (count + 1) % 2;
    }
    
    return table;
}

function generateErrorRow() {
	var errorRow = $("<tr/>");
    errorRow.attr("class", "noEntries");
    
    var errorContent = $("<td COLSPAN=\"3\"/>");
    errorContent.html("There are no records to display for this entity.");
    
    errorRow.append(errorContent);
    
    return errorRow;
}

function populateGrid() {
    var grid = $("#grid");
    var content = $("#content");
    
    if (typeof idMatches == "undefined" || idMatches == null) {
        alert("Error: Malformed request.");
        return;
    }
    
    var entity = toTitleCase(idMatches["entity"]);
    
    var pageName = getEntitiesWithText()[entity];
    var pageHeader = $("<h2/>");
    pageHeader.html(toTitleCase(entity));
    
    content.prepend(pageHeader);
    
    // Insert the top of the page header
    var headers = getHeadersForEntity(entity);
    var entities = getRecordForEntity(toTitleCase(entity), "");
    
    insertHeaderRow(headers, grid);
    
    // Insert an error row if there are no entities of this type
    if (typeof entities == "undefined" || entities == null || $.isEmptyObject(entities)) {
        grid.append(generateErrorRow());
        return;
    }
    
    var count = 0;
    for (var id in entities) {
        var row = $("<tr/>");
        row.attr("class", "row" + count);
        
        var checkboxCol = $("<td/>");
        checkboxCol.attr("class", "checkboxContainer");
        
        var checkbox = $("<input/>");
        checkbox.attr("value", id);
        checkbox.attr("id", id);
        checkbox.attr("type", "checkbox");
        
        checkboxCol.append(checkbox);
        row.append(checkboxCol);
        
        for (var key in headers) {
            var content = $("<td/>");
            content.attr("id", id);
            
            content.html(entities[id][headers[key]]/*["value"]*/);
            
            content.click(function() {
                // Issue with JavaScript closures
            	location.reload(true);
                return showModalEntityPage(entity, this.id, MODE_VIEW);
           });
            
            row.append(content);
        }
        
        
        grid.append(row);
        
        count = (count + 1) % 2;
    }
}

function showModalEntityPage(entity, id, mode) {
    var entityName = toTitleCase(entity);
    
    var pageURL = [];
    pageURL.push("entityPage.html?");
    pageURL.push("entity=" + entity);
    pageURL.push("&mode=" + mode);
    
    if(mode != MODE_CREATE) {
        pageURL.push("&id=" + id);
    }
    var pageTitle = "Entity - " + entityName;
    
    window.showModalDialog(pageURL.join(""), pageTitle, "dialogWidth: 840px; dialogHeight: 600px;");
}

function toTitleCase(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

function getHeadersForEntity(entity) {
	var schema = getSchemaForEntity(entity);
	
	if ("name" in schema) {
	    return {
	        "Name": "name"
	    };
	}
	else {
		return {
			"Description": "description"
		};
	}
}

function generateSQLCurrentDate() {
	var currentTime = new Date();
	
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	
	return year + "-" + month + "-" + day;
}

function getExternalReference(entityName, id) {
	var entity = entityName.toLowerCase();
	
	var tableName = "";
	
	if (entity == "lead") {
    	tableName = "company_gets";
    }
    else if (entity == "opportunity") {
    	tableName = "lead_becomes";
    }
    else if (entity == "quote") {
    	tableName = "opportunity_requests";
    }
    else if (entity == "order") {
    	tableName = "quote_becomes";
    }
	
	var json = {};
	json[entity + "_id"] = id;
	
	return getRecordForEntity(tableName, id);
}

function handleExternalReference(entityName, id, externalId, create) {
	
	var entity = entityName.toLowerCase();
	var tableName = "";
	var externalEntity = "";
	
	if (entity == "lead") {
		externalEntity = "company";
    	tableName = "company_gets";
    }
    else if (entity == "opportunity") {
    	externalEntity = "lead";
    	tableName = "lead_becomes";
    }
    else if (entity == "quote") {
    	externalEntity = "opportunity";
    	tableName = "opportunity_requests";
    }
    else if (entity == "order") {
    	externalEntity = "quote";
    	tableName = "quote_becomes";
    }
	
	var sqlDate = generateSQLCurrentDate();
	
	var json = {};
	
	if (create) {
		json[entity + "_id"] = id;
		json[externalEntity + "_id"] = externalId;
		json["create_date"] = sqlDate;
		
		createEntity(tableName, JSON.stringify(json));
	}
	else {
		var external = getExternalReference(entity, id);
		json[entity + "_id"] = id;
		json[externalEntity + "_id"] = $("#external").attr("value");
		json["id"] = external["id"];
		
		updateEntity(tableName, JSON.stringify(json), external["id"]);
	}
}

function insertExternalReference(externalEntity, entity, entityid, create, selectId, labelText) {
	var entities = getRecordForEntity(toTitleCase(externalEntity), "");
	
	var select = $("<select/>");
	
	if (typeof selectId == "undefined" || selectId == null) {
		selectId = "external";
	}
	
	if (typeof labelText == "undefined" || labelText == null) {
		labelText = toTitleCase(externalEntity) + ": ";
	}
	
	select.attr("id", selectId);
	
	for(id in entities) {
		var option = $("<option/>");
		
		if("name" in entities[id]) {
			option.html(entities[id]["name"]);
			option.attr("value", id); 
		}
		else {
			option.html(entities[id]["description"]);
			option.attr("value", id);
		}
		
		select.append(option);
	}
	
	var label = $("<label/>");
	label.attr("for", "external");
	label.html(labelText);

	$("#entity").append(label);
	$("#entity").append(select);
	
	if (!create) {
		var external = getExternalReference(entity, entityid);
		select.attr("value", external[externalEntity + "_id"]);
	}
}

function validateForm() {
	var inputs = $("#entity > input[type='text']");
	var valid = true;
    inputs.each(function() {
    	if($.trim(this.value) == "") {
    		var label = $("#entity > label[for='" + this.id + "']");
    		label.css("color", "#FF0000");
    		$(this).css("border", "1px solid #FF0000");
    		
    		valid = false;
    	}
    	else {
    		var label = $("#entity > label[for='" + this.id + "']");
    		label.css("color", "#000");
    		$(this).css("border", "1px solid #000");
    	}
    });
    
    return valid;
}

function getJSONFromForm() {
	var inputs = $("input");
    var record = {};
    inputs.each(function() {
    	if (this.type == "checkbox") {
    		record[this.id] = this.checked;
    	}
    	else {
    		record[this.id] = this.value;
    	}
    });
    
    return JSON.stringify(record);
}

function insertHeaderRow(headers, grid) {
    var headerRow = $("<tr/>");
    headerRow.attr("id", "headerRow");
    
    var checkboxCol = $("<td/>");
    headerRow.append(checkboxCol);
    
    for (var text in headers) {
        
        var content = $("<td/>");
        content.html(text);
        
        headerRow.append(content);
    }
    
    grid.append(headerRow);
}

function getSchemaForEntity(entity) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/DatabaseConceptsServer/rest/Schema/" + toTitleCase(entity), 
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    
    if (typeof result == "undefined") {
        alert("This entity is not supported in this phase.");
        return null;
    }
    
    return result;
}

function createEntity(entity, json) {
	var result = "";
	$.ajax({
        type: "POST",
        url: "http://localhost:8080/DatabaseConceptsServer/rest/" + entity,
        data: json,
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        dataType:"json",
        async: false,
        success: function(data) {
        	result = data.id;
        }
    });
	return result;
}

function updateEntity(entity, json, id) {
	$.ajax({
        type: "PUT",
        url: "http://localhost:8080/DatabaseConceptsServer/rest/" + entity + "/" + id,
        data: json,
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        dataType:"json",
        async: false,
        success: function(data) {
        }
    });
}

function deleteEntity(entity, id) {
	$.ajax({
        type: "DELETE",
        url: "http://localhost:8080/DatabaseConceptsServer/rest/" + entity + "/" + id,
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        dataType:"json",
        async: false,
        success: function(data) {
        	return;
        }
    });
}

function getRecordForEntity(entity, id) {
    var result;
    $.ajax({
        url: "http://localhost:8080/DatabaseConceptsServer/rest/" + entity + "/" + id, 
        type: "GET",
        async: false,
        success: function(data) {
            result = data;
        }
    });
    
    if (typeof result == "undefined") {
        alert("This entity is not supported in this phase.");
        return null;
    }
    
    return result;
}

function getEntitiesWithText() {
    return {
        "company": "Companies",
        "lead": "Leads",
        "opportunity": "Opportunities",
        "quote": "Quotes",
        "order": "Orders",
        "product": "Products",
        "currency": "Currencies"
    };
}