// SERCE controllers
angular.module('serceControllers', [])


.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.isClicked = false;
    $scope.count = 0;

    $scope.click = function() {
        $scope.count++;
        $scope.isClicked = true;
        console.log('click voted!!!');
    };
}])

.controller('ClickingCtrl', ['$scope', '$window', '$http',
        function($scope, $window, $http) {
    // TODO: implement me !!
}])

.controller('ClickedCtrl', ['$scope', '$window', '$http',
        function($scope, $window, $http) {
    // TODO: implement me !!
}]);