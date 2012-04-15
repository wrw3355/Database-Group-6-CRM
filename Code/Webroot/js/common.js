
var idMatches = $.deparam.querystring( true );

var MODE_CREATE = "create";
var MODE_VIEW = "view";
var MODE_EDIT = "edit";
var MODE_DELETE = "delete";


function initEntityPage() {
    var entity = idMatches["entity"];
    var id = idMatches["id"];
    var mode = idMatches["mode"];
    
    populateEntityMenu();
    
    $("#header > h1").html(toTitleCase(mode) + " - " + toTitleCase(entity));
    
    
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
        var entity = idMatches["entity"];
        
        var createButton = $("<li/>");
        createButton.html("Create " + toTitleCase(entity));
        
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
            });
        });
        
        var deleteButton = $("<li/>");
        deleteButton.html("Delete");
        
        topNav.append(createButton);
        topNav.append(editButton);
        topNav.append(deleteButton);
    }
}

function populateEntityMenu() {
    var topNav = $("#top-nav > ul");
    var mode = idMatches["mode"];
    
    if (idMatches != null) {        
        var editButton = $("<li/>");
        editButton.html("Edit");
        
        var saveButton = $("<li/>");
        saveButton.html("Save");
        
        var deleteButton = $("<li/>");
        deleteButton.html("Delete");
        
        if (mode == MODE_VIEW) {
            topNav.append(editButton);
        }
        
        if (mode == MODE_EDIT) {
            topNav.append(saveButton);
        }
        
        if (mode == MODE_VIEW || mode == MODE_EDIT) {
            topNav.append(deleteButton);
        }
        
    }
}

function populateGrid() {
    var grid = $("#grid");
    var content = $("#content").prepend(pageHeader);
    
    if (typeof idMatches == "undefined" || idMatches == null) {
        alert("Error: Malformed request.");
        return;
    }
    
    var entity = idMatches["entity"];
    
    var pageName = getEntitiesWithText()[entity];
    var pageHeader = $("<h2/>");
    pageHeader.html(pageName);
    
    // Insert the top of the page header
    var headers = getHeadersForEntity(entity);
    var entities = getRecordsForEntity(entity);
    
    insertHeaderRow(headers, grid);
    
    // Insert an error row if there are no entities of this type
    if (typeof entities == "undefined" || entities == null || entities.length < 1) {
        var errorRow = $("<tr/>");
        errorRow.attr("class", "noEntries");
        
        var errorContent = $("<td COLSPAN=\"3\"/>");
        errorContent.html("There are no records to display for this entity.");
        
        errorRow.append(errorContent);
        
        grid.append(errorRow);
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
            content.html(entities[id][headers[key]]);
            
            content.click(function() {
                showModalEntityPage(entity, id, MODE_VIEW);
            });
            
            row.append(content);
        }
        
        
        grid.append(row);
        
        count = (count + 1) % 2;
    }
    
    
}

function showModalEntityPage(entity, id, mode) {
    var entityName = toTitleCase(entity);
    
    var pageURL = "entityPage.html?entity=" + entity + "&id=" + id + "&mode=" + mode;
    var pageTitle = "Entity - " + entityName;
    
    window.showModalDialog(pageURL, pageTitle, "dialogWidth: 840px; dialogHeight: 600px;");
}

function toTitleCase(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

function getHeadersForEntity(entity) {
    return {
        "Name": "name",
        "Date": "date"
    }
}

function insertHeaderRow(headers, grid) {
    var headerRow = $("<tr/>");
    headerRow.attr("id", "headerRow");
    
    var checkboxCol = $("<td/>");
    headerRow.append(checkboxCol)
    
    for (var text in headers) {
        
        var content = $("<td/>");
        content.html(text);
        
        headerRow.append(content);
    }
    
    grid.append(headerRow);
}

function getRecordsForEntity(entity) {
    var entities = {
        "company": {
            "1": {
                "name": "Test Company",
                "address": "123 Fake Street",
                "type": "Industrial",
                "email": "user@domain.com",
                "phone": "555-555-5555",
                "date": "1/1/2008"
            },
            
            "2": {
                "name": "XYZ Company",
                "address": "1 Main Street",
                "type": "Cooling Technologies",
                "email": "user@domain.com",
                "phone": "666-666-6666",
                "date": "1/1/2008"
            },
            
            "3": {
                "name": "Thermal Company",
                "address": "2 Main Street",
                "type": "Cooling Technologies",
                "email": "user@domain.com",
                "phone": "777-777-7777",
                "date": "1/1/2008"
            },
            
            "4": {
                "name": "Nanosoft",
                "address": "3 Main Street",
                "type": "Shovelware",
                "email": "user@domain.com",
                "phone": "777-777-7777",
                "date": "1/1/2008"
            },
            
            "5": {
                "name": "Random",
                "address": "4 Main Street",
                "type": "Random",
                "email": "user@domain.com",
                "phone": "888-888-8888",
                "date": "1/1/2008"
            }
        }
    };
    
    if (typeof entities[entity] == "undefined") {
        alert("This entity is not supported in this phase.");
        return null;
    }
    
    return entities[entity];
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