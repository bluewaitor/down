(function () {
    'use strict';
    var app = angular.module('app', ['ui.router']);
    app.constant('API_URL', 'http://localhost:8080');
    app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider.
            state('signup', {
                url: '/signup',
                templateUrl: '/views/login/signup.html'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: '/views/login/signin.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '/views/profile/index.html'
            })
    });
    app.controller('MainCtrl', ['RandomUserFactory', '$location',function (RandomUserFactory, $location) {
        var vm = this;
        vm.getRandomUser = getRandomUser;
        vm.randomNumber = Math.random() * 10 + 1;
        function getRandomUser() {
            RandomUserFactory.getUser().then(function success(response) {
                vm.randomUser = response.data;
            });
        }
        window.location.href = '#/signin';
        console.log('hahahha');
    }]);
    app.factory('RandomUserFactory', ['$http', 'API_URL', function ($http, API_URL) {
        return {
            getUser: getUser
        };
        function getUser() {
            return $http.get(API_URL + '/random-user');
        }
    }]);
})();