angular.module('app.directives', [])

.directive('input', function($timeout,$cordovaKeyboard) {
  return {
          restrict: 'E',
          scope: {
         },
         link: function(scope, element, attr){
            element.bind('keydown', function(e){
                if(e.which == 13){
                  var nextinput = element.next('input');
                  console.log(nextinput.length);
                  if (nextinput.length === 1)
                  {
                    nextinput[0].focus();
                  } else {
                    $cordovaKeyboard.close();
                  }
                }
            });
         }
     }
});
