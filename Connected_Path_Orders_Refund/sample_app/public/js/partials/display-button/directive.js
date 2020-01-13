'use strict'
paypal.Buttons.driver('angular', window.angular);
angular.module('pcpcpor').directive('displayButton', [ () => {
	return {
		restrict: 'E',
		scope: {
            updateId: '='
        },
		controller: ['$scope', '$cookies', ($scope, $cookies) => {
            let previewConfig = $cookies.getObject('preview-config')
            console.log('initial load');
            console.log('Preview: ', previewConfig);
            $scope.options = {
                env: "sandbox",
                style: previewConfig,
                createOrder: () => {
                    return ""
                },
                onApprove: () => {
                    return ""
                }
            };
            $scope.$watch('updateId', (newVal, oldVal) => {
                console.log('$watch fired...');
                if(newVal !== oldVal) {
                    previewConfig = $cookies.getObject('preview-config')
                    console.log('Preview: ', previewConfig);
                    console.log('updateId: ', newVal);
                    $scope.options = {
                        env: "sandbox",
                        style: previewConfig,
                        createOrder: () => {
                            return ""
                        },
                        onApprove: () => {
                            return ""
                        }
                    };
                }
            }, true);
		}],
		templateUrl: '/js/partials/display-button/template.html'
	}
}])