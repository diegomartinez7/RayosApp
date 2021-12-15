var express = require("express");
var app = express();
var bodyparser = require('body-parser');
var oracledb = require('oracledb');

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}));

var connAttrs = {
    "user" : "rayos",
    "password" : "rayos",
    "connectString": "localhost/orcl"
}


//Consulta normal
app.get('/proyecto', function (req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("SELECT * FROM equipo", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the dba_tablespaces",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
				
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /sendTablespace : Connection released");
                    }
            });
        });
    });
});


//Consulta procedure
app.get('/procedure', async function (req, res) {
    "use strict";
    oracledb.getConnection(connAttrs, async function (err, connection) {
        
         if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        try {
        const result = await connection.execute("BEGIN tot_lib('2', :ret); END;", {ret: { dir: oracledb.BIND_OUT,
        type: oracledb.STRING, maxSize: 40 }});// Return the result as Object  
        console.log(result.outBinds);
        res.send([{Libros: result.outBinds}]);
    } catch (err) {

    }
    });
});

app.listen(4201,'localhost',function(){
    console.log("Server escuchando en el puerto 4201");
})