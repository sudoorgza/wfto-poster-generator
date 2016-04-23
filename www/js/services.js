angular.module('app.services', ['ngCordova'])

//.factory('BlankFactory', [function(){
//
//}])

.factory('FileService', function() {
  var images;
  var IMAGE_STORAGE_KEY = 'images';

  function getImages() {
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    if (img) {
      images = JSON.parse(img);
    } else {
      images = [];
    }
    return images;
  };

  function getLastImage() {
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    image = null;
    if (typeof img !== 'undefined') {
      images = JSON.parse(img);
      image = images[images.length-1];
    }
    return image;
  };

  function addImage(img) {
    images.push(img);
    console.log("addImage\n"+img);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  };

  return {
    storeImage: addImage,
    images: getImages,
    lastImage: getLastImage
  }
})

.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {

  function makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
  }

  function saveMedia(type) {
    return $q(function(resolve, reject) {

      var options = optionsForType(type);

      $cordovaCamera.getPicture(options).then(function(imageUrl) {
        console.log("cordovaCamera.getPicture\nimageURL\n"+imageUrl);
        window.FilePath.resolveNativePath(imageUrl, function(nativePath) {
          console.log("resolveNativePath Success\n"+nativePath);
        }, function(err) {
          console.log("resolveNativePath Error\n"+nativePath);
        });
        var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
        var newName = makeid() + name;
        console.log("copeFile\nname\n"+name+"\nnewName\n"+newName);
        $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
          .then(function(info) {
            console.log("calling storeImage\n"+newName);
            FileService.storeImage(newName);
            resolve();
          }, function(e) {
            reject();
          });
      });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }
});
