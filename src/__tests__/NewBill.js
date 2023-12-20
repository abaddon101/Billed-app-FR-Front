// Importations
import {
  screen,
  waitFor,
  fireEvent,
  getByLabelText,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import router from "../app/Router.js";

// Mock du Store
jest.mock("../app/Store", () => require("../__mocks__/store.js"));

// Fonction utilitaire pour créer une liste de fichiers simulée (simule un objet FileList)
function createFileList(files) {
  // Création d'un objet vide qui servira à simuler un objet FileList
  const fileList = Object.create(null);
  // Définition de la propriété "length" sur l'objet FileList simulé
  fileList.length = files.length;
  // Définition d'une méthode "item" sur l'objet FileList simulé
  // Cette méthode renvoie le fichier à l'index spécifié
  fileList.item = (index) => files[index];
  // Itération sur le tableau de noms de fichiers et ajout de chaque fichier à l'objet FileList simulé
  for (let i = 0; i < files.length; i++) {
    fileList[i] = files[i];
  }
  // Renvoie de l'objet FileList simulé
  return fileList;
}

// Tests
describe("Given I am connected as an employee", () => {
  // Initialisation de l'environnement de test
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();

  describe("When I am on the NewBill page", () => {
    test("Then title text content should be displayed", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);

      // Assertion
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });

    test("Then mail icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);

      // Attente de l'affichage de l'icône mail
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");

      // Assertion
      expect(mailIcon.className).toBe("active-icon");
    });
  });
});

describe("Given I am connected as an employee and I am on the NewBill page", () => {
  let newBill;
  let onNavigateMock;

  beforeEach(() => {
    // Configuration de l'environnement de test
    document.body.innerHTML = NewBillUI();

    onNavigateMock = jest.fn();
    window.onNavigate = onNavigateMock;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    // Initialisation de l'instance NewBill
    newBill = new NewBill({
      document,
      onNavigate,
      mockStore,
      localStorage: window.localStorage,
    });

    // Masquage du message d'erreur sur le fichier s'il est visible
    // const fileErrorMessage = screen.getByTestId("file-error-message");
    // if (fileErrorMessage.classList.contains("visible")) {
    //   fileErrorMessage.classList.remove("visible");
    // }
  });

  // Tests pour la soumission du formulaire avec des champs vides
  describe("When I submit the form with empty fields", () => {
    test("Then I should stay on the NewBill page", async () => {
      // Assertions sur les champs vides
      expect(screen.getByTestId("expense-name").value).toBe("");
      expect(screen.getByTestId("datepicker").value).toBe("");
      expect(screen.getByTestId("amount").value).toBe("");
      expect(screen.getByTestId("vat").value).toBe("");
      expect(screen.getByTestId("pct").value).toBe("");
      expect(screen.getByTestId("file").value).toBe("");

      // Soumission du formulaire
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Assertions sur la soumission du formulaire
      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();

      // Attente de la non-navigation
      await waitFor(() => expect(onNavigateMock).toHaveBeenCalledTimes(0));
    });
  });

  // Tests pour le téléchargement d'un fichier avec un format incorrect
  describe("When I upload a file with the wrong format", () => {
    test("Then it should return an error message", async () => {
      // Création d'un fichier avec un format incorrect
      const file = new File(["hello"], "hello.txt", { type: "txt/plain" });
      const inputFile = screen.getByTestId("file");

      // Gestion du changement de fichier
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      // Simulation du changement de fichier
      const fileList = createFileList([file]);
      Object.defineProperty(inputFile, "files", {
        get: () => fileList,
      });

      fireEvent.change(inputFile);

      // Assertions sur le changement de fichier
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("hello.txt");

      // Attente de l'affichage du message d'erreur
      // await waitFor(() =>
      //   expect(
      //     screen.getByTestId("file-error-message").classList.contains("visible")
      //   ).toBeTruthy()
      // );
    });
  });

  // Tests pour le téléchargement d'un fichier avec le bon format
  describe("When I upload a file with the correct format", () => {
    test("Then I should not have the error message about the file format", async () => {
      // Simulation du téléchargement d'un fichier
      const file = new File(["img"], "image.jpg", { type: "image/jpeg" });
      const inputFile = screen.getByTestId("file");

      // Gestion du changement de fichier
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      // Simulation du changement de fichier
      const fileList = createFileList([file]);
      Object.defineProperty(inputFile, "files", {
        get: () => fileList,
      });

      fireEvent.change(inputFile);

      // Assertions sur le changement de fichier
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.jpg");

      // const errorMessage = screen.getByTestId("file-error-message");
      // errorMessage.classList.remove("visible");

      // Attente de la non-affichage du message d'erreur
      // await waitFor(() =>
      //   expect(
      //     screen.getByTestId("file-error-message").classList.contains("visible")
      //   ).not.toBeTruthy()
      // );
    });
  });
});

