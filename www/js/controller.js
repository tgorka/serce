// SERCE controllers
angular.module('serceControllers', [])


.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$state',
            function($scope, $rootScope, $http, $state) {

    if (!$rootScope.isNotVoted()) {
        // go to clicked at the initial time if already clicked
        $state.go('clicked');
    }

    $scope.click = function() {
        if ($rootScope.loaded) {
            if ($rootScope.isNotVoted()) {

                var today = new Date();
                var incrementFunction = function(value) {
                    return {
                        lastUser: $rootScope.uuid,
                        lastDate: /*Firebase.ServerValue.TIMESTAMP,*/today.toISOString(),
                        lastYear: today.getFullYear().toString(),
                        lastMonth: (today.getMonth() + 1).toString(),
                        lastDay: today.getDate().toString(),
                        value: (value && value.value) ? value.value + 1 : 1
                    };
                    //return (value || 0) + 1;
                };
                var firebaseFunction = function(urls, counter, callback) {
                    if (counter < urls.length) {
                        (new Firebase(urls[counter])).transaction(incrementFunction,
                            function(error, committed, snapshot) {
                                if (!error && committed) {
                                    firebaseFunction(urls, counter++, callback);
                                }
                            }
                        );
                    } else {
                        callback();
                    }
                };

                // call user vote
                var userRef = new Firebase('https://serce.firebaseio.com/users/' +
                $rootScope.uuid + '/votes/' + today.getFullYear() + '/' +
                (today.getMonth() + 1) + '/' + today.getDate());
                userRef.set(today.toISOString(), function() {

                    // global statistics
                    (new Firebase('https://serce.firebaseio.com/statistics/total')).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/statistics/years/' + today.getFullYear())).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/statistics/months/' + today.getFullYear() + '/' + (today.getMonth() + 1))).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/statistics/days/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate())).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/statistics/weeks/' + today.getFullYear() + '/' + (today.getWeek(1) + 1))).
                            transaction(incrementFunction);

                    // user statistics
                    (new Firebase('https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/total')).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/years/' + today.getFullYear())).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/months/' + today.getFullYear() + '/' + (today.getMonth() + 1))).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/days/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate())).
                            transaction(incrementFunction);
                    (new Firebase('https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/weeks/' + today.getFullYear() + '/' + (today.getWeek(1) + 1))).
                            transaction(incrementFunction);

                    // on complete
                    angular.forEach($rootScope.statistics, function(value, key) {
                        $rootScope.statistics[key]++;
                    });
                    angular.forEach($rootScope.userStatistics, function(value, key) {
                        $rootScope.userStatistics[key]++;
                    });

                    $state.go('clicked');
                });

                // global statistics in sync
                /*firebaseFunction([
                    'https://serce.firebaseio.com/statistics/total',
                    'https://serce.firebaseio.com/statistics/years/'  + today.getFullYear(),
                    'https://serce.firebaseio.com/statistics/months/' + today.getFullYear() + '/' + (today.getMonth() + 1),
                    'https://serce.firebaseio.com/statistics/days/'   + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate(),
                    'https://serce.firebaseio.com/statistics/weeks/'  + today.getFullYear() + '/' + (today.getWeek(1) + 1),
                    'https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/total',
                    'https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/years/'  + today.getFullYear(),
                    'https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/months/' + today.getFullYear() + '/' + (today.getMonth() + 1),
                    'https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/days/'   + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate(),
                    'https://serce.firebaseio.com/users/' + $rootScope.uuid + '/statistics/weeks/'  + today.getFullYear() + '/' + (today.getWeek(1) + 1)
                ], 0, function() {

                });*/
            } else {
                $state.go('clicked');
            }
        }
    };
}])

.controller('ClickedCtrl', ['$scope', function($scope) {
    // empty controller
}])

.controller('StatisticsCtrl', ['$scope', function($scope) {
    // TODO: implement me!!
}])

.controller('AlertCtrl', ['$scope', function($scope) {
    // TODO: implement me!!
}])

.controller('ContactCtrl', ['$scope', function($scope) {
    // TODO: implement me!!
}])

.controller('AboutCtrl', ['$scope', function($scope) {
    // TODO: implement me!!
}])

.controller('HelpCtrl', ['$scope', function($scope) {
    // TODO: implement me!!
}])

;
