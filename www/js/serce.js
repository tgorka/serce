// SERCE app

/**
 * Get week number in the year.
 * @param  {Integer} [weekStart=0]  First day of the week. 0-based. 0 for Sunday, 6 for Saturday.
 * @return {Integer}                0-based number of week.
 */
Date.prototype.getWeek = function(weekStart) {
    var januaryFirst = new Date(this.getFullYear(), 0, 1);
    if(weekStart !== undefined && (typeof weekStart !== 'number' || weekStart % 1 !== 0 || weekStart < 0 || weekStart > 6)) {
        throw new Error('Wrong argument. Must be an integer between 0 and 6.');
    }
    weekStart = weekStart || 0;
    return Math.floor((((this - januaryFirst) / 86400000) + januaryFirst.getDay() - weekStart) / 7);
};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'serce' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('serce', ['ionic', 'firebase', 'serceControllers'])


.run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // alert for a notification
        var alertStr = localStorage.getItem('alert');
        if (!alertStr) {
            $rootScope.alert = null;
        } else {
            $rootScope.alert = Date.parse(alertStr);
        }

        //var device = ionic.Platform.device();
        //$rootScope.uuid = device.uuid;
        $rootScope.loaded = false;
        $rootScope.uuid = localStorage.getItem('uuid');
        if (!$rootScope.uuid) {
            $rootScope.uuid = uuid.v4();
            localStorage.setItem('uuid', $rootScope.uuid);
        }

        $rootScope.statistics = {
            day:   0,
            week:  0,
            month: 0,
            year:  0,
            total: 0
        };
        $rootScope.userStatistics = {
            day:   0,
            week:  0,
            month: 0,
            year:  0,
            total: 0
        };

        $rootScope.isNotVoted = function() {
            return $rootScope.userStatistics.day == 0;
        };

        var updateStatisticsFunction = function(url, variable) {
            var statisticsRef = new Firebase(url);
            statisticsRef.on("child_changed", function(snap) {
                $rootScope.statistics[variable] = snap.val().value;
            });
            statisticsRef.once("value", function(snap) {
                if (snap.val() != null) {
                    $rootScope.statistics[variable] = snap.val().value;
                }
            });
        };
        var updateUserStatisticsFunction = function(url, variable, callback) {
            var statisticsRef = new Firebase(url);
            statisticsRef.on("child_changed", function(snap) {
                $rootScope.userStatistics[variable] = snap.val();
            });
            statisticsRef.once("value", function(snap) {
                if (snap.val() != null) {
                    $rootScope.userStatistics[variable] = snap.val();
                }
                if (callback) {
                    callback();
                }
            });
        };

        var today = new Date();

        // global statistics
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/total', 'total');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/years/' + today.getFullYear(),
                'year');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/months/' + today.getFullYear() +
                '/' + (today.getMonth() + 1), 'month');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/days/' + today.getFullYear() +
                '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/weeks/' + today.getFullYear() +
                '/' + (today.getWeek(1) + 1), 'week');

        // user statistics
        updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            $rootScope.uuid + '/statistics/total', 'total');
        updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            $rootScope.uuid + '/statistics/years/' + today.getFullYear(),
                'year');
        updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            $rootScope.uuid + '/statistics/months/' + today.getFullYear() +
                '/' + (today.getMonth() + 1), 'month');
        updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            $rootScope.uuid + '/statistics/weeks/' + today.getFullYear() +
                '/' + (today.getWeek(1) + 1), 'week');
        updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            $rootScope.uuid + '/statistics/days/' + today.getFullYear() +
                '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day',
                    function() {
            $rootScope.loaded = true;
            if (!$rootScope.isNotVoted()) {
                // go to clicked at the initial time if already clicked
                $state.go('serce.clicked');
            }
        });
    });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // not working in mobile (need to enable server url rewrite mode)
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    //$stateProvider.reloadOnSearch = true;
    //$stateProvider.caseInsensitiveMatch = true;
    $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'menuContent': {
                        templateUrl: 'html/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('clicked', {
                url: '/clicked',
                views: {
                    'menuContent': {
                        templateUrl: 'html/clicked.html',
                        controller: 'ClickedCtrl'
                    }
                }
            })
            .state('statistics', {
                url: '/statistics',
                views: {
                    'menuContent': {
                        templateUrl: 'html/statistics.html',
                        controller: 'StatisticsCtrl'
                    }
                }
            })
            .state('help', {
                url: '/help',
                views: {
                    'menuContent': {
                        templateUrl: 'html/help.html',
                        controller: 'HelpCtrl'
                    }
                }
            })
            .state('alert', {
                url: '/alert',
                views: {
                    'menuContent': {
                        templateUrl: 'html/alert.html',
                        controller: 'AlertCtrl'
                    }
                }
            })
            .state('about', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'html/about.html',
                        controller: 'AboutCtrl'
                    }
                }
            })
    ;

    $urlRouterProvider.otherwise("/");
}])

;
