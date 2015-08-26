// SERCE controllers
angular.module('serceControllers', [])


.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$state',
            function($scope, $rootScope, $http, $state) {
    $scope.click = function() {
        $rootScope.isVoted = true;
        $rootScope.count++;
        for (var statistic in $rootScope.statistics) {
            $rootScope.statistics[statistic]++;
        }
        //TODO: call server vor next voting
        $state.go('clicked');
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
