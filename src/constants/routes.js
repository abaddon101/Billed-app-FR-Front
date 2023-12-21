// Importation des composants de l'interface utilisateur pour chaque itinéraire
import LoginUI from "../views/LoginUI.js";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import DashboardUI from "../views/DashboardUI.js";

// Définition des chemins des itinéraires
export const ROUTES_PATH = {
  Login: "/", // Itinéraire pour la page de connexion
  Bills: "#employee/bills", // Itinéraire pour la page des factures de l'employé
  NewBill: "#employee/bill/new", // Itinéraire pour la création d'une nouvelle facture par l'employé
  Dashboard: "#admin/dashboard", // Itinéraire pour le tableau de bord de l'administrateur
};

// Fonction qui rend l'interface utilisateur en fonction du chemin (pathname) fourni
export const ROUTES = ({ pathname, data, error, loading }) => {
  // Affiche le chemin de navigation dans la console à des fins de débogage
  // console.log("Navigating to path:", pathname);

  // Utilise une instruction switch pour déterminer quelle interface utilisateur rendre en fonction du chemin
  switch (pathname) {
    case ROUTES_PATH["Login"]:
      // console.log("Rendering LoginUI");
      return LoginUI({ data, error, loading }); // Rend la page de connexion
    case ROUTES_PATH["Bills"]:
      // console.log("Rendering BillsUI");
      return BillsUI({ data, error, loading }); // Rend la page des factures
    case ROUTES_PATH["NewBill"]:
      // console.log("Rendering NewBillUI");
      return NewBillUI(); // Rend la page de création d'une nouvelle facture
    case ROUTES_PATH["Dashboard"]:
      // console.log("Rendering DashboardUI");
      return DashboardUI({ data, error, loading }); // Rend le tableau de bord
    default:
      // console.log("Unknown path. Rendering LoginUI");
      return LoginUI({ data, error, loading }); // Rend la page de connexion par défaut si le chemin est inconnu
  }
};
