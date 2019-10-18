import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.padding(0, 15, 0, 15);
chart.colors.step = 3;

var data = [];
var price1 = 1000;
var price2 = 2000;
var price3 = 3000;
var quantity = 1000;
for (var i = 15; i < 3000; i++) {
	price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
	price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
	price3 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);

	if (price1 < 100) {
		price1 = 100;
	}

	if (price2 < 100) {
		price2 = 100;
	}

	if (price3 < 100) {
		price3 = 100;
	}		

	quantity += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 500);

	if (quantity < 0) {
		quantity *= -1;
	}
	data.push({ date: new Date(2000, 0, i), price1: price1, price2:price2, price3:price3, quantity: quantity });
}


chart.data = data;
// the following line makes value axes to be arranged vertically.
chart.leftAxesContainer.layout = "vertical";

// uncomment this line if you want to change order of axes
//chart.bottomAxesContainer.reverseOrder = true;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.ticks.template.length = 8;
dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.ticks.template.disabled = false;
dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
dateAxis.renderer.minLabelPosition = 0.01;
dateAxis.renderer.maxLabelPosition = 0.99;
dateAxis.keepSelection = true;

dateAxis.groupData = true;
dateAxis.minZoomCount = 5;

// these two lines makes the axis to be initially zoomed-in
// dateAxis.start = 0.7;
// dateAxis.keepSelection = true;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;
valueAxis.zIndex = 1;
valueAxis.renderer.baseGrid.disabled = true;
// height of axis
valueAxis.height = am4core.percent(65);

valueAxis.renderer.gridContainer.background.fill = am4core.color("#000000");
valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.verticalCenter = "bottom";
valueAxis.renderer.labels.template.padding(2, 2, 2, 2);

//valueAxis.renderer.maxLabelPosition = 0.95;
valueAxis.renderer.fontSize = "0.8em"

var series1 = chart.series.push(new am4charts.LineSeries());
series1.dataFields.dateX = "date";
series1.dataFields.valueY = "price1";
series1.dataFields.valueYShow = "changePercent";
series1.tooltipText = "{name}: {valueY.changePercent.formatNumber('[#0c0]+#.00|[#c00]#.##|0')}%";
series1.name = "Stock A";
series1.tooltip.getFillFromObject = false;
series1.tooltip.getStrokeFromObject = true;
series1.tooltip.background.fill = am4core.color("#fff");
series1.tooltip.background.strokeWidth = 2;
series1.tooltip.label.fill = series1.stroke;

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "price2";
series2.dataFields.valueYShow = "changePercent";
series2.tooltipText = "{name}: {valueY.changePercent.formatNumber('[#0c0]+#.00|[#c00]#.##|0')}%";
series2.name = "Stock B";
series2.tooltip.getFillFromObject = false;
series2.tooltip.getStrokeFromObject = true;
series2.tooltip.background.fill = am4core.color("#fff");
series2.tooltip.background.strokeWidth = 2;
series2.tooltip.label.fill = series2.stroke;

var series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.dateX = "date";
series3.dataFields.valueY = "price3";
series3.dataFields.valueYShow = "changePercent";
series3.tooltipText = "{name}: {valueY.changePercent.formatNumber('[#0c0]+#.00|[#c00]#.##|0')}%";
series3.name = "Stock C";
series3.tooltip.getFillFromObject = false;
series3.tooltip.getStrokeFromObject = true;
series3.tooltip.background.fill = am4core.color("#fff");
series3.tooltip.background.strokeWidth = 2;
series3.tooltip.label.fill = series3.stroke;

var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis2.tooltip.disabled = true;
// height of axis
valueAxis2.height = am4core.percent(35);
valueAxis2.zIndex = 3
// this makes gap between panels
valueAxis2.marginTop = 30;
valueAxis2.renderer.baseGrid.disabled = true;
valueAxis2.renderer.inside = true;
valueAxis2.renderer.labels.template.verticalCenter = "bottom";
valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
//valueAxis.renderer.maxLabelPosition = 0.95;
valueAxis2.renderer.fontSize = "0.8em";

valueAxis2.renderer.gridContainer.background.fill = am4core.color("#000000");
valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

