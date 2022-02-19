const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harshita',
    database: 'medicalmgm'
});


connection.connect((err) => {
    if (err) { console.log("DB Connection Failed."); return }

    // Initializing Express Server
    const app = express();
    app.use(cors({
        origin: "*",
    }));


    //Routes/Apis
    app.use("/readFile", async (req, res) => {
        res.end(await fs.readFileSync("./data.json"))
    });


    // display
    app.get("/medicalmgm", (req, res) => {
        connection.query("SELECT * FROM player;", (err, results, fields) => {
            if (err) return res.json({ error: err.message })
            res.json(results)
        })
    })

    // search
    app.get("/medicalmgm/:pid", (req, res) => {
        if (!req.params.pid) {
            res.json({ error: "Id required" })
            return
        }
        var playerno = req.params.pid
        connection.query("SELECT * FROM player WHERE pid = " + playerno, (err, results, fields) => {
            if (err) return res.json({ error: err.message })
            res.json(results)
        })
    })

    // // add 
    app.get("/newplayer", (req, res) => {
        if (!req.query.p_name) {
            res.json({ error: "name  required" })
            return
        }

        if (!req.query.p_age) {
            res.json({ error: "age required" })
            return
        }
        if (!req.query.p_sports) {
            res.json({ error: "sports required" })
            return
        }
        if (!req.query.p_phn) {
            res.json({ error: "phone no.required" })
            return
        }
        if (!req.query.p_email) {
            res.json({ error: "email required" })
            return
        }
        if (!req.query.city) {
            res.json({ error: "city required" })
            return
        }

        connection.query(`INSERT INTO player(p_name, p_age, p_sports, p_phn, p_email, city) ` +
            `VALUES(${req.query.p_name},'${req.p_age}','${req.query.p_sports}','${req.query.p_phn}','${req.query.p_email}','${req.query.city}')`,
            (err, results, fields) => {
                if (err) return res.json({ error: err.message })
                res.json(results)
            })
    })

    // // update
    app.get("/updateplayer", (req, res) => {
        if (!req.query.p_email) {
            res.json({ error: "source required" })
            return
        }
        if (!req.query.p_phn) {
            res.json({ error: "destination required" })
            return
        }
        var source = req.query.source
        var destn = req.query.destn
        connection.query(`UPDATE player SET source = '${p_email}' WHERE destn = ${p_phn}`, (err, results, fields) => {
            if (err) return res.json({ error: err.message })
            res.json(results)
        })
    })

    // delete
    app.get("/deleteplayer", (req, res) => {
        if (!req.query.pid) {
            res.json({ error: "player id required" })
            return
        }

        var fno = req.query.pid
        connection.query(`DELETE FROM player WHERE pid = ${pid}`, (err, results, fields) => {
            if (err) return res.json({ error: err.message })
            res.json(results)
        })
    })


    //Port
    const port = 8000;

    //Starting a server
    app.listen(port, () => {
        console.log(`* SERVER STARTED AT PORT ${port} *`);
    });

})