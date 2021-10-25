// Require Dependencies
const express = require("express");
const fs = require("fs");
const path = require('path');

// Initialize express/ PORT
const app = express();
const PORT = process.env.PORT || 3000;

// Setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

//Require routes file
require('./routes/routes')(app);

// Port listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
}); 