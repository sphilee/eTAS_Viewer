angular.module('starter.controllers', [])

  .controller("DashCtrl", ["$scope", "$firebaseObject", function ($scope, $firebaseObject) {
    var ref = firebase.database().ref("realtime");
    var obj = $firebaseObject(ref);


    var gaugeOptions = {

      chart: {
        type: 'solidgauge'
      },

      title: null,

      pane: {
        center: ['50%', '85%'],
        size: '80%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };

    // The speed gauge
    var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: 50,
        title: {
          text: 'Speed'
        }
      },

      credits: {
        enabled: false
      },

      series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">km/h</span></div>'
        },
        tooltip: {
          valueSuffix: ' km/h'
        }
      }]



    }));



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





    // To make the data available in the DOM, assign it to $scope
    $scope.data = obj;





  }])
  .controller('graphsCtrl', ["$scope", "$firebaseObject", function ($scope, $firebaseObject) {
    var ref = firebase.database().ref("realtime");
    var obj = $firebaseObject(ref);



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
          load: function () {
          }
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

    $scope.data = obj;

  }])

  .controller('recordsCtrl', ["$scope", "$firebaseArray", function ($scope, $firebaseArray) {
    var ref = firebase.database().ref("record");
    var list = $firebaseArray(ref);
    var items = [];
    var cnt = 0;
    list.$loaded()
      .then(function (x) {

        angular.forEach(x, function (x) {
          x.id = cnt;
          x.drivingTime = Math.round(x.drivingTime / 3600) + "시간" + Math.round(x.drivingTime % 3600 / 60) + "분" + Math.round(x.drivingTime % 3600 % 60) + "초";
         x.date = x.date.slice(0,24);
          items.push(x);
          cnt++;
        })
        console.log(items);
        $scope.items = items;
      })
      .catch(function (error) {
        console.log("Error:", error);
      });


  }]);


