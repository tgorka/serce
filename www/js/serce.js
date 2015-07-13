// SERCE app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'serce' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('serce', ['ionic', 'ui.router', 'serceControllers'])


.config(['$stateProvider', function($stateProvider) {
    // Routing
    $stateProvider.reloadOnSearch = true;
    $stateProvider.caseInsensitiveMatch = true;
    $stateProvider
        .state('home', {
            url:'/',
            templateUrl: 'index.html',
            controller : 'HomeCtrl'
        })
        .state('clicked', {
            url:'/clicked',
            templateUrl: 'html/clicked.html',
            controller : 'ClickedCtrl'
        });
}])


.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}]);
