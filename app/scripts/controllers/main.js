'use strict';

/**
 * @ngdoc function
 * @name njuskaloStanoviApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the njuskaloStanoviApp
 */


/*
https://www.njuskalo.hr/iznajmljivanje-stanova
?locationId=1153 lokacija zagreb
&price%5Bmax%5D=400 cijena max
&mainArea%5Bmin%5D=30 min kvadrat
&mainArea%5Bmax%5D=60 max kvadrat
&adsWithImages=1 sa slikama
 */
angular.module('njuskaloStanoviApp')
  .controller('MainCtrl', function($scope, $http) {
    $scope.test = "TEST";
    $scope.$http = $http;

    $scope.loadAds = function() {
      $scope.$http.get("https://www.njuskalo.hr/iznajmljivanje-stanova")
        .then(function(response) {
          var el = document.createElement('div');
          el.innerHTML = response.data;

          var oglasiPremium = el.getElementsByClassName('EntityList--VauVau EntityList--ListItemVauVauAd'); // Live NodeList of your anchor elements
          var oglasiStandard = el.getElementsByClassName('EntityList--Regular EntityList--ListItemRegularAd'); // Live NodeList of your anchor elements

          $(oglasiStandard).find('.entity-tools').remove();
          $(oglasiPremium).find('.entity-tools').remove();

          $('.njuskalo-oglasi').append($(oglasiPremium));
          $('.njuskalo-oglasi').append($(oglasiStandard));

        });
    }
  });
