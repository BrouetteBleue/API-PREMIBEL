const config = require("../../config");
const mysql = require("mysql");
const auth = require("../auth/auth");

module.exports = (app) => {
  // ^^on crée une fonction qui prend en paramètre toute l'appli (ca permet de définir les route plus simplement tout en les séparant dant plusieurs modules distinct)
  app.get("/api/commands", auth, (req, res) => {
    // ^^le middlware est passé comme 2eme argument lors de la déclaration de la nouvelle route
    if (req.query.name) {
      const limit = parseInt(req.query.limit) || 5; // pour donner une valeur par default
      const name = req.query.name;

      if (name.length < 2) {
        const message =
          "Le terme de recherche doit contenir au moins 2 caractères";
        return res.status(400).json({ message }); // pour renvoyer un code erreur genre ca faut pas oublier le "return" avant sinon ca crash
      }
      return Pokemon.findAndCountAll({
        where: {
          name: {
            // ^^ce name est la propriété du modèle pokemon
            [Op.like]: `%${name}%`, // ce name est le critère de recherche  //// lES opérateurs sequelize sont entre crochets REGARDE LA DOC
          },
        },
        limit: limit,
        order: ["name"], // par défaut le tri est par ordre croissant sinon c comme ca : ['name', 'ASC']
      }).then(({ count, rows }) => {
        const message = `Il y'a ${count} pokemons qui correspondent au terme de recherche ${name}.`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des commandes a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message =
            "La liste des commandes n'a pas pu etre récupérée. Rééssayez dans quelques instants.";
          res.status(500).json({ message, data: error });
        });
    }
  });
};
