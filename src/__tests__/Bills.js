/**
 * @jest-environment jsdom
 */

// Importation des modules et composants nécessaires pour les tests
import { screen, waitFor } from "@testing-library/dom";

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);
// Description des tests pour le contexte où l'utilisateur est connecté en tant qu'employé
describe("Given I am connected as an employee", () => {
  // Description du premier test : Lorsque je suis sur la page des factures
  describe("When I am on Bills Page", () => {
    // Premier sous-test : L'icône de la fenêtre de factures dans la mise en page verticale devrait être mise en surbrillance
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // Configuration d'un localStorage factice
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Ajout d'un utilisateur simulé dans le localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création d'un élément div avec l'id "root" dans le corps du document
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Initialisation du routeur
      router();

      // Navigation vers la page des factures
      window.onNavigate(ROUTES_PATH.Bills);

      // Attente de l'affichage de l'icône de la fenêtre

      await waitFor(() => {
        const windowIcon = screen.getByTestId("icon-window");
        expect(windowIcon).toBeInTheDocument();
        expect(windowIcon).toHaveClass("active-icon");
      });
    });

    // Deuxième sous-test : Les factures devraient être triées du plus ancien au plus récent
    test("Then bills should be ordered from earliest to latest", () => {
      // Injection du HTML simulé dans le corps du document
      document.body.innerHTML = BillsUI({ data: bills });

      // Récupération des dates des factures
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      // Fonction de tri anti-chronologique
      const antiChrono = (a, b) => (a < b ? 1 : -1);

      // Tri des dates dans l'ordre anti-chronologique
      const datesSorted = [...dates].sort(antiChrono);

      // Vérification que les dates dans l'interface utilisateur sont triées correctement
      expect(dates).toEqual(datesSorted);
    });

    test("Then button btn-new-bill should allow to navigate to NewBill", async () => {
      // Création d'un espion (spy) pour la fonction onNavigate
      const onNavigate = jest.fn((pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      });

      // Configuration de l'objet localStorage pour le test
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Ajout d'un utilisateur simulé dans le localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Initialisation de Bills avec la fonction mock pour handleClickNewBill
      const bills = new Bills({
        document,
        onNavigate, // Utilisation de l'espion (spy) ici
        localStorage: window.localStorage,
      });

      // Injection du HTML simulé dans le corps du document
      document.body.innerHTML = BillsUI({ data: bills });

      const handleClickNewBillTest = jest.fn((e) => bills.handleClickNewBill());

      // Récupération des éléments DOM
      const buttonNewBill = screen.getByTestId("btn-new-bill");

      // Ajout d'un écouteur d'événements pour le clic
      buttonNewBill.addEventListener("click", handleClickNewBillTest);

      // Simulation du clic
      userEvent.click(buttonNewBill);

      // Vérification que la fonction associée au clic a été appelée
      expect(handleClickNewBillTest).toHaveBeenCalled();

      // Vérification que l'espion (spy) onNavigate a été appelé avec les bons arguments
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });
  });
});
