var express = require("express");
var app = express();
var bodyparser = require('body-parser');
var oracledb = require('oracledb');
const cors = require("cors");

// ?? Attaching routing to app server

var corsOptions = {
    origin: "http://localhost:4200/index.html"
}

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(cors());

var connAttrs = {
    "user" : "maldini",
    "password" : "acmilan",
    "connectString": "localhost/xe"
}

//Consulta normal
app.get('/consulta', function (req, res) {
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
        connection.execute("SELECT * FROM " + req.query.tabla, {}, {
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

app.delete('/:table/eliminar/:id', async function(req, res) {
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

        var id = req.params.id;
        const table = req.params.table;
        const key = String(req.body.key);
        const keyType = req.body.keyType;
        var query = '';

        if(keyType=='number'){
            id = Number(id);
            query = `DELETE FROM ${table} WHERE ${key}=${id}`;
        }
        else
            query = `DELETE FROM ${table} WHERE ${key}='${id}'`;

        console.log(`Ejecutando: ${query}`);

        connection.execute(query, {}, {
            outFormat: oracledb.OBJECT, // Return the result as Object
            autoCommit: true  //Para que la eliminación se efectúe correctamente
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
                res.send(JSON.stringify('Se eliminó el registro con ID: '+result.lastRowid));
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

app.put('/:table/actualizar/:id', async function(req, res) {
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

        var id = req.params.id;
        const table = req.params.table;
        const key = String(req.body.key);
        const keyType = req.body.keyType;
        const updateObj = req.body.updateObj;
        var query = '';

        if(keyType=='number'){
            id = Number(id);
        }

        switch(table){
            case 'sucursal':
                var id_sucursal = req.body.
                // query = `UPDATE almacen SET id_sucursal=${}`
            break;
        }

        console.log(`Ejecutando: ${query}`);

        connection.execute(query, {}, {
            outFormat: oracledb.OBJECT, // Return the result as Object
            autoCommit: true  //Para que la eliminación se efectúe correctamente
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
                res.send(JSON.stringify('Se eliminó el registro con ID: '+result.lastRowid));
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

app.listen(4201,'localhost',function(){
    console.log("Server escuchando en el puerto 4201");
})