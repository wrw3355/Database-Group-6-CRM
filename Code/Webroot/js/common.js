
var idMatches = $.deparam.querystring( true );

var MODE_CREATE = "create";
var MODE_VIEW = "view";
var MODE_EDIT = "edit";
var MODE_DELETE = "delete";

var TYPE_TEXT = TYPE_TEXT;
var TYPE_DATE = TYPE_DATE;


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
    var entities = getRecordsForEntity(entity);
    
    for (var name in fields) {
        var element;

        if(fields[name] == TYPE_TEXT) {
            var label = $("<label/>");
            label.attr("for", name);
            label.html(toTitleCase(name) + ": ");
            
            if(mode == MODE_CREATE || mode == MODE_EDIT) {

                element = $("<input/>");
                element.attr("type", "text");
                element.attr("id", name);
                
                if(mode == MODE_EDIT) {
                    if(typeof entities[id] == "undefined" || entities[id] == null) {
                        alert("A record with the id '" + id + "' does not exist.");
                        return;
                    }
                    
                    var value = entities[id][name]["value"];
                    element.attr("value", value);
                }
            }
            else if(mode == MODE_VIEW) {                
                element = $("<div/>");
                element.attr("class", "attributeText");
                element.attr("id", name);
                
                if(typeof entities[id] == "undefined" || entities[id] == null) {
                    alert("A record with the id '" + id + "' does not exist.");
                    return;
                }
                
                var value = entities[id][name]["value"];
                element.html(value);
            }
        }
        
        var separator = $("<br/>");
        
        var clear = $("<span/>");
        clear.attr("class", "clear");
        
        entityForm.append(label);
        entityForm.append(element);
        entityForm.append(clear);
        entityForm.append(separator);
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
        var entity = idMatches["entity"];
        
        var createButton = $("<li/>");
        createButton.html("Create " + toTitleCase(entity));
        createButton.click(function() {
            showModalEntityPage(entity, null, MODE_CREATE);
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
                });
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
    var entity = idMatches["entity"];
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
            if(mode == MODE_CREATE) {
                // TODO: Commit to database, get an id back
            }
            else if(mode == MODE_EDIT) {
                // TODO: Commit to database
                window.location = "entityPage.html?id=" + id + "&entity=" + entity + "&mode=view";
            }
        });
        
        var deleteButton = $("<li/>");
        deleteButton.html("Delete");
        deleteButton.click(function() {
            if(confirm("Are you sure you want to delete this record?")) {
                // TODO: Delete from database
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
            content.attr("id", id);
            content.html(entities[id][headers[key]]["value"]);
            
            content.click(function() {
                // Issue with JavaScript closures
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

function getSchemaForEntity(entity) {
    var schema = {
        "company": {
            "name": TYPE_TEXT,
            "address": TYPE_TEXT,
            "type": TYPE_TEXT,
            "email": TYPE_TEXT,
            "phone": TYPE_TEXT
        }
    }
    
    if (typeof schema[entity] == "undefined") {
        alert("This entity is not supported in this phase.");
        return null;
    }
    
    return schema[entity];
}

function getRecordsForEntity(entity) {
    var entities = {
        "company": {
            "1": {
                "name": {
                    "value": "Test Company",
                    "type": TYPE_TEXT
                },
                "address": {
                    "value": "123 Fake Street",
                    "type": TYPE_TEXT
                },
                "type": {
                    "value": "Industrial",
                    "type": TYPE_TEXT
                },
                "email": {
                    "value": "user@domain.com",
                    "type": TYPE_TEXT
                },
                "phone":  {
                    "value": "555-555-5555",
                    "type": TYPE_TEXT
                },
                "date": {
                    "value": "1/1/2008",
                    "type": TYPE_DATE,
                    "noedit": true
                }
            },
            "2": {
                "name": {
                    "value": "XYZ Company",
                    "type": TYPE_TEXT
                },
                "address": {
                    "value": "123 Fake Street",
                    "type": TYPE_TEXT
                },
                "type": {
                    "value": "Industrial",
                    "type": TYPE_TEXT
                },
                "email": {
                    "value": "user@domain.com",
                    "type": TYPE_TEXT
                },
                "phone":  {
                    "value": "555-555-5555",
                    "type": TYPE_TEXT
                },
                "date": {
                    "value": "1/1/2008",
                    "type": TYPE_DATE,
                    "noedit": true
                }
            },
            "3": {
                "name": {
                    "value": "Thermal Company",
                    "type": TYPE_TEXT
                },
                "address": {
                    "value": "123 Fake Street",
                    "type": TYPE_TEXT
                },
                "type": {
                    "value": "Cooling Technology",
                    "type": TYPE_TEXT
                },
                "email": {
                    "value": "user@domain.com",
                    "type": TYPE_TEXT
                },
                "phone":  {
                    "value": "555-555-5555",
                    "type": TYPE_TEXT
                },
                "date": {
                    "value": "1/1/2008",
                    "type": TYPE_DATE,
                    "noedit": true
                }
            },
            "4": {
                "name": {
                    "value": "Nanosoft",
                    "type": TYPE_TEXT
                },
                "address": {
                    "value": "123 Fake Street",
                    "type": TYPE_TEXT
                },
                "type": {
                    "value": "Industrial",
                    "type": TYPE_TEXT
                },
                "email": {
                    "value": "user@domain.com",
                    "type": TYPE_TEXT
                },
                "phone":  {
                    "value": "555-555-5555",
                    "type": TYPE_TEXT
                },
                "date": {
                    "value": "1/1/2008",
                    "type": TYPE_DATE,
                    "noedit": true
                }
            },
            "5": {
                "name": {
                    "value": "Random",
                    "type": TYPE_TEXT
                },
                "address": {
                    "value": "123 Fake Street",
                    "type": TYPE_TEXT
                },
                "type": {
                    "value": "Random",
                    "type": TYPE_TEXT
                },
                "email": {
                    "value": "user@domain.com",
                    "type": TYPE_TEXT
                },
                "phone":  {
                    "value": "555-555-5555",
                    "type": TYPE_TEXT
                },
                "date": {
                    "value": "1/1/2008",
                    "type": TYPE_DATE,
                    "noedit": true
                }
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