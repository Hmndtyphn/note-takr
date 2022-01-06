// require file path
const path = require('path');

// require file sys for writing file to json
const fs = require("fs");

// require express
const express = require("express");

// express app middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// app PORT initialization
const app = express();
const PORT = process.env.PORT || 3000;


// pulls from the routes files
require('./routes/routes')(app);

// Port listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
}); 