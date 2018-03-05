import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";


amcharts4.system.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", xy.XYChart);
chart.paddingRight = 20;

let data = [];
let visits = 10;
for (let i = 1; i < 366; i++) {
	visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
	data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
}

chart.data = data;

let dateAxis = chart.xAxes.push(new xy.DateAxis());
dateAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new xy.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.renderer.minWidth = 35;

let series = chart.series.push(new xy.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";

series.tooltipText = "{valueY.value}";
chart.cursor = new xy.XYCursor();

let scrollbarX = new xy.XYChartScrollbar();
scrollbarX.series.push(series);
chart.scrollbarX = scrollbarX;