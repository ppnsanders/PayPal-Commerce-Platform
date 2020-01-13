'use strict'

angular.module('pcpcpor').directive('xoerrorPage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', 'xoErrorServiceModel', '$location', ($scope, xoErrorServiceModel, $location) => {
		$scope.model = xoErrorServiceModel;
		$scope.model.queryParams = $location.search();
            $scope.model.setup();
		}],
		templateUrl: '/js/pages/xoerror-page/template.html'
	}
}])