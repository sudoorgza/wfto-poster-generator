angular.module('app.controllers', [])

.controller('PosterGeneratorCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing,
  $ionicLoading, $ionicActionSheet, $location, $timeout, $ionicPopup, FileService, ImageService) {

  var canvas = document.getElementById('tempCanvas');
  var context = canvas.getContext('2d');
  var baseImage =  new Image();
  var templateImage = new Image();
  var SHARING_TEXT = "I'm part of the human chain for Fair Trade and Planet \
    #FairTradeDay #AgentForChange";

  var updateCanvas = function() {
    baseImage.src = $scope.urlForLastImage;
    templateImage.src = $scope.urlForOverlay;
    var width = baseImage.width;
    var height = baseImage.height;
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;
    context.drawImage(baseImage,0,0,2000,1414);
    context.drawImage(templateImage,0,0,2000,1414);
  }

  var sharedImageChanged = function() {
    return !$scope.sharedImage;
  }

  var saveAndShareImage = function() {
    if (!sharedImageChanged()) {
      console.log("sharedImage exists");
      $cordovaSocialSharing.share(SHARING_TEXT, null, $scope.sharedImage, null);
      $ionicLoading.hide();
    } else {
      console.log("sharedImage new");
      updateCanvas();
      window.canvas2ImagePlugin.saveImageDataToLibrary(
        function(fileName){
          console.log("canvas2ImagePlugin success");
          console.log(fileName);
          $scope.sharedImage = "file://" + fileName;
          $cordovaSocialSharing.share(SHARING_TEXT, null, $scope.sharedImage, null);
          $ionicLoading.hide();
        },
        function(err){
          console.log("canvas2ImagePlugin failure");
          console.log(err);
          $ionicLoading.hide();
        },
        canvas
      );
    }
  }

  $scope.shareImage = function(){
    $ionicLoading.show({
      template: 'Preparing image<br>this may take a while...'
    });
    if (sharedImageChanged()) {
      setTimeout(saveAndShareImage, 100);
    } else {
      saveAndShareImage();
    }
  }

  $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.urlForLastImage = "img/wfto-logo-landscape.png";
      $scope.urlForOverlay = "img/poster-template-landscape.png";
      $scope.sharedImage = "";
      $scope.imageLoaded = false;
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

    $scope.goWfto = function() {
      console.log("goWfto");
       window.location.href = 'http://www.wfto.com';
    }

    $scope.addImage = function(type) {
      $scope.sharedImage = "";
      ImageService.handleMediaDialog(type).then(function() {
        $scope.hideSheet();
        $scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
        if (!$scope.imageLoaded) {
          $scope.imageLoaded = true;
        }
        console.log("FileService.lastImage\n"+FileService.lastImage())
        console.log("$scope.urlForLastImage\n"+$scope.urlForLastImage);
      });
    }

})
