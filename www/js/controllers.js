angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading) {
 
    console.log("##In Google.maps.event.addDomListener");

    /**
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
    **/
    
  var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');
  var modes = document.getElementById('mode-selector');

  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
      new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
    });
  }
  setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry - controler");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry - controler");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
    
    
    
    // adding
    $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
        document.getElementById('origin-input').blur();
        document.getElementById('destination-input').blur();
    });
  };
    
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

// Loading page
.controller('PageRecvCourierCtrl', function($scope, $timeout, $ionicLoading, Chats) {
    console.log("## Inside page receive courier controler");
    
    // Get Parse class object driver request 
    function getCourierResponse (params) {
        var SendItemRequest = Parse.Object.extend("SendItemRequest");
        var query = new Parse.Query(SendItemRequest);
        if(params !== undefined) {
            if(params.confirmStatus !== undefined) {
                query.equalTo("confirmStatus", params.confirmStatus);
            }
        }
        console.log("## After Inside page receive courier controler");
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " confirm status!");
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get("userid") + " - confirm status : " + object.get("confirmStatus"));
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        })
    }
    
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    })
    
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    $timeout(function () {
        $ionicLoading.hide();
        $scope.couriers = [{name: 'Courier 1'}, {name: 'Courier 2'}, {name: 'Courier 3'}, {name: 'Courier 4'}];
        
        // load service list of couriers
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
          };
        
        // Parse waiting for courier to response
        $scope.getCourierResponse = getCourierResponse({confirmStatus: 'Y'});
        console.log("## Inside page receive courier controler - " + $scope.getCourierResponse);
        
    }, 4000);

})

<<<<<<< HEAD
// Loding page with interceptors
.controller('LoadingCtrl', function($scope, $http, $ionicLoading, Chats) {
  console.log("## Inside LoadingCtrl controler");
  var _this = this
  
  /***
  $ionicLoading.show({
    template: 'loading'
  })
  ***/
  
  $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
  })
    
  $http.jsonp('https://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero').then(function(result) {
    $ionicLoading.hide()
    $scope.items = result;
    console.log("## Inside LoadingCtrl controler : " + $scope.items);
    
    $scope.couriers = [{name: 'Courier 1'}, {name: 'Courier 2'}, {name: 'Courier 3'}, {name: 'Courier 4'}];
        
        // load service list of couriers
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };
  })
})

// Request loading page with interceptors
.controller('ReqLoadingCtrl', function($scope, $http, $ionicLoading, Chats) {
  console.log("## Inside Request LoadingCtrl controler");
  
  $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
  })
    
    console.log("## Outside getSendItemResponse ... ");
    $scope.getSendItemResponse = function(params) {
      console.log("## Inside getSendItemResponse ... ");
      var sendItemRequest = Parse.Object.extend("SendItemRequest");
      var query = new Parse.Query(sendItemRequest);
      
      if(params !== undefined) {
          console.log("## inside  getSendItemResponse params ... " + params);
          if(params.confirmStatus !== undefined) {
              console.log("## inside  getSendItemResponse params ... " + params.confirmStatus);
              query.equalTo("confirmStatus", params.confirmStatus);
          }
      }
      query.find({
          success: function(results) {
              alert("Successfully retrieved " + results.length + " confirmStatus!");
              for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  console.log("confirmStatus : " + object.id + ' - ' + object.get("confirmStatus"));
              }
              $ionicLoading.hide()
              $scope.couriers = [{name: 'Courier 1'}, {name: 'Courier 2'}, {name: 'Courier 3'}, {name: 'Courier 4'}];
                  
                  // load service list of couriers
                  $scope.chats = Chats.all();
                  $scope.remove = function(chat) {
                      Chats.remove(chat);
                  };
        
          },
          error: function(error) {
              $ionicLoading.hide()
              alert("Error: " + error.code + " " + error.message);
          }
      });
    }
    
    $scope.getSendItemResponse({confirmStatus: 'Y'});
})


