/**********GridService********************/
/*
*/

var gridService = angular.module('GridServiceModule',['ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.i18n', 'ui.grid.resizeColumns'])
gridService.service('GridService',["$http", function($http){
	/*
	function initilizeScope
	Initialisation par défaut de scope des controleur qui utilisent la directive GridAngular
	@prams Scope : Scope du controleur courant
	*/
	this.initilizeScope = function(Scope){
		console.info("Initilizing grid configuration..")  
	    //grid default Options 
	    Scope.gridOptions = {};
	    Scope.gridOptions.rowHeight = 77,
	    Scope.flags={}
	   	Scope.gridOptions.enablePaginationControls = false
	    Scope.gridOptions.enableFiltering = true //activer le filtre sur chaque colonne de la grille
	   	Scope.isDataEmpty= false
		Scope.isDataLoaded = false
		Scope.showMsgError = false
	    Scope.gridOptions.enableSorting = true //le click sur le titre de la colonne permettra de faire le trie selon la colonne
	    Scope.gridOptions.jqueryUITheme = true
	    Scope.gridOptions.enableCellEdit = false //pas de modification de cellue de la table
	    // Scope.gridOptions.totalItems = 25
	    Scope.gridOptions.useExternalPagination = true
	    Scope.gridOptions.enableGridMenu = true// afficher le menu show/hde colonne
	    Scope.gridDataUrl = {"url":""}		//url des données à affiher dans le tableau grille
	    Scope.gridFunctions = {}
	    Scope.cronFunctions = {}
	    Scope.cronFunctions["functions"] = {}
	    Scope.gridFunctions= {}
	    Scope.gridDataUrl={}
	    // Scope.filterCriterias: [{field:'', type:'', operator:''}]
	    self = this
	    Scope.gridOptions.onRegisterApi = function(gridApi){
        	//set gridApi on scope
	        Scope.gridApi = gridApi;
	        // calback à lancer au changement de pagination en cas de paginatio externe (server side paging)(numero de page ou demande de page suivantes/précedente ou changement de taille de la page)
	        Scope.gridApi.pagination.on.paginationChanged(Scope, function (newPage, pageSize) {
		        console.log('pagesize'+ pageSize)
		        console.log('pagesize'+ newPage)
		        //on charge de nouveau les données du serveurs
		        Scope.dataToSend.pageNumber = newPage
				Scope.dataToSend.pageSize = pageSize
		        self.getGridData(Scope, true)
	      	});
    	}
      	// callbacks de mise à jour des flags , appelés lorsq'on veux propager une modification au scopes de l'arbre de scopes, en utilisant le $emit du Scope
      	//--flag showMsgError
      	Scope.$on("UPDATE_showMsgError", function(event, value){
   			Scope.showMsgError = value
      	});
      	//--flag isDataLoaded
      	Scope.$on("UPDATE_isDataLoaded", function(event, value){
   			Scope.isDataLoaded = value
      	});
      	//-- modif de gridOptions
      	Scope.$on("UPDATE_gridOptions", function(event, value){
   			Scope.gridOptions = value
      	});
      	//-- flag isDataEmpty
  		Scope.$on("UPDATE_isDataEmpty", function(event, value){
			Scope.isDataEmpty = value
  		});
  		//-- flag isDataEmpty
  		Scope.$on("UPDATE_total_items", function(event, value){
			Scope.dataToSend.totalItems = value
  		});
	}

	/*
	function getGridData
	permet de charger les données en Ajax et mettre à jour la grille du scope et les flags
	@param Scope: scope de controlleur appellant
	@param keep_total_items : bool si on envoi le totals _items ou pas
	*/
	this.getGridData = function(Scope, keep_total_items){
		console.log(keep_total_items)
		//initialiser les flags et propagers cette modfication au scopes
		Scope.$emit("UPDATE_isDataLoaded", false) 
		Scope.$emit("UPDATE_showMsgError", false) 
		console.info('get data from :', Scope.gridDataUrl)
		$http.get(Scope.gridDataUrl, {params: Scope.dataToSend})
		//en cas de succéesde la requets Ajax, on met a jour la listedes données et les flags
		.success(function(response){
			//mettre à jour les données de la grille
			if(response.data){
				Scope.gridOptions.data = response.data
				// console.log("response data length: "+ response.data.length)
				// console.log(Scope.gridOptions.data)
				//mettre à jour la hauteur de la grid en fonction de nombre de lignes
				Scope.gridOptions.minRowsToShow = response.data.length
				//mettre à jour les flags de succées
				// propager les modification au scopes pour que les vues se mettent à jour
				Scope.$emit("UPDATE_isDataLoaded", true) 
				Scope.$emit("UPDATE_showMsgError", false) 
				Scope.$emit("UPDATE_gridOptions", Scope.gridOptions)
				// s'il y a de total items en cas de pagination
				if(response.totalItems){
					console.log('total items', response.totalItems)
					Scope.gridOptions.totalItems = response.totalItems
					// si les données proviennent d'une pagination alors on envoi le total_items pour eviter de les calculer
					if(keep_total_items){
						Scope.dataToSend.totalItems = angular.copy(Scope.gridOptions.totalItems)
						console.log(Scope.gridOptions.totalItems)
						Scope.$emit("UPDATE_total_items", angular.copy(Scope.gridOptions.totalItems)) 
					} else {
						Scope.$emit("UPDATE_total_items", '')
					}
				}
				// si pas données
				if(response.data.length == 0){
					console.log("isDataEmpty")
					Scope.$emit("UPDATE_isDataEmpty", true) 
				}
			}
		})
		// en cas d'erreur de la requete ajax
		.error(function(data, status, headers, config, statusText){
			//mettre à jour les flag d'erreur et les propager dans les autres scope
			Scope.$emit("UPDATE_isDataLoaded", true) 
			Scope.$emit("UPDATE_showMsgError", true) 
			if(status>0){
				alert("une erreur s'est produite lors du chargement de vos données !")
			}
		})
	}
	
	//pour tester en cas de date statique (à supprimer en prod)
	function sleep(milliSeconds){
		console.log('sleep')
	        var startTime = new Date().getTime();
	        while (new Date().getTime() < startTime + milliSeconds);
	}
}])