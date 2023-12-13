// Importation des icônes SVG depuis les fichiers correspondants
import eyeBlueIcon from "../assets/svg/eye_blue.js";
import downloadBlueIcon from "../assets/svg/download_blue.js";

// Fonction qui retourne le HTML représentant les icônes d'action pour une facture
export default (billUrl) => {
  // Retourne une chaîne de caractères contenant le HTML des icônes d'action avec le lien vers la facture (billUrl)
  return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`;
};
