'use strict'

angular.module('pcpcpor').directive('adminPage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$http', '$location', '$window', 'adminServiceModel', ($scope, $http, $location, $window, adminServiceModel) => {
            $scope.model = adminServiceModel
            $scope.model.setup()
		}],
		templateUrl: '/js/pages/admin-page/template.html'
	}
}])

