//AngularJS factory module for retrieving data
//Using $http to GET JSON data from files
angular.module('dooer.apiService', [])
.factory('ApiService', ['$http', function($http) {

  var functions = {};

  // Loading GitHub repo list
  functions.getUserRepos = function(username) {
    return $http({
      url: 'https://api.github.com/users/' + username + '/repos',
      method: 'GET'
    });
  };

  // Loading GitHub user details
  functions.getUserInfo = function(username) {
    return $http({
      url: 'https://api.github.com/users/' + username,
      method: 'GET'
    });
  };

  return functions;
}]);