'use strict'

angular.module('pcpcpor').directive('homePage', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', () => {
		}],
		templateUrl: '/js/pages/home-page/template.html'
	}
}])