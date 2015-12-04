angular.module('starter.controllers', [])

//.controller('DashCtrl', function($scope) {})
.controller('DashCtrl', function($scope, $ionicLoading) {
 
  console.log("In Google.maps.event.addDomListener");
   google.maps.event.addDomListener(window, 'load', function() {
    console.log("Finish In Google.maps.event.addDomListener");
        var myLatlng = new google.maps.LatLng(1.395621, 103.91228);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
    });

 
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

// Send Item Controler
.controller('SendItemCtrl', function($scope, $stateParams) {
  console.log("## Inside send item controler");
})

// Send confirmation Controler
.controller('SendConfirmationCtrl', function($scope, $stateParams) {
  console.log("## Inside send confirmation controler");
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
