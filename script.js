/*  Project 01_11_02

    Author: Nathan Howard
    Date:   08.31.18

    Filename: script.js
*/

"use strict";

var httpRequest = false; //variable to hold http request
var entry = "^IXIC";

//formatting table function
function formatTable() {
    var rows = document.getElementsByTagName("tr")
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE089"
    }
}

//make or use the request object
function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    }
    catch {
        return false;
    }
    return httpRequest;
}

//stop the default submission from executing
function stopSubmission(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}
    
//function that will get the stock quote
function getQuote() {
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
    }
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", "StockCheck.php?t=" + entry, true);
    httpRequest.send(null);
    httpRequest.onreadystatechange = displayData;
}
    
//function to display the data
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        var stockItems = stockResults.split(/,|\"/)
        for (var i = stockItems.length - 1; i >= 0; i--) {
            if (stockItems[i] === "") {
                stockItems.splice(i, 1);
            }
        }
        document.getElementById("ticker").innerHTML = stockItems[0];
        document.getElementById("openingPrice").innerHTML = stockItems[6];
        document.getElementById("lastTrade").innerHTML = stockItems[1]
        document.getElementById("lastTradeDT").innerHTML = stockItems[2] + "," + stockItems[3];
        document.getElementById("change").innerHTML = stockItems[4];
        document.getElementById("range").innerHTML = (stockItems[8] * 1).toFixed(2) + "&ndash;" + (stockItems[7] * 1).toFixed(2);
        document.getElementById("volume").innerHTML = (stockItems[9] * 1).toLocaleString();
    }
}

//event handler creation
var form = document.getElementsByTagName("form")[0];    
if (form.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", getQuote, false);
} else if (window.attachEvent) {
    window.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", getQuote);
}