// Fonction pour formater une date au format "jj MMM. yy" (par exemple, "15 Janv. 22")
export const formatDate = (dateStr) => {
  // Crée un objet Date à partir de la chaîne de caractères de la date
  const date = new Date(dateStr);

  // Obtient l'année au format numérique (par exemple, "22" pour 2022)
  const ye = new Intl.DateTimeFormat("fr", { year: "numeric" }).format(date);

  // Obtient le mois au format abrégé (par exemple, "Jan" pour janvier)
  const mo = new Intl.DateTimeFormat("fr", { month: "short" }).format(date);

  // Obtient le jour au format deux chiffres (par exemple, "15" pour le 15ème jour du mois)
  const da = new Intl.DateTimeFormat("fr", { day: "2-digit" }).format(date);

  // Convertit la première lettre du mois en majuscule et concatène avec la date et l'année formatées
  const month = mo.charAt(0).toUpperCase() + mo.slice(1);

  // Retourne la date formatée
  return `${parseInt(da)} ${month.substr(0, 3)}. ${ye.toString().substr(2, 4)}`;
};

// Fonction pour formater le statut d'une facture
export const formatStatus = (status) => {
  // Utilise une instruction switch pour mapper les différents états de facturation
  switch (status) {
    case "pending":
      return "En attente";
    case "accepted":
      return "Accepté";
    case "refused":
      return "Refusé";
    default:
      return status; // Retourne le statut tel quel s'il ne correspond à aucun des états spécifiés
  }
};
