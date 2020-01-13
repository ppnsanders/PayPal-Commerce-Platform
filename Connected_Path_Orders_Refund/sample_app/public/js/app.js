'use strict'

//since we're using DustJS, 
//we must set the startSymbol and endSymbol to '[[' and ']]'.

angular.module('pcpcpor', ['paypal-buttons', 'ngCookies'])
.config(['$interpolateProvider', '$cookiesProvider', '$locationProvider', ($interpolateProvider, $cookiesProvider, $locationProvider) => {
    $interpolateProvider
        .startSymbol('[[');
    $interpolateProvider
        .endSymbol(']]');
    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.secure = false;
    $locationProvider.html5Mode(true).hashPrefix('!');
}])
