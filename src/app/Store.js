// Fonction utilitaire qui gère les erreurs de réponse JSON
const jsonOrThrowIfError = async (response) => {
  // Si la réponse n'est pas OK, lance une erreur avec le message de la réponse JSON
  if (!response.ok) throw new Error((await response.json()).message);
  // Sinon, retourne la réponse JSON
  return response.json();
};

// Classe Api qui gère les requêtes API de base
class Api {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  // Méthode pour effectuer une requête GET
  async get({ url, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, { headers, method: "GET" })
    );
  }

  // Méthode pour effectuer une requête POST
  async post({ url, data, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, {
        headers,
        method: "POST",
        body: data,
      })
    );
  }

  // Méthode pour effectuer une requête DELETE
  async delete({ url, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, { headers, method: "DELETE" })
    );
  }

  // Méthode pour effectuer une requête PATCH
  async patch({ url, data, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, {
        headers,
        method: "PATCH",
        body: data,
      })
    );
  }
}

// Fonction utilitaire pour obtenir les en-têtes de requête avec gestion du token JWT
const getHeaders = (headers) => {
  const h = {};
  // Ajoute l'en-tête "Content-Type" si noContentType n'est pas défini dans headers
  if (!headers.noContentType) h["Content-Type"] = "application/json";
  // Ajoute l'en-tête "Authorization" avec le token JWT si disponible et noAuthorization n'est pas défini dans headers
  const jwt = localStorage.getItem("jwt");
  if (jwt && !headers.noAuthorization) h["Authorization"] = `Bearer ${jwt}`;
  return { ...h, ...headers };
};

// Classe ApiEntity qui représente une entité dans l'API
class ApiEntity {
  constructor({ key, api }) {
    this.key = key;
    this.api = api;
  }

  // Méthode pour sélectionner une entité avec un sélecteur
  async select({ selector, headers = {} }) {
    return await this.api.get({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
    });
  }

  // Méthode pour lister toutes les entités
  async list({ headers = {} } = {}) {
    return await this.api.get({
      url: `/${this.key}`,
      headers: getHeaders(headers),
    });
  }

  // Méthode pour mettre à jour une entité avec un sélecteur
  async update({ data, selector, headers = {} }) {
    return await this.api.patch({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
      data,
    });
  }

  // Méthode pour créer une nouvelle entité
  async create({ data, headers = {} }) {
    return await this.api.post({
      url: `/${this.key}`,
      headers: getHeaders(headers),
      data,
    });
  }

  // Méthode pour supprimer une entité avec un sélecteur
  async delete({ selector, headers = {} }) {
    return await this.api.delete({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
    });
  }
}

// Classe Store qui encapsule l'API et fournit des méthodes d'accès aux entités
class Store {
  constructor() {
    // Initialise l'API avec une URL de base
    this.api = new Api({ baseUrl: "http://localhost:5678" });
  }

  // Méthode pour obtenir un utilisateur par son ID
  user = (uid) =>
    new ApiEntity({ key: "users", api: this.api }).select({ selector: uid });

  // Méthode pour obtenir la liste des utilisateurs
  users = () => new ApiEntity({ key: "users", api: this.api });

  // Méthode pour effectuer une requête de connexion
  login = (data) =>
    this.api.post({
      url: "/auth/login",
      data,
      headers: getHeaders({ noAuthorization: true }),
    });

  // Méthode pour obtenir une référence à un chemin (non implémentée dans le code fourni)
  ref = (path) => this.store.doc(path);

  // Méthode pour obtenir une facture par son ID
  bill = (bid) =>
    new ApiEntity({ key: "bills", api: this.api }).select({ selector: bid });

  // Méthode pour obtenir la liste des factures
  bills = () => new ApiEntity({ key: "bills", api: this.api });
}

// Exporte une instance de la classe Store pour une utilisation globale
export default new Store();
