// Importe la constante ROUTES_PATH depuis le fichier de constantes routes.js
import { ROUTES_PATH } from "../constants/routes.js";
// Déclare la variable globale PREVIOUS_LOCATION
export let PREVIOUS_LOCATION = "";

// Utilisation d'une classe pour tester ses méthodes dans les tests d'end-to-end (e2e)
// Définit la classe Login
export default class Login {

  // Le constructeur prend un objet en paramètre avec plusieurs propriétés
  constructor({ document, localStorage, onNavigate, store }) {
    // Affiche un message de débogage avec les paramètres du constructeur
    // console.log("Login constructor called with parameters:", {
      document,
      localStorage,
      onNavigate,

      store,
    // });
    // Initialise les propriétés de la classe avec les paramètres du constructeur
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    PREVIOUS_LOCATION = "";
    this.store = store;

    // Sélectionne les formulaires dans le document HTML par leur attribut data-testid
    const formEmployee = this.document.querySelector(
      `form[data-testid="form-employee"]`
    );
    // Affiche un message de débogage avec le formulaire de l'employé
    // console.log("Form Employee:", formEmployee);
    // Ajoute des écouteurs d'événements pour la soumission des formulaires
    formEmployee.addEventListener(
      "submit",
      this.handleSubmitEmployee.bind(this)
    );

    const formAdmin = this.document.querySelector(
      `form[data-testid="form-admin"]`
    );
    // Affiche un message de débogage avec le formulaire de l'administrateur
    // console.log("Form Admin:", formAdmin);
    // Ajoute des écouteurs d'événements pour la soumission des formulaires
    formAdmin.addEventListener("submit", this.handleSubmitAdmin.bind(this));
  }

  // Méthode pour gérer la soumission du formulaire de l'employé
  handleSubmitEmployee = (e) => {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();
    // Affiche un message de débogage
    // console.log("Submitting employee form...");
    // Extraction des données du formulaire
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="employee-password-input"]`
      ).value,
      status: "connected",
    };
    // Stocke les données utilisateur dans le stockage local (localStorage)
    this.localStorage.setItem("user", JSON.stringify(user));
    // Affiche un message de débogage avec les données utilisateur
    // console.log("User data stored:", user);
    // Appelle la méthode login, gère les erreurs et redirige
    this.login(user)
      .catch((err) => {
        console.error("Error during login:", err);
        this.createUser(user);
      })
      .then(() => {
        // Affiche un message de débogage et redirige vers la page des factures
        // console.log("Login successful. Navigating to Bills...");
        this.onNavigate(ROUTES_PATH["Bills"]);
        this.PREVIOUS_LOCATION = ROUTES_PATH["Bills"];
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        this.document.body.style.backgroundColor = "#fff";
      });
  };

  // Méthode pour gérer la soumission du formulaire de l'administrateur
  handleSubmitAdmin = (e) => {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();

    // Affiche un message de débogage
    // console.log("Submitting admin form...");
    // Extraction des données du formulaire
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="admin-password-input"]`
      ).value,
      status: "connected",
    };
    // Stocke les données utilisateur dans le stockage local (localStorage)
    this.localStorage.setItem("user", JSON.stringify(user));
    // Affiche un message de débogage avec les données utilisateur
    // console.log("User data stored:", user);
    // Appelle la méthode login, gère les erreurs et redirige
    this.login(user)
      .catch((err) => {
        console.error("Error during login:", err);
        this.createUser(user);
      })
      .then(() => {
        // Affiche un message de débogage et redirige vers le tableau de bord
        // console.log("Login successful. Navigating to Dashboard...");
        this.onNavigate(ROUTES_PATH["Dashboard"]);
        this.PREVIOUS_LOCATION = ROUTES_PATH["Dashboard"];
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        document.body.style.backgroundColor = "#fff";
      });
  };

  // Méthode pour effectuer la connexion (non nécessaire à tester)
  login = (user) => {
    // Vérifie la présence du store, puis appelle la méthode login du store
    if (this.store) {
      // console.log("Logging in...");
      return this.store
        .login(
          JSON.stringify({
            email: user.email,
            password: user.password,
          })
        )
        .then(({ jwt }) => {
          // Affiche un message de débogage et stocke le jeton JWT dans le localStorage
          // console.log("Login successful. JWT received:", jwt);
          localStorage.setItem("jwt", jwt);
        });
    } else {
      return null;
    }
  };

  // Méthode pour créer un nouvel utilisateur (non nécessaire à tester)
  createUser = (user) => {
    // Vérifie la présence du store, puis appelle la méthode createUser du store
    if (this.store) {
      // console.log("Creating user...");
      return this.store
        .users()
        .create({
          data: JSON.stringify({
            type: user.type,
            name: user.email.split("@")[0],
            email: user.email,
            password: user.password,
          }),
        })
        .then(() => {
          // Affiche un message de débogage et appelle la méthode login
          // console.log(`User with ${user.email} is created`);
          return this.login(user);
        });
    } else {
      return null;
    }
  };
}
