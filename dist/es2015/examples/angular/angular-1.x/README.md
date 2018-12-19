Using AngularJS 1.x
===================

This tutorial will show you every step you need to use amCharts 4 with AngularJS 1.x.

First, create an `index.html` file:

```html
<!DOCTYPE HTML>
<html ng-app="app">
  <head>
    <!-- Loads amCharts 4 -->
    <script src="https://www.amcharts.com/lib/4/core.js"></script>
    <script src="https://www.amcharts.com/lib/4/charts.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/animated.js"></script>

    <!-- Loads AngularJS -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.5/angular.min.js"></script>

    <!-- Loads our app code -->
    <script src="chart.js"></script>
    <script src="app.js"></script>
  </head>
  <body>
    <!-- Displays the chart component -->
    <chart style="width: 100%; height: 500px"></chart>
  </body>
</html>
```

Now create a `chart.js` file:

```js
am4core.useTheme(am4themes_animated);

angular.module("chart", [])
  .directive("chart", function () {
    return {
      restrict: "E",
      scope: {},
      template: "<div id='chartdiv'></div>",
      replace: true,
      link: function ($scope) {
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        chart.paddingRight = 20;

        var data = [];
        var visits = 10;
        for (var i = 1; i < 366; i++) {
          visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
          data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
        }

        chart.data = data;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        $scope.$on("$destroy", function () {
          chart.dispose();
        });
      }
    };
  });
```

This contains all of the chart code. It is important to use `$scope.$on("$destroy", ...)` to dispose the chart (as shown above).

Lastly, make an `app.js` file:

```js
angular.module("app", ["chart"]);
```

Notice that the `app` module imports the `chart` module.

Now you can open the `index.html` file in a browser, and it should work!
