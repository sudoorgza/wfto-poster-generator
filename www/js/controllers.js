angular.module('app.controllers', [])

.controller('PosterGeneratorCtrl', function($scope, $ionicPlatform, $ionicActionSheet, FileService, ImageService) {

  $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.urlForLastImage = "img/wfto-logo.png";
      //$scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
      $scope.$apply();
    });

    $scope.urlForImage = function(imageName) {
      var trueOrigin = cordova.file.dataDirectory + imageName;
      return trueOrigin;
    }

    $scope.addMedia = function() {
      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Take photo' },
          { text: 'Photo from library' }
        ],
        titleText: 'Add images',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.addImage(index);
        }
      });
    }
    $scope.addImage = function(type) {
      ImageService.handleMediaDialog(type).then(function() {
        $scope.hideSheet();
        $scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
        console.log("FileService.lastImage\n"+FileService.lastImage())
        console.log("$scope.urlForLastImage\n"+$scope.urlForLastImage);
      });
    }

})
