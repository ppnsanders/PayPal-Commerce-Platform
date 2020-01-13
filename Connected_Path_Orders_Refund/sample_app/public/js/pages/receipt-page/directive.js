'use strict'

angular.module('pcpcpor').directive('receiptPage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', 'receiptServiceModel', ($scope, receiptServiceModel) => {
            $scope.model = receiptServiceModel;
            $scope.model.setup();
		}],
		templateUrl: '/js/pages/receipt-page/template.html'
	}
}])