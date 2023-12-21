/* global onNavigate */

// Importe le store depuis le fichier Store.js
import store from "./Store.js";
// Importe les différents composants et vues nécessaires
import Login from "../containers/Login.js";
import Bills from "../containers/Bills.js";
import NewBill from "../containers/NewBill.js";
import Dashboard from "../containers/Dashboard.js";
import BillsUI from "../views/BillsUI.js";
import DashboardUI from "../views/DashboardUI.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

// Définit la fonction principale du module
export default () => {
    // Déclare la variable PREVIOUS_LOCATION
    let PREVIOUS_LOCATION = "";
  // console.log("router control:");
  // Récupère l'élément avec l'ID "root" dans le DOM
  const rootDiv = document.getElementById("root");
  // console.log("rootDiv control:", rootDiv);
  // Initialise le contenu de l'élément "root" avec le rendu des routes en fonction du chemin actuel
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
  // console.log("rootDiv control:", rootDiv.innerHTML);
  // console.log("pathname: window.location.pathname:", window.location.pathname);

  // Définit une fonction onNavigate pour la navigation entre les pages
  window.onNavigate = (pathname) => {
    // console.log("Navigating to:", pathname); // <-- Ajout d'un log
    // Met à jour l'historique de navigation
    window.history.pushState({}, pathname, window.location.origin + pathname);

    // Gère les différentes pages en fonction du chemin (pathname)
    if (pathname === ROUTES_PATH["Login"]) {
      // console.log("Rendering Login page");
      // Affiche la page de connexion
      rootDiv.innerHTML = ROUTES({ pathname });
      document.body.style.backgroundColor = "#0E5AE5";
      // console.log("About to instantiate Login...");
      new Login({
        document,
        localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
    } else if (pathname === ROUTES_PATH["Bills"]) {
      // console.log("Rendering Bills page");
      // Affiche la page des factures avec indication de chargement
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.add("active-icon");
      divIcon2.classList.remove("active-icon");
      const bills = new Bills({ document, onNavigate, store, localStorage });
      bills
        .getBills()
        .then((data) => {
          // Affiche les données des factures une fois qu'elles sont chargées
          // console.log("Bills data loaded:", data);
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById("layout-icon1");
          const divIcon2 = document.getElementById("layout-icon2");
          divIcon1.classList.add("active-icon");
          divIcon2.classList.remove("active-icon");
          new Bills({ document, onNavigate, store, localStorage });
        })
        .catch((error) => {
          // En cas d'erreur, affiche la page d'erreur
          console.error("Error loading Bills:", error);
          rootDiv.innerHTML = ROUTES({ pathname, error });
        });
    } else if (pathname === ROUTES_PATH["NewBill"]) {
      // Affiche la page de création d'une nouvelle facture
      // console.log("Rendering NewBill page");
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      new NewBill({ document, onNavigate, store, localStorage });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.remove("active-icon");
      divIcon2.classList.add("active-icon");
    } else if (pathname === ROUTES_PATH["Dashboard"]) {
      // Affiche le tableau de bord avec indication de chargement
      // console.log("Rendering Dashboard page");
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const bills = new Dashboard({
        document,
        onNavigate,
        store,
        bills: [],
        localStorage,
      });
      bills
        .getBillsAllUsers()
        .then((bills) => {
          // Affiche les données du tableau de bord une fois qu'elles sont chargées
          // console.log("Dashboard data loaded:", bills);
          rootDiv.innerHTML = DashboardUI({ data: { bills } });
          new Dashboard({ document, onNavigate, store, bills, localStorage });
        })
        .catch((error) => {
          // En cas d'erreur, affiche la page d'erreur
          console.error("Error loading Dashboard:", error);
          rootDiv.innerHTML = ROUTES({ pathname, error });
        });
    }
  };

  // Gère l'événement de retour arrière dans l'historique de navigation
  window.onpopstate = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.location.pathname === "/" && !user) {
      // Si l'utilisateur n'est pas connecté et est sur la page d'accueil, affiche la page d'accueil
      document.body.style.backgroundColor = "#0E5AE5";
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
    } else if (user) {
      // Si l'utilisateur est connecté, retourne à la page précédente définie dans PREVIOUS_LOCATION
      onNavigate(PREVIOUS_LOCATION);
    }
  };

  // Gère le cas initial lors du chargement de l'application
  if (window.location.pathname === "/" && window.location.hash === "") {
    // Si l'utilisateur n'est pas connecté et la page n'a pas de fragment (#), affiche la page de connexion
    new Login({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store });
    document.body.style.backgroundColor = "#0E5AE5";
  } else if (window.location.hash !== "") {
    // Si l'URL a un fragment (#), traite la navigation en conséquence
    if (window.location.hash === ROUTES_PATH["Bills"]) {
      // Affiche la page des factures avec indication de chargement
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.add("active-icon");
      divIcon2.classList.remove("active-icon");
      const bills = new Bills({ document, onNavigate, store, localStorage });
      bills
        .getBills()
        .then((data) => {
          // Affiche les données des factures une fois qu'elles sont chargées
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById("layout-icon1");
          const divIcon2 = document.getElementById("layout-icon2");
          divIcon1.classList.add("active-icon");
          divIcon2.classList.remove("active-icon");
          new Bills({ document, onNavigate, store, localStorage });
        })
        .catch((error) => {
          // En cas d'erreur, affiche la page d'erreur
          rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });
        });
    } else if (window.location.hash === ROUTES_PATH["NewBill"]) {
      // Affiche la page de création d'une nouvelle facture
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      new NewBill({ document, onNavigate, store, localStorage });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.remove("active-icon");
      divIcon2.classList.add("active-icon");
    } else if (window.location.hash === ROUTES_PATH["Dashboard"]) {
      // Affiche le tableau de bord avec indication de chargement
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      const bills = new Dashboard({
        document,
        onNavigate,
        store,
        bills: [],
        localStorage,
      });
      bills
        .getBillsAllUsers()
        .then((bills) => {
          // Affiche les données du tableau de bord une fois qu'elles sont chargées
          rootDiv.innerHTML = DashboardUI({ data: { bills } });
          new Dashboard({ document, onNavigate, store, bills, localStorage });
        })
        .catch((error) => {
          // En cas d'erreur, affiche la page d'erreur
          rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });
        });
    }
  }

  // Indique la fin de l'exécution de la fonction
  return null;
};
