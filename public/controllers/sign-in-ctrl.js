
var app = angular.module('app');

app.controller('SignInCtrl', ['$scope', '$state', 'auth', function ($scope, $state, auth) {
    if (auth.isSignIn()){
        console.log('1111');
        $state.go('profile');
    }
    $scope.signIn = function () {
        auth.logIn($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            $state.go('profile');
        });
    }
}]);