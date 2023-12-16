/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import DashboardFormUI from "../views/DashboardFormUI.js";
import DashboardUI from "../views/DashboardUI.js";
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills";
import router from "../app/Router";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an Admin", () => {
  describe("When I am on Dashboard page, there are bills, and there is one pending", () => {
    test("Then, filteredBills by pending status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "pending");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is one accepted", () => {
    test("Then, filteredBills by accepted status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "accepted");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is two refused", () => {
    test("Then, filteredBills by accepted status should return 2 bills", () => {
      const filtered_bills = filteredBills(bills, "refused");
      expect(filtered_bills.length).toBe(2);
    });
  });
  describe("When I am on Dashboard page but it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = DashboardUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("When I am on Dashboard page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = DashboardUI({ error: "some error message" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
  // Description du scénario de test
  describe("When I am on Dashboard page and I click on arrow", () => {
    // Test spécifique
    test("Then, tickets list should be unfolding, and cards should appear", async () => {
      // Fonction pour simuler la navigation vers une nouvelle page
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // Configuration de l'objet localStorage pour le test
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      // Création d'une instance de la classe Dashboard
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });

      // Mise en place du contenu de la page de tableau de bord
      document.body.innerHTML = DashboardUI({ data: { bills } });
      // Définition de trois fonctions de gestion d'événements pour simuler le clic sur les flèches
      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const handleShowTickets2 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 2)
      );
      const handleShowTickets3 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 3)
      );
      // Récupération des éléments DOM représentant les icônes de flèches
      const icon1 = screen.getByTestId("arrow-icon1");
      const icon2 = screen.getByTestId("arrow-icon2");
      const icon3 = screen.getByTestId("arrow-icon3");

      // Ajout d'un écouteur d'événements pour le clic sur la première flèche
      icon1.addEventListener("click", handleShowTickets1);
      // Simulation du clic sur la première flèche
      userEvent.click(icon1);
      // Vérification que la fonction associée au clic a été appelée
      expect(handleShowTickets1).toHaveBeenCalled();
      // Attente de l'apparition d'un élément spécifique dans le DOM
      await waitFor(() => screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`));
      // Vérification que l'élément spécifique est présent dans le DOM
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();

      // Ajout d'un écouteur d'événements pour le clic sur la deuxième flèche
      icon2.addEventListener("click", handleShowTickets2);
      // Simulation du clic sur la première flèche
      userEvent.click(icon2);
      // Vérification que la fonction associée au clic a été appelée
      expect(handleShowTickets2).toHaveBeenCalled();
      // Attente de l'apparition d'un élément spécifique dans le DOM
      await waitFor(() => screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`));
      // Vérification que l'élément spécifique est présent dans le DOM
      expect(screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`)).toBeTruthy();

      // Ajout d'un écouteur d'événements pour le clic sur la troisième flèche
      icon3.addEventListener("click", handleShowTickets3);
      // Simulation du clic sur la première flèche
      userEvent.click(icon3);
      // Vérification que la fonction associée au clic a été appelée
      expect(handleShowTickets3).toHaveBeenCalled();
      // Attente de l'apparition d'un élément spécifique dans le DOM
      await waitFor(() => screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`));
      // Vérification que l'élément spécifique est présent dans le DOM
      expect(screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`)).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click on edit icon of a card", () => {
    test("Then, right form should be filled", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = DashboardUI({ data: { bills } });
      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const icon1 = screen.getByTestId("arrow-icon1");
      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();
      const iconEdit = screen.getByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      userEvent.click(iconEdit);
      expect(screen.getByTestId(`dashboard-form`)).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click 2 times on edit icon of a card", () => {
    test("Then, big bill Icon should Appear", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = DashboardUI({ data: { bills } });

      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const icon1 = screen.getByTestId("arrow-icon1");
      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();
      const iconEdit = screen.getByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      userEvent.click(iconEdit);
      userEvent.click(iconEdit);
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });

  describe("When I am on Dashboard and there are no bills", () => {
    test("Then, no cards should be shown", () => {
      document.body.innerHTML = cards([]);
      const iconEdit = screen.queryByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      expect(iconEdit).toBeNull();
    });
  });
});

describe("Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill", () => {
  describe("When I click on accept button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const acceptButton = screen.getByTestId("btn-accept-bill-d");
      const handleAcceptSubmit = jest.fn((e) =>
        dashboard.handleAcceptSubmit(e, bills[0])
      );
      acceptButton.addEventListener("click", handleAcceptSubmit);
      fireEvent.click(acceptButton);
      expect(handleAcceptSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
  describe("When I click on refuse button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      const refuseButton = screen.getByTestId("btn-refuse-bill-d");
      const handleRefuseSubmit = jest.fn((e) =>
        dashboard.handleRefuseSubmit(e, bills[0])
      );
      refuseButton.addEventListener("click", handleRefuseSubmit);
      fireEvent.click(refuseButton);
      expect(handleRefuseSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
});

describe("Given I am connected as Admin and I am on Dashboard page and I clicked on a bill", () => {
  describe("When I click on the icon eye", () => {
    test("A modal should open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye);
      const eye = screen.getByTestId("icon-eye-d");
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFileAdmin");
      expect(modale).toBeTruthy();
    });
  });
});

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Admin", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Dashboard);
      await waitFor(() => screen.getByText("Validations"));
      const contentPending = await screen.getByText("En attente (1)");
      expect(contentPending).toBeTruthy();
      const contentRefused = await screen.getByText("Refusé (2)");
      expect(contentRefused).toBeTruthy();
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Admin",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Dashboard);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Dashboard);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