var volumeSeries = chart.series.push(new am4charts.StepLineSeries());
volumeSeries.fillOpacity = 1;
volumeSeries.fill = series1.stroke;
volumeSeries.stroke = series1.stroke;
volumeSeries.dataFields.dateX = "date";
volumeSeries.dataFields.valueY = "quantity";
volumeSeries.yAxis = valueAxis2;
volumeSeries.tooltipText = "Volume: {valueY.value}";
volumeSeries.name = "Series 2";
// volume should be summed
volumeSeries.groupFields.valueY = "sum";
volumeSeries.tooltip.label.fill = volumeSeries.stroke;
chart.cursor = new am4charts.XYCursor();

var scrollbarX = new am4charts.XYChartScrollbar();
scrollbarX.series.push(series1);
scrollbarX.marginBottom = 20;
chart.scrollbarX = scrollbarX;


/**
 * Set up external controls
 */

// Date format to be used in input fields
var inputFieldFormat = "yyyy-MM-dd";

document.getElementById("b1m").addEventListener("click", function() {
	resetButtonClass();
	var max = dateAxis.groupMax["day1"];
	var date = new Date(max);
	date.setMonth(date.getMonth() - 1);

	dateAxis.zoomToDates(
		date,
		new Date(max)
	);
	//this.className = "amcharts-input amcharts-input-selected";
});

document.getElementById("b3m").addEventListener("click", function() {
	resetButtonClass();
	var max = dateAxis.groupMax["day1"];
	var date = new Date(max);
	date.setMonth(date.getMonth() - 3);

	dateAxis.zoomToDates(
		date,
		new Date(max)
	);
	//this.className = "amcharts-input amcharts-input-selected";
});

document.getElementById("b6m").addEventListener("click", function() {
	resetButtonClass();
	var max = dateAxis.groupMax["day1"];
	var date = new Date(max);
	date.setMonth(date.getMonth() - 6);

	dateAxis.zoomToDates(
		date,
		new Date(max)
	);
	//this.className = "amcharts-input amcharts-input-selected";
});

document.getElementById("b1y").addEventListener("click", function() {
	resetButtonClass();
	var max = dateAxis.groupMax["week1"];
	var date = new Date(max);
	date.setFullYear(date.getFullYear() - 1);

	dateAxis.zoomToDates(
		date,
		new Date(max)
	);
	//this.className = "amcharts-input amcharts-input-selected";
});

document.getElementById("bytd").addEventListener("click", function() {
	resetButtonClass();
	var date = new Date(dateAxis.max);
	date.setMonth(0, 1);
	date.setHours(0, 0, 0, 0);
	dateAxis.zoomToDates(date, new Date(dateAxis.max));
	//this.className = "amcharts-input amcharts-input-selected";
});

document.getElementById("bmax").addEventListener("click", function() {
	resetButtonClass();
	dateAxis.zoom({start:0, end:1});
	//this.className = "amcharts-input amcharts-input-selected";
});

function resetButtonClass() {
	var selected = document.getElementsByClassName("amcharts-input-selected");
	for(var i = 0; i < selected.length; i++) {
		selected[i].className = "amcharts-input";
	}
}

dateAxis.events.on("selectionextremeschanged", function() {
	updateFields();
});

dateAxis.events.on("extremeschanged", updateFields);

function updateFields() {
	var minZoomed = dateAxis.minZoomed + am4core.time.getDuration(dateAxis.mainBaseInterval.timeUnit, dateAxis.mainBaseInterval.count) * 0.5;
	document.getElementById("fromfield").value = chart.dateFormatter.format(minZoomed, inputFieldFormat);
	document.getElementById("tofield").value = chart.dateFormatter.format(new Date(dateAxis.maxZoomed), inputFieldFormat);
}

document.getElementById("fromfield").addEventListener("keyup", updateZoom);
document.getElementById("tofield").addEventListener("keyup", updateZoom);

var zoomTimeout;
function updateZoom() {
	if (zoomTimeout) {
		clearTimeout(zoomTimeout);
	}
	zoomTimeout = setTimeout(function() {
		resetButtonClass();
		var start = document.getElementById("fromfield").value;
		var end = document.getElementById("tofield").value;
		if ((start.length < inputFieldFormat.length) || (end.length < inputFieldFormat.length)) {
			return;
		}
		var startDate = chart.dateFormatter.parse(start, inputFieldFormat);
		var endDate = chart.dateFormatter.parse(end, inputFieldFormat);

		if (startDate && endDate) {
			dateAxis.zoomToDates(startDate, endDate);
		}
	}, 500);
}