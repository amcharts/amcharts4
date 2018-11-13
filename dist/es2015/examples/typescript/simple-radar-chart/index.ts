import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.RadarChart);


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

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "direction";
categoryAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());

let series = chart.series.push(new am4charts.RadarSeries());
series.dataFields.categoryX = "direction";
series.dataFields.valueY = "value";
series.tooltipText = "{valueY.value}"
series.fillOpacity = 0.4;

chart.cursor = new am4charts.RadarCursor();