 angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.reservation = {};

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function () {
      $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function () {
      $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };
  })
  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
    function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {

      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.showDetails = false;

      $scope.showMenu = false;
      $scope.message = "Loading ...";
      menuFactory.getDishes().query(
        function (response) {
          $scope.dishes = response;
          $scope.showMenu = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });

      $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
          $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
          $scope.filtText = "mains";
        }
        else if (setTab === 4) {
          $scope.filtText = "dessert";
        }
        else {
          $scope.filtText = "";
        }
      };

      $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
      }
    }])

  .controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

      if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.getFeedback().save($scope.feedback);
        $scope.feedbackForm.$setPristine();
        console.log('Saved feedback: ' + JSON.stringify($scope.feedback));
        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
      }
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal',
    function ($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {

      $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function () {
        $scope.popover.hide();
      };

      $scope.baseURL = baseURL;
      $scope.showDish = false;
      $scope.message = "Loading ...";
      $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
        .$promise.then(
          function (response) {
            $scope.dish = response;
            $scope.showDish = true;
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );

      $scope.addFavorite = function () {
        console.log("index is " + $scope.dish.id);
        favoriteFactory.addToFavorites($scope.dish.id);
        $scope.closePopover();
      }

      $scope.comment = {};

      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.commentform = modal;
      });

      $scope.closeComment = function () {
        $scope.commentform.hide();
      };

      $scope.openComment = function () {
        $scope.commentform.show();
      };

      $scope.doComment = function () {
        $scope.comment.date = new Date().toISOString();
        console.log($scope.comment);
        $scope.dish.comments.push($scope.comment);

        menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
        $scope.comment = {rating: 5};
        $scope.closePopover();
        $scope.closeComment();
      }

    }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {
      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);
      $scope.dish.comments.push($scope.mycomment);

      menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
      $scope.commentForm.$setPristine();
      $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
    };
  }])

  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.showPromotion = false;
    $scope.showLeader = false;
    $scope.message = "Loading ...";

    $scope.featuredDish = menuFactory.getDishes().get({id: 0})
      .$promise.then(
        function (response) {
          $scope.featuredDish = response;
          $scope.showDish = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );

    $scope.featuredPromotion = menuFactory.getPromotions().get({id: 0})
      .$promise.then(
        function (response) {
          $scope.featuredPromotion = response;
          $scope.showPromotion = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );

    $scope.executiveChef = corporateFactory.getLeaders().get({id: 3})
      .$promise.then(
        function (response) {
          $scope.executiveChef = response;
          $scope.showLeader = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );

  }])

  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showLeaders = false;

    $scope.leaders = corporateFactory.getLeaders().query(
      function (response) {
        $scope.leaders = response;
        $scope.showLeaders = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

  }])

  .controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
    '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

      $scope.baseURL = baseURL;
      $scope.shouldShowDelete = false;

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
      });

      $scope.favorites = favoriteFactory.getFavorites();

      $scope.dishes = menuFactory.getDishes().query(
        function (response) {
          $scope.dishes = response;
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
        });

      $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
      }

      $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('Ok to delete');
            favoriteFactory.deleteFromFavorites(index);
          } else {
            console.log('Canceled delete');
          }
        });

        $scope.shouldShowDelete = false;

      }
    }])

  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }
  })

;
