const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_keys");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization; // c dans cette entete que y'a le jeton JWT

  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  }

  const token = authorizationHeader.split(" ")[1]; // on récupère juste le jeton pck ya 2 infos dans l'entete (on veut la deuxieme)
  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    // la on vérifie si le token de l'entete de la rqt HTTP est le meme que le privé
    if (error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }

    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`;
      res.status(401).json({ message });
    } else {
      next(); // Si tout est bon : on laisse l'utilisateur accéder au point de teminaison
    } // rapel general: tout ca c'est un middleware pour l'authentification
  });
};
