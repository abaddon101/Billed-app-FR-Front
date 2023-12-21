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
// simule la fonction $modal
$.fn.modal = jest.fn();

// Description des tests pour le contexte où l'utilisateur est connecté en tant qu'employé
describe("Given I am connected as an employee", () => {
  // Description du premier test : Lorsque je suis sur la page des factures
  describe("When I am on Bills Page", () => {
    // Premier sous-test : L'icône de la fenêtre de factures dans la mise en page verticale devrait être mise en surbrillance
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // Avant la configuration du localStorage
      // console.log("Before localStorage configuration:");
      // console.log("Original localStorage:", window.localStorage);

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

      // Après la configuration du localStorage
      // console.log("After localStorage configuration:");
      // console.log("Modified localStorage:", window.localStorage);

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

    test("Then modal should be displayed after clicking on bill icon", async () => {
      // Créer une facture fictive pour les tests
      const fakeBill = {
        url: "fakeBillUrl",
      };

      // Injection du HTML simulé dans le corps du document
      document.body.innerHTML = BillsUI({ data: [fakeBill] });

      // Créer une instance de la classe Bills avec des mocks appropriés
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: {
          bills: () => ({
            list: () => Promise.resolve([fakeBill]),
          }),
        },
      });

      // Appeler la méthode getBills pour initialiser les éléments de la page
      await billsInstance.getBills();
      // Récupérer l'icône "eye" et simuler le clic
      const iconEye = screen.getByTestId("icon-eye");
      // Simuler le clic sur l'icône "eye"
      userEvent.click(iconEye);
      // Attendre que la modale soit affichée
      await waitFor(() => {
        const modalContent = document.querySelector(".modal-content");
        expect($.fn.modal).toHaveBeenCalled();
        expect(modalContent).toBeInTheDocument();
        expect(modalContent.innerHTML).toContain(`<img width=`);
        // console.log("Modal Content InnerHTML:", modalContent.innerHTML);
        expect(modalContent.innerHTML).toContain(`<h5`);
      });
    });
  });
});

// Test d'intégration GET pour les notes de frais
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      // Prépare l'état de l'utilisateur en tant qu'employé connecté
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "e@e" })
      );

      // Crée un élément de div en tant que point d'ancrage pour l'application
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Initialise le router
      router();

      // Simule la navigation vers la page des notes de frais
      window.onNavigate(ROUTES_PATH.Bills);

      // Attend que le titre "Mes notes de frais" soit rendu à l'écran
      await waitFor(() => screen.getByText("Mes notes de frais"));

      // Vérifie la présence d'éléments spécifiques sur la page des notes de frais
      const table = await screen.getByTestId("tbody");
      expect(table).toBeTruthy();
    });

    // Suite de tests pour gérer les erreurs de l'API
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        // Espionne la méthode "bills" de l'objet mockStore
        jest.spyOn(mockStore, "bills");

        // Remplace l'objet localStorage par un objet de mock
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        // Initialise l'utilisateur en tant qu'employé connecté
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "e@e",
          })
        );

        // Crée un élément de div en tant que point d'ancrage pour l'application
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        // Initialise le router
        router();
      });

      // Teste la gestion d'une erreur 404 lors de la récupération des notes de frais depuis l'API
      test("fetches bills from an API and fails with 404 message error", async () => {
        // Remplace l'implémentation de la méthode "list" pour renvoyer une promesse rejetée avec une erreur 404
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });

        // Simule la navigation vers la page des notes de frais
        window.onNavigate(ROUTES_PATH.Bills);

        // Attend que le message d'erreur 404 soit rendu à l'écran
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      // Teste la gestion d'une erreur 500 lors de la récupération des notes de frais depuis l'API
      test("fetches messages from an API and fails with 500 message error", async () => {
        // Remplace l'implémentation de la méthode "list" pour renvoyer une promesse rejetée avec une erreur 500
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        // Simule la navigation vers la page des notes de frais
        window.onNavigate(ROUTES_PATH.Bills);

        // Attend que le message d'erreur 500 soit rendu à l'écran
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
