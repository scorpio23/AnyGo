angular.module('starter.controllers', [])

// This is User Management controler
// Login and Signup member
.controller('LoginCtrl', function($scope, $state, $ionicLoading, $timeout, $ionicPopup) {
  
  $scope.data = {};
  // Signup email function to update Parse
  $scope.signupEmail = function() {
    //Create a new user on Parse
    var user = new Parse.User();
    user.set("username", $scope.data.username);
    user.set("password", $scope.data.password);
    user.set("email", $scope.data.email);
    user.set("isDriver", $scope.data.isdriver);
    
    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        $ionicPopup.alert({
          title: 'Success Signup',
          content: 'Welcome to AnyGo.'
        }).then(function(res) {
          console.log('User has successfully signup : ' + user);
        });
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        //alert("Error: " + error.code + " " + error.message);
        $ionicPopup.alert({
          title: 'Unsuccessful Signup',
          content: 'Please completed the form to signup.'
        }).then(function(res) {
          console.log('User failed to signup : ' + user);
        });
      }
    });
  };
 
  // Login function
  $scope.loginEmail = function() {
    
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>',
      //content: 'Loading',
      //animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    })
      
    Parse.User.logIn($scope.data.username, $scope.data.password, {
      success: function(user) {
        // Do stuff after successful login.
        console.log("User successfully login : " + user);
        //alert("success login.. !");
        
        // store user session in localStorage
        localStorage.setItem("username", $scope.data.username);
        
        // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
        $timeout(function () {
            $state.go('tab.dash');
            $ionicLoading.hide();
        }, 2000);
      },
      error: function(user, error) {
        $ionicLoading.hide();
        // The login failed. Check error to see why.
        //alert("Login Unsuccessful, please try again");
        $ionicPopup.alert({
          title: 'Unsuccessful Login',
          content: 'Wrong password or login id.'
        }).then(function(res) {
          console.log('User has failed login : ' + user);
        });
      }
    });
  };
})

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
    $scope.disableTap = function() {
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

.controller('CourierCtrl', function($scope, $stateParams) {
  console.log("## Inside Courier controler");
})

// Loading page
.controller('PageRecvCourierCtrl', function($scope, $timeout, $ionicLoading, Chats) {
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>',
        //content: 'Loading',
        //animation: 'fade-in',
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
    }, 4000);

})

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
        template: '<ion-spinner icon="android"></ion-spinner>',
        //content: 'Loading',
        //animation: 'fade-in',
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

