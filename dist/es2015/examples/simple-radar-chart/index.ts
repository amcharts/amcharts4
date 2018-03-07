import * as amcharts4 from "@amcharts/amcharts4";
import * as radar from "@amcharts/amcharts4/radar";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);


let chart = amcharts4.create("chartdiv", radar.RadarChart);

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

let categoryAxis = chart.xAxes.push(new radar.CategoryAxis<radar.AxisRendererCircular>());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "direction";
categoryAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new radar.ValueAxis<radar.AxisRendererRadial>());

let series = chart.series.push(new radar.RadarSeries());
series.dataFields.categoryX = "direction";
series.dataFields.valueY = "value";
series.tooltipText = "{valueY.value}"
series.fillOpacity = 0.4;

chart.cursor = new radar.RadarCursor();