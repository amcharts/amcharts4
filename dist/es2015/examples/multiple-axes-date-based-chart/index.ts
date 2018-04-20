import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", charts.XYChart);

let data = [];
let price = 1000;
let quantity = 30000;
for (let i = 0; i < 300; i++) {
	price += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
	quantity += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 1000);
	data.push({ date: new Date(2000, 1, i), price: price, quantity: quantity });
}

chart.data = data;

let dateAxis = chart.xAxes.push(new charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.ticks.template.length = 8;
dateAxis.renderer.ticks.template.strokeOpacity = 0.1;

let valueAxis = chart.yAxes.push(new charts.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new charts.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "price";
series.tooltipText = "{valueY.value}";
series.name = "Series 1";

let valueAxis2 = chart.yAxes.push(new charts.ValueAxis());
valueAxis2.tooltip.disabled = true;
valueAxis2.renderer.opposite = true;
valueAxis2.renderer.grid.template.disabled = true;

let series2 = chart.series.push(new charts.LineSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "quantity";
series2.yAxis = valueAxis2;
series2.tooltipText = "{valueY.value}";
series2.name = "Series 2";

chart.cursor = new charts.XYCursor();

let scrollbarX = new charts.XYChartScrollbar();
scrollbarX.series.push(series);
chart.scrollbarX = scrollbarX;

chart.legend = new charts.Legend();
chart.legend.parent = chart.plotContainer;
chart.legend.zIndex = 100;
chart.legend.valueLabels.template.text = "{valueY.value.formatNumber('$#.')}";