// Get customer List request to send item for courier page
.controller('SendItemReqCtrl', function($scope, $http, $ionicLoading, $state) {
      console.log("## Inside Request SendItemReqCtrl controler");

      $scope.sendReqList = [];

      //$scope.getSendItemReqList = function(params) {

      params = {sendResponse: false};

      var sendItemRequest = Parse.Object.extend("SendItemRequest");
      var query = new Parse.Query(sendItemRequest);

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>',
        //content: 'Loading',
        //animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      })

      if(params !== undefined) {
          console.log("## inside  SendItemReqCtrl params ... " + params);
          if(params.sendResponse !== undefined) {
              console.log("## inside  SendItemReqCtrl params ... " + params.sendResponse);
              query.equalTo("sendResponse", params.sendResponse);
              query.equalTo("sendRequest", true);
              query.equalTo("deleteFlag", false);
              query.equalTo("status", "NEW");
          }
      }
      query.find({
          success: function(results) {
              console.log("Successfully retrieved " + results.length + " requests!");
              for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  $scope.sendReqList.push({objectId: object.id, userid: object.get("userid")});

                  console.log("getting request from username : " + object.id + ' - ' + object.get("userid"));
              }
              $ionicLoading.hide();
          },
          error: function(error) {
              $ionicLoading.hide()
              alert("Error: " + error.code + " " + error.message);
          }
      });
      
    //}

    // to load send item request
   //$scope.getSendItemReqList({confirmStatus: 'N'});
    
    // process selected customer by courier
    $scope.confirmSendOrder = function(userid) {
        console.log("## inside  SendItemReqCtrl method confirmSendOrder to confirm user : " + userid);
        var SendItemRequest = Parse.Object.extend("SendItemRequest");
        var query = new Parse.Query(SendItemRequest);
        query.equalTo("userid", userid);
        
        query.first({
          success: function(object) {
            object.set("driverid", localStorage.getItem("username"));
            object.set("sendResponse", true);
            object.set("waiting", true);
            object.set("status", "RES");
            object.save();
            alert ("Request Job Successfully..");
              
            $state.go('tab.courier');
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }
})

// Customer to request to send item to courier
.controller('ReqLoadingIntervalCtrl', ['$scope', '$interval', '$ionicLoading', 'Chats', '$ionicPopup', 
      function($scope, $interval, $ionicLoading, Chats, $ionicPopup) {
        $scope.format = 'M/d/yy h:mm:ss a';
        $scope.blood_1 = 100;
        $scope.blood_2 = 120;
        $scope.confirmStatusFlag = 0;
        
        console.log("## Inside Request ReqLoadingIntervalCtrl controler with interval");
        
        
        $ionicLoading.show({ 
            scope: $scope, 
            template: '</button><ion-spinner icon="android"></ion-spinner><button class="button button-clear" ng-click="cancelSearch()" style="color: #FFFFFF; right: -43%; margin-top: -40%;"><i class="ion-ios-close" item-icon-right"></i>',
            //template: '</button><ion-spinner icon="android">',
            showBackdrop: true,
            maxWidth: 10,
            showDelay: 0,
            duration: 20000
        });
        
        $scope.cancelSearch = function () {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Request Timeout',
              content: 'Sorry, there is no Courier right now, please try again.'
            }).then(function(res) {
              console.log('Sorry, there is no Courier right now, please try again.  : ' + localStorage.getItem("username"));
            });
        }
        
        // function to delete if existing request by customer is exist
        $scope.updateUserOrder = function(userid) {
            console.log("## Searching user and delete if exist : " + userid);
            var SendItemRequest = Parse.Object.extend("SendItemRequest");
            var query = new Parse.Query(SendItemRequest);
            query.equalTo("userid", userid);
            query.equalTo("sendRequest", true);
            query.equalTo("deleteFlag", false);
            
            console.log("## Find query start ");
            query.find({
              success: function(results) {
                  console.log("## updateUserOrder - return value for user's case deletion : " + results.length);
                  for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    object.set("deleteFlag", true);
                    object.save();
                    console.log("## User existing, mark this request deleted : " + userid);
                  }
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            }).then(function() {
                // Insert send item request from customer
                var SendItemRequest = Parse.Object.extend("SendItemRequest");
                var sendItemObject = new SendItemRequest();
                sendItemObject.set("userid", localStorage.getItem("username"));
                sendItemObject.set("sendResponse", false);
                sendItemObject.set("sendRequest", true);
                sendItemObject.set("deleteFlag", false);
                sendItemObject.set("status", "NEW");  
                sendItemObject.save(null, {});
                console.log("## Inside Request ReqLoadingIntervalCtrl - success insert request for " + localStorage.getItem("username"));
            }).then(function() {
                $scope.getSendItemResponse(localStorage.getItem("username"), {sendResponse: true});  
            })
            
            console.log("## Find query end ");
        }
        
        $scope.getSendItemResponse = function(username, params) {
          console.log("## Inside ReqLoadingIntervalCtrl -  ... $scope.getSendItemResponse.. ");
          var sendItemRequest = Parse.Object.extend("SendItemRequest");
          var queryMain = new Parse.Query(sendItemRequest);
          
          if(params !== undefined) {
              console.log("## inside  ReqLoadingIntervalCtrl params ... $scope.getSendItemResponse " + params);
              if(params.sendResponse !== undefined) {
                  console.log("## inside  ReqLoadingIntervalCtrl params ... $scope.getSendItemResponse filter " + params.sendResponse);
                  queryMain.equalTo("sendResponse", params.sendResponse);
                  queryMain.equalTo("userid", localStorage.getItem("username"));
                  queryMain.equalTo("deleteFlag", false);
                  queryMain.equalTo("waiting", true);
              }
          }
          console.log("## step go here ");
          queryMain.find({
              success: function(resultsRes) {
                  console.log("Successfully retrieved " + resultsRes.length + " confirm response from driver!");
                  for (var i = 0; i < resultsRes.length; i++) {
                      var object = resultsRes[i];
                      console.log("sendResponse : " + object.id + ' - ' + object.get("deleteFlag"));
                  }
                  
                  // condition if someone confirm the request
                  if (resultsRes.length > 0) {
                    console.log("## Inside ReqLoadingIntervalCtrl -  ... responseConfirm count.. " + resultsRes.length);
                    
                    //return true;
                    $scope.confirmStatusFlag = resultsRes.length;
                    
                  } 

                  // service call stop or repeat depend on success confirm status
                  $scope.fight();
                  
                  // Load Static data
                  // Display only when finish loading and got response from driver
                  if (resultsRes.length > 0) {
                      $scope.couriers = [];
                      
                      var sendItemRequest = Parse.Object.extend("SendItemRequest");
                      var query = new Parse.Query(sendItemRequest);

                      console.log("## Response from driver received..");
                      query.equalTo("sendResponse", true);
                      query.equalTo("waiting", true);
                      query.equalTo("userid", localStorage.getItem("username"));
                      query.equalTo("sendRequest", true);
                      query.equalTo("deleteFlag", false);
                      query.equalTo("status", "RES");
                      
                      query.find({
                          success: function(resultsCourierCfr) {
                              console.log("Successfully retrieved driver list " + resultsCourierCfr.length + " requests!");
                              for (var i = 0; i < resultsCourierCfr.length; i++) {
                                  var object = resultsCourierCfr[i];
                                  $scope.couriers.push({objectId: object.id, userid: object.get("driverid"), face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'});

                                  console.log("getting response from driver id : " + object.id + ' - ' + object.get("driverid"));
                              }
                              $ionicLoading.hide();
                          },
                          error: function(error) {
                              $ionicLoading.hide()
                              $ionicPopup.alert({
                                title: 'Error',
                                  content: 'Error in retrieving driver list.'
                                }).then(function(res) {
                                  console.log('Error in retrieving driver list.');
                                });
                          }
                      });
                      
                    // load service list of couriers
                    /***
                    $scope.chats = Chats.all();
                    $scope.remove = function(chat) {
                        Chats.remove(chat);
                    };
                    ***/
                  }
              },
              error: function(error) {
                  $ionicLoading.hide()
                  alert("Error: " + error.code + " " + error.message);
              }
          });
        }
        
        var stop;
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
              $scope.getSendItemResponse(localStorage.getItem("username"), {sendResponse: true});
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
        
        // Update user request if exist
        $scope.updateUserOrder(localStorage.getItem("username"));
          
        // Call response parse service
        //$scope.getSendItemResponse(localStorage.getItem("username"), {sendResponse: true});  
          
        
        
        
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

// Courier request controler -- ##### UNUSED
.controller('CourierReqCtrl', function($scope) {
    console.log("## Inside CourierReqCtrl for courier controler for username : " + localStorage.getItem("username"));
    
    $scope.saveCourierReq = function(userid, sendResponse) {
        var SendItemRequest = Parse.Object.extend("SendItemRequest");
        var sendItemObject = new SendItemRequest();
        sendItemObject.set("userid", localStorage.getItem("username"));
        sendItemObject.set("sendResponse", sendResponse);
        sendItemObject.save(null, {});
    };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };   
});
