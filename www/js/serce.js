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


.run(['$ionicPlatform', '$rootScope', '$state', 'statisticsService', 'configService', function($ionicPlatform, $rootScope, $state, statisticsService, configService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // configs
        $rootScope.config = configService;

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

        $rootScope.isVoted = function() {
            return $rootScope.userStatistics.day > 0;
        };

        statisticsService.updateShortStatistics();
    });

}])

.factory('configService', ['$rootScope', function($rootScope) {
    // alert for a notification
    var alertStr = localStorage.getItem('alert');
    var alert = (!alertStr) ? null : Date.parse(alertStr);

    //var device = ionic.Platform.device();
    //var uuid = device.uuid;
    var uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = null;
    }
    return {
        uuid: function() {
            return uuid
        },
        alert: alert,
        setAlert: function(newAlert) {
            alert = newAlert;
            localStorage.setItem('alert', newAlert.toISOString());
        },
        setUuid: function(newUuid) {
            uuid = newUuid;
            localStorage.setItem('uuid', uuid);
        },
        getOrGenerateUuid: function() {
            if (!uuid) {
                var usersRef = new Firebase('https://serce.firebaseio.com/users');
                uuid = usersRef.push().key();
                localStorage.setItem('uuid', uuid);
            }
            return uuid;
        }
    }
}])

.factory('statisticsService', ['$rootScope', 'configService', function($rootScope, configService) {
    var today;
    var updateToday = function() {
        today = new Date();
    };

    var updateStatisticsFunction = function(url, variable) {
        var statisticsRef = new Firebase(url);
        statisticsRef.on("child_changed", function(snap) {
            $rootScope.statistics[variable] = snap.val().value;
        });
        statisticsRef.once("value", function(snap) {
            if (snap.val() != null) {
                $rootScope.statistics[variable] = snap.val().value;
            } else {
                $rootScope.statistics[variable] = 0;
            }
        });
    };
    var updateUserStatisticsFunction = function(url, variable, callback) {
        var statisticsRef = new Firebase(url);
        //statisticsRef.on("child_changed", function(snap) {
        //    $rootScope.userStatistics[variable] = snap.val();
        //});
        statisticsRef.once("value", function(snap) {
            if (snap.val() != null) {
                $rootScope.userStatistics[variable] = snap.val().value;
            } else {
                $rootScope.userStatistics[variable] = 0;
            }
            if (callback) {
                callback();
            }
        });
    };
    var userStatistics = function() {
        if (configService.uuid()) {
            updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            configService.uuid() + '/statistics/total', 'total');
            updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
                    configService.uuid() + '/statistics/years/' + today.getFullYear(),
                    'year');
            updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            configService.uuid() + '/statistics/months/' + today.getFullYear() +
            '/' + (today.getMonth() + 1), 'month');
            updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            configService.uuid() + '/statistics/weeks/' + today.getFullYear() +
            '/' + (today.getWeek(1) + 1), 'week');
            updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
            configService.uuid() + '/statistics/days/' + today.getFullYear() +
            '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day');
        } else {
            $rootScope.userStatistics = {
                day:   0,
                week:  0,
                month: 0,
                year:  0,
                total: 0
            };
        }
    };
    var globalStatistics = function() {
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/total', 'total');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/years/' + today.getFullYear(), 'year');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/months/' + today.getFullYear() +
            '/' + (today.getMonth() + 1), 'month');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/days/' + today.getFullYear() +
            '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/weeks/' + today.getFullYear() +
            '/' + (today.getWeek(1) + 1), 'week');
    };
    var shortStatistics = function() {
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/days/' + today.getFullYear() +
            '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/months/' + today.getFullYear() +
            '/' + (today.getMonth() + 1), 'month');
        updateStatisticsFunction('https://serce.firebaseio.com/' +
            '/statistics/weeks/' + today.getFullYear() +
            '/' + (today.getWeek(1) + 1), 'week');
    };

    return {
        updateAllStatistics: function() {
            updateToday();
            globalStatistics();
            userStatistics();
        },
        updateUserStatistics: function() {
            updateToday();
            userStatistics();
        },
        updateGlobalStatistics: function() {
            updateToday();
            globalStatistics();
        },
        updateShortStatistics: function() {
            updateToday();
            shortStatistics();
        },
        updateUserDayStatistics: function(callback) {
            if (configService.uuid()) {
                updateToday();
                updateUserStatisticsFunction('https://serce.firebaseio.com/users/' +
                configService.uuid() + '/statistics/days/' + today.getFullYear() +
                '/' + (today.getMonth() + 1) + '/' + today.getDate(), 'day', callback);
            } else {
                $rootScope.userStatistics.day = 0;
                callback();
            }
        }
    }
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
            .state('contact', {
                url: '/contact',
                views: {
                    'menuContent': {
                        templateUrl: 'html/contact.html',
                        controller: 'ContactCtrl'
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
