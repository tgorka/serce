// SERCE controllers

angular.module('serceControllers', [])


.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

    // TODO: implement me !!
}])

.controller('ClickingCtrl', ['$scope', '$window', '$http',
        function($scope, $window, $http) {
    $scope.isClicked = false;
    $scope.click = function() {
        $scope.isClicked = true;
        console.log('click voted!!!');
    };
}])

.controller('ClickedCtrl', ['$scope', '$window', '$http',
        function($scope, $window, $http) {
    // TODO: implement me !!
}]);