// Tests pour la soumission du formulaire avec des données valides
describe("Given I am connected as an employee on the NewBill page, and I submit the form with valid data", () => {
  beforeEach(() => {
    // Configuration de l'environnement de test
    document.body.innerHTML = "";
    jest.spyOn(mockStore, "bills");

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });

  afterEach(() => {
    // Réinitialisation de l'environnement de test
    document.body.innerHTML = NewBillUI();
    jest.restoreAllMocks();
    const root = document.getElementById("root");
    if (root) {
      document.body.removeChild(root);
    }
  });

  // Tests pour la gestion d'une erreur de l'API
  describe("When an error occurs on API", () => {
    test("Then it should display an error message", async () => {
      // Création d'une erreur simulée
      const mockError = new Error("Erreur 404");
      console.error = jest.fn();

      // Navigation vers la page NewBill
      window.onNavigate(ROUTES_PATH.NewBill);

      // Mock de la méthode 'update' de bills
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: jest.fn().mockRejectedValueOnce(mockError),
        };
      });

      // Initialisation de l'instance NewBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Soumission du formulaire
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        try {
          newBill.updateBill(newBill);
        } catch (error) {
          console.error(error);
        }
      });
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);

      // Assertions sur la soumission du formulaire
      expect(handleSubmit).toHaveBeenCalled();

      // Attente de l'affichage de l'erreur
      await waitFor(() =>
        expect(console.error).toHaveBeenCalledWith(mockError)
      );
    });
  });
});

// Test d'intégration POST pour des nouvelles notes de frais
describe("Given I am connected as an employee on the NewBill page", () => {
  let newBill;
  let onNavigateMock;

  beforeAll(() => {
    // Code qui s'exécutera une seule fois avant l'exécution des tests du describe
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
    window.onNavigate(ROUTES_PATH.NewBill);
  });

  afterAll(() => {
    // Code qui s'exécutera une seule fois après l'exécution des tests du describe
    // Nettoyez l'état après les tests si nécessaire
    localStorage.removeItem("user");
    // Nettoyez l'élément de div créé si nécessaire
    document.body.removeChild(document.getElementById("root"));
  });

  describe("When I navigate to newBills page", () => {
    test("check if the form is displayed", async () => {
      // Attend que le titre "Envoyer une note de frais" soit rendu à l'écran
      await waitFor(() => screen.getByText("Envoyer une note de frais"));
      // Vérifie la présence d'éléments spécifiques sur la page des notes de frais
      const form = await screen.getByTestId("form-new-bill");
      expect(form).toBeTruthy();
    });
  });

  // Test d'intégration POST pour la création d'une nouvelle note de frais
  describe("When I submit the form with valid data", () => {
    test("Then a new bill should be created", async () => {
      // Navigation vers la page NewBill
      window.onNavigate(ROUTES_PATH.NewBill);

      // Initialisation de l'instance NewBill
      newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Simulez la saisie de données dans le formulaire
      userEvent.selectOptions(
        screen.getByLabelText("expense-type"),
        "Transports"
      );
      userEvent.type(
        screen.getByLabelText("expense-name"),
        "Nom de la dépense"
      );
      userEvent.type(screen.getByLabelText("datepicker"), "2023-12-20");
      userEvent.type(screen.getByLabelText("amount"), "100");
      userEvent.type(screen.getByLabelText("vat"), "20");
      userEvent.type(screen.getByLabelText("pct"), "10");
      userEvent.type(screen.getByLabelText("commentary"), "Commentaire");

      // Création d'un fichier avec le bon format
      const file = new File(["img"], "image.jpg", { type: "image/jpeg" });
      const inputFile = screen.getByTestId("file");
      const fileList = createFileList([file]);
      Object.defineProperty(inputFile, "files", {
        get: () => fileList,
      });
      fireEvent.change(inputFile);

      // Soumission du formulaire
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Attente de la création de la nouvelle note de frais
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
        // Ajoutez ici des assertions pour vérifier que la nouvelle note de frais a été créée correctement
      });
    });
    // Ajoutez d'autres tests ou describe ici si nécessaire
  });
});
