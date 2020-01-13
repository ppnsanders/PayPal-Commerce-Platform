'use strict'

angular.module('pcpcpor').directive('headerNav', [ () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$location', ($scope, $location) => {
			if($location.path() === '/config'){
				$scope.showSettings = false
				$('#configModal').modal('show')
			} else {
				$scope.showSettings = true
			}
			$scope.nav = [ 
							{
								url: "/admin",
								text: "Admin Panel"
							},
							{
								url: "/cart",
								text: "Shopping Cart"
							}
						]
			$scope.showConfigModal = () => {
				$('#configModal').modal('show')
			}
		}],
		templateUrl: '/js/partials/header-nav/template.html'
	}
}])