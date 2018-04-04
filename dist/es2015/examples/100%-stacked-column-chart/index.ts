import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", xy.XYChart);

chart.data = [{
	"category": "One",
	"value1": 1,
	"value2": 5,
	"value3": 3
}, {
	"category": "Two",
	"value1": 2,
	"value2": 5,
	"value3": 3
}, {
	"category": "Three",
	"value1": 3,
	"value2": 5,
	"value3": 4
}, {
	"category": "Four",
	"value1": 4,
	"value2": 5,
	"value3": 6
}, {
	"category": "Five",
	"value1": 3,
	"value2": 5,
	"value3": 4
}, {
	"category": "Six",
	"value1": 2,
	"value2": 13,
	"value3": 1
}]

chart.colors.step = 2;
chart.padding(30, 30, 10, 30);
chart.legend = new xy.Legend();

let categoryAxis = chart.xAxes.push(new xy.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.minGridDistance = 60;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.mouseEnabled = false;

let valueAxis = chart.yAxes.push(new xy.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.mouseEnabled = false;
valueAxis.min = 0;
valueAxis.max = 100;
valueAxis.strictMinMax = true;
valueAxis.calculateTotals = true;

valueAxis.renderer.grid.template.strokeOpacity = 0.05;
valueAxis.renderer.minGridDistance = 20;
valueAxis.renderer.minWidth = 35;

let series1 = chart.series.push(new xy.ColumnSeries());
series1.columns.template.width = amcharts4.percent(80);
series1.columns.template.tooltipText = "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
series1.name = "Series 1";
series1.dataFields.categoryX = "category";
series1.dataFields.valueY = "value1";
series1.dataFields.valueYShow = "totalPercent";
series1.dataItems.template.locations.categoryX = 0.5;
series1.stacked = true;

let bullet1 = series1.bullets.push(new xy.LabelBullet());
bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
bullet1.locationY = 0.5;

let series2 = chart.series.push(new xy.ColumnSeries());
series2.columns.template.width = amcharts4.percent(80);
series2.columns.template.tooltipText = "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
series2.name = "Series 2";
series2.dataFields.categoryX = "category";
series2.dataFields.valueY = "value2";
series2.dataFields.valueYShow = "totalPercent";
series2.dataItems.template.locations.categoryX = 0.5;
series2.stacked = true;

let bullet2 = series2.bullets.push(new xy.LabelBullet());
bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
bullet2.locationY = 0.5;

let series3 = chart.series.push(new xy.ColumnSeries());
series3.columns.template.width = amcharts4.percent(80);
series3.columns.template.tooltipText = "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
series3.name = "Series 3";
series3.dataFields.categoryX = "category";
series3.dataFields.valueY = "value3";
series3.dataFields.valueYShow = "totalPercent";
series3.dataItems.template.locations.categoryX = 0.5;
series3.stacked = true;

let bullet3 = series3.bullets.push(new xy.LabelBullet());
bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
bullet3.locationY = 0.5;

chart.scrollbarX = new amcharts4.Scrollbar();