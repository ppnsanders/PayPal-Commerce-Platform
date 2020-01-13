'use strict'

angular.module('pcpcpor').directive('cancelPage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', 'cancelServiceModel', ($scope, cancelServiceModel) => {
            $scope.model = cancelServiceModel;
            $scope.model.setup();
		}],
		templateUrl: '/js/pages/cancel-page/template.html'
	}
}])