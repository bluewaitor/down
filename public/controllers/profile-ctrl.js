var app = angular.module('app');

app.controller('ProfileCtrl', ['$scope', 'auth', '$state', '$http', function ($scope, auth, $state, $http) {


    $scope.signOut = function () {
        auth.logOut();
        $state.go('signin');
    };

    $scope.addUrl = function () {
        $http.post('/api/url', {
            token: auth.getToken(),
            name: $scope.name,
            url: $scope.url
        }).success(function (data) {
            $scope.newUrl = data;
        });
    };

    $scope.getUrl = function () {
        console.log('get');
        $http.get('/api/url', {
            params: {
                token: auth.getToken()
            }
        }).success(function (data) {
            $scope.getUrl = data;
        });
    }
}]);