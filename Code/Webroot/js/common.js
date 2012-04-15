
var idRe = /.*\?entity=(.*)&?(.*)/;


function populateMenu() {
    var menu = getEntitiesWithText();
    var list = $("#top-options");
    
    for (var entity in menu) {
        var listItem = $("<li/>");
        
        var link = $("<a/>");
        link.attr("href", "entityList.html?entity=" + entity);
        link.html(menu[entity]);
        
        listItem.append(link);
        
        list.append(listItem);
        
    }
}

function populateGrid() {
    var grid = $("#grid");
    var content = $("#content").prepend(pageHeader);

    var idMatches = idRe.exec(window.location);
    
    if (typeof idMatches == "undefined" || idMatches == null) {
        alert("Error: Malformed request.");
        return;
    }
    
    var entity = idMatches[1];
    
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
        
        var errorContent = $("<td COLSPAN=\"2\"/>");
        errorContent.html("There are no records to display for this entity.");
        
        errorRow.append(errorContent);
        
        grid.append(errorRow);
    }
    
    var count = 0;
    for (var id in entities) {
        var row = $("<tr/>");
        row.attr("class", "row" + count);
        
        for (var key in headers) {
            var content = $("<td/>");
            content.html(entities[id][headers[key]]);
            
            row.append(content);
            
            row.click(function() {
                alert("Open modal dialog here.");
            });
        }
        
        grid.append(row);
        
        count = (count + 1) % 2;
    }
    
    
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