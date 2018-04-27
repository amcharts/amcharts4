am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4charts.XYChart);

let data = [];
let visits = 10;
for (let i = 0; i < 1000; i++) {
	visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
	data.push({ date: new Date(2000, 1, i), name: "name" + i, value: visits });
}

chart.data = data;

chart.legend = new am4charts.Legend();

let categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
categoryAxis.renderer.grid.template.location = 0;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "value";

series.tooltipText = "{valueY.value}";
chart.cursor = new am4charts.XYCursor();
chart.scrollbarX = new am4core.Scrollbar();
