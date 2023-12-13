// Importation de la constante ROUTES_PATH depuis le module routes.js
import { ROUTES_PATH } from "../constants/routes.js";

// Classe Logout représentant la fonctionnalité de déconnexion
export default class Logout {
  // Constructeur de la classe prenant en paramètre un objet contenant document, onNavigate et localStorage
  constructor({ document, onNavigate, localStorage }) {
    // Initialisation des propriétés de la classe avec les valeurs fournies en paramètre
    this.document = document;
    this.onNavigate = onNavigate;
    this.localStorage = localStorage;

    // Ajout d'un gestionnaire d'événement click sur l'élément avec l'ID "layout-disconnect"
    $("#layout-disconnect").click(this.handleClick);
  }

  // Méthode appelée lorsqu'un clic est détecté sur l'élément avec l'ID "layout-disconnect"
  handleClick = (e) => {
    // Efface toutes les données stockées localement (dans le localStorage)
    this.localStorage.clear();

    // Redirige l'utilisateur vers la page de connexion en utilisant la fonction onNavigate avec l'itinéraire correspondant
    this.onNavigate(ROUTES_PATH["Login"]);
  };
}
