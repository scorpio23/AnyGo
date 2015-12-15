// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ion-place-tools', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
      
    // Parse initialization
    Parse.initialize("QulU4nLdAg84OoM0Yvd8LfE8dwNNqD2o4UW4mo1f", "yl8ZDO4kpwmtQYrvS95zjWVwkSwnlyC5cznauYxT");
      
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  
  // Show item details
  .state('tab.send-item', {
    url: '/send-item',
    views: {
      'tab-dash': {
        templateUrl: 'templates/page-send-item.html',
        controller: 'SendItemCtrl'
      }
    }
  })
  
  // Show send confirmation details
  .state('tab.send-confirmation', {
    url: '/send-confirmation',
    views: {
      'tab-dash': {
        templateUrl: 'templates/page-send-confirmation.html',
        controller: 'SendConfirmationCtrl'
      }
    }
  })
  
  // Page Loading
  // Show list of accepted courier
  .state('tab.page-receive-couriers', {
    url: '/page-receive-couriers',
    views: {
      'tab-dash': {
        templateUrl: 'templates/page-receive-couriers.html',
        controller: 'PageRecvCourierCtrl'
      }
    }
  })
  
  // Show courier confirmation details
  .state('tab.page-courier-confirmation', {
    url: '/page-courier-confirmation/:chatId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/page-courier-confirmation.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })
  

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