.controller('ReqLoadingIntervalCtrl', ['$scope', '$interval', '$ionicLoading', 'Chats',
      function($scope, $interval, $ionicLoading, Chats) {
        $scope.format = 'M/d/yy h:mm:ss a';
        $scope.blood_1 = 100;
        $scope.blood_2 = 120;
        
        $scope.confirmStatusFlag = 0;
        
        console.log("## Inside Request ReqLoadingIntervalCtrl controler with interval");
        
        $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
        })

        $scope.getSendItemResponse = function(params) {
          console.log("## Inside ReqLoadingIntervalCtrl -  ... $scope.getSendItemResponse.. ");
          var sendItemRequest = Parse.Object.extend("SendItemRequest");
          var query = new Parse.Query(sendItemRequest);
          
          if(params !== undefined) {
              console.log("## inside  ReqLoadingIntervalCtrl params ... $scope.getSendItemResponse " + params);
              if(params.confirmStatus !== undefined) {
                  console.log("## inside  ReqLoadingIntervalCtrl params ... $scope.getSendItemResponse filter " + params.confirmStatus);
                  query.equalTo("confirmStatus", params.confirmStatus);
              }
          }
          query.find({
              success: function(results) {
                  console.log("Successfully retrieved " + results.length + " confirmStatus!");
                  for (var i = 0; i < results.length; i++) {
                      var object = results[i];
                      console.log("confirmStatus : " + object.id + ' - ' + object.get("confirmStatus"));
                  }
                  
                  // condition if someone confirm the request
                  if (results.length > 0) {
                    console.log("## Inside ReqLoadingIntervalCtrl -  ... responseConfirm.. " + results.length);
                    
                    //return true;
                    $scope.confirmStatusFlag = results.length;
                    
                  } 

                  // service call stop or repeat depend on success confirm status
                  $scope.fight();
                  
                  // Load Static data
                  // Display only when finish loading and got response
                  if (results.length > 0) {
                    $scope.couriers = [{name: 'Courier 1'}, {name: 'Courier 2'}, {name: 'Courier 3'}, {name: 'Courier 4'}];
                      
                    // load service list of couriers
                    $scope.chats = Chats.all();
                    $scope.remove = function(chat) {
                        Chats.remove(chat);
                    };
                  }
                  
                  
              },
              error: function(error) {
                  $ionicLoading.hide()
                  alert("Error: " + error.code + " " + error.message);
              }
          });
        }
    
        var stop;
        
        // Call response parse service
        $scope.getSendItemResponse({confirmStatus: 'Y'});
        
        $scope.fight = function() {
          
          // Don't start a new fight if we are already fighting
          if ( angular.isDefined(stop) ) return;
          
          stop = $interval(function() {
            //if ($scope.blood_1 > 0 && $scope.blood_2 > 0) {
              //$scope.blood_1 = $scope.blood_1 - 3;
              //$scope.blood_2 = $scope.blood_2 - 4;
            if ($scope.confirmStatusFlag > 0) {
              console.log("## Inside ReqLoadingIntervalCtrl -  ... $scope.fight.. stop calling " + $scope.confirmStatusFlag);
              $scope.stopFight();
            } else {
              console.log("## Inside ReqLoadingIntervalCtrl -  ... $scope.fight.. repeat calling " + $scope.confirmStatusFlag);
              // wair for someone confirm until timeout
              $scope.getSendItemResponse({confirmStatus: 'Y'});
            }
          }, 2000);
        };

        $scope.stopFight = function() {
          if (angular.isDefined(stop)) {
            console.log("## Inside ReqLoadingIntervalCtrl -  ... $scope.stopFight.. " + stop);
            $interval.cancel(stop);
            stop = undefined;
            // finish loading and return response result
            $ionicLoading.hide();
          }
        };

        $scope.resetFight = function() {
          $scope.blood_1 = 100;
          $scope.blood_2 = 120;
        };

        $scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopFight();
        });
      }]
)
      
// Register the 'myCurrentTime' directive factory method.
// We inject $interval and dateFilter service since the factory method is DI.
.directive('myCurrentTime', ['$interval', 'dateFilter',
  function($interval, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var format,  // date format
          stopTime; // so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      // watch the expression, and update the UI on change.
      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });

      stopTime = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTime);
      });
    }
  }])
=======
// Firebase Login controler
.controller("loginCtrl", function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
  // Get a reference to the Firebase
  // TODO: Replace "ionic-demo" below with the name of your own Firebase
  //var firebaseRef = new Firebase("https://ionic-demo.firebaseio.com/");
  var firebaseRef = new Firebase("https://sweltering-heat-9867.firebaseio.com/");
    
  // Create a Firebase Simple Login object
  $scope.auth = $firebaseSimpleLogin(firebaseRef);

  // Initially set no user to be logged in
  $scope.user = null;

  // Logs a user in with inputted provider
  $scope.login = function(provider) {
    $scope.auth.$login(provider);
  };

  // Logs a user out
  $scope.logout = function() {
    $scope.auth.$logout();
  };

  // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $scope.user = user;
  });

  // Upon successful logout, reset the user object
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $scope.user = null;
  });

  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });
})


>>>>>>> aa224c6bd47ce778cf55552aae19ed2fe5e53f55
    

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };   
});
