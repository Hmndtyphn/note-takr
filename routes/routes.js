// dependencies for path, file
const path = require('path');
const fs = require('fs');


module.exports = app => {

    // variable for notes setup
    fs.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);
    
        // Get route for api/notes
        app.get("/api/notes", function(req, res) {
            res.json(notes);
        });

        // Post route for api/notes
        app.post("/api/notes", function(req, res) {
            let createNote = req.body;
            notes.push(createNote);
            updateDb();
            return console.log("Added new note: "+createNote.title);
        });

        // Get by ID
        app.get("/api/notes/:id", function(req,res) {
            res.json(notes[req.params.id]);
        });

        // Delete by ID
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id "+req.params.id);
        });

        // Notes Page (pulls from notes.html)
        app.get('/notes', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });
        
        // index page (pulls from index.html)
        app.get('*', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        //Update function (this updates the json file when adding or deleting a note)
        function updateDb() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

    });

}