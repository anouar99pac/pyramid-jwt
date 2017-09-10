 //========directive <grid-angular></grid-angular>
 //permet l'affichage de grille
 // le template utilise la directive angular ng-grid
 // le tableau gridOption sera passé en parametre ng-grid
 // la directive gridAngular permet de charger la data correspondante au target
 // et l'ajoute au tableau GridOption
 //GridOption est un tableau qui respecte la norme de ng-grid (http://angular-ui.github.io/ng-grid/)
 //il est personnalisé par chaque controleur

var grid = angular.module('gridAngular', [])
 grid.directive('gridAngular', function(){

 	return {
 		restrict: 'E', //la directive sera appelée comme balise html:<grid-angular>
 		transclude: true,
 		scope:{
 			gridOptions:'='	,//--attribut de balise contient les données de la grille
 			//target:'@',
 			isDataLoaded:"=",
 			isDataEmpty:"=",
 			externalFunctions:"=", //fonctions passé en parametres
 			gridApi:"=",
 			showMsgError:"="
 		},
 		templateUrl:"/grid",//--template de la grille
 	}
 });
