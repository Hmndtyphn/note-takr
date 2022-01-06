// require all dependencies 
const path = require('path');
const fs = require("fs");

// require express
const express = require("express");

// app PORT initialization
const app = express();
const PORT = process.env.PORT || 3000;

// express app middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// pulls from the routes files
require('./routes/routes')(app);

// Port listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
}); 