/*********************************MainController**************************************/
'use strict'
var app = angular.module('neteven',["ui.grid", 'gridAngular', 'DataService', 'ui.grid.i18n', 'ui.bootstrap', 'ngTouch','cfp.loadingBar', 'ngTagsInput', 'filter', 'ngCookies', 'angucomplete-alt', 'uiSwitch', 'ngWebsocket'])
app.controller('MainController', ['$scope','cfpLoadingBar','$http','uiGridConstants','GetDataService','i18nService','$interval', function ($scope ,cfpLoadingBar, $http, uiGridConstants, GetDataService, i18nService, $interval, $websocket){
	 //1======================initialisations
	console.log("MainController")  
    $scope.gridOptions = {};
    $scope.flags={}
    $scope.flags["isDataEmpty"] = false
    $scope.flags["isDataLoaded"] = false
    $scope.flags["show_msg_error"] = false
    //configuration commune des options de la grille
    $scope.gridOptions.enableFiltering = true
    $scope.gridOptions.enableSorting = true //le click sur le titre de la colonne permettra de faire le trie selon la colonne
    $scope.gridOptions.jqueryUITheme = true
    $scope.gridOptions.enableCellEdit = false //pas de modification de cellue de la table
    $scope.gridOptions.enablePaging = false //pas de pagination
    $scope.gridOptions.showFooter = false // ne pas afficher le foote de la pagination
    $scope.gridOptions.enableGridMenu = true// afficher le menu show/hde colonne
    $scope.gridDataUrl = {"url":""}		//url des données à affiher dans le tableau grille
    $scope.gridFunctions = {}
    $scope.cronFunctions = {}
    $scope.cronFunctions["functions"] = {}
    $scope.gridFunctions= {}
    //=========================charger les données de la grid
    $scope.getData = function(){
    	//lancer le loader de chargment en top de page 
    	
	    $scope.flags["isDataLoaded"] = false;
    	cfpLoadingBar.start()
	    var requestForGridData = GetDataService.getData($scope.gridDataUrl["url"])
	    requestForGridData.then(
	          function( newData ) {
	          	// arreter le loader
	          	cfpLoadingBar.complete()
	          	// 1 --tester si la data envoyée est vide pour mettre a jour les indicateurs
	            if(newData.data['data'].length == 0) {
	            	$scope.flags["isDataLoaded"] = true;
	                $scope.flags["isDataEmpty"] = true;
	            }
	            //on affecte la data reçu au gridOption.data de notre scope
	            else {
	                $scope.flags["isDataEmpty"] = false;
	            	$scope.gridOptions.data = newData.data["data"];
	            	$scope.flags["isDataLoaded"] = true;
	            	$scope.flags["show_msg_error"] = false
	          	}
	          },
	          function(errorMessage) {
		            //affichage de message d'erreur si l'erreur vient de serveur
            		console.error("can not get data from:", $scope.gridDataUrl["url"] )
	          		cfpLoadingBar.complete()
	              	if(errorMessage !== "concelled"){
		            	$scope.flags["isDataLoaded"] = true
			            $scope.flags["show_msg_error"] = true
	              } 
	          }
	      );
	}

	//==================function triggerTask====================

	/** permet de lancer une tache en fonction d'url
	
	@param url : l'url à consulter
	@param property: le nom de la propriété à changer dans le gridOption
	@param index: l'index de la  proprieté à changer dans le tableau gridOptions
	@param data: data à attacher avec l'url
	*/
	$scope.triggerTask = function(url, property, index, data){
		// 1-- demarrer le loader en top de page
		cfpLoadingBar.start()
		// 2-- accéder à l'url en question
		$http.post(url, data)
         	.success(function(response){
		        cfpLoadingBar.complete() //arreter le loader
	            //3-- si la réponse est ok alors on modifie l'état de la proprieté en question
	            if(response.status && response.status=="ok") {
	              $scope.gridOptions.data[index][property] = "en cours"
            	}	
          	})
          .error(function(data, status, headers, config){
          	cfpLoadingBar.complete() //arreter le loader
            alert("erreur de lancement de tâche !", status)
            console.error("can not trigger task for", property, " from:", url )

          })
	}

	//=====================getProperty====================

	/** permet de récupérer une proprieté et modifer son affichaged dans lav ue

	@param url : l'url à consulter
	@param property: le nom de la propriété à changer dans le gridOption
	@param index: l'index de la  proprieté à changer dans le tableau gridOptions
	@param data: data à attacher avec l'url
	*/
	$scope.getProperty = function(url, data, property, group){
		$http.post(url, data)
     	.success(function(response){
            //1-- si la réponse est ok alors on modifie l'état de la proprieté en question pur chaque MKP
            if(response.properties) {
				for (i in $scope.gridOptions.data) {
				var marketplace_id = $scope.gridOptions.data[i]["id"]
				$scope.gridOptions.data[i][property] = response.properties[marketplace_id]
				}
        	}	
      	})
      	//error: afficher le message d'erreur dans la console
		.error(function(data, status, headers, config){
		console.error("can not charge property", property, " from:", url )
		})
	}

	//==================triggerCronFunctions
	$scope.triggerCronFunctions = function(){
		//executer les fonctions cron du scope
  		for(fonction in $scope.cronFunctions.functions) {
  			//s'il y a des fonctions on les exécute
  			if(fonction){
  				 $scope.cronFunctions.functions[fonction]()
  			}
  		}
	}

}])