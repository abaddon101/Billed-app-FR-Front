// Importation d'une constante ROUTES_PATH depuis un fichier de constantes
import { ROUTES_PATH } from "../constants/routes.js";
// Déclaration d'une variable globale PREVIOUS_LOCATION
export let PREVIOUS_LOCATION = "";

// we use a class so as to test its methods in e2e tests
// Définition de la classe Login
export default class Login {
  // Le constructeur prend un objet en paramètre avec plusieurs propriétés
  constructor({
    document,
    localStorage,
    onNavigate,
    PREVIOUS_LOCATION,
    store,
  }) {
    console.log("Login constructor called with parameters:", {
      document,
      localStorage,
      onNavigate,
      PREVIOUS_LOCATION,
      store,
    });
    // Initialisation des propriétés de la classe avec les paramètres du constructeur
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION; // Redéfinition de PREVIOUS_LOCATION ici, peut-être une erreur
    this.store = store;

    // Sélection des formulaires dans le document HTML par leur attribut data-testid
    const formEmployee = this.document.querySelector(
      `form[data-testid="form-employee"]`
    );
    console.log("Form Employee:", formEmployee);
    // Ajout d'écouteurs d'événements pour la soumission des formulaires
    formEmployee.addEventListener("submit", this.handleSubmitEmployee);

    const formAdmin = this.document.querySelector(
      `form[data-testid="form-admin"]`
    );
    console.log("Form Admin:", formAdmin);
    // Ajout d'écouteurs d'événements pour la soumission des formulaires
    formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }
  // Méthode pour gérer la soumission du formulaire de l'employé
  handleSubmitEmployee = (e) => {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();
    console.log("Submitting employee form...");
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
    // Stockage des données utilisateur dans le stockage local (localStorage)
    this.localStorage.setItem("user", JSON.stringify(user));
    console.log("User data stored:", user);
    // Appel de la méthode login, gestion des erreurs et redirection
    this.login(user)
      .catch((err) => {
        console.error("Error during login:", err);
        this.createUser(user);
      })
      .then(() => {
        console.log("Login successful. Navigating to Bills...");
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
    console.log("Submitting admin form...");
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
    // Stockage des données utilisateur dans le stockage local (localStorage)
    this.localStorage.setItem("user", JSON.stringify(user));
    console.log("User data stored:", user);
    // Appel de la méthode login, gestion des erreurs et redirection
    this.login(user)
      .catch((err) => {
        console.error("Error during login:", err);
        this.createUser(user);
      })
      .then(() => {
        console.log("Login successful. Navigating to Dashboard...");
        this.onNavigate(ROUTES_PATH["Dashboard"]);
        this.PREVIOUS_LOCATION = ROUTES_PATH["Dashboard"];
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        document.body.style.backgroundColor = "#fff";
      });
  };

  // Méthode pour effectuer la connexion (non nécessaire à tester)
  login = (user) => {
    // Vérification de la présence du store, puis appel de la méthode login du store
    if (this.store) {
      console.log("Logging in...");
      return this.store
        .login(
          JSON.stringify({
            email: user.email,
            password: user.password,
          })
        )
        .then(({ jwt }) => {
          console.log("Login successful. JWT received:", jwt);
          localStorage.setItem("jwt", jwt);
        });
    } else {
      return null;
    }
  };

  // Méthode pour créer un nouvel utilisateur (non nécessaire à tester)
  createUser = (user) => {
    // Vérification de la présence du store, puis appel de la méthode createUser du store
    if (this.store) {
      console.log("Creating user...");
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
          console.log(`User with ${user.email} is created`);
          return this.login(user);
        });
    } else {
      return null;
    }
  };
}
