import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", charts.RadarChart);

chart.data = [{
  "direction": "N",
  "value": 8
}, {
  "direction": "NE",
  "value": 9
}, {
  "direction": "E",
  "value": 4.5
}, {
  "direction": "SE",
  "value": 3.5
}, {
  "direction": "S",
  "value": 9.2
}, {
  "direction": "SW",
  "value": 8.4
}, {
  "direction": "W",
  "value": 11.1
}, {
  "direction": "NW",
  "value": 10
}]

chart.padding(10, 10, 10, 10);

let categoryAxis = chart.xAxes.push(new charts.CategoryAxis<charts.AxisRendererCircular>());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "direction";
categoryAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new charts.ValueAxis<charts.AxisRendererRadial>());

let series = chart.series.push(new charts.RadarSeries());
series.dataFields.categoryX = "direction";
series.dataFields.valueY = "value";
series.tooltipText = "{valueY.value}"
series.fillOpacity = 0.4;

chart.cursor = new charts.RadarCursor();