// Importation des constantes de chemin des routes, ainsi que des fonctions de formatage et du composant Logout
import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

// Définition de la classe exportée
export default class {
  // Le constructeur de la classe prend en paramètre un objet contenant document, onNavigate, store, et localStorage
  constructor({ document, onNavigate, store, localStorage }) {
    // Initialisation des propriétés de l'instance avec les valeurs fournies en paramètres
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    // Assurez-vous que handleClickNewBill et handleClickIconEye sont liés à l'instance de Bills
    this.handleClickNewBill = this.handleClickNewBill.bind(this);
    this.handleClickIconEye = this.handleClickIconEye.bind(this);
    // Recherche du bouton "New Bill" dans le document et ajout d'un gestionnaire d'événement au clic
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);

    // Recherche de tous les éléments avec l'attribut data-testid="icon-eye" et ajout d'un gestionnaire d'événement au clic pour chacun
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });

    // Création d'une instance de Logout et passage des paramètres nécessaires
    new Logout({ document, localStorage, onNavigate });
  }

  // Méthode appelée lors du clic sur le bouton "New Bill"
  handleClickNewBill = () => {
    // Utilisation de la fonction onNavigate pour rediriger vers la route NewBill
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  // Méthode appelée lors du clic sur l'icône "eye" (affichage de la facture)
  handleClickIconEye = (icon) => {
    // Récupération de l'URL de la facture depuis l'attribut data-bill-url de l'icône
    const billUrl = icon.getAttribute("data-bill-url");

    // Calcul de la largeur de l'image à afficher (50% de la largeur de l'élément avec l'ID modaleFile)
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);

    // Modification du contenu de l'élément avec l'ID modaleFile pour afficher l'image de la facture
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );

    // Affichage de la modale
    $("#modaleFile").modal("show");
  };

  // Méthode pour obtenir la liste des factures à partir du magasin (store)
  getBills = () => {
    // Vérification si le magasin (store) existe
    if (this.store) {
      // Appel de la méthode list() du magasin (store.bills()) pour obtenir la liste des factures
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          // Traitement de chaque facture dans le snapshot
          const bills = snapshot.map((doc) => {
            try {
              // Tentative de formatage de la date et récupération du statut
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
            } catch (e) {
              // Gestion de l'erreur en cas d'échec du formatage de la date
              // console.log(e, "for", doc);
              // Retour de la facture avec la date non formatée dans ce cas
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status),
              };
            }
          });
          // Affichage de la longueur de la liste des factures dans la console
          // console.log("length", bills.length);
          // Retour de la liste des factures formatées
          return bills;
        });
    }
  };
}
