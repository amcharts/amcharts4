am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.padding(0, 15, 0, 15);

var data = [];
var price = 1000;
var quantity = 1000;
for (var i = 15; i < 3000; i++) {
	price += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);

	if (price < 100) {
		price = 100;
	}

	quantity += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 500);

	if (quantity < 0) {
		quantity *= -1;
	}
	data.push({ date: new Date(2000, 0, i), price: price, quantity: quantity });
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

var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "price";
series.tooltipText = "{valueY.value}";
series.name = "Series 1";

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
valueAxis2.renderer.fontSize = "0.8em"

valueAxis2.renderer.gridContainer.background.fill = am4core.color("#000000");
valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

var series2 = chart.series.push(new am4charts.ColumnSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "quantity";
series2.yAxis = valueAxis2;
series2.tooltipText = "{valueY.value}";
series2.name = "Series 2";
// volume should be summed
series2.groupFields.valueY = "sum";

chart.cursor = new am4charts.XYCursor();

var scrollbarX = new am4charts.XYChartScrollbar();
scrollbarX.series.push(series);
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