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
            });
    });
    app.run(function($rootScope, $location, auth) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        });
    });
    app.factory('auth', ['$window', function ($window) {
        var auth = {};
        var tokenIndex = 'downtoken';
        auth.saveToken = function (token) {
            $window.localStorage[tokenIndex] = token;
        };
        auth.getToken = function () {
            return $window.localStorage[tokenIndex];
        };
        auth.isSignIn = function () {
            var token = auth.getToken();
            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                console.log(payload.exp);
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        auth.currentUser = function(){
            if(auth.isSignIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.username;
            }
        };
        // auth.register = function(user){
        //     return $http.post('/signup', user).success(function(data){
        //         auth.saveToken(data.token);
        //     });
        // };
        // auth.logIn = function(user){
        //     return $http.post('/signin', user).success(function(data){
        //         auth.saveToken(data.token);
        //     });
        // };
        auth.logOut = function(){
            $window.localStorage.removeItem(tokenIndex);
        };
        return auth;
    }]);

    app.factory('tokenInterceptor', function ($q, auth) {
        return {
            request: function (config) {
                config.headers['x-access-token'] = auth.getToken();
                return config || $q.when(config);
            },
            requestError: function(rejection) {
                return $q.reject(rejection);
            },

            response: function(response) {
                return response || $q.when(response);
            },

            responseError: function(rejection) {
                return $q.reject(rejection);
            }
        }
    });
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('tokenInterceptor');
    }]);

    app.controller('MainCtrl', ['RandomUserFactory', '$location', 'auth', '$state',function (RandomUserFactory, $location, auth, $state) {
        var vm = this;
        vm.getRandomUser = getRandomUser;
        vm.randomNumber = Math.random() * 10 + 1;
        function getRandomUser() {
            RandomUserFactory.getUser().then(function success(response) {
                vm.randomUser = response.data;
            });
        }
        if(auth.isSignIn()){
            $state.go('profile');
        }else{
            $state.go('signin');
        }
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