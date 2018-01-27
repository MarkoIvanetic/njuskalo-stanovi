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
&price%5Bmin%5D=10 cijena min
&price%5Bmax%5D=400 cijena max
&mainArea%5Bmin%5D=30 min kvadrat
&mainArea%5Bmax%5D=60 max kvadrat
&adsWithImages=1 sa slikama
&newBuilding=1 novogradnja
 */
angular.module('njuskaloStanoviApp')
  .controller('MainCtrl', function($scope, $http, $q) {
    var TIMEOUT_MIN = 1000;
    var TIMEOUT_MAX = 5000;
    $scope.$http = $http;

    $scope.form = {};

    $scope.form.zupanije = [{ "id": "1150", "name": "Bjelovarsko-bilogorska" }, { "id": "1151", "name": "Brodsko-posavska" }, { "id": "1152", "name": "Dubrovačko-neretvanska" }, { "id": "1154", "name": "Istarska" }, { "id": "1155", "name": "Karlovačka" }, { "id": "1156", "name": "Koprivničko-križevačka" }, { "id": "1157", "name": "Krapinsko-zagorska" }, { "id": "1158", "name": "Ličko-senjska" }, { "id": "1159", "name": "Međimurska" }, { "id": "1160", "name": "Osječko-baranjska" }, { "id": "1161", "name": "Požeško-slavonska" }, { "id": "1162", "name": "Primorsko-goranska" }, { "id": "1163", "name": "Sisačko-moslavačka" }, { "id": "1164", "name": "Splitsko-dalmatinska" }, { "id": "1165", "name": "Šibensko-kninska" }, { "id": "1166", "name": "Varaždinska" }, { "id": "1167", "name": "Virovitičko-podravska" }, { "id": "1168", "name": "Vukovarsko-srijemska" }, { "id": "1169", "name": "Zadarska" }, { "id": "1153", "name": "Grad Zagreb" }, { "id": "1170", "name": "Zagrebačka" }];
    $scope.form.naselja = [{ "name": "Brezovica", "id": "1247" }, { "name": "Črnomerec", "id": "1248", "rating": 6 }, { "name": "Donja Dubrava", "id": "1249" }, { "name": "Donji Grad", "id": "1250", "rating": 10 }, { "name": "Gornja Dubrava", "id": "1251" }, { "name": "Gornji Grad - Medveščak", "id": "1252", "rating": 9 }, { "name": "Maksimir", "id": "1253", "rating": 7 }, { "name": "Novi Zagreb - Istok", "id": "1254" }, { "name": "Novi Zagreb - Zapad", "id": "1255" }, { "name": "Peščenica - Žitnjak", "id": "1256" }, { "name": "Podsljeme", "id": "1257" }, { "name": "Podsused - Vrapče", "id": "1258" }, { "name": "Sesvete", "id": "1259" }, { "name": "Stenjevec", "id": "1260" }, { "name": "Trešnjevka", "id": "1261", "rating": 5 }, { "name": "Trešnjevka - Jug", "id": "1261", "rating": 4 }, { "name": "Trešnjevka - Sjever", "id": "1262", "rating": 5 }, { "name": "Trnje", "id": "1263", "rating": 8 }, { "name": "Zagreb - Okolica", "id": "1264" }];

    $scope.form.zupanija = "1153";
    $scope.form.cijena_od = '200';
    $scope.form.cijena_do = '450';
    $scope.form.povrsina_od = '30';
    $scope.form.povrsina_do = '60';
    $scope.form.novogradnja = false;
    $scope.form.oglasi_slika = true;

    $scope.form.pages = 1;


    $scope.loadAds = function() {

      console.log($scope.form);

      $scope.oglasi = [];


      for (var i = 1; i <= $scope.form.pages; i++) {



        $http.get($scope.generateUrl($scope.form, i))
          .then(function(response) {

            var el = document.createElement('div');
            el.setAttribute("style", "display:none;");
            el.innerHTML = response.data;

            var oglasiStandard = $(el).find('.EntityList--Regular.EntityList--ListItemRegularAd')
            oglasiStandard.find('.entity-tools').remove();

            oglasiStandard.find("ul.EntityList-items > li:not('.EntityList-item--banner')").each(function() {

              if ($(this).find('.entity-title a').text()) {
                var oglas = {};
                oglas.title = $(this).find('.entity-title a').text();
                oglas.link = $(this).find('.entity-title a').attr('href');

                oglas.image = $(this).find('.entity-thumbnail a img').attr('data-src');

                var sizeString = $(this).find('.entity-description-main').text().split('Stambena površina:')[1];
                oglas.size = sizeString.match(/\d+/)[0];

                oglas.publication_date = $(this).find('.entity-pub-date time').attr('datetime');
                oglas.price_hrk = $(this).find('.entity-prices .price.price--hrk').text().replace('.', '').replace(',', '').match(/\d+/)[0];
                oglas.price_eur = $(this).find('.entity-prices .price.price--eur').text().replace('.', '').replace(',', '').match(/\d+/)[0];

                $scope.oglasi.push(oglas);
              }

            });
            console.log($scope.oglasi);
          });
      }

    };
    $scope.generateTimeout = function () {
    	return Math.floor((Math.random() * TIMEOUT_MAX) + TIMEOUT_MIN);	
    };
    $scope.improveInfo = function() {
      var promiseChain = $q.when();

      $scope.oglasi.forEach(function(oglas) {
        promiseChain = promiseChain.then(function() {
        	$timeout(function(){
          		return $scope.getSingleAd(oglas);
        	}, $scope.generateTimeout());
        });
      });

      promiseChain.finally(function() {
      	console.clear();
      	console.log($scope.oglasi);
      })
    };
    $scope.getSingleAd = function(ad) {
      $http.get("https://www.njuskalo.hr" + ad.link)
        .then(function(response) {

          var el = document.createElement('div');
          el.innerHTML = response.data;

          var adDetails = $(el).find('.table-summary--alpha');
          ad.naselje = adDetails.find("th:contains('Naselje')").siblings('td').text();
          ad.location_rating = $scope.getRatingForName(ad.naselje);

        })
    };
    $scope.generateUrl = function(form, page) {
      form = form || $scope.form;
      var url = 'https://www.njuskalo.hr/iznajmljivanje-stanova';
      if (form.zupanija) { url += '?locationId=' + form.zupanija };
      if (form.cijena_od) { url += '&price%5Bmin%5D=' + form.cijena_od };
      if (form.cijena_do) { url += '&price%5Bmax%5D=' + form.cijena_do };
      if (form.povrsina_od) { url += '&mainArea%5Bmin%5D=' + form.povrsina_od };
      if (form.povrsina_do) { url += '&mainArea%5Bmax%5D=' + form.povrsina_do };
      if (form.novogradnja) { url += '&newBuilding=1' };
      if (form.oglasi_slika) { url += '&adsWithImages=1' };

      if (page) { url += '&page=' + page };

      return url;
    };
    $scope.getRatingForName = function(naselje) {
      var foundNaselje = _.find($scope.form.naselja, function(nas) {
        return nas.name === naselje;
      }) || {};
      return (foundNaselje.rating || 0);
    }
  });
