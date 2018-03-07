import * as amcharts4 from "@amcharts/amcharts4";
import * as radar from "@amcharts/amcharts4/radar";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", radar.RadarChart);

chart.data = [{
  "category": "One",
  "value1": 8,
  "value2": 2,
  "value3": 4,
  "value4": 3
}, {
  "category": "Two",
  "value1": 11,
  "value2": 4,
  "value3": 2,
  "value4": 4
}, {
  "category": "Three",
  "value1": 7,
  "value2": 6,
  "value3": 6,
  "value4": 2
}, {
  "category": "Four",
  "value1": 13,
  "value2": 8,
  "value3": 3,
  "value4": 2
}, {
  "category": "Five",
  "value1": 12,
  "value2": 10,
  "value3": 5,
  "value4": 1
}, {
  "category": "Six",
  "value1": 15,
  "value2": 12,
  "value3": 4,
  "value4": 4
}, {
  "category": "Seven",
  "value1": 9,
  "value2": 14,
  "value3": 6,
  "value4": 2
}, {
  "category": "Eight",
  "value1": 6,
  "value2": 16,
  "value3": 5,
  "value4": 1
}]


chart.padding(10, 10, 10, 10);

let categoryAxis = chart.xAxes.push(new radar.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.minGridDistance = 60;
categoryAxis.renderer.labels.template.location = 0.5;
categoryAxis.mouseEnabled = false;

let valueAxis = chart.yAxes.push(new radar.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.minGridDistance = 10;
valueAxis.renderer.grid.template.strokeOpacity = 0.05
valueAxis.renderer.labels.template.textElement.fontSize = 9;
valueAxis.mouseEnabled = false;
//valueAxis.renderer.gridType = "polygons";
valueAxis.min = 0;

let series1 = chart.series.push(new radar.RadarColumnSeries());
series1.columns.template.width = amcharts4.percent(80);
series1.name = "Series 1";
series1.dataFields.categoryX = "category";
series1.dataFields.valueY = "value2";
series1.stacked = true;

let series2 = chart.series.push(new radar.RadarColumnSeries());
series2.columns.template.width = amcharts4.percent(80);
series2.columns.template.tooltipText = "{name}: {valueY.value}";
series2.name = "Series 2";
series2.dataFields.categoryX = "category";
series2.dataFields.valueY = "value2";
series2.stacked = true;

let series3 = chart.series.push(new radar.RadarColumnSeries());
series3.columns.template.width = amcharts4.percent(80);
series3.columns.template.tooltipText = "{name}: {valueY.value}";
series3.name = "Series 3";
series3.dataFields.categoryX = "category";
series3.dataFields.valueY = "value3";
series3.stacked = true;

let series4 = chart.series.push(new radar.RadarColumnSeries());
series4.columns.template.width = amcharts4.percent(80);
series4.columns.template.tooltipText = "{name}: {valueY.value}";
series4.name = "Series 4";
series4.dataFields.categoryX = "category";
series4.dataFields.valueY = "value4";
series4.stacked = true;

chart.seriesContainer.zIndex = -1;

chart.scrollbarX = new amcharts4.Scrollbar();
chart.scrollbarY = new amcharts4.Scrollbar();