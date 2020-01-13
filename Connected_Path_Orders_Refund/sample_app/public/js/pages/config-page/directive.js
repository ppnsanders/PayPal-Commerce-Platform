'use strict'

angular.module('pcpcpor').directive('configPage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', 'partnerConfigService', ($scope, partnerConfigService) => {
			$scope.model = partnerConfigService
		    $scope.model.setup()	
		}],
		templateUrl: '/js/pages/config-page/template.html'
	}
}])