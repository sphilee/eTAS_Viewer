angular.module('starter.controllers', [])

.controller('graphsCtrl', ["$scope", "$firebaseObject", function ($scope, $firebaseObject) {
  
  
}])


  .controller("DashCtrl", ["$scope", "$firebaseObject", function ($scope, $firebaseObject) {
    var ref = firebase.database().ref("realtime");
    var obj = $firebaseObject(ref);

    var point;
    
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

        point = chartSpeed.series[0].points[0];
        point.update(obj.speed);


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





  }]);

  
