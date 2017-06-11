app.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, $ionicPopup, ngFB) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  //--------------------------------------------
  $scope.login = function (user) {

    if (typeof (user) == 'undefined') {
      $scope.showAlert('Please fill username and password to proceed.');
      return false;
    }

    if (user.username == 'demo@gmail.com' && user.password == 'demo') {
      $location.path('/tab/dash');
    } else {
      $scope.showAlert('Invalid username or password.');
    }

  };
  //--------------------------------------------
  $scope.logout = function () {
    $location.path('/app/login');
  };
  //--------------------------------------------
  // An alert dialog
  $scope.showAlert = function (msg) {
    var alertPopup = $ionicPopup.alert({
      title: 'Warning Message',
      template: msg
    });
  };
  //--------------------------------------------
  /*
    install reference
      cordova plugin add cordova-plugin-inappbrowser
      https://github.com/ccoenraets/OpenFB
   */

  $scope.fbLogin = function () {
    ngFB.login({
      scope: 'email,publish_actions'
    }).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          location.href = "#/tab/dash";
        } else {
          alert('Facebook login failed');
        }
      });
  };

  $scope.fbLogout = function () {
    facebookConnectPlugin.logout(function () {
      location.href = "#/login"
    }, function () {

    });
  };
  //--------------------------------------------
});
app.controller("DashCtrl", function ($scope, $ionicSideMenuDelegate, $firebaseObject) {
  var ref = firebase.database().ref("realtime");
  var obj = $firebaseObject(ref);

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };




  // The speed gauge
  var chartSpeed = Highcharts.chart('speed', {

    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    },

    title: {
      text: ''
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 60,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: 'km/h'
      },
      plotBands: [{
        from: 0,
        to: 40,
        color: '#55BF3B' // green
      }, {
        from: 40,
        to: 50,
        color: '#DDDF0D' // yellow
      }, {
        from: 50,
        to: 60,
        color: '#DF5353' // red
      }]
    },

    series: [{
      name: 'Speed',
      data: [40],
      tooltip: {
        valueSuffix: ' km/h'
      }
    }]

  });

  const voiceList = ["급출발입니다.",

    "급정지입니다.",

    "급가속입니다.",

    "급감속입니다.",

    "과속입니다.",

    "장기과속중입니다.",

    "급좌회전입니다.",

    "급우회전입니다.",

    "급유턴입니다.",

    "급진로변경입니다.",

    "급앞지르기입니다."
  ]
  const voice = function (id, voice) {
    if (id > 0) {
      TTS
        .speak({
          text: voice,
          locale: 'ko-KR',
          rate: 1
        }, function () {
          // alert('success');
        }, function (reason) {
          alert(reason);
        });
    }
  }

  // obj.$watch(function () {
  //   return obj.start;
  // }, function (event) {
  //   voice(event, voiceList[0]);
  // });
  // $scope.$watch(function () {
  //   return obj.stop;
  // }, function (event) {
  //   voice(event, voiceList[1]);
  // });
  // $scope.$watch(function () {
  //   return obj.acc;
  // }, function (event) {
  //   voice(event, voiceList[2]);
  // });
  // $scope.$watch(function () {
  //   return obj.dcc;
  // }, function (event) {
  //   voice(event, voiceList[3]);
  // });
  // $scope.$watch(function () {
  //   return obj.SL;
  // }, function (event) {
  //   voice(event, voiceList[4]);
  // });
  // $scope.$watch(function () {
  //   return obj.LSL;
  // }, function (event) {
  //   voice(event, voiceList[5]);
  // });
  // $scope.$watch(function () {
  //   return obj.rotationL;
  // }, function (event) {
  //   voice(event, voiceList[6]);
  // });
  // $scope.$watch(function () {
  //   return obj.rotationR;
  // }, function (event) {
  //   voice(event, voiceList[7]);
  // });

  // $scope.$watch(function () {
  //   return obj.utrun;
  // }, function (event) {
  //   voice(event, voiceList[8]);
  // });
  // $scope.$watch(function () {
  //   return obj.CC;
  // }, function (event) {
  //   voice(event, voiceList[9]);
  // });

  // $scope.$watch(function () {
  //   return obj.CF;
  // }, function (event) {
  //   voice(event, voiceList[10]);
  // });

  obj.$watch(function () {

    chartSpeed.series[0].points[0].update(obj.speed);

    var accum = obj.rotationL + obj.rotationR + obj.uturn + obj.CC + obj.CF + obj.SL + obj.LSL + obj.acc + obj.dcc + obj.start + obj.stop;
    if (accum < 20) {
      $scope.color = '#33cc33';
      $scope.text = '우수';
    } else if (accum < 40) {
      $scope.color = '#33ccff';
      $scope.text = '양호';
    } else if (accum < 60) {
      $scope.color = '#ffff00';
      $scope.text = '보통';
    } else if (accum < 80) {
      $scope.color = '#ff9900';
      $scope.text = '미달';
    } else if (accum < 100) {
      $scope.color = '#cc3300';
      $scope.text = '위험';
    } else {
      $scope.color = '#c842f4';
      $scope.text = '이상';
    }
  });

  $scope.data = obj;


});
app.controller('graphsCtrl', function ($scope, $ionicSideMenuDelegate, $firebaseObject) {
  var ref = firebase.database().ref("realtime");
  var obj = $firebaseObject(ref);

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };




  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  var chartGraph = Highcharts.chart('container', {
    chart: {
      type: 'spline',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function () {

          // set up the updating of the chart each second
          // var series = this.series[0];
          // setInterval(function () {
          //     var x = (new Date()).getTime(), // current time
          //         y = Math.random();
          //     series.addPoint([x, y], true, true);
          // }, 1000);
        }
      }
    },
    title: {
      text: '속도, 가속도'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: 'km/h'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'Speed data',
      data: (function () {
        // generate an array of random data
        var data = [],
          time = (new Date()).getTime(),
          i;

        for (i = -30; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0
          });
        }
        return data;
      }())
    }, {
      name: 'Acc data',
      data: (function () {
        // generate an array of random data
        var data = [],
          time = (new Date()).getTime(),
          i;

        for (i = -30; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0
          });
        }
        return data;
      }())
    }]
  });
  var chartGraph2 = Highcharts.chart('container2', {
    chart: {
      type: 'spline',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function () {}
      }
    },
    title: {
      text: '각속도'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: '°/sec'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'angular data',
      data: (function () {
        // generate an array of random data
        var data = [],
          time = (new Date()).getTime(),
          i;

        for (i = -30; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0
          });
        }
        return data;
      }())
    }]
  });
  var i = 0;
  obj.$watch(function () {
    const time = (new Date()).getTime();
    if (i % 10 == 0) {
      chartGraph.series[0].addPoint([time + i * 100, obj.speed], true, true);
      chartGraph.series[1].addPoint([time + i * 100, obj.accVel], true, true);
      chartGraph2.series[0].addPoint([time + i * 100, obj.angularVel], true, true);
    }
    i++;

  });


});
app.controller('recordsCtrl', function ($scope, $ionicSideMenuDelegate, $firebaseArray, Records) {

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  var ref = firebase.database().ref("record");
  var list = $firebaseArray(ref);
  var cnt = 0;
  var keepGoing = true;
  Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  }

  // FIXME: for refresh
  $scope.load = function () {
    list.$loaded()
      .then(function (x) {
        // $scope.forminput = {};
        Records.clear();
        cnt = 0;

        angular.forEach(x, function (x) {
          if (keepGoing) {
            if (cnt == list.length) {
              keepGoing = false;
            }
            x.id = cnt;
            x.drivingTimeStr = x.drivingTime.toHHMMSS();
            x.dateRecord = x.date.slice(0, 24);
            Records.push(x);
            cnt++;
          }
        })

        $scope.items = Records.all();

        keepGoing = true;
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  $scope.load();
});
app.controller('recordCtrl', function ($scope, $stateParams, Records, $cordovaGeolocation) {
  $scope.item = Records.get($stateParams.recordId);
  var startDate = Date.parse($scope.item.date) + 32400000;
  var recordGraph = Highcharts.chart('record', {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      labels: {
        overflow: 'justify'
      }
    },
    yAxis: {
      title: {
        text: 'km/h'
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      alternateGridColor: null
    },
    plotOptions: {
      spline: {
        lineWidth: 4,
        states: {
          hover: {
            lineWidth: 5
          }
        },
        marker: {
          enabled: false
        }
      }
    },
    series: [{
      name: '속도',
      type: 'column',

      pointStart: startDate,
      pointInterval: 1000, // one second
      tooltip: {
        valueSuffix: ' Km/h'
      },
      data: Records.get($stateParams.recordId).speedList.map(function (item) {
        return parseInt(item, 10);
      })
    }, {
      name: '가속도',
      tooltip: {
        valueSuffix: ' Km/h'
      },
      pointStart: startDate,

      pointInterval: 1000, // one second
      data: Records.get($stateParams.recordId).accList.map(function (item) {
        return parseInt(item, 10);
      })
    }, {
      name: '각속도',
      tooltip: {
        valueSuffix: ' °/sec'
      },
      pointStart: startDate,

      pointInterval: 100,
      data: Records.get($stateParams.recordId).angularList.map(function (item) {
        return parseInt(item, 10);
      })
    }],
    navigation: {
      menuItemStyle: {
        fontSize: '10px'
      }
    }
  });





});
// FIXME: 전체
app.controller('ProfileCtrl', function ($scope, ngFB, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  ngFB.api({
    path: '/me',
    params: {
      fields: 'id,name'
    }
  }).then(
    function (user) {
      $scope.user = user;
    },
    function (error) {});
});
app.filter('reverse', function () {
  return function (items) {
    return items.slice().reverse();
  };
});
