const config = require("../../config");
const mysql = require("mysql");
const auth = require("../auth/auth");

module.exports = (app) => {
    app.get("/api/commands/:id",  (req, res) => {
        let pool = mysql.createPool(config.sql);
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Erreur de connexion à la base de données" });
            } else {
                connection.query("SELECT * FROM `llx_commande` WHERE `rowid` = ?", [req.params.id],
                    (err, rows) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: "Erreur de connexion à la base de données" });
                        } else {
                            const message = "Une commande a bien été trouvé.";
                            res.json({message, data: rows});
                        }
                    });        
        }})
    });
  };