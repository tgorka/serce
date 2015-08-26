// SERCE app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'serce' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('serce', ['ionic', 'ui.router', 'serceControllers'])

.run(['$ionicPlatform', '$rootScope', function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // default data that should be downloaded from the server,
        // they can be also stored in local storage
        $rootScope.count   = 0;
        $rootScope.isVoted = false;
        $rootScope.alert   = null;
        $rootScope.statistics = {
            day:   0,
            week:  0,
            month: 0,
            year:  0,
            total: 0
        };
    });
}])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // not working in dev mode (need to enable server url rewrite mode)
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    $stateProvider.reloadOnSearch = true;
    $stateProvider.caseInsensitiveMatch = true;
    $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'html/home.html',
                controller: 'HomeCtrl'
            })
            .state('clicked', {
                url: '/clicked',
                templateUrl: 'html/clicked.html',
                controller: 'ClickedCtrl'
            })
            .state('statistics', {
                url: '/statistics',
                templateUrl: 'html/statistics.html',
                controller: 'StatisticsCtrl'
            })
            .state('help', {
                url: '/help',
                templateUrl: 'html/help.html',
                controller: 'HelpCtrl'
            })
            .state('alert', {
                url: '/alert',
                templateUrl: 'html/alert.html',
                controller: 'AlertCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'html/about.html',
                controller: 'AboutCtrl'
            })
    ;

    $urlRouterProvider.otherwise("/");
})

;
