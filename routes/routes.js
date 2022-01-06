// dependencies for path, file
const path = require('path');
const fs = require('fs');

// exports app
module.exports = app => {

    // variable for notes setup
    fs.readFile("db/db.json","utf8", (err, data) => {

        // if err throw err
        if (err) throw err;
        
        // console log error
        console.log(err);

        // parses notes data
        const notes = JSON.parse(data);
    
        // Get route for api/notes
        app.get("/api/notes", function(req, res) {
            res.json(notes);
        });

        // Post route for api/notes
        app.post("/api/notes", function(req, res) {
            let newNote = req.body;
            notes.push(newNote);
            dbUpdate();
            return console.log("Added new note: "+newNote.title);
        });

        // Get by ID
        app.get("/api/notes/:id", function(req,res) {
            res.json(notes[req.params.id]);
        });

        // Delete by ID
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            dbUpdate();
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
        function dbUpdate() {

            // writes file to json
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {

                // throws error
                if (err) throw err;

                // console logs the error.
                console.log(err);

                // return data to note if no issues
                return true;
            });
        }

    });

}