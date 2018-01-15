//AngularJS controller module for Tab1 partial element
angular.module('dooer.repos', ['ngRoute'])
//Configuring route provider path for partial element
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/repos', {
    templateUrl: 'components/repos/repos.html',
    controller: 'ReposController'
  });
}])
//Creating controller
.controller('ReposController', ['$scope','ApiService', '$localStorage', '$location', function($scope, ApiService, $localStorage, $location) {
  $scope.username = $localStorage.loggedUser;
  $scope.user = {};
  $scope.repos = [];
  $scope.addedRepos = [];
  $scope.search = '';
  $scope.sortType = 'name';
  $scope.sortReverse = false;
  $scope.sortTypeAdded = 'name';
  $scope.sortReverseAdded = false;

  // Checking if user is logged in
  $scope.validLogin = function() {
    if ($scope.username != null) {
      return true;
    }
    return false;
  };

  // Calling factory for API call to get user details
  $scope.loadUserInfo = function() {
    ApiService.getUserInfo($scope.username)
    .then(function(success) {
      $scope.user = success.data;
    }, function(error) {
      delete $localStorage.loggedUser;
      $localStorage.error = 'Incorrect username. GitHub user not found.';
      $location.path('/login');
    });
  };
  $scope.loadUserInfo();

  // Calling factory for API call to get public repos for logged user
  $scope.loadGitRepos = function() {
    ApiService.getUserRepos($scope.username)
    .then(function(success) {
      success.data.forEach(function(element) {
        element.disabled = false;
        $scope.repos.push(element);
        $scope.addedRepos.forEach(function(repo) {
          if (repo.name == element.name) {
            element.disabled = true;
          }
        });
      });
    }, function(error) {
      delete $localStorage.loggedUser;
      $localStorage.error = 'Incorrect username. GitHub user not found.';
      $location.path('/login');
    });
  };
  $scope.loadGitRepos();
  
  // Loading local saved repos, serves as favourite repos on the computer
  $scope.loadLocalRepos = function() {
    $scope.localRepos = $localStorage.localRepos;
    if ($scope.localRepos != null) {
      $scope.localRepos.forEach(function(repo) {
        if (repo.username == $scope.username) {
          $scope.addedRepos = repo.repos;
        }
      });
    }
  };
  $scope.loadLocalRepos();

  // Adding new repo to favourites, looking for all users favourites, and adding
  // to list. Added repo is then flagged as added, prevending duplicates in favourites
  $scope.add = function(repo) {
    repo.disabled = true;
    $scope.addedRepos.push(repo);

    $scope.userRepos = {};
    $scope.localRepos = $localStorage.localRepos;

    if ($scope.localRepos == null) {
      $scope.userRepos = {
        username: $scope.username,
        repos: $scope.addedRepos
      };
      $scope.localRepos = [];
      $scope.localRepos.push($scope.userRepos);
    } else {
      $scope.found;
      $scope.localRepos.forEach(function(repo) {
        if (repo.username == $scope.username) {
          repo.repos = $scope.addedRepos;
          $scope.found = repo;
        }
      });

      if ($scope.found == null) {
        $scope.userRepos = {
          username: $scope.username,
          repos: $scope.addedRepos
        };
        $scope.localRepos.push($scope.userRepos);
      }
    }

    $localStorage.localRepos = $scope.localRepos;
  };

  // Removing repo from favourites, and allowing the same repo to be
  // added again from the list of all repos
  $scope.remove = function(repo) {
    repo.disabled = false;

    $scope.repos.forEach(function(existingRepo) {
      if (existingRepo.name == repo.name) {
        existingRepo.disabled = false;
      }
    });

    var index = $scope.addedRepos.indexOf(repo);
    $scope.addedRepos.splice(index,1);
  };

  // Logout funciton, removes all local storage user data
  $scope.logout = function() {
    delete $localStorage.loggedUser;
    delete $localStorage.error;
    $location.path('/login');
  };
}]);