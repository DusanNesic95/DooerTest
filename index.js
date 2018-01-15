angular.module('dooer', [
  'ngRoute',
  'ngStorage',
  'dooer.apiService',
  'dooer.repos',
  'dooer.login'
])
//Setting up default route provider path
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
