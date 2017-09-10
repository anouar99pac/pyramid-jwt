/**************************************
1-le controleur provisionningController hérite de MainController
2- Permet de configurer les options de grille qui affiche la liste des MKP 
3- exécuter les fonctions héritées du MainController avec les parametres du scope personnalisés
 ***************************************/

app.controller('ProvisionningController', ['$scope', '$http', '$interval','uiGridConstants','GetDataService',  function ($scope,$http, $interval, uiGridConstants, GetDataService, $window ){

   //==============================initialisations==================================
  
    $scope.marketplace_name_label = 'Marketplace'
    $scope.date_label='Dernière mise à jour'
    $scope.tootltip_label_download_provisionning ='Télécharger le dernier différentiel'
    $scope.tootltip_label_trigger_wf ='déclancher le wk'
    $scope.tootltip_label_update_provisionning ='mettre à jour le référentiel'
    $scope.action_label ='Action'
    $scope.state_label = 'état de provisionning'

    //==============================fonctions=========================================

    //gridFunction contiendra les fonctions à passer au scope de la grille pour qu'elle puisse les appliquer à ses coposantes 
    $scope.gridFunctions={
      //---------déclancher le workflow
      triggerProvisionningWorkflow: function(mk_id, index){
         $http.post("/trigger-workflow", {'_csrf':'csrf', 'marketplace_id': mk_id})
          .success(function(response){
            if(response.status && response.status=="ok") {
              //$popover.$hide()
              $scope.gridOptions.data[index].report_state = "en cours"
            }
          })
          .error(function(data, status, headers, config){
            alert(status)
          })
      }, 

      //---------mettre à jour le référentiel
      updateProvisionning: function(mk_id){
       $http.post("/update-provisionning", {'_csrf':'csrf', 'marketplace_id': mk_id})
          .success(function(response){
              $scope.gridOptions.data[index].report_state = "en cours"
              console.log(response)
          })
          .error(function(data, status, headers, config){
            alert(status)
          })
          
      } 
    } 

    //===========checkReportStates
    /*recupère l'état de reporting de chaque marketplace*/
    $scope.checkReportStates = function(){
      $http.get("/get-mk-provisionning-states?group=provisionning")
      .success(function(response){
        //mettre à jour les état de provisionning dans le tableau
        if(response && response.properties) {
          for (i in $scope.gridOptions.data) {
            var marketplace_id = $scope.gridOptions.data[i]["marketplace_id"]
            if(response.properties[marketplace_id]){
              $scope.gridOptions.data[i]["report_state"] = response.properties[marketplace_id]["REPORT_STATE"]
              $scope.gridOptions.data[i]["last_report_generated_date"] = response.properties[marketplace_id]["LAST_REPORT_GENERATED_DATE"]
              $scope.gridOptions.data[i]["last_report_url"] = response.properties[marketplace_id]["LAST_REPORT_URL"]
            }
          }
        }
      })
    }

    //===============fonction cron pour récupérer l'état de rapport chaque 30seconde
    $scope.cronReportState=function(){
      $interval(function(){$scope.checkReportStates()},10300)
    }

    //==========================fonction Main=================================
    //le controleur doit configurer la grille d'affichage de la liste des place de marché pour le provisionning
    $scope.setGridOptionsProvisionning = function(){

        // 1-- configuration des options de la grille
        $scope.gridOptions.columnDefs = [] 
        $scope.gridOptions.columnDefs =
        [
          { 
            name: 'marketplace_name',
            cellTemplate:'<a href="">{{row.entity.marketplace_name}}</a>',
            displayName: $scope.marketplace_name_label,
            width:"30%",
            filter: {
              placeholder: 'saisir le nom la MKP..',
              condition: uiGridConstants.filter.CONTAINS,
            },
          },
          { 
            width:"20%",
            name:'last_updated_date',
            displayName:$scope.date_label,
            cellTemplate:'<span ng-if="row.entity.last_updated_date"> {{row.entity.last_updated_date}}</span>',
            filter:{
              
              filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" datepicker /></div>'
            }
          },
          {
            width:"20%",
            field:'report_state',
            filter:{
              type: uiGridConstants.filter.SELECT,
              selectOptions: [ {label: 'en cours', value: 'en cours'}, {label: 'fini', value: 'fini'}, {label: 'erreur', value: 'erreur'}],
            },
            displayName:$scope.state_label,
            //width:"12%",
            cellTemplate: '<span ng-if="row.entity.report_state ==\'fini\'" class="text-success">{{row.entity.report_state}}&nbsp;<span class="glyphicon glyphicon-ok text-success" style="float: left; margin-right:5px"></span></span>'
           
            +'<span ng-if="row.entity.report_state==\'en cours\'"> <span class="text-info"> {{row.entity.report_state}}</span><img src="/static/img/progress_loader.gif" style="float: right"/></span>'
  
            +'<span ng-if="row.entity.report_state ==\'erreur\'" class="text-danger" popover-trigger="mouseenter" data-toggle="tooltip" popover="cause d\'erreur">{{row.entity.report_state}} &nbsp;<span class="glyphicon glyphicon-remove text-danger"  style="float: left; margin-right:5px"></span></span>'
           
          },
          {
            width:"30%",
            enableFiltering: false,
            enableSorting:false,
            name:"actionProvisionnig",
            displayName: $scope.action_label,
            cellTemplate:'<button class="grid-row-glyphicon glyphicon glyphicon-import btn btn-lg btn-warning" popover-placement="right" data-toggle="tooltip" popover-trigger="mouseenter" data-toggle="tooltip" popover="' + $scope.tootltip_label_trigger_wf + ', " ng-click="grid.appScope.externalFunctions.triggerProvisionningWorkflow(row.entity.marketplace_id, grid.appScope.gridOptions.data.indexOf(row.entity))" ng-disabled="row.entity.report_state==\'en cours\'"></button>' + 
  
            '<a href="marketplace_management/show-report/{{row.entity.marketplace_id}}" target="_blank" class="grid-row-glyphicon glyphicon glyphicon-cloud-download btn btn-info btn-lg" data-toggle="tooltip" popover-trigger="mouseenter" popover-placement="left" data-toggle="tooltip" popover="' + $scope.tootltip_label_download_provisionning + ', mis à jour le  {{row.entity.last_report_generated_date}}" ></a>' +
  
  
          '<button class="grid-row-glyphicon btn btn-lg btn-success glyphicon glyphicon-retweet" popover-placement="left" data-toggle="tooltip" popover-trigger="mouseenter" data-toggle="tooltip" popover="' + $scope.tootltip_label_update_provisionning + '" ng-click="grid.appScope.externalFunctions.updateProvisionning(row.entity.marketplace_id)" ng-disabled="row.entity.report_state==\'en cours\'" ></button>'
        }
      ]

    }
    //on récupère les donnée propre au provisionning
    $scope.getControllerProvisionning = function(){
      $scope.setGridOptionsProvisionning()
      // 2-- l'URL à appler pour charger les données de la MKP : passage par référence pour pointer le même objet avec le mainController 
      $scope.gridDataUrl["url"] = "/marketplace-list" 
      // 3-- tableau de fonctions à excuter après le chargement des données de la place de marché 
      //$scope.cronReportState()
      $scope.getData()
    }
    //initialisation du Tab Pannel de la page, au début c'est le provisionnig qui s'affiche 
    $scope.getControllerProvisionning ()

  }])
