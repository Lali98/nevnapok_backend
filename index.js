const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

const monthNames = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "oktober", "november", "december"];

app.use(cors());

function connectToSql() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Passw123',
        database: 'nevnapok'
    })
}

app.get("/api/nevnapok", (req, res) => {
    const napQuery = req.query.nap;
    const nevQuery = req.query.nev;
    if (napQuery) {
        const connection = connectToSql();
        connection.connect();
        const adat = napQuery.split('-');
        const sql = `select *
                     from nevnap
                     where ho = ?
                       and nap = ?`;
        connection.query(sql, [adat[0], adat[1]], (err, result, fields) => {
            if (result[0]){
                res.send({
                    datum: `${monthNames[result[0].ho - 1]} ${result[0].nap}.`,
                    nevnap1: result[0].nev1,
                    nevnap2: result[0].nev2
                });
            } else {
                res.send({"hiba": "nincs találat"});
            }
        });
    } else if (nevQuery) {
        const connection = connectToSql();
        connection.connect();
        const sql = `select *
                     from nevnap
                     where nev1 = ?
                        or nev2 = ?`;
        connection.query(sql, [nevQuery, nevQuery], (err, result, fields) => {
            if (result[0]){
                res.send({
                    datum: `${monthNames[result[0].ho - 1]} ${result[0].nap}.`,
                    nevnap1: result[0].nev1,
                    nevnap2: result[0].nev2
                });
            } else {
                res.send({"hiba": "nincs találat"});
            }
        });
    } else {
        res.send({"minta1":"/?nap=12-31","minta2":"/?nev=Szilveszter"})
    }
})

app.listen(5000, () => {
    console.log('Szerver fut a 5000 porton!');
})