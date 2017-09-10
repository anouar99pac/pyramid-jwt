/**========directive filtre
	* 
 	*permet l'affichage de filtre en fonction des colonnes passées en parametres
 	la dirctive modifie au fure et a mesure le tableau de critères en fonction des criteres choisis
 	*
 	*@class Filter
 	*@pram {object} filterColumns: les colonnes sur lequels on va filtrer  
 	columns = [
       {
            'field': 'SKU', # la colonne en DB
            'name' :  _("SKU"), # le nom labelisee de la colonne
            'operators': condition_operators, # liste de operateurs possibles
        }
        ]
 	*@param {object} filterOperators: tableau d'operateurs à appliquer sur les colonnes
 	 filterOperators = {'SKU': {"eq":{'type':'text', 'name': _("filter.equal")}}
 	*@param {array} filterCriterias: le tableau de critères à remplir par la directive filter 
 	operators = {
        "eq":{'type':'text', 'name': _("filter.equal")}
    }
    *@param {string} urlSearch: l'url de récuếration de données après l'application de filtre
 */
var filter = angular.module('filter', ['GridServiceModule', 'ngTagsInput'])
 filter.directive('filter',['$http', 'GridService', function($http, GridService){
 	return {
 		restrict: 'E', //la directive sera appelée comme balise html:<filter>
 		transclude: true,
 		scope:{
 			filterColumns:'=',
 			filterOperators:'=',
            gridOptions:"=",	
            isDataLoaded:"=",
            isDataEmpty:"=",
            showMsgError:"=",
            urlSearch:"@",
            attachedData:"=",
            criteriasToSend:"="
 		},
 		templateUrl:"/filter",//--template du filtre
 		link: function(scope, element, attributs){
 			// console.log("filter attribtes")
 			// console.log(attributs)
	 		scope.filterCriterias=[{'field':'--', 'type':'', 'operator':''}]
 			console.info("filter is ready !")
 			scope.data_to_send = {}
 			/**
 			*@function ChangeCriteriasColumn
 			*
 			* permet de changer la colonne à chercher dans le tableau de critères en fonction de l'index
 			le type de l'opérateur change automatiquement en fonction de la nouvelle colonne(cf template filter)
 			*
 			*@param {integer} index : l'index du crtère à modifier dans le tableau de critères
 			*@param {object} column : la nouvelle colonne qui remplace l'ancienne
 			**/
 			scope.ChangeCriteriasColumn = function(index, column){
 				//si on choisie une colonne specifique dans le select des colonnes
 				console.log("change column of criterias")
 				console.log(column)
 				if(column && column.field){
 					//on met à jour la colonne à filtrer dans le tableau de critère
 					scope.filterCriterias[index]['field'] = column.field
 				}
 				//si non si on choisi l'option --
 				else{
 					scope.filterCriterias[index]['field'] = "--"
 				}
 					console.log(scope.filterCriterias)
 			}
 			/**
 			*@function changeOperator
 			*
 			* permet de changer l'operateur dans le tableau de critères en fonction de l'index
 			*
 			*@param {integer} index : l'index dans le tableau du critères
 			*@param {object} Operator : le nouvel opérateur 
 			*/
 			scope.changeOperator = function(index, operator){
 				console.log("changeOperator")
 				//on met à jour le nouvel opérateur
 				console.log(index)
 				console.log(operator)
	 			scope.filterCriterias[index]['operator'] = operator
 				if(operator != undefined && operator != '--'){
	 				//on met à jour le type d'opérateur correspondant dans le tbleau de critères
	 				var column = scope.filterCriterias[index]['field']
	 				scope.filterCriterias[index]['type'] = scope.filterOperators[column][operator]['type']
	 				console.log(scope.filterCriterias)
	 				//si le type de lm'opérateur n'est pas du text à saisir, on met à jour aussi sa valeur 
	 				if(scope.filterCriterias[index]['type'] !== 'text' && scope.filterCriterias[index]['type'] !== "multipleTag") {
	 					scope.filterCriterias[index]['value'] = scope.filterOperators[column][operator]['value']
	 				}
	 				if(scope.filterCriterias[index]['type'] == 'text') {
	 					scope.filterCriterias[index]['value'] = ''
	 				}
	 				if(scope.filterCriterias[index]['type'] == 'multipleTag') {
	 					scope.filterCriterias[index]['value'] = []
	 				}
 				}else if(operator == '--'){
 					scope.filterCriterias[index]['type'] = ''
 					scope.filterCriterias[index]['type'] = ''
 				}
 			}
 			/**
 			*@function addCriteria
 			*
 			*Permet d'ajouter un nouveau critère dans le tableau de critères
 			*
 			*/
 			scope.addCriteria = function(){
 				//1-- on fait une parse sur la liste précédente pour mettre à jour le filtre à envoyer dans le scope(ça servira s'il y pour la pagination)
 				scope.filterCriterias.push({'field':'--', 'operator':'--'})
 				console.log(scope.filterCriterias)
 			}
 			/**
 			*@function removeCriteria
 			*
 			*supprimer un critere du tbleau en fonction de son index
 			*
 			*/
			scope.removeCriteria = function(index){
				//le tableau de critère doit avoir au minimum une ligne
 				if(index >0){
 					scope.filterCriterias.splice(index,1)
 				}
 				console.log(scope.filterCriterias)
 			}
 			/**
 			*@function removeCriteria
 			*
 			*réinitialiser le filtre
 			*
 			*/
 			scope.resetFilter = function(){
 				scope.filterCriterias = [{'field':'--'}]
 			}

 			/**
 			*@function addFilterValue
 			*
 			*changer la valeur de critère correspondant à l'index dans la tableau de critères
 			*
 			*@param {integer} index: index de critière 
 			*@param {string} value: nouvelle valeur du critère 

 			*/
 			//scope.changeFilterValue = function(index, value){
 			//	scope.filterCriterias[index]['value'] = value
 			//	console.log(scope.filterCriterias)
 			//}

 			//lancer la recherche en fonction des critères de ercherche et de l'url de recherche
 			scope.searchData = function(){
 				
 				//si le filtre est attaché à une grille, on effectue la recherche des données
 				if(scope.urlSearch && scope.gridOptions){
 					//1- configurer les url et la date to send
 					scope.gridDataUrl = scope.urlSearch
 					//2-- clean filter criterias et supprimer les lignes vides
 					cleanFilterCriterias()
 					//3-- convertir les critères avant de les envoyers
 					prepareCriteriasToSend()
 					//4- lancer la recherche s'il ya des critères 
 					if(scope.dataToSend.filterCriterias !='[]'){
 						GridService.getGridData(scope, false)
 					}
 				}
 			}
 			/*
			fonction permet de nettoyer la liste de filtre 
			champs de type dates: convertir les valeurs du champs de type date en chaine de caracteres qui respect un format passé en parametres
			//format de date est YYYY-MM-DD
			champs de type multitag: remplacer la valeur par une liste des chaine de caracteres au lieu d'une liste des objects
 			*/
 			function cleanFilterCriterias(){
 				console.info("clean filter criterias before send")
 				scope.criteriasToSend  = angular.copy(scope.filterCriterias)
 				angular.forEach(scope.criteriasToSend, function(value, key){
 					//console.log(value)
 					//1-- supprimer les lignes vides et 
 					if(value.field == "--" || value.operator =="--"){
 						if(key!=0){
 							scope.filterCriterias.splice(key,1)
 						}
 						scope.criteriasToSend.splice(key,1)
 					}
 					//formater les champs dates par le format YYYY-MM-DD
 					if(value.type=="date" && value.value instanceof Date){
 						var valueDate = value.value
 						value.value = valueDate.getFullYear() + '-' + (valueDate.getMonth()+1) + '-' + valueDate.getDate()
 					}
 					//formater le champs mutitag
 					if(value.type=="multipleTag" && value.value instanceof Array){
 						var tabValues = []
 						angular.forEach(value.value, function(val,index){
 							tabValues.push(val.text)
 						})
 						value.value = tabValues
 					}
 				})
 				console.info("tabs of criterias after clean")
 				console.log(scope.criteriasToSend)
 			}

 			/*
 			fonntion permet de préparer le tableau de critères à envoyer sous format Json 
 			*/
 			function prepareCriteriasToSend(){
 				//on copie l'object attachedData a scope.dataToSend  pour utiliser gridService
 				scope.dataToSend = angular.copy(scope.attachedData)
 				scope.criteriasToSend = angular.toJson(scope.criteriasToSend)
 				// scope.criteriasToSend = scope.filterCriterias
 				scope.dataToSend['filterCriterias'] = scope.criteriasToSend
 				//s'il y à une seule ligne dans le filtre
 				if(scope.filterCriterias.length == 1 && (scope.filterCriterias[0].operator == '--' || scope.filterCriterias[0].field == '--' || scope.filterCriterias[0].operator == "")) {
			    	scope.dataToSend.filterCriterias = [angular.toJson([])]	
			    }
 			}

 			/*
 				permet de convertir les valeurs de champs dates en strign avec el format passé en parametres 
 			*/
 			function convertDateToStrings(format){

 			}

 			/*
			si on ajoute une valeur dans le champs multitagInput

 			*/
			scope.tagAdded = function(tag){
 				console.log(tag)
 			}
 			/*
 			callback à chaque fois qu'on supprime une valeur d'un champs multivaleurs
 			@params: tag : le tag supprimé
 			@param:index: l'index de l'objet crière dans la tableau de critères
 			*/
 			scope.tagRemoved = function(tag, index){
 				console.log(index)
 				//s'il n y a plus de valeurs dans le champs
 				console.log(scope.filterCriterias)
 				console.log(tag)
 				//s'il n y a plus de valeur dans le champs multivaleurs on doit bloquer l'ajout d'un critère
 				//il faut just mettre la value à null pour 
 				if(scope.filterCriterias[index].value.length == 0){
 					scope.filterCriterias[index].value = null
 				}
 			}
		    /*dates*/
		    scope.open = function($event) {
		    	scope.status.opened = true;
		  	};

		  	scope.setDate = function(year, month, day) {
		    	scope.dt = new Date(year, month, day);
		  	};

		  		scope.dateOptions = {
			    formatYear: 'yy',
			    startingDay: 1
		  	};

		  	// scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  	// scope.format = scope.formats[0];

		  	scope.status = {
		    opened: false
		  };
	}
	}
 }]);