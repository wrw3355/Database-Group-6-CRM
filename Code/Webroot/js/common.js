
function populateMenu() {
    var menu = getEntitiesWithText();
    var list = $("#top-options");
    
    for(var text in menu) {
        var listItem = $("<li/>");
        
        var link = $("<a/>");
        link.attr("href", "entityList.html?entity=" + menu[text]);
        link.html(text);
        
        listItem.append(link);
        
        list.append(listItem);
        
    }
}

function getEntitiesWithText() {
    return {
        "Companies": "company",
        "Leads": "lead",
        "Opportunities": "opportunity",
        "Quotes": "quote",
        "Orders": "order",
        "Products": "product",
        "Currencies": "currency"
    };
}