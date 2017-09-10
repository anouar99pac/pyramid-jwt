/**************************************
1-le controleur AccountController hérite de MainController
2- Permet de configurer les options de grille qui affiche la liste des MKP 
3- exécuter les fonctions héritées du MainController avec les parametres du scope personnalisés
 ***************************************/

app.controller('AccountController', ['$scope', '$http', '$interval','uiGridConstants', function($scope, $http, $interval, uiGridConstants){

  //==============================initialisations==================================
  console.log("AccountController")
  $scope.account_id = $("#account-id").val()
  $scope.show_grid = false
  //==============================fonctions=========================================

   //gridFunction contiendra les fonctions à passer au scope de la grille pour qu'elle puisse les appliquer à ses coposantes 
  $scope.gridFunctions={
    /*******************lancer la synchronisation des annonces pour une MKP*****************/
    triggerSynchroAnnonce: function(mk_id, index){
      //associer des valeur au parametres, ensuite lancer la fonction du Controleur parent "MainController"
      url = '/account-marketplaces/trigger-synchro-annonces'
      property = 'SYNCHRO_ANNONCES_STATE'
      data ={'_csrf': 'csrf', 'marketplace_id': mk_id, 'account_id': $scope.account_id}
      $scope.triggerTask(url, property, index, data)
    },
    
    /*******************lancer la synchronisation des commande pour une MKP*****************/
    triggerSynchroCommande: function(mk_id, index){
      url = '/account-marketplaces/trigger-synchro-orders'
      //associer des valeur au parametres, ensuite lancer la fonction du Controleur parent "MainController"
      property = 'SYNCHRO_COMMANDES_STATE'
      data ={'_csrf': 'csrf', 'marketplace_id': mk_id, 'account_id': $scope.account_id}
      $scope.triggerTask(url, property, index, data)
    },

    /*******************lancer la publication des catalogues *****************/
    triggerCatalogPublication: function(mk_id, index){
      console.log("triggerCatalogPublication")

    }

  }

  //cronfunctions sont les fonctions à executer régulièrement dans un intervalle de temps juste après les chargement des données cf. getData du MainController en cas de succèss
  $scope.cronFunctions["functions"] = {
    /*checkAnnoncesState: recupère l'état de la synchronisation des annonces de la MKP et du compte courant*/
    checkAnnoncesState: function(){
      var url = "/account-marketplaces/get-account-mk-property"
      var property = 'SYNCHRO_ANNONCES_STATE'
      var group = 'ANNONCES'
      var data = {account_id: $scope.account_id, 'group':group, 'key':property}
      //lancer la fonctio du mainController chaque 30 secondes
      $scope.getProperty(url, data, property, group)
      },

    /* checkCommandesState: recupère l'état de la synchronisation des commandes de la MKP et du compte courant*/
    // checkCommandesState: function(){
    //   var url = "/account-marketplaces/get-account-mk-property"
    //   var property = 'SYNCHRO_COMMANDES_STATE'
    //   var group = 'COMMANDES'
    //   var data = {account_id: $scope.account_id, 'group':group, 'key':property}
    //   //lancer la fonctio du mainController chaque 30 secondes
    //   $scope.getProperty(url, data, property, group)
    //   }
  }    
  //==========================fonction Main=================================
  //le controleur doit configurer la grille d'affichage de la liste des place de marché pour le provisionning
  $scope.setGridOptions = function() {  
    // 1-- configuration des options de la grille  
    $scope.gridOptions.columnDefs =
    [
      { 
        name: 'id',
        cellTemplate:'<a href="">{{row.entity.id}}</a>',
        displayName: 'MKP_id',
        width:"10%",
        filter: {
          placeholder: 'saisir l\'id la MKP..',
          condition: uiGridConstants.filter.CONTAINS,
        },
      },
      { 
        name: 'name',
        cellTemplate:'<a href="">{{row.entity.name}}</a>',
        displayName: "Marketplace",
        width:"15%",
        filter: {
          placeholder: 'saisir le nom la MKP..',
          condition: uiGridConstants.filter.CONTAINS,
        },
      },
      {
        enableFiltering: true, 
        width:"10%",
        name:'preprod',
        displayName:'Preprod',
        filter:{
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ {label: 'oui', value: true}, {label: 'non', value: false}],
        },
        cellTemplate:'<span ng-if="row.entity.preprod" class="glyphicon glyphicon-ok btn-lg text-success"></span><span ng-if="!row.entity.preprod" class="glyphicon glyphicon-remove btn-lg text-danger"></span>',
      },
       { 
        enableFiltering: true,
        width:"10%",
        name:'active',
        displayName:'Active',
        filter:{
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ {label: 'oui', value: true}, {label: 'non', value: false}],
        },
        cellTemplate:'<span ng-if="row.entity.preprod" class="glyphicon glyphicon-ok btn-lg text-success"></span><span ng-if="!row.entity.preprod" class="glyphicon glyphicon-remove btn-lg text-danger"></span>',
      },
      { 
        width:"10%",
        name:'ca',
        displayName:'CA mensuel',
        cellTemplate:'<span>{{row.entity.ca}}k€</span>',
      },
      { 
        width:"10%",
        name:'date_activity_start',
        displayName:'Date d\'activité',
        cellTemplate:'<span>{{row.entity.date_activity_start}}</span>',
      },
      
      {
        width:"12%",
        enableFiltering: false,
        enableSorting:false,
        name:"annonces",
        displayName: "synchro annonces",
        cellTemplate:'<button ng-if="row.entity.SYNCHRO_ANNONCES_STATE !=\'en cours\'" class="grid-row-glyphicon glyphicon glyphicon-refresh btn btn-lg btn-info" tooltip-placement="left" tooltip="dernière synchro le 20/09/2015, cliquer pour relancer"bs-tooltip ng-click="grid.appScope.externalFunctions.triggerSynchroAnnonce(row.entity.id, grid.appScope.gridOptions.data.indexOf(row.entity))">&nbsp;<span class="glyphicon glyphicon-shopping-cart"></span></button>' +

        '<span ng-if="row.entity.SYNCHRO_ANNONCES_STATE==\'en cours\'"><span class="grid-row-glyphicon btn label label-warning">en cours</span> <img src="/static/img/progress_loader.gif" style="float: right; margin-right: 20px;"/></span>'
      },
      {
        width:"12%",
        enableFiltering: false,
        enableSorting:false,
        name:"commandes",
        displayName: "synchro commandes",
        cellTemplate:'<button ng-if="row.entity.SYNCHRO_COMMANDES_STATE ==\'fini\'" class="grid-row-glyphicon glyphicon glyphicon-cloud-upload btn btn-lg btn-info"  ng-click="grid.appScope.externalFunctions.triggerSynchroCommande(row.entity.id, grid.appScope.gridOptions.data.indexOf(row.entity))" tooltip-placement="left" tooltip="{{row.entity.SYNCHRO_COMMANDES_DURATION}}", cliquer pour relancer" bs-tooltip>&nbsp;<span class="glyphicon glyphicon-gift"></span></button>' +

        '<span ng-if="row.entity.SYNCHRO_COMMANDES_STATE==\'en cours\'" ><span class="grid-row-glyphicon btn label label-warning" tooltip-placement="left" tooltip="{{row.entity.SYNCHRO_COMMANDES_DURATION}}">en cours</span> <img src="/static/img/progress_loader.gif" style="float: right; margin-right: 20px"/></span>'
      },
      {
        width:"10%",
        enableFiltering: false,
        enableSorting:false,
        name:"debloque",
        displayName: "publier le catalogue",
        cellTemplate:'<button ng-if="row.entity.CATALOG_PUBLICATION_STATE != \'en cours\'" class="grid-row-glyphicon glyphicon glyphicon-refresh btn btn-lg btn-success"  ng-click="grid.appScope.externalFunctions.triggerCatalogPublication(row.entity.id, grid.appScope.gridOptions.data.indexOf(row.entity))" tooltip-placement="left" tooltip="publier le catalogue" bs-tooltip>&nbsp;<span class="glyphicon glyphicon-globe"></span></button>' +

        '<span ng-if="row.entity.CATALOG_PUBLICATION_STATE==\'en cours\'" class="grid-row-glyphicon btn label label-warning">en cours <img src="/static/img/progress_loader.gif" style="float: right"/></span>'
      }
    ]

    $scope.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          $scope.gridApi = gridApi;
        }
  }
  $scope.setGridOptions();
  $scope.getMarketPlaces = function() {
    $scope.show_grid = true
    $scope.flags["isDataLoaded"] = false
    // 2-- l'URL à appler pour charger les données de la MKP : passage par référence pour pointer le même objet avec le mainController 
    $scope.gridDataUrl["url"] = "/account/account-marketplaces/" + $scope.account_id 
    //3-- récupérer les données à afficher dans le tableau
    $scope.getData()
    //4-- après le chargement de data on lance les requètes cron
    console.log($scope.cronFunctions)
    $interval(function(){$scope.triggerCronFunctions()}, 10300)
  }
  $scope.abortRequests= function(){
    var deferredAbort = $q.defer()
    console.log(deferredAbort)

  }
}])
