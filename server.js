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
    "user" : "rayos",
    "password" : "rayos",
    "connectString": "localhost/orcl"
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

/*app.get('/cantidad', function (req,res) {
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
        connection.execute("SELECT * FROM " + , {}, {
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
});*/

app.delete('/eliminar/:table/:id', async function(req, res) {
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

        console.log(req.body.key);

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

        console.log(req.body.updateObj);
        console.log(req.body.key);

        var keys = Object.keys(updateObj);
        var query = `UPDATE ${table} SET`;

        for(let i = 1; i < keys.length; i++){
            if(isNaN(updateObj[keys[i]]))
                query += ` ${keys[i]} = '${updateObj[keys[i]]}'`;
            else{
                let valor = Number(updateObj[keys[i]]);
                query += ` ${keys[i]} = ${valor}`;
            }
            
            if((i+1)!=keys.length){
                query += ',';
            }
        }

        if(keyType=='number'){
            id = Number(id);
            query += ` WHERE ${keys[0]} = ${id}`;
        }
        else
            query += ` WHERE ${keys[0]} = '${id}'`

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
                res.send(JSON.stringify('Se actualizó el registro con ID: '+result.lastRowid));
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

app.post('/:table/create', async function(req, res) {
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

        const table = req.params.table;
        const key = String(req.body.key);
        const keyType = req.body.keyType;
        const createObj = req.body.createObj;

        var keys = Object.keys(createObj);
        var query = `INSERT INTO ${table} VALUES(`;

        for(let i = 0; i < keys.length; i++){
            if(isNaN(createObj[keys[i]]))
                query += `'${createObj[keys[i]]}'`;
            else{
                let valor = Number(createObj[keys[i]]);
                query += `${valor}`;
            }
            
            if((i+1)!=keys.length){
                query += ',';
            }
        }
        query += ')';

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
                res.send(JSON.stringify('Se creó el registro con ID: '+result.lastRowid));
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