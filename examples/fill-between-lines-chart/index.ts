import * as amcharts4 from "@amcharts/amcharts4";
import * as xy from "@amcharts/amcharts4/xy";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";

amcharts4.system.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", xy.XYChart);

let data = [];
let open = 100;
let close = 250;

for (let i = 1; i < 366; i++) {
	open += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
	close += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
	data.push({ date: new Date(2018, 0, i), open: open, close: close });
}

chart.data = data;

let dateAxis = chart.xAxes.push(new xy.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.ticks.template.length = 8;
dateAxis.renderer.ticks.template.strokeOpacity = 0.1;

let valueAxis = chart.yAxes.push(new xy.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new xy.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.openValueY = "open";
series.dataFields.valueY = "close";
series.tooltipText = "open: {openValueY.value} close: {valueY.value}";
series.sequencedInterpolation = true;
series.fillOpacity = 0.3;
series.defaultState.transitionDuration = 1000;

let series2 = chart.series.push(new xy.LineSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "open";
series2.sequencedInterpolation = true;
series2.defaultState.transitionDuration = 1500;
series2.stroke = chart.colors.getIndex(6);

chart.cursor = new xy.XYCursor();
chart.scrollbarX = new amcharts4.Scrollbar();
