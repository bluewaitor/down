
var app = angular.module('app');

app.controller('SignInCtrl', ['$http', function ($http) {
    var vm = this;
    vm.signIn = function () {
        var http = $http.post('http://localhost:8080/signin', {name: vm.username, password: vm.password});
        http.then(function (data) {
            if(data.data.success){
                window.location.href = '#/profile';
            }
        });
    }
}]);