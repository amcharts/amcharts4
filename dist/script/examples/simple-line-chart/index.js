amcharts4.useTheme(amcharts4.themes.animated);

let chart = amcharts4.create("chartdiv", amcharts4.xy.XYChart);

let data = [];
let visits = 10;
for (let i = 0; i < 1000; i++) {
	visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
	data.push({ date: new Date(2000, 1, i), name: "name" + i, value: visits });
}

chart.data = data;

chart.legend = new amcharts4.xy.Legend();

let categoryAxis = chart.xAxes.push(new amcharts4.xy.DateAxis());
categoryAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new amcharts4.xy.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new amcharts4.xy.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";

series.tooltipText = "{valueY.value}";
chart.cursor = new amcharts4.xy.XYCursor();
chart.scrollbarX = new amcharts4.Scrollbar();
