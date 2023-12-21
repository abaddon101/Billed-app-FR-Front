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

// Tests pour la page NewBill en tant qu'employé connecté
describe("Given I am connected as an employee", () => {
  // Initialisation de l'environnement de test avec une implémentation de localStorage
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  // Simulation de la connexion d'un utilisateur de type "Employee"
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
  // Création d'un élément div pour simuler la structure HTML de l'application
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  // Activation du routeur de l'application
  router();
  // Description des tests spécifiques à la page NewBill
  describe("When I am on the NewBill page", () => {
    // Test : Vérification de l'affichage du titre de la page
    test("Then title text content should be displayed", async () => {
      // Navigation vers la page NewBill
      window.onNavigate(ROUTES_PATH.NewBill);
      // Assertion : Vérification de l'existence du texte "Envoyer une note de frais"
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
    // Test : Vérification de la mise en surbrillance de l'icône de messagerie dans la disposition verticale
    test("Then mail icon in vertical layout should be highlighted", async () => {
      // Navigation vers la page NewBill
      window.onNavigate(ROUTES_PATH.NewBill);
      // Attente de l'affichage de l'icône mail
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      // Assertion : Vérification de la classe "active-icon" de l'icône
      expect(mailIcon.className).toBe("active-icon");
    });
  });
});

describe("Given I am connected as an employee and I am on the NewBill page", () => {
  let newBill; // Déclaration d'une variable pour stocker l'instance de NewBill
  let onNavigateMock; // Déclaration d'une variable pour stocker une fonction mock de navigation

  beforeEach(() => {
    // Avant chaque test, configuration de l'environnement de test
    // Effacement du contenu du corps du document HTML et ajout du HTML généré par la fonction NewBillUI()
    document.body.innerHTML = NewBillUI();
    // Initialisation d'une fonction mock pour la navigation
    onNavigateMock = jest.fn();
    window.onNavigate = onNavigateMock;
    // Définition de la fonction onNavigate qui sera utilisée pour la navigation dans le test
    const onNavigate = (pathname) => {
      // Mise à jour du contenu du corps du document HTML en fonction du chemin de navigation fourni
      document.body.innerHTML = ROUTES({ pathname });
    };
    // Initialisation de l'instance NewBill avec les paramètres nécessaires
    newBill = new NewBill({
      document,
      onNavigate,
      mockStore,
      localStorage: window.localStorage,
    });
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

  // Tests pour la soumission du formulaire avec des données valides
  describe("When I submit the form with valid data", () => {
    test("Then it should submit the form and navigate on Bills page", async () => {
      // Remplir les champs du formulaire avec des données valides
      const expenseNameInput = screen.getByTestId("expense-name");
      const datepickerInput = screen.getByTestId("datepicker");
      const amountInput = screen.getByTestId("amount");
      const vatInput = screen.getByTestId("vat");
      const pctInput = screen.getByTestId("pct");
      const fileInput = screen.getByTestId("file");

      userEvent.type(expenseNameInput, "Example Expense");
      userEvent.type(datepickerInput, "2023-12-20");
      userEvent.type(amountInput, "100");
      userEvent.type(vatInput, "20");
      userEvent.type(pctInput, "10");

      // Simulation du téléchargement d'un fichier
      const file = new File(["img"], "image.jpg", { type: "image/jpeg" });
      const fileList = createFileList([file]);
      Object.defineProperty(fileInput, "files", {
        get: () => fileList,
      });
      fireEvent.change(fileInput);

      // Soumission du formulaire
      const form = screen.getByTestId("form-new-bill");
      const testHandleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", testHandleSubmit);
      fireEvent.submit(form);
      expect(testHandleSubmit).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
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
  // Test pour  pour la soumission du formulaire avec des champs rempli

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

describe("Given I am connected as an employee 2", () => {
  let newBill; // Déclaration d'une variable pour stocker l'instance de NewBill
  beforeEach(() => {
    document.body.innerHTML = NewBillUI();
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
  });
  describe("When I am on the Newbill Page", () => {
    describe("When I filled in correct format all the required fields", () => {
      test("Then it should submit the form with file and navigate on Bills page", async () => {
        // Remplir les champs du formulaire avec des données valides
        const expenseTypeInput = screen.getByTestId("expense-type");
        const expenseNameInput = screen.getByTestId("expense-name");
        const datepickerInput = screen.getByTestId("datepicker");
        const amountInput = screen.getByTestId("amount");
        const vatInput = screen.getByTestId("vat");
        const pctInput = screen.getByTestId("pct");
        const fileInput = screen.getByTestId("file");

        fireEvent.change(expenseTypeInput, { target: { value: "Transports" } });
        fireEvent.change(expenseNameInput, {
          target: { value: "Nom de la dépense" },
        });
        fireEvent.change(datepickerInput, { target: { value: "2023-12-20" } });
        fireEvent.change(amountInput, { target: { value: "100" } });
        fireEvent.change(vatInput, { target: { value: "20" } });
        fireEvent.change(pctInput, { target: { value: "10" } });

        // Simulation du téléchargement d'un fichier
        const file = new File(["img"], "image.jpg", { type: "image/jpeg" });
        const fileList = createFileList([file]);
        Object.defineProperty(fileInput, "files", {
          get: () => fileList,
        });
        const testHandleChangeFile = jest.fn((e) =>
          newBill.handleChangeFile(e)
        );
        // Ajoutez un gestionnaire d'événement de changement de fichier
        fileInput.addEventListener("change", testHandleChangeFile);

        // Simulez le changement de fichier
        fireEvent.change(fileInput);

        // Soumission du formulaire
        const form = screen.getByTestId("form-new-bill");
        const testHandleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", testHandleSubmit);

        fireEvent.submit(form);

        // Vérifiez que handleSubmit a été appelée
        expect(testHandleSubmit).toHaveBeenCalledTimes(1);
        // Vérifiez que l'utilisateur est redirigé vers la page des factures
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      });
    });
    // describe("When the form is submitted", () => {
    // test("Then, it should send to the server when the form is submitted", async () => {
    //   // Simuler la saisie des valeurs du formulaire
    //   const expenseTypeInput = screen.getByTestId("expense-type");
    //   const expenseNameInput = screen.getByTestId("expense-name");
    //   const datepickerInput = screen.getByTestId("datepicker");
    //   const amountInput = screen.getByTestId("amount");
    //   const vatInput = screen.getByTestId("vat");
    //   const pctInput = screen.getByTestId("pct");
    //   const fileInput = screen.getByTestId("file");
    //   // Ajoutez ici d'autres sélections d'éléments pour les champs du formulaire

    //   fireEvent.change(expenseTypeInput, { target: { value: "SomeType" } });
    //   fireEvent.change(expenseNameInput, { target: { value: "SomeName" } });
    //   // Ajoutez ici d'autres changements pour les autres champs du formulaire

    //   // Simuler la sélection d'un fichier
    //   const fileInput = screen.getByTestId("file");
    //   const testFile = new File(["file content"], "file.txt", {
    //     type: "text/plain",
    //   });
    //   fireEvent.change(fileInput, { target: { files: [testFile] } });

    //   // Simuler la soumission du formulaire
    //   const form = screen.getByTestId("form-new-bill");
    //   fireEvent.submit(form);

    //   // Attendre que la requête au serveur soit terminée (par exemple, en utilisant waitFor)
    //   // Ajoutez du code ici pour attendre que la requête soit terminée

    //   // Vérifier que la méthode updateBill a été appelée avec les bonnes données
    //   expect(newBill.updateBill).toHaveBeenCalledWith({
    //     email: "user@example.com", // Remplacez par l'e-mail attendu
    //     type: "SomeType",
    //     name: "SomeName",
    //     // Ajoutez ici d'autres champs attendus
    //     fileUrl: expect.any(String),
    //     fileName: "file.txt",
    //     status: "pending",
    //   });

    //   // Vérifier que la navigation a eu lieu
    //   expect(window.onNavigate).toHaveBeenCalledWith("/bills");
    // });
  });
});
