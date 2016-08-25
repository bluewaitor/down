
var app = angular.module('app');

app.controller('SignInCtrl', ['$scope', '$state', 'auth', '$http', function ($scope, $state, auth, $http) {
    if (auth.isSignIn()){
        $state.go('profile');
    }
    $scope.signIn = function () {
        $http.post('/signin', $scope.user).success(function(data){
            auth.saveToken(data.token);
            $state.go('profile');
        });
    }
}]);