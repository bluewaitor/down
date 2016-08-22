
var signInApp = angular.module('sign-in', []);

signInApp.controller('SignInCtrl', [function () {
    var vm = this;
    vm.signIn = function () {
        console.log('random-number'+Math.random()*10);
    }
}]);