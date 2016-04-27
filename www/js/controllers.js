angular.module('app.controllers', [])

.controller('PosterGeneratorCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing,
  $ionicActionSheet, $location, $timeout, $ionicPopup, FileService, ImageService) {

  var canvas = document.getElementById('tempCanvas');
  var context = canvas.getContext('2d');

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Coming soon',
      template: 'Keep your eyes peeled sharing will be coming soon!'
    });

    alertPopup.then(function(res) {
      console.log('Showing alert');
    });
  };

  $scope.shareImage= function(){
    console.log("createOverlay");

    // $scope.showAlert();
    // return;

    var baseImage =  new Image();
    var templateImage = new Image();

    baseImage.src = $scope.urlForLastImage;
    templateImage.src = $scope.urlForOverlay;

    var width = baseImage.width;
    var height = baseImage.height;
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;

    console.log(canvas);

    context.drawImage(baseImage,0,0,1200,800);
    context.drawImage(templateImage,0,0,1200,800);

    // context.font = "100px impact";
    // textWidth = context.measureText($scope.frase).width;
    //
    // if (textWidth > canvas.offsetWidth) {
    //     context.font = "40px impact";
    // }
    // context.textAlign = 'center';
    // context.fillStyle = 'white';
    //
    // context.fillText($scope.textOverlay,canvas.width/2,canvas.height*0.8);


    window.canvas2ImagePlugin.saveImageDataToLibrary(
            function(msg){
              console.log("canvas2ImagePlugin success");
              console.log(msg);
              $scope.sharedImage = "file://" + msg;
              // window.location.href = "file://" + msg;
              var options = {
                message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: 'the subject', // fi. for email
                files: [msg], // an array of filenames either locally or remotely
                url: 'https://www.wfto.com',
                chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
              }

              var onSuccess = function(result) {
                console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
              }

              var onError = function(msg) {
                console.log("Sharing failed with message: " + msg);
              }

              // window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
              console.log($cordovaSocialSharing);
              $cordovaSocialSharing.shareWithOptions(options);

            },
            function(err){
              console.log("canvas2ImagePlugin failure");
                console.log(err);
            },
            canvas
        );

    return;
    var imgURI = canvas.toDataURL("image/png");
    console.log(canvas);

    $timeout( function(){
      console.log("downloading");
      console.log("imgURI:\n"+imgURI);
      var url = imgURI.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      window.open(url);
      window.location.href = imgURI;
        //$scope.image = imgURI;
    }, 200);
  }

  $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.urlForLastImage = "img/wfto-logo-landscape.png";
      $scope.urlForOverlay = "img/poster-template-landscape.png";
      //$scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
      $scope.$apply();
      $scope.sharedImage = "";
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
      ImageService.handleMediaDialog(type).then(function() {
        $scope.hideSheet();
        $scope.urlForLastImage = $scope.urlForImage(FileService.lastImage());
        console.log("FileService.lastImage\n"+FileService.lastImage())
        console.log("$scope.urlForLastImage\n"+$scope.urlForLastImage);
      });
    }

})
