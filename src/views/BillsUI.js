// Importation des composants nécessaires
import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import Actions from "./Actions.js";

// Fonction pour générer le HTML d'une ligne (row) représentant une facture
const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
  `;
};

// Fonction pour générer le HTML de toutes les lignes (rows) à partir des données fournies
const rows = (data) => {
  // console.log(data);
  if (data && data.length) {
    // Trie les données par date dans l'ordre décroissant
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Map chaque facture à une ligne HTML et les joint ensemble
    return data.map((bill) => row(bill)).join("");
  } else {
    return "";
  }
};

// Fonction principale exportée sous forme de composant React
export default ({ data: bills, loading, error }) => {
  // console.log(bills)
  // Fonction pour générer le HTML de la modale
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  // Si la page est en cours de chargement, afficher la page de chargement
  if (loading) {
    return LoadingPage();
  } else if (error) {
    // Si une erreur est survenue, afficher la page d'erreur avec le message d'erreur
    return ErrorPage(error);
  }

  // Si les données sont disponibles, générer le HTML de la page
  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
          <table id="example" class="table table-striped" style="width:100%">
            <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody data-testid="tbody">
              ${rows(bills)}
            </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};
