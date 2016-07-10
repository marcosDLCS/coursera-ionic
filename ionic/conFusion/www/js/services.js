'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant('baseURL', 'http://localhost:3000/')
  .service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    this.getDishes = function () {
      return $resource(baseURL + "dishes/:id", null, {'update': {method: 'PUT'}});
    };

    this.getPromotions = function () {
      return $resource(baseURL + "promotions/:id", null, {'update': {method: 'PUT'}});
    };

  }])

  .factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    var corpfac = {};

    corpfac.getLeaders = function () {
      return $resource(baseURL + "leadership/:id", null, {'update': {method: 'PUT'}});
    };

    return corpfac;
  }])

  .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    var feedfac = {};

    feedfac.getFeedback = function () {
      return $resource(baseURL + "feedback/:id", null, {'update': {method: 'PUT'}});
    };

    return feedfac;
  }])

  .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var favFac = {};
    var favorites = [];

    favFac.addToFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index)
          return;
      }
      favorites.push({id: index});
    };

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
        }
      }
    }

    favFac.getFavorites = function () {
      return favorites;
    };

    return favFac;
  }])

;
