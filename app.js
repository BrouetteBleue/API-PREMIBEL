'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const config = require("./config");
const cors = require("cors");
// pour démarer l'appli c'est npm run dev || avant ct npm start mais la on passe en prod ducoup ca change pck heroku utilise par default npm start pour demarer le projet
// (si on laissait comme ça, ca lancerait nodemon a chaque fois et c gourmand en ressource + inutile ducoup on separe les commandes en fonction de l'environnement d'exécution)
const app = express();

app // comme ca qu'on déclare des middlewares (a la chaine) , l'ordre est important
  .use(favicon(__dirname + "/favicon.ico"))
  .use(bodyParser.json()) // MDW pour parser les données des requettes pck les données d'une rqt HTTP sont en string et nous on les veux en JSON
  .use(cors());


app.get("/", (req, res) => {
  res.json("tes perdu ? ");
});

// ici y'aura les points de terminaison

require("./src/routes/findCommandByPk")(app); // raccourci de syntaxe voir notes
//require("./src/routes/login")(app);

// ajout de la gestion des erreurs 404

app.use(({ res }) => {
  const message = "La ressource demandée n'a pas été trouvée";
  res.status(404).json({ message });
});

app.listen(config.port, () =>
  console.log(
    `Notre application Node est démarée sur : http://localhost:`+config.port
  )
);
