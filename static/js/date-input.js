// handling the option to select a date
// only allow days from the next day and onwards

var dateInput = document.getElementById("datepicker");

var today = new Date();
today.setDate(today.getDate() + 1);
var nextDay = today.toISOString().split("T")[0];

dateInput.setAttribute("min", nextDay);
