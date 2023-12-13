// Import des modules et fichiers nécessaires
import { formatDate } from "../app/format.js"; // Fonction pour formater la date
import DashboardFormUI from "../views/DashboardFormUI.js"; // Interface utilisateur pour le tableau de bord
import BigBilledIcon from "../assets/svg/big_billed.js"; // Icône d'une grosse facture en SVG
import { ROUTES_PATH } from "../constants/routes.js"; // Chemins des routes de l'application
import USERS_TEST from "../constants/usersTest.js"; // Utilisateurs de test
import Logout from "./Logout.js"; // Module de déconnexion

// Fonction pour filtrer les factures en fonction du statut
export const filteredBills = (data, status) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;

        // Environnement de test avec Jest
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status;
        } else {
          // Environnement de production
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          selectCondition =
            bill.status === status &&
            ![...USERS_TEST, userEmail].includes(bill.email);
        }

        return selectCondition;
      })
    : [];
};

// Fonction pour générer le code HTML d'une carte de facture
export const card = (bill) => {
  const firstAndLastNames = bill.email.split("@")[0];
  const firstName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[0]
    : "";
  const lastName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[1]
    : firstAndLastNames;

  return `
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${
      bill.id
    }'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `;
};

// Fonction pour générer le code HTML de plusieurs cartes de factures
export const cards = (bills) => {
  return bills && bills.length ? bills.map((bill) => card(bill)).join("") : "";
};

// Fonction pour obtenir le statut en fonction de l'index
export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
};

// Classe principale pour le tableau de bord
export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    // Gestion des événements des icônes pour afficher/masquer les tickets
    $("#arrow-icon1").click((e) => this.handleShowTickets(e, bills, 1));
    $("#arrow-icon2").click((e) => this.handleShowTickets(e, bills, 2));
    $("#arrow-icon3").click((e) => this.handleShowTickets(e, bills, 3));

    // Initialisation du module de déconnexion
    new Logout({ localStorage, onNavigate });
  }

  // Gestion du clic sur l'icône d'œil pour afficher l'image de la facture
  handleClickIconEye = () => {
    const billUrl = $("#icon-eye-d").attr("data-bill-url");
    const imgWidth = Math.floor($("#modaleFileAdmin1").width() * 0.8);
    $("#modaleFileAdmin1")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`
      );
    if (typeof $("#modaleFileAdmin1").modal === "function")
      $("#modaleFileAdmin1").modal("show");
  };

  // Gestion de l'édition d'une facture
  handleEditTicket(e, bill, bills) {
    // Gestion du style des cartes en fonction de l'édition
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0;
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id;
    if (this.counter % 2 === 0) {
      bills.forEach((b) => {
        $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
      });
      $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
      $(".dashboard-right-container div").html(DashboardFormUI(bill));
      $(".vertical-navbar").css({ height: "150vh" });
      this.counter++;
    } else {
      $(`#open-bill${bill.id}`).css({ background: "#0D5AE5" });

      $(".dashboard-right-container div").html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `);
      $(".vertical-navbar").css({ height: "120vh" });
      this.counter++;
    }

    // Gestion des événements des boutons accepter et refuser
    $("#icon-eye-d").click(this.handleClickIconEye);
    $("#btn-accept-bill").click((e) => this.handleAcceptSubmit(e, bill));
    $("#btn-refuse-bill").click((e) => this.handleRefuseSubmit(e, bill));
  }

  // Gestion de la soumission d'une facture acceptée
  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "accepted",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  // Gestion de la soumission d'une facture refusée
  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "refused",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  // Affichage ou masquage des tickets en fonction de l'index

  // Fonction qui gère l'affichage des tickets en fonction de certains événements
  handleShowTickets(e, bills, index) {
    console.log("event handleShowTicket"); // Affiche un message dans la console pour indiquer le début de la fonction
    // debugger;
    // Vérifie si la variable counter n'est pas définie ou si l'index est différent, puis initialise counter à 0
    if (this.counter === undefined || this.index !== index) this.counter = 0;

    // Vérifie si l'index n'est pas défini ou s'il est différent, puis initialise l'index avec la valeur actuelle
    if (this.index === undefined || this.index !== index) this.index = index;

    // Si counter est pair, effectue des actions spécifiques et incrémente counter, sinon effectue d'autres actions et incrémente counter
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(0deg)" }); // Modifie la rotation d'un élément avec un ID spécifique
      $(`#status-bills-container${this.index}`).html(
        cards(filteredBills(bills, getStatus(this.index)))
      ); // Remplace le contenu HTML d'un élément avec un ID spécifique par des cartes générées à partir de certaines données filtrées
      this.counter++;
      // Ajouter un console log pour déboguer les valeurs
      console.log("Counter:", this.counter); // Affiche la valeur actuelle de counter dans la console
      console.log("Index:", this.index); // Affiche la valeur actuelle de l'index dans la console
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(90deg)" }); // Modifie la rotation d'un élément avec un ID spécifique
      $(`#status-bills-container${this.index}`).html(""); // Efface le contenu HTML d'un élément avec un ID spécifique
      this.counter++;
    }

    console.log("Counter:", this.counter); // Affiche la valeur actuelle de counter dans la console
    console.log("Index:", this.index); // Affiche la valeur actuelle de l'index dans la console

    // Détacher les gestionnaires d'événements existants sur les éléments avec la classe 'open-bill'
    $(`#status-bills-container${this.index}`).off("click", ".open-bill");

    // Gestion des événements de clic sur les cartes pour l'édition
    $(`#status-bills-container${this.index}`).on("click", ".open-bill", (e) => {
      const billId = $(e.currentTarget).data("bill-id"); // Récupère la valeur de l'attribut 'data-bill-id'
      const selectedBill = bills.find((bill) => bill.id === billId); // Trouve le ticket correspondant à l'ID récupéré
      this.handleEditTicket(e, selectedBill, bills); // Appelle une fonction pour gérer l'édition du ticket
    });

    // Ajouter un attribut 'data-bill-id' aux éléments 'open-bill' et ajoute une classe 'open-bill'
    bills.forEach((bill) => {
      $(`#open-bill${bill.id}`).addClass("open-bill").data("bill-id", bill.id);
    });

    return bills; // Renvoie la liste des tickets
  }

  // Récupération de toutes les factures de tous les utilisateurs
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => ({
            id: doc.id,
            ...doc,
            date: doc.date,
            status: doc.status,
          }));
          return bills;
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  // Mise à jour d'une facture
  // Cette fonction est ignorée lors des tests (pas besoin de la couvrir)
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then((bill) => bill)
        .catch(console.log);
    }
  };
}
