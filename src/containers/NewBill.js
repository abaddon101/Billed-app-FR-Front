// Importation de la constante ROUTES_PATH depuis le module routes.js et de la classe Logout depuis Logout.js
import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

// Classe NewBill représentant la création d'une nouvelle facture
export default class {
  // Constructeur de la classe prenant en paramètre un objet contenant document, onNavigate, store et localStorage
  constructor({ document, onNavigate, store, localStorage }) {
    // Initialisation des propriétés de la classe avec les valeurs fournies en paramètre
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    // Récupération de l'élément de formulaire "form-new-bill" et ajout d'un gestionnaire d'événement sur la soumission du formulaire
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);

    // Récupération de l'élément d'entrée de fichier "file" et ajout d'un gestionnaire d'événement sur le changement de fichier
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);

    // Initialisation des propriétés liées au fichier de facture
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;

    // Instanciation de la classe Logout pour gérer la déconnexion
    new Logout({ document, localStorage, onNavigate });
  }

  // Méthode appelée lorsqu'un fichier est sélectionné
  handleChangeFile = (e) => {
    e.preventDefault();
    
    console.log("File change event triggered");
    // Récupération du fichier depuis l'élément d'entrée de fichier
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];
    console.log("File input element:", fileInput);

    // Vérification de l'extension du fichier
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileName = fileInput.value.split(/(\\|\/)/g).pop();
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      console.error(
        "Extension de fichier non autorisée. Veuillez sélectionner un fichier jpg, jpeg ou png."
      );
      return;
    }

    console.log("File extension:", fileExtension);

    // Création d'un objet FormData pour envoyer le fichier et l'e-mail de l'utilisateur au serveur
    const formData = new FormData();
    const email = JSON.parse(localStorage.getItem("user")).email;
    formData.append("file", file);
    formData.append("email", email);

    // Envoi de la requête POST pour créer la facture avec le fichier
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        // Traitement de la réponse et mise à jour des propriétés liées au fichier de facture
        console.log("File URL:", fileUrl);
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })
      .catch((error) => console.error(error));
  };

  // Méthode appelée lorsqu'un formulaire est soumis
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submit event triggered");
    // Récupération des valeurs du formulaire pour créer une nouvelle facture
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };

    console.log("Form values:", bill);

    // Appel de la méthode pour mettre à jour la facture
    this.updateBill(bill);

    // Redirection vers la page des factures après la création
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // Méthode pour mettre à jour la facture
  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      // Appel de la méthode d'API pour mettre à jour la facture
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          // Redirection vers la page des factures après la mise à jour
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
