var app = angular.module('starter', ['ionic', 'ngCordova', 'deviceGyroscope', 'firebase', 'ngOpenFB']);


app.run(function ($ionicPlatform, $rootScope, $timeout, ngFB) {
  $ionicPlatform.ready(function () {
    ngFB.init({
      appId: '1229073797201154'
    });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.authStatus = false;
  //stateChange event
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    $rootScope.authStatus = toState.authStatus;
    if ($rootScope.authStatus) {


    }
  });

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    console.log("URL : " + toState.url);
    if (toState.url == '/dash') {
      console.log("match : " + toState.url);
      $timeout(function () {
        angular.element(document.querySelector('#leftMenu')).removeClass("hide");
      }, 1000);
    }
  });

});
app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    //--------------------------------------
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-signin.html'
        }
      },
      authStatus: false
    })
    .state('app.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-signup.html',
        }
      },
      authStatus: false
    })
    //--------------------------------------
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
      },
      authStatus: true
    })
    .state('tab.graphs', {
      url: '/graphs',
      views: {
        'tab-graphs': {
          templateUrl: 'templates/tab-graphs.html',
          controller: 'graphsCtrl'
        }
      }
    })
    .state('tab.records', {
      url: '/records',
      views: {
        'tab-records': {
          templateUrl: 'templates/tab-records.html',
          controller: 'recordsCtrl'
        }
      }
    })
    .state('tab.record', {
      url: '/record/:recordId',
      views: {
        'tab-records': {
          templateUrl: 'templates/record-detail.html',
          controller: 'recordCtrl'
        }
      }
    })
    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent': {
          templateUrl: "templates/profile.html",
          controller: "ProfileCtrl"
        }
      }
    })




  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position('bottom');


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');

});
