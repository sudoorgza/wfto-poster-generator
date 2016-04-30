angular.module('app.controllers', [])

.controller('PosterGeneratorCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing,
  $ionicLoading, $ionicActionSheet, $location, $timeout, $ionicPopup, $ionicModal, $cordovaKeyboard,
  $cordovaInAppBrowser,
  FileService, ImageService) {

  var canvas = document.getElementById('tempCanvas');
  var context = canvas.getContext('2d');
  var baseImage =  new Image();
  var templateImage = new Image();
  var SHARING_TEXT = "I'm part of the human chain for Fair Trade and Planet \
#FairTradeDay #AgentForChange";
  var IMAGE_WIDTH = 2000;
  var IMAGE_HEIGHT = 1414;


  var updateCanvas = function() {
    baseImage.src = $scope.urlForLastImage;
    templateImage.src = $scope.urlForOverlay;
    canvas.width = IMAGE_WIDTH;
    canvas.height = IMAGE_HEIGHT;
    context.save();
    context.drawImage(baseImage,0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
    context.drawImage(templateImage,0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
    context.restore();
    context.fillStyle = 'white';
    context.font="normal normal 600 64px Roboto";
    nameWidth = context.measureText($scope.name).width;
    context.fillText($scope.name,(IMAGE_WIDTH-nameWidth)/2,IMAGE_HEIGHT*0.81);
    context.font="italic normal 600 64px Roboto";
    sloganWidth = context.measureText($scope.slogan).width;
    context.fillText($scope.slogan,(IMAGE_WIDTH-sloganWidth)/2,IMAGE_HEIGHT*0.97);
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
       $cordovaInAppBrowser.open('http://www.wfto.com','_system');
    }

    $scope.addImage = function(type) {
      $scope.sharedImage = "";
      ImageService.handleMediaDialog(type).then(function() {
        $scope.hideSheet();
        $scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
        if (!$scope.imageLoaded) {
          $scope.imageLoaded = true;
        }
        var element = document.getElementById("input-name");
        console.log(element);
        element.focus();
        $cordovaKeyboard.show();
        console.log("FileService.lastImage\n"+FileService.lastImage())
        console.log("$scope.urlForLastImage\n"+$scope.urlForLastImage);
      });
    }

})
