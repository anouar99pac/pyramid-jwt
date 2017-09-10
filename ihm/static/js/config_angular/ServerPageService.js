/*
permet de réupere des données à travers une url
ce service est utilisé pour la paginnation
@target: url qui renvoie les données
@limit: nombre de ligne demandées
@offset: dernier offset (numéro de page demandée)
@data: tableau de données envoyé à target, les données peuent être des filter
*/

app.service('serverPaging', function($http){

	this.getPage = function(target, limit, offset, data){
		$http.post(target, {'limit': limit, 'offset': offset})
		.success(function(response){
			return response;
		})
		.error(function(status){
			return false;
		})
		return true
	}
})
