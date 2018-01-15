//AngularJS controller module for Tab1 partial element
angular.module('dooer.login', ['ngRoute'])
//Configuring route provider path for partial element
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'components/login/login.html',
    controller: 'LoginController'
  });
}])
//Creating controller
.controller('LoginController', ['$scope', '$localStorage', '$location', function($scope, $localStorage, $location) {
  $scope.username = '';
  $scope.emptyInput = false;
  $scope.error = '';

  // Checking local storage for error message, DOM depends on $scope.error
  $scope.loadError = function() {
    var error = $localStorage.error;
    if (error != null) {
      $scope.error = error;
    }
    delete $localStorage.error;
  };
  $scope.loadError();

  // Logging the user with passed username
  $scope.login = function() {
    if ($scope.username != '') {
      $localStorage.loggedUser = $scope.username;
      $scope.emptyInput = false;
      $location.path('/repos');
    } else {
      $scope.emptyInput = true;
    }
  };
}]);