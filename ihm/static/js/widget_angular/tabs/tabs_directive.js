//@url de la directive : lien vers le fichier json qui fourni la liste des nom de marketplaces de l'utilisateur
//@target : lien de récupération de data (les catégories de marketplace)
//@griOption: tableau de configuratio de la grille
//@csrftoken: necessaire pour les requètes de type post
var  marketplaceTabs = angular.module('marketplaceTabs',['RequestsFactory'])
 marketplaceTabs.directive('marketplaceTabs', function($http, $q, RequestManager){
    return {
        restrict: 'E',                  //--la directive sera appelée comme balise html : <marketplace-tabs></marketplace-tabs>
        transclude: true,
        scope:{
            url:"=url",                 //--<marketplace-tabs url=""></marketplace-tabs>
            gridOptions:"=gridOptions", // tableau d'option de la grille prérempli par le controleur parent: //--<marketplace-tabs grid-option=""></marketplace-tabs>
            target:"@target",           //--<marketplace-tabs target=""></marketplace-tabs>
            csrftoken:"@csrftoken",     //token post
            isDataLoaded:"=",
            isDataEmpty:"=",
            marketplace:"=", 
            mappingLanguage:"=mappingLanguage",
            showMsgError:"=", 
            filterCriterias:"=" 
        },
        templateUrl:"/tabs_directive", //--le template de directive
        link:  function(scope, element, attributs) {
            //initialize request for data grid
            scope.oldRequest = null
            scope.requestForGridData = null;
            scope.showMsgError=false
            scope.isDataLoaded = false;
            scope.isDataEmpty = false;
            //1--oncharge la liste des nom de marketplace a travers l'attribut url de la balise html de directive
            scope.tabs_marketplace = [];
            data= {'_csrf':scope.csrftoken}
            $http.post(scope.url, data).success(function(data) {
                //1.2--structurer le tableau pour pouvoir l'afficher dans le template
                //NB: data contient l'attribut message, si ce tableau chnge de structure, il faut modifier la boucle suivante
                for(i=0; i<data.marketplaces.length; i++) {
                    scope.tabs_marketplace[i]           = {}
                    scope.tabs_marketplace[i].title     = data.marketplaces[i].name;
                    scope.tabs_marketplace[i].market_id = data.marketplaces[i].marketplace_id;
                    //mettre à jour les flags
                    scope.tabs_marketplace[i].isLoaded  = true;
                    scope.tabs_marketplace[i].isActive  = false;
                }
                //index de dernier tab selectionné
                //si c'est le premier accées c-a-d pas d'index dans sessionStorage
                //if typeof localStorage!='undefined'
                if(sessionStorage.index != undefined && sessionStorage.index != "undefined" && sessionStorage.index != ""){
                    var index = parseInt(sessionStorage.index );
                    //initialiser les données correspondante au tab selectionné
                    if(index>scope.tabs_marketplace.length){
                        index = 0;
                    }
                    scope.getContent(scope.tabs_marketplace[index].market_id, index);
                } else {
                    //init index in localstorage
                    sessionStorage.index = "0"
                    scope.tabs_marketplace[0].isActive= true;
                    //data de premier tab par defaut
                    scope.getContent(scope.tabs_marketplace[0].market_id, 0);
                }
            })
            .error(function(){
                scope.showMsgError = true
                scope.isDataLoaded = true;
                console.error("unable to get mkp list")
                alert("Une erreur se produite lors du chargement de données.")
            })

            //=================events==============================================
            //event of tab change
            scope.getContent = function(market_id, index){
                if(scope.oldRequest){
                    scope.cancel(scope.oldRequest)
                }
                scope.getData(market_id, index)
            }
            //charger les nouvelles données qui correspondent à chaque marketplace
            //@market_id : l'id de market correspondant
            //@index : idex de marketplace dans le tab de listing de marketplaces
            scope.getData = function(market_id, index){
                //update flags
                //scope.requests=[]
                scope.isDataLoaded = false;
                scope.showMsgError = false;
                scope.isDataEmpty = false;
                //set index of tab in localstorage of HTML5
                scope.tabs_marketplace[index].isActive= true
                sessionStorage.index = "" + index + ""
                //update active marketplace_id
                scope.marketplace = scope.tabs_marketplace[index].market_id
                //send data to target page
                var request= RequestManager.getData(scope.target+'?marketplace_id='+market_id)
                scope.oldRequest = request
                request.promise.then(
                    function( newData ) {
                        scope.filterCriterias=[{'field':'--', 'type':'', 'operator':''}]
                    //1.1---tester si la data envoyée est vide pour mettre a jour les indicateurs
                        if(newData.data.length == 0) {
                            scope.isDataEmpty = true;
                        }
                        //1.2--ajouter la data au tableau
                        //on changeant le tableau gridOption la grille va mettre à jour son affichage automatiquement grace au dataBinding d'angular
                        else{
                            scope.gridOptions.data = newData.data;
                            scope.gridOptions.minRowsToShow = newData.data.length
                        }
                        scope.isDataLoaded = true;
                        scope.showMsgError=false
                        scope.mappingLanguage =  newData.language_id
                        //mettre a jour le language de la marketplace
                        sessionStorage.mapping_language = newData.language_id? newData.language_id: 'fr'
                    },
                    function(errorMessage) {
                       //affichage de message d'erreur si l'erreur vient de serveur
                       //si le status est à 0 alors la requets a été annulée
                       console.log(errorMessage)
                        if(errorMessage.status!=-1){
                            scope.showMsgError=true
                            scope.isDataLoaded = true;
                        }
                        //si non c'etait annulé à cause de changement d'onglet marketplace avant le chargement complet de data
                    }
                );
            }
            // I abort the current request (if its running).
            scope.abortRequest = function() {
                console.log("abort request")
                return( scope.requestForGridData && scope.requestForGridData.abort());
            }
            //annuler la requete en cours
            scope.cancel = function(request){
                request.cancel("cancel request");
            };
        }
    }
 });