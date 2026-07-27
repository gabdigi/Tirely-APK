/* Tirely — mode 100% hors ligne.
   Ce fichier DOIT etre charge avant support.js.

   1) Il remplit window.__resources : le runtime dc y cherche une copie locale
      avant d'aller sur unpkg.com. Toutes les dependances viennent donc de ./vendor/.
   2) Sa simple presence desactive aussi le fetch(location.href) que le runtime
      fait au demarrage pour recharger le template a chaud — un fetch qui echoue
      systematiquement en file:// (dans un APK) et qui polluait la console.
*/
(function () {
  var V = './vendor/';
  var r = window.__resources || (window.__resources = {});
  r['https://unpkg.com/react@18.3.1/umd/react.production.min.js'] = V + 'react.production.min.js';
  r['https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js'] = V + 'react-dom.production.min.js';
  r['https://unpkg.com/@babel/standalone@7.29.0/babel.min.js'] = V + 'babel.min.js';
})();
