// Exporte une fonction anonyme (fonction fléchée) qui génère une chaîne de caractères représentant une partie du code HTML
export default () => {
  // Affiche un message de débogage indiquant le début du rendu
  // console.log("Start rendering...");

  // Retourne une chaîne de caractères représentant la structure HTML de la page
  return `
    <div class="page-div">
      <div class="row">
        <div class="title-container"> 
          <!-- Ajoute un logo avec une icône de reçu -->
          <svg width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-receipt" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <!-- Chemin de l'icône -->
            <path fill-rule="evenodd" d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z"/>
            <!-- Deuxième chemin de l'icône -->
            <path fill-rule="evenodd" d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <!-- Ajoute un titre à la page -->
          <h1> Billed </h1>
        </div>
      </div>
      <div class="row">
        <!-- Colonne pour le formulaire de l'employé -->
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <!-- Formulaire de connexion pour l'employé -->
              <form class="form-signin" data-testid="form-employee">
                <h2 class="h3 mb-3 font-weight-normal">Employé</h2>
                <label for="employee-email-input">Votre email</label>
                <input type="email" data-testid="employee-email-input" id="employee-email-input" class="form-control" placeholder="valid email" required autofocus>
                <label for="employee-password-input">Mot de passe</label>
                <input type="password" data-testid="employee-password-input" id="employee-password-input" class="form-control" placeholder="current-password" required>
                <button class="btn btn-lg btn-primary btn-block" data-testid="employee-login-button" style="background-color: #0E5AE5;" type="submit">Se connecter</button>
              </form>
            </div>
          </div>
        </div>
        <!-- Colonne pour le formulaire de l'administrateur -->
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <!-- Formulaire de connexion pour l'administrateur -->
              <form class="form-signin" data-testid="form-admin">
                <h2 class="h3 mb-3 font-weight-normal">Administration</h2>
                <label for="admin-email-input">Votre email</label>
                <input type="email" data-testid="admin-email-input" id="admin-email-input" class="form-control" placeholder="valid email" required autofocus>
                <label for="admin-password-input">Mot de passe</label>
                <input type="password" data-testid="admin-password-input" id="admin-password-input" class="form-control" placeholder="current-password" required>
                <button type="submit" class="btn btn-lg btn-primary btn-block" data-testid="admin-login-button" style="background-color: #0E5AE5;">Se connecter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
