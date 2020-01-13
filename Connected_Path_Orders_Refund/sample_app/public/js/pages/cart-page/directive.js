'use strict'
paypal.Buttons.driver('angular', window.angular);
angular.module('pcpcpor').directive('cartPage', () => {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$http', '$location', '$window', 'cartServiceModel', ($scope, $http, $location, $window, cartServiceModel) => {
            $scope.model = cartServiceModel
            $scope.model.setup()
            //setup 'options' object for PayPal's button.
            //styles based on recommended styles on https://developer.paypal.com/docs/checkout/integration-features/customize-button/
            $scope.options = {
                env: "sandbox",
                style: $scope.model.buttonConfig.style,
                createOrder: () => {
                    return new Promise((resolve, reject) => {
                        $scope.model.createOrder((response) => {
                            if(!response.error) {
                                resolve(response);
                            } else {
                                reject(response);
                            }
                        });
                    });
                },
                onShippingChange: (data, actions) => {
                    $scope.model.shippingData = data;
                    return new Promise((resolve, reject) => {
                        $scope.model.getShippingOptions((response) => {
                            if(response) {
                                resolve(response);
                            } else {
                                reject(response);
                            }
                        });
                    });
                },
                onError: (err) => {
                    console.log('PayPal Buttons onError Callback: ', err);
                    $window.location.href = '/xoerror?err=' + err.JSON.stringify();
                },
                onCancel: (data) => {
                    console.log(data);
                    $window.location.href = '/cancel';
                },
                onApprove: () => {
                    return new Promise((resolve, reject) => {
                        $scope.model.capturePPOrder((response) => {
                            if(response.status === "COMPLETED") {
                                $window.location.href = '/receipt';
                                resolve(response);
                            } else if(response.error === 'INSTRUMENT_DECLINED') {
                                console.log(response);
                                reject(actions.restart());
                            } else {
                                reject(response);
                            }
                        });
                    });
                }
            };
            if(paypal.HostedFields.isEligible()) {
                paypal.HostedFields.render({
                    env: 'sandbox',
                    createOrder: () => {
                        return new Promise((resolve, reject) => {
                            $scope.model.createOrder((response) => {
                                if(!response.error) {
                                    resolve(response);
                                } else {
                                    reject(response);
                                }
                            });
                        });
                    },
                    styles: {
                            "input": {
                                "font-size": "14px",
                                "font-family": "Arial",
                                "color": "#3a3a3a"
                            },
                            ":focus": {
                                "color": "black"
                            }
                    },
                    fields: {
                        number: {
                          selector: '#card-number',
                          placeholder: 'card number'
                        },
                        cvv: {
                          selector: '#cvv',
                          placeholder: 'card security number'
                        },
                        expirationDate: {
                          selector: '#expiration-date',
                          placeholder: 'mm/yy'
                        }
                      },
                      onError: (error) => {
                          console.log("onError Fired: ", error);
                      },
                      onApprove: (data) => {
                        return new Promise((resolve, reject) => {
                            $scope.model.capturePPOrder((response) => {
                                if(response.status === "COMPLETED") {
                                    $window.location.href = '/receipt';
                                    resolve(response);
                                } else {
                                    reject(response);
                                }
                            });
                        });
                      }
                }).then((hf) => {
                    $('#my-sample-form').submit(function (event) {
                        event.preventDefault();
                        hf.submit({
                            // Cardholder Name
                            cardholderName: document.getElementById('card-holder-name').value,
                            // Billing Address
                            billingAddress: {
                                streetAddress: document.getElementById('card-billing-address-street').value,      // address_line_1 - street
                                extendedAddress: document.getElementById('card-billing-address-unit').value,       // address_line_2 - unit
                                region: document.getElementById('card-billing-address-state').value,           // admin_area_1 - state
                                locality: document.getElementById('card-billing-address-city').value,          // admin_area_2 - town / city
                                postalCode: document.getElementById('card-billing-address-zip').value,           // postal_code - postal_code
                                countryCodeAlpha2: document.getElementById('card-billing-address-country').value   // country_code - country
                            }
                        }).then(function (payload) {
                            if (payload.liabilityShifted) {
                                // 3DS Contingency Passed - Buyer confirmed Successfully
                                // window.location.replace("http://www.google.com?order_id="+orderID);
                            }
                            if (payload.liabilityShifted === undefined) {
                                // No 3DS Contingency Passed
                                // window.location.replace("http://www.yahoo.com?order_id="+orderID);
                            }
                            if (payload.liabilityShifted === false) {
                                // 3DS Contingency Passed, but Buyer skipped 3DS
                                // window.location.replace("http://www.3ds-skipped.com?order_id="+orderID);
                            }
                        }).catch(function (err) {
                            console.log('error: ', JSON.stringify(err));
                            document.getElementById("consoleLog").innerHTML = JSON.stringify(err);
                        });
                    });
                });
            } else {
                $('#credit-card-form').hide();    // hide hosted fields
            }
		}],
		templateUrl: '/js/pages/cart-page/template.html'
	}
